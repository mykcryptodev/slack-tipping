import { NextResponse } from "next/server";
import { type NextRequest } from "next/server";
import { CHAIN, TIP_INDICATOR } from "~/constants";
import { getLoadingData, getUserPreferences } from "~/lib/redis";
import { app } from "~/lib/slack";
import { db } from "~/server/db";
import { type EngineWebhookPayload } from "~/types/engine";

type User = {
  real_name?: string;
  profile?: { 
    display_name?: string;
    image_48?: string;
  };
  name?: string;
  id?: string;
};

const getUserNameFromProfile = (profile: User) => {
  return profile.real_name ?? 
         profile.profile?.display_name ?? 
         profile.name ??
         profile.id ??
         "Unknown User";
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as EngineWebhookPayload;

    // Only process mined transactions
    if (body.status !== 'mined') {
      return NextResponse.json({ ok: true });
    }

    // Get the loading message data from Redis
    const messageData = await getLoadingData(body.queueId);
    if (!messageData) {
      console.log('No loading message found for queue ID:', body.queueId);
      return NextResponse.json({ ok: true });
    }

    // Get the installation for this team
    const installation = await db.slackInstall.findFirst();
    if (!installation?.botToken) {
      console.error('No bot token found');
      return NextResponse.json({ error: 'No bot token found' }, { status: 400 });
    }

    // Update the message
    try {
      // read the profile of each receipient
      const [senderProfile, ...receiverProfiles] = await Promise.all([
        app.client.users.info({
          token: installation.botToken,
          user: messageData.senderUserId
        }),
        ...messageData.receiverUserIds.map(async (userId) => {
          const profile = await app.client.users.info({
            token: installation.botToken!,
            user: userId
          });
          return profile;
        })
      ]);
      // DM the sender and receivers with the preferences for being notified
      await app.client.chat.postMessage({
        token: installation.botToken,
        channel: messageData.senderUserId,
        blocks: [
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: ":white_check_mark: *Your tip has been sent successfully!*"
            }
          },
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: `Amount: ${TIP_INDICATOR.repeat(messageData.tipAmount)} (${messageData.tipAmount})`
            }
          },
          {
            type: "actions",
            elements: [
              {
                type: "button" as const,
                text: {
                  type: "plain_text" as const,
                  text: "View Message",
                  emoji: true
                },
                url: `slack://channel?team=${installation.teamId}&id=${messageData.channelId}&message=${messageData.messageTs}`,
                action_id: "view_message"
              },
              {
                type: "button" as const,
                text: {
                  type: "plain_text" as const,
                  text: `View on ${CHAIN.blockExplorers![0]!.name}`,
                  emoji: true
                },
                url: `${CHAIN.blockExplorers![0]!.url}/tx/${body.transactionHash}`,
                action_id: "view_transaction"
              }
            ]
          },
          {
            type: "context",
            elements: [
              ...receiverProfiles.map(profile => ({
                type: "image" as const,
                image_url: profile.user?.profile?.image_48 ?? "https://api.slack.com/img/blocks/bkb_template_images/profile_1.png",
                alt_text: getUserNameFromProfile(profile.user!)
              })),
              {
                type: "mrkdwn" as const,
                text: `Recipients: ${receiverProfiles.map(profile => `*${getUserNameFromProfile(profile.user!)}*`).map((name, i, arr) => {
                  if (i === arr.length - 1 && arr.length > 1) {
                    return `and ${name}`;
                  }
                  return name;
                }).join(', ')}`
              }
            ]
          },
        ],
        text: `✅ Your tip has been sent successfully!` // Fallback text
      });
      const receiverPreferences = await Promise.all(messageData.receiverUserIds.map(async (userId) => {
        return { receiverId: userId, preferences: await getUserPreferences({ userId, teamId: installation.teamId }) };
      }));
      // if no preferences, default to on
      const receiversToNotify = receiverPreferences.filter(
        storedUserPreferences => storedUserPreferences.preferences?.notifyOnTipReceived ?? true
      );
      for (const receiver of receiversToNotify) {
        await app.client.chat.postMessage({
          token: installation.botToken,
          channel: receiver.receiverId,
          blocks: [
            {
              type: "section",
              text: {
                type: "mrkdwn",
                text: ":tada: *You received a tip!*"
              }
            },
            {
              type: "section",
              text: {
                type: "mrkdwn",
                text: `Amount: ${TIP_INDICATOR.repeat(messageData.tipAmount)} (${messageData.tipAmount})`
              }
            },
            {
              type: "actions",
              elements: [
                {
                  type: "button" as const,
                  text: {
                    type: "plain_text" as const,
                    text: "View Message",
                    emoji: true
                  },
                  url: `slack://channel?team=${installation.teamId}&id=${messageData.channelId}&message=${messageData.messageTs}`,
                  action_id: "view_message"
                },
                {
                  type: "button" as const,
                  text: {
                    type: "plain_text" as const,
                    text: `View on ${CHAIN.blockExplorers![0]!.name}`,
                    emoji: true
                  },
                  url: `${CHAIN.blockExplorers![0]!.url}/tx/${body.transactionHash}`,
                  action_id: "view_transaction"
                }
              ]
            },
            {
              type: "context",
              elements: [
                {
                  type: "image" as const,
                  image_url: senderProfile.user?.profile?.image_48 ?? "https://api.slack.com/img/blocks/bkb_template_images/profile_1.png",
                  alt_text: getUserNameFromProfile(senderProfile.user!)
                },
                {
                  type: "mrkdwn",
                  text: `Sent by *${getUserNameFromProfile(senderProfile.user!)}*`
                }
              ]
            },
          ],
          text: `✅ You received a tip from ${getUserNameFromProfile(senderProfile.user!)}!` // Fallback text
        });
      }
    } catch (error) {
      console.error('Error updating message:', JSON.stringify(error, null, 2));
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
} 