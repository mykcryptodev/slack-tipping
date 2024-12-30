import { NextResponse } from "next/server";
import { type NextRequest } from "next/server";
import { app } from "~/lib/slack";
import { db } from "~/server/db";
import { env } from "~/env";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const code = url.searchParams.get('code');
    
    if (!code) {
      return NextResponse.json({ error: 'Missing code parameter' }, { status: 400 });
    }

    // Exchange the code for an access token
    const result = await app.client.oauth.v2.access({
      client_id: env.AUTH_SLACK_ID,
      client_secret: env.AUTH_SLACK_SECRET,
      code,
    });

    if (!result.team?.id) {
      throw new Error('Missing team ID in OAuth response');
    }

    if (result.token_type !== 'bot') {
      throw new Error('Expected bot token type in OAuth response');
    }

    // Store the installation
    await db.slackInstall.upsert({
      where: {
        teamId: result.team.id,
      },
      create: {
        teamId: result.team.id,
        installedByUserId: result.authed_user?.id ?? null,
        botToken: result.access_token,
        enterpriseId: result.enterprise?.id ?? null,
      },
      update: {
        botToken: result.access_token,
        enterpriseId: result.enterprise?.id ?? null,
      },
    });

    // Redirect back to Slack
    return NextResponse.redirect(new URL('slack://open'));
  } catch (error) {
    console.error('Error handling Slack OAuth:', error);
    return NextResponse.json(
      { error: 'Failed to complete OAuth' },
      { status: 500 }
    );
  }
} 