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
  const { isDeployed, address } = await verifyDeploymentByUserId();
  if (!isDeployed) {
    console.log(`User ${from} has not deployed an account at ${address}`);
    await deployAccount(from, `deploy-account-${from}-${eventId}`);
    console.log(`Deployed account for user ${from} at ${address}`);
  } else {
    console.log(`From user ${from} has an existing account at ${address}`);
  }

  // check if the sender is registered
  const senderIsRegistered = await isAddressRegistered(address);
  if (!senderIsRegistered) {
    console.log(`User ${from} is not registered`);
    const registerSenderTx = await getRegisterAccountTx(address);
    txns.push(registerSenderTx);
    console.log(`Registered account for user ${from} at ${address}`);
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
      const { isDeployed, address } = await verifyDeploymentByUserId();
      console.log(`Receiver ${toUser} has an account at ${address} and is ${isDeployed ? 'deployed' : 'not deployed'}`);
      if (!isDeployed) {
        console.log(`User ${toUser} has not deployed an account at ${address}`);
        // no need to await this
        void deployAccount(toUser, `deploy-account-${toUser}-${eventId}`);
        console.log(`Deployed account for user ${toUser} at ${address}`);
      } else {
        console.log(`User ${toUser} has an existing account at ${address}`);
      }
      addressesToTip.push(address);
    } catch (error) {
      console.error(`Error getting address for user ${toUser}:`, error);
    }
  }

  const tipTxns = await getTipTxns(address, addressesToTip, amount);
  txns.push(...tipTxns);

  // send all transactions in one batch
  return await sendBatchTxns(txns, eventId);

  async function verifyDeploymentByUserId() {
    const address = await getAddressByUserId(from);
    const isDeployed = await isAddressDeployed(address);
    console.log(`Sender ${from} has an account at ${address} and is ${isDeployed ? 'deployed' : 'not deployed'}`);
    return { isDeployed, address };
  }
};