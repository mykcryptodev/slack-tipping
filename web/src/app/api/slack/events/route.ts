import { NextResponse } from "next/server";
import { type NextRequest } from "next/server";
import { handleSlackInstallation, type SlackPayload, extractMentionedUsers, countTipIndicators, tipUsers } from "~/lib/slack";
import { isEventProcessed } from "~/lib/redis";

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

      // Handle installation events
      await handleSlackInstallation(body);

      // Handle message events
      if (body.event?.type === 'message' && body.event.user && body.event.text) {
        const mentionedUsers = extractMentionedUsers(body.event.blocks);
        const tipCount = countTipIndicators(body.event.text);

        if (mentionedUsers.length > 0 && tipCount > 0) {
          await tipUsers(body.event.user, mentionedUsers, tipCount);
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
