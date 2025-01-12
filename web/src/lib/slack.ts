import { App } from "@slack/bolt";
import { CHAIN, TIP_INDICATOR } from "~/constants";
import { env } from "~/env";
import { db } from "~/server/db";
import { getBalance } from "./engine";
import { getAddressByUserId } from "./engine";
import { getAllTimeTippedCount, getTipsSentToday, getDailyLeaderboard, getWeeklyLeaderboard, getMonthlyLeaderboard } from "./ghost";
import { shortenAddress, toEther } from "thirdweb/utils";
import { getUserIdByAddress, getUserPreferences } from "./redis";

export const app = new App({
  signingSecret: env.AUTH_SLACK_SIGNING_SECRET,
  clientId: env.AUTH_SLACK_ID,
  clientSecret: env.AUTH_SLACK_SECRET,
  stateSecret: env.AUTH_SLACK_STATE_SECRET,
  scopes: [
    'channels:history',
    'chat:write',
  ],
});

// TODO: Use the real SlackPayload types from @slack/bolt
export type SlackBlock = {
  type: string,
  block_id: string,
  elements: SlackBlockElement[],
};

export type SlackBlockElement = {
  type: string,
  elements?: SlackTextElement[],
};

export type SlackTextElement = {
  type: string,
  user_id?: string,
  name?: string,
  text?: string,
};

export type SlackPayload = {
  type: string,
  challenge: string,
  team_id: string,
  event_id?: string,
  api_app_id?: string,
  authorizations?: Array<{
    team_id: string,
    user_id: string,
    is_bot: boolean,
    token?: string,
  }>,
  token?: string,
  event?: {
    type: string,
    subtype?: string,
    user?: string,
    channel?: string,
    text?: string,
    blocks?: SlackBlock[],
    ts?: string,
  }
};

// Helper function to extract mentioned users from message blocks
export const extractMentionedUsers = (blocks?: SlackBlock[]): string[] => {
  if (!blocks) return [];
  
  const mentionedUsers: string[] = [];
  
  blocks.forEach((block: SlackBlock) => {
    block.elements.forEach((element: SlackBlockElement) => {
      if (element.type === 'rich_text_section' && element.elements) {
        element.elements.forEach((subElement: SlackTextElement) => {
          if (subElement.type === 'user' && subElement.user_id) {
            mentionedUsers.push(subElement.user_id);
          }
        });
      }
    });
  });
  
  return mentionedUsers;
};

// Helper function to count tip indicators in text
export const countTipIndicators = (text?: string): number => {
  if (!text) return 0;
  return (text.match(new RegExp(TIP_INDICATOR, 'g')) ?? []).length;
};

export const sendEphemeralMessage = async ({
  channel,
  user,
  text,
  botToken,
}: {
  channel: string,
  user: string,
  text: string,
  botToken: string,
}) => {
  try {
    const result = await app.client.chat.postEphemeral({
      token: botToken,
      channel,
      user,
      text,
    });
    return result;
  } catch (error) {
    console.error(`Error sending ephemeral message to user ${user} in channel ${channel}:`, JSON.stringify(error, null, 2));
    throw error;
  }
};

export const handleSlackInstallation = async (body: SlackPayload) => {
  // Get the installation for this team
  let installation = await db.slackInstall.findUnique({
    where: {
      teamId: body.team_id,
    }
  });
  // If we don't have an installation record, create one
  if (!installation?.botToken && body.token && body.authorizations?.[0]) {
    const auth = body.authorizations[0];
    installation = await db.slackInstall.create({
      data: {
        teamId: auth.team_id,
        installedByUserId: auth.user_id,
        botToken: auth.token,
        // We'll need to get the bot token through OAuth, but we can store the team info for now
      }
    });
    console.log('Created new installation record for team:', body.team_id);
  }

  return installation;
};

interface SlackUserProfile {
  real_name?: string;
  profile?: {
    display_name?: string;
    image_512?: string;
  };
  name?: string;
}

