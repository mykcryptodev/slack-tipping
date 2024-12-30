import { getLoadingData, LoadingMessageData } from "~/lib/redis";
import { EngineWebhookPayload } from "~/types/engine";
import { NextResponse } from "next/server";
import { db } from "~/server/db";

export async function getMessageAndInstallationData(body: EngineWebhookPayload, status: string): Promise<{messageData: LoadingMessageData, installation: any}> {	
      // Only process mined transactions
      if (body.status !== status) {
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

      return {messageData, installation};
}