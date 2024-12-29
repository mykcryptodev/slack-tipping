import { NextResponse } from "next/server";
import { type NextRequest } from "next/server";
import { handleSlackInstallation, type SlackPayload, extractMentionedUsers, countTipIndicators, tipUser } from "~/lib/slack";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as SlackPayload

    console.log('Received Slack event:', JSON.stringify(body, null, 2));

    // Handle the URL verification challenge
    if (body.type === 'url_verification') {
      return NextResponse.json({ challenge: body.challenge });
    }

    // Handle events
    if (body.type === 'event_callback' && body.team_id) {
      // Handle installation events
      await handleSlackInstallation(body);

      // Handle message events
      if (body.event?.type === 'message' && body.event.user && body.event.text) {
        const mentionedUsers = extractMentionedUsers(body.event.blocks);
        const tipCount = countTipIndicators(body.event.text);

        if (mentionedUsers.length > 0 && tipCount > 0) {
          await tipUser(body.event.user, mentionedUsers, tipCount);
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