const getUserProfile = async (userId: string, botToken: string): Promise<SlackUserProfile | null> => {
  try {
    const result = await app.client.users.info({
      token: botToken,
      user: userId,
    });
    return result.user as SlackUserProfile;
  } catch (error) {
    console.error(`Error fetching user profile for ${userId}:`, error);
    return null;
  }
};

const formatLeaderboardSection = (title: string, entries: { userId: string, displayName: string, avatarUrl: string, amount: string }[], limit = 5) => {
  if (entries.length === 0) {
    return [{
      type: "section",
      text: {
        type: "mrkdwn",
        text: `*${title}*\nNo tips yet!`
      }
    }];
  }

  return [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `*${title}*`
      }
    },
    {
      type: "context",
      elements: entries.slice(0, 5).map((entry, index) => ([
        {
          type: "image",
          image_url: entry.avatarUrl,
          alt_text: entry.displayName
        },
        {
          type: "mrkdwn",
          text: `${index + 1}. *${entry.displayName}* - ${entry.amount} ${TIP_INDICATOR}`
        }
      ])).flat()
    }
  ].slice(0, limit);
};

export const getSlackHomeView = async (userId: string, teamId: string) => {
  // Get user's preferences
  const preferences = await getUserPreferences({ userId, teamId });

  // Get user's blockchain address
  const address = await getAddressByUserId(userId, teamId);
  
  // Get user's stats
  const [tipsSentToday, balance, totalTipsReceived] = await Promise.all([
    getTipsSentToday({ address }),
    getBalance(address),
    getAllTimeTippedCount({ address })
  ]);

  // Get the installation for this team
  const installation = await db.slackInstall.findFirst();
  if (!installation?.botToken) {
    console.error('No bot token found');
    throw new Error('No bot token found');
  }

  // Get leaderboards
  const [dailyLeaderboard, weeklyLeaderboard, monthlyLeaderboard] = await Promise.all([
    getDailyLeaderboard(teamId),
    getWeeklyLeaderboard(teamId),
    getMonthlyLeaderboard(teamId)
  ]);

  // Get user profiles for leaderboards
  const allUserAddresses = new Set([
    ...dailyLeaderboard.map(e => e.userAddress),
    ...weeklyLeaderboard.map(e => e.userAddress),
    ...monthlyLeaderboard.map(e => e.userAddress)
  ]);

  const userProfiles = new Map<string, SlackUserProfile>();
  await Promise.all(Array.from(allUserAddresses).map(async (userAddress) => {
    const userId = await getUserIdByAddress({
      address: userAddress,
    });
    if (!userId) {
      return;
    }
    const profile = await getUserProfile(userId, installation.botToken!);
    if (profile) {
      userProfiles.set(userAddress, profile);
    }
  }));

  const formatLeaderboardEntries = (leaderboard: typeof dailyLeaderboard) => {
    return leaderboard.map(entry => {
      const profile = userProfiles.get(entry.userAddress);
      return {
        userId: userId,
        displayName: profile?.profile?.display_name ?? 
                    profile?.real_name ?? 
                    profile?.name ?? 
                    shortenAddress(entry.userAddress),
        avatarUrl: profile?.profile?.image_512 ?? `https://robohash.org/${entry.userAddress}`,
        amount: entry.totalAmount.toString()
      };
    });
  };

  // Publish the home view
  await app.client.views.publish({
    token: installation.botToken,
    user_id: userId,
    view: {
      type: "home",
      blocks: [
        {
          type: "header",
          text: {
            type: "plain_text",
            text: "Your Tip Stats 📊",
            emoji: true
          }
        },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: "*Tips Sent Today*"
          }
        },
        {
          type: "context",
          elements: [
            {
              type: "mrkdwn",
              text: `${TIP_INDICATOR.repeat(Number(tipsSentToday))} (${tipsSentToday})`
            }
          ]
        },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: "*Total Tips Received All Time*"
          }
        },
        {
          type: "context",
          elements: [
            {
              type: "mrkdwn",
              text: `${toEther(BigInt(totalTipsReceived))}`
            }
          ]
        },
        {
          type: "divider"
        },
        {
          type: "header",
          text: {
            type: "plain_text",
            text: "Team Leaderboard 🏆",
            emoji: true
          }
        },
        ...formatLeaderboardSection("Today's Top Recipients", formatLeaderboardEntries(dailyLeaderboard)),
        ...formatLeaderboardSection("This Week's Top Recipients", formatLeaderboardEntries(weeklyLeaderboard)),
        ...formatLeaderboardSection("This Month's Top Recipients", formatLeaderboardEntries(monthlyLeaderboard)),
        {
          type: "divider"
        },
        {
          type: "header",
          text: {
            type: "plain_text",
            text: "Notifications :bell:",
            emoji: true
          }
        },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: "Choose whether you want to receive a message when someone tips you"
          }
        },
        {
          type: "actions",
          elements: [
            {
              type: "radio_buttons",
              action_id: "notification_preference",
              // if no preferences, default to on
              initial_option: preferences?.notifyOnTipReceived ?? true ? {
                text: {
                  type: "plain_text",
                  text: "On",
                  emoji: true
                },
                value: "true"
              } : {
                text: {
                  type: "plain_text",
                  text: "Off",
                  emoji: true
                },
                value: "false"
              },
              options: [
                {
                  text: {
                    type: "plain_text",
                    text: "On",
                    emoji: true
                  },
                  value: "true"
                },
                {
                  text: {
                    type: "plain_text",
                    text: "Off", 
                    emoji: true
                  },
                  value: "false"
                }
              ]
            }
          ]
        },
        {
          type: "divider"
        },
        {
          type: "header",
          text: {
            type: "plain_text",
            text: "Your Wallet :credit_card:",
            emoji: true
          }
        },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: "*Your Wallet Address*"
          }
        },
        {
          type: "context",
          elements: [
            {
              type: "mrkdwn",
              text: `\`${address}\``
            }
          ]
        },
        {
          type: "actions",
          elements: [
            {
              type: "button",
              text: {
                type: "plain_text",
                text: `View on ${CHAIN.blockExplorers![0]!.name}`,
                emoji: true
              },
              url: `${CHAIN.blockExplorers![0]!.url}/address/${address}`,
              action_id: "view_on_explorer"
            }
          ]
        },
        {
          type: "divider"
        },
        {
          type: "header",
          text: {
            type: "plain_text",
            text: "Withdraw Tacos :money_with_wings:",
            emoji: true
          }
        },
        {
          type: "input",
          block_id: "withdrawal_address",
          label: {
            type: "plain_text",
            text: "Withdrawal Address",
            emoji: true
          },
          element: {
            type: "plain_text_input",
            action_id: "withdrawal_address_input",
            placeholder: {
              type: "plain_text",
              text: "Enter the address where you want to withdraw your tacos",
              emoji: true
            }
          },
          hint: {
            type: "plain_text",
            text: "This address will be used when you choose to withdraw your tacos",
            emoji: true
          }
        },
        {
          type: "input",
          block_id: "withdrawal_amount",
          label: {
            type: "plain_text",
            text: "Amount of Tacos",
            emoji: true
          },
          element: {
            type: "number_input",
            action_id: "withdrawal_amount_input",
            is_decimal_allowed: false,
            min_value: "1",
            placeholder: {
              type: "plain_text",
              text: "Enter the number of tacos to withdraw",
              emoji: true
            }
          },
          hint: {
            type: "plain_text",
            text: `You have ${toEther(BigInt(balance.value))} tacos available to withdraw`,
            emoji: true
          }
        },
        {
          type: "actions",
          elements: [
            {
              type: "button",
              text: {
                type: "plain_text",
                text: "Withdraw Tacos",
                emoji: true
              },
              style: "primary",
              action_id: "withdraw_tacos"
            }
          ]
        },
      ]
    }
  });
};