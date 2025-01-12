import { NextResponse } from "next/server";
import { type NextRequest } from "next/server";
import { type SlackInteractivityPayload } from "~/types/slack";
import { addAccountAdmin, getAccountAdmins, getAddressByUserId, transferTips } from "~/lib/engine";
import { THIRDWEB_ENGINE_BACKEND_EOA_WALLET } from "~/constants";

export async function POST(req: NextRequest) {
  try {
    // Slack sends interactivity payloads as form data
    const formData = await req.formData();
    const payload = JSON.parse(formData.get('payload') as string) as SlackInteractivityPayload;
    
    // Handle different types of interactions
    switch (payload.type) {
      case 'block_actions':
        // Handle button clicks
        for (const action of payload.actions ?? []) {
          if (action.action_id === 'view_transaction') {
            // The URL opening is handled by Slack client, we just need to acknowledge
            return NextResponse.json({ ok: true });
          }

          if (action.action_id === 'withdraw_tacos' && payload.view?.state) {
            try {
              const { values } = payload.view.state;
              const withdrawalAddress = values.withdrawal_address.withdrawal_address_input.value;
              const withdrawalAmount = values.withdrawal_amount.withdrawal_amount_input.value;

              if (!withdrawalAddress || !withdrawalAmount) {
                // Send an error message back to the user
                console.error('Withdrawal address or amount is missing');
                return NextResponse.json({ ok: true });
              }

              // Get the user's account address
              const userAddress = await getAddressByUserId(payload.user.id, payload.team.id);
              
              const accountAdmins = await getAccountAdmins(userAddress);
              if (!accountAdmins.includes(THIRDWEB_ENGINE_BACKEND_EOA_WALLET)) {
                console.error('EOA is not an admin');
                await addAccountAdmin({
                  address: userAddress,
                  adminAddress: THIRDWEB_ENGINE_BACKEND_EOA_WALLET,
                  idempotencyKey: `add-eoa-as-admin-${payload.trigger_id}`,
                });
              }

              // Process the withdrawal
              await transferTips({
                senderAddress: userAddress,
                toAddress: withdrawalAddress,
                amount: withdrawalAmount,
                idempotencyKey: payload.trigger_id,
              });
              // Notify the user
              console.log('Successfully initiated withdrawal of', withdrawalAmount, 'tacos to', withdrawalAddress);

              return NextResponse.json({ ok: true });
            } catch (error) {
              console.error('Error processing withdrawal:', error);
              return NextResponse.json({ ok: true });
            }
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
