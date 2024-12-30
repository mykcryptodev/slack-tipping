import { NextResponse } from "next/server";
import { type NextRequest } from "next/server";
import { type SlackInteractivityPayload } from "~/types/slack";

export async function POST(req: NextRequest) {
  try {
    // Slack sends interactivity payloads as form data
    const formData = await req.formData();
    console.log({ formData });
    const payload = JSON.parse(formData.get('payload') as string) as SlackInteractivityPayload;
    
    console.log('Received Slack interactivity payload:', JSON.stringify(payload, null, 2));

    // Handle different types of interactions
    switch (payload.type) {
      case 'block_actions':
        // Handle button clicks
        for (const action of payload.actions ?? []) {
          if (action.action_id === 'view_transaction') {
            // The URL opening is handled by Slack client, we just need to acknowledge
            return NextResponse.json({ ok: true });
          }
        }
        break;
      default:
        console.log('Unhandled interaction type:', payload.type);
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Error processing Slack interactivity:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
