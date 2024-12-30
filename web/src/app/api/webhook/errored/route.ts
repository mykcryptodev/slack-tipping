import { NextResponse } from "next/server";
import { type NextRequest } from "next/server";
import { getLoadingData } from "~/lib/redis";
import { app } from "~/lib/slack";
import { db } from "~/server/db";
import { type EngineWebhookPayload } from "~/types/engine";
type User = {
  real_name?: string;
  profile?: { display_name?: string };
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
    console.log('Received webhook:', JSON.stringify(body, null, 2));

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
            type: "section",
            text: {
              type: "mrkdwn",
              text: `Recipients: ${receiverProfiles.map(profile => `*${getUserNameFromProfile(profile.user!)}*`).map((name, i, arr) => {
                if (i === arr.length - 1 && arr.length > 1) {
                  return `and ${name}`;
                }
                return name;
              }).join(', ')}`
            }
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
