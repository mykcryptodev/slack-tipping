import { NextResponse } from "next/server";
import { type NextRequest } from "next/server";
import { getLoadingData } from "~/lib/redis";
import { app } from "~/lib/slack";
import { db } from "~/server/db";
import { type EngineWebhookPayload } from "~/types/engine";
import { TIP_INDICATOR } from "~/constants";
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
    // Only process errored transactions
    if (body.status !== 'errored') {
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
      // Get the profiles of the receivers
      const receiverProfiles = await Promise.all(messageData.receiverUserIds.map(async (userId) => {
        const profile = await app.client.users.info({
          token: installation.botToken!,
          user: userId
        });
        return profile;
      }));

      // Send error message to the sender
      await app.client.chat.postMessage({
        token: installation.botToken,
        channel: messageData.senderUserId,
        blocks: [
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: ":x: *Your tip transaction failed*"
            }
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
                  text: "View Original Message",
                  emoji: true
                },
                url: `slack://channel?team=${installation.teamId}&id=${messageData.channelId}&message=${messageData.messageTs}`,
                action_id: "view_message"
              }
            ]
          },
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: body.errorMessage 
                ? `Error: ${body.errorMessage}`
                : "The transaction failed for an unknown reason. Please try again."
            }
          },
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: `Transaction Hash: \`${body.transactionHash}\``
            }
          }
        ],
        text: "❌ Your tip transaction failed" // Fallback text
      });

      console.log('Sent error message to sender');
    } catch (error) {
      console.error('Error sending message:', JSON.stringify(error, null, 2));
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
