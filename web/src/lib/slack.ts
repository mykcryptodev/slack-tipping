import { App } from "@slack/bolt";
import { TIP_INDICATOR } from "~/constants";
import { env } from "~/env";
import { db } from "~/server/db";
import { deployAccount, getAddressByUserId, isAddressDeployed, isAddressRegistered, registerAccount } from "./engine";

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

// Dummy function to handle tips
export const tipUser = async (from: string, to: string[], amount: number) => {
  console.log(`User ${from} tipped ${amount} to users:`, to);
  // check if the sender has an account
  const senderAddress = await getAddressByUserId(from);
  const senderIsDeployed = await isAddressDeployed(senderAddress);
  console.log(`Sender ${from} has an account at ${senderAddress} and is ${senderIsDeployed ? 'deployed' : 'not deployed'}`);
  
  if (!senderIsDeployed) {
    console.log(`User ${from} has not deployed an account at ${senderAddress}`);
    await deployAccount(from);
    console.log(`Deployed account for user ${from} at ${senderAddress}`);
  } else {
    console.log(`From user ${from} has an existing account at ${senderAddress}`);
  }

  // check if the sender is registered
  const senderIsRegistered = await isAddressRegistered(senderAddress);
  if (!senderIsRegistered) {
    console.log(`User ${from} is not registered`);
    await registerAccount(senderAddress);
    console.log(`Registered account for user ${from} at ${senderAddress}`);
  } else {
    console.log(`User ${from} is already registered`);
  }

  // tip each user
  for (const toUser of to) {
    // user cannot tip themselves
    if (toUser === from) {
      console.log(`User ${from} cannot tip themselves`);
      continue;
    }

    console.log(`Getting address for user ${toUser}`);
    try {
      const address = await getAddressByUserId(toUser);
      const isDeployed = await isAddressDeployed(address);
      console.log(`Receiver ${toUser} has an account at ${address} and is ${isDeployed ? 'deployed' : 'not deployed'}`);
      if (!isDeployed) {
        console.log(`User ${toUser} has not deployed an account at ${address}`);
        // no need to await this
        void deployAccount(toUser);
        console.log(`Deployed account for user ${toUser} at ${address}`);
      } else {
        console.log(`User ${toUser} has an existing account at ${address}`);
      }

      const isRegistered = await isAddressRegistered(address);
      if (!isRegistered) {
        console.log(`User ${toUser} is not registered`);
        await registerAccount(address);
        console.log(`Registered account for user ${toUser} at ${address}`);
      } else {
        console.log(`User ${toUser} is already registered`);
      }
    } catch (error) {
      console.error(`Error getting address for user ${toUser}:`, error);
    }
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
  if (!installation && body.authorizations?.[0]) {
    const auth = body.authorizations[0];
    installation = await db.slackInstall.create({
      data: {
        teamId: body.team_id,
        installedByUserId: auth.user_id,
        botToken: auth.token,
        // We'll need to get the bot token through OAuth, but we can store the team info for now
      }
    });
    console.log('Created new installation record for team:', body.team_id);
  }
};