import { 
  sendBatchTxns,
  getTipTxns,
  getRegisterAccountTx,
  isAddressRegistered,
  getAddressByUserId,
  isAddressDeployed,
  deployAccount
} from "./engine";

// TODO: transactions are failing when the user needs to be registered even though we are bundling
export const tipUsers = async (from: string, to: string[], amount: number, eventId: string) => {
  // we will do one batch transaction for onchain activity (except for deploying accounts)
  const txns = [];

  console.log(`User ${from} tipped ${amount} to users:`, to);
  // check if the sender has an account
  const senderAddress = await getAddressByUserId(from);
  const senderIsDeployed = await isAddressDeployed(from);
  console.log(`Sender ${from} has an account at ${senderAddress} and is ${senderIsDeployed ? 'deployed' : 'not deployed'}`);
  
  if (!senderIsDeployed) {
    console.log(`User ${from} has not deployed an account at ${senderAddress}`);
    const { deployedAddress } = await deployAccount({
      userId: from,
      idempotencyKey: `deploy-account-${from}-${eventId}`
    });
    console.log(`Deployed account for user ${from} at ${deployedAddress}`);
  } else {
    console.log(`From user ${from} has an existing account at ${senderAddress}`);
  }

  // check if the sender is registered
  const senderIsRegistered = await isAddressRegistered(senderAddress);
  if (!senderIsRegistered) {
    console.log(`User ${from} is not registered`);
    const registerSenderTx = await getRegisterAccountTx(senderAddress);
    txns.push(registerSenderTx);
    console.log(`Registered account for user ${from} at ${senderAddress}`);
  } else {
    console.log(`User ${from} is already registered`);
  }

  // tip each user
  const addressesToTip: string[] = [];

  for (const toUser of to) {
    // user cannot tip themselves
    if (toUser === from) {
      console.log(`User ${from} cannot tip themselves`);
      continue;
    }

    console.log(`Getting address for user ${toUser}`);
    try {
      const address = await getAddressByUserId(toUser);
      const isDeployed = await isAddressDeployed(toUser);
      console.log(`Receiver ${toUser} has an account at ${address} and is ${isDeployed ? 'deployed' : 'not deployed'}`);
      if (!isDeployed) {
        console.log(`User ${toUser} has not deployed an account at ${address}`);
        // no need to await this
        const { deployedAddress } = await deployAccount({
          userId: toUser,
          idempotencyKey: `deploy-account-${toUser}-${eventId}`
        });
        console.log(`Deployed account for user ${toUser} at ${deployedAddress}`);
      } else {
        console.log(`User ${toUser} has an existing account at ${address}`);
      }
      addressesToTip.push(address);
    } catch (error) {
      console.error(`Error getting address for user ${toUser}:`, error);
    }
  }

  const tipTxns = await getTipTxns(senderAddress, addressesToTip, amount);
  txns.push(...tipTxns);

  // send all transactions in one batch
  return await sendBatchTxns(txns, eventId);
};