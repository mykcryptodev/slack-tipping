import { NextResponse } from "next/server";
import { type NextRequest } from "next/server";
import { handleSlackInstallation, type SlackPayload, extractMentionedUsers, countTipIndicators } from "~/lib/slack";
import { tipUsers } from "~/lib/tips";
import { isEventProcessed, setLoadingData } from "~/lib/redis";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as SlackPayload;

    console.log('Received Slack event:', JSON.stringify(body, null, 2));

    // Handle the URL verification challenge
    if (body.type === 'url_verification') {
      return NextResponse.json({ challenge: body.challenge });
    }

    // Handle events
    if (body.type === 'event_callback' && body.team_id) {
      // Check for duplicate events if event_id is present
      if (body.event_id) {
        if (await isEventProcessed(body.event_id)) {
          console.log('Duplicate event detected, skipping:', body.event_id);
          return NextResponse.json({ ok: true });
        } else {
          console.log('New event detected, processing:', body.event_id);
        }
      } else {
        console.log('No event_id present, skipping deduplication check');
      }

      // Get the installation for this team
      const installation = await handleSlackInstallation(body);
      if (!installation?.botToken) {
        console.error('No bot token found for team:', body.team_id);
        return NextResponse.json({ error: 'No bot token found' }, { status: 400 });
      }

      // Handle message events
      if (body.event?.type === 'message' && body.event.user && body.event.text && body.event_id) {
        const mentionedUsers = extractMentionedUsers(body.event.blocks);
        const tipCount = countTipIndicators(body.event.text);

        if (mentionedUsers.length > 0 && tipCount > 0) {
          // Send loading message before processing tip
          if (body.event.channel) {
            const result = await tipUsers(body.event.user, mentionedUsers, tipCount, body.event_id);
            if (result.queueIds.length > 0) {
              await setLoadingData({
                queueId: result.queueIds[0]!,
                senderUserId: body.event.user,
                receiverUserIds: mentionedUsers,
                ttl: 300,
              });
            }
          }
        }
      }
    }

    return NextResponse.json({ ok: true });

  } catch (error) {
    console.error('Error processing Slack event:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
