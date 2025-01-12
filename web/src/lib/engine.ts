import { ACCOUNT_FACTORY, ACCOUNT_FACTORY_ADMIN, CONTRACT, THIRDWEB_ENGINE_BACKEND_EOA_WALLET, THIRDWEB_ENGINE_BACKEND_WALLET, TIP_TOKEN } from "~/constants";
import { registerAccount as registerAccountTx, tipMany } from "~/thirdweb/84532/0xb18627080be9b71debc1e85daa5789f51345933e";
import { CHAIN } from "~/constants";
import { env } from "~/env";
import { encode, toHex, toWei } from "thirdweb";

const generateAccountSalt = (teamId: string, userId: string) => {
  return `${teamId}-${userId}`;
}

export const sendBatchTxns = async (txns: { toAddress: string, data: string, value: string }[], idempotencyKey: string) => {
  const url = new URL(`${env.THIRDWEB_ENGINE_URL}/backend-wallet/${CHAIN.id}/send-transaction-batch`);
  const fetchOptions = {
    headers: {
      'Authorization': `Bearer ${env.THIRDWEB_ENGINE_ACCESS_TOKEN}`,
      'Content-Type': 'application/json',
      'x-backend-wallet-address': THIRDWEB_ENGINE_BACKEND_WALLET,
      'x-idempotency-key': idempotencyKey,
    },
    method: 'POST',
    body: JSON.stringify(txns)
  }

  try {
    const response = await fetch(url, fetchOptions);
    const data = await response.json() as { result: { queueIds: string[] } };
    console.log('\x1b[33m%s\x1b[0m', `sendBatchTxns:`, JSON.stringify(data, null, 2));
    return data.result;
  } catch (error) {
    console.error(`Error sending batch transactions:`, error);
    throw error;
  }
}

export const getAddressByUserId = async (userId: string, teamId: string) => {
  const baseUrl = new URL(`${env.THIRDWEB_ENGINE_URL}/contract/${CHAIN.id}/${ACCOUNT_FACTORY}/account-factory`);

  const getAddressUrl = new URL(`${baseUrl}/predict-account-address`);
  getAddressUrl.searchParams.set('adminAddress', ACCOUNT_FACTORY_ADMIN);
  getAddressUrl.searchParams.set('extraData', generateAccountSalt(teamId, userId));

  const fetchOptions = {
    headers: {
      Authorization: `Bearer ${env.THIRDWEB_ENGINE_ACCESS_TOKEN}`,
    },
    method: 'GET',
  };

  try {
    const addressResponse = await fetch(getAddressUrl, fetchOptions);
    const addressData = await addressResponse.json() as { result: string };
    console.log('\x1b[33m%s\x1b[0m', `getAddressByUserId for userId ${userId} teamId ${teamId}:`, JSON.stringify(addressData, null, 2));
    return addressData.result;
  } catch (error) {
    console.error(`Error getting address for user ${userId} teamId ${teamId}:`, error);
    throw error;
  }
};

export const isAddressRegistered = async (address: string) => {
  const isRegisteredUrl = new URL(`${env.THIRDWEB_ENGINE_URL}/contract/${CHAIN.id}/${TIP_TOKEN}/read`);
  isRegisteredUrl.searchParams.set('functionName', 'isRegistered');
  isRegisteredUrl.searchParams.set('args', address);
  const fetchOptions = {
    headers: {
      Authorization: `Bearer ${env.THIRDWEB_ENGINE_ACCESS_TOKEN}`,
    },
    method: 'GET',
  };

  try {
    const response = await fetch(isRegisteredUrl, fetchOptions);
    const data = await response.json() as { result: boolean };
    console.log('\x1b[33m%s\x1b[0m', `isRegistered for address ${address}:`, JSON.stringify(data, null, 2));
    return data.result;
  } catch (error) {
    console.error(`Error getting isRegistered for address ${address}:`, error);
    throw error;
  }
}

export const getRegisterAccountTx = async (address: string) => {
  const tx = registerAccountTx({
    contract: CONTRACT,
    account: address,
  });
  return {
    toAddress: TIP_TOKEN,
    data: await encode(tx),
    value: "0",
  };
}

export const isAddressDeployed = async (userId: string, teamId: string) => {
  const baseUrl = new URL(`${env.THIRDWEB_ENGINE_URL}/contract/${CHAIN.id}/${ACCOUNT_FACTORY}/account-factory`);
  const isDeployedUrl = new URL(`${baseUrl}/is-account-deployed`);
  isDeployedUrl.searchParams.set('adminAddress', ACCOUNT_FACTORY_ADMIN);
  isDeployedUrl.searchParams.set('extraData', toHex(generateAccountSalt(teamId, userId)));

  const fetchOptions = {
    headers: {
      Authorization: `Bearer ${env.THIRDWEB_ENGINE_ACCESS_TOKEN}`,
    },
    method: 'GET',
  };

  try {
    const response = await fetch(isDeployedUrl, fetchOptions);
    const data = await response.json() as { result: boolean };
    console.log('\x1b[33m%s\x1b[0m', `isDeployed for userId ${userId} teamId ${teamId}:`, JSON.stringify(data, null, 2));
    return data.result;
  } catch (error) {
    console.error(`Error getting isDeployed for userId ${userId} teamId ${teamId}:`, error);
    throw error;
  }
};

export const deployAccount = async ({
  userId, teamId, idempotencyKey
}: {
  userId: string, teamId: string, idempotencyKey: string
}) => {
  const createAccountUrl = new URL(`${env.THIRDWEB_ENGINE_URL}/contract/${CHAIN.id}/${ACCOUNT_FACTORY}/account-factory/create-account`);

  const fetchOptions = {
    headers: {
      'Authorization': `Bearer ${env.THIRDWEB_ENGINE_ACCESS_TOKEN}`,
      'Content-Type': 'application/json',
      'x-backend-wallet-address': ACCOUNT_FACTORY_ADMIN,
      'x-idempotency-key': idempotencyKey,
      'x-account-factory-address': ACCOUNT_FACTORY,
      'x-account-salt': generateAccountSalt(teamId, userId)
    },
    method: 'POST',
    body: JSON.stringify({
      adminAddress: ACCOUNT_FACTORY_ADMIN,
      extraData: generateAccountSalt(teamId, userId)
    })
  };

  try {
    const response = await fetch(createAccountUrl, fetchOptions);
    const data = await response.json() as { 
      result: {
        queueId: string;
        deployedAddress: string;
      }
    };
    console.log('\x1b[33m%s\x1b[0m', `deployAccount for user ${userId} teamId ${teamId}:`, JSON.stringify(data, null, 2));
    return data.result;
  } catch (error) {
    console.error(`Error deploying account for user ${userId} teamId ${teamId}:`, error);
    throw error;
  }
}

export const getTipTxn = async (senderAddress: string, toAddresses: string[], amount: number) => {
  const tipManyTxn = tipMany({
    contract: CONTRACT,
    to: toAddresses,
    from: senderAddress,
    amount: toWei(amount.toString()),
  });
  return {
    toAddress: TIP_TOKEN,
    data: await encode(tipManyTxn),
    value: '0'
  };
}

export const getBalance = async (address: string) => {
  const balanceUrl = new URL(`${env.THIRDWEB_ENGINE_URL}/contract/${CHAIN.id}/${TIP_TOKEN}/erc20/balance-of`);
  balanceUrl.searchParams.set('wallet_address', address);

  const fetchOptions = {
    headers: {
      Authorization: `Bearer ${env.THIRDWEB_ENGINE_ACCESS_TOKEN}`,
    },
    method: 'GET',
  };

  try {
    const response = await fetch(balanceUrl, fetchOptions);
    const data = await response.json() as { 
      result: {
        name: string;
        symbol: string;
        decimals: string;
        value: string;
        displayValue: string;
      }
    };
    console.log('\x1b[33m%s\x1b[0m', `getBalance for address ${address}:`, JSON.stringify(data, null, 2));
    return data.result;
  } catch (error) {
    console.error(`Error getting balance for address ${address}:`, error);
    throw error;
  }
}

export const getAccountAdmins = async (address: string) => {
  const accountAdminsUrl = new URL(`${env.THIRDWEB_ENGINE_URL}/contract/${CHAIN.id}/${address}/account/admins/get-all`);

  const fetchOptions = {
    headers: {
      Authorization: `Bearer ${env.THIRDWEB_ENGINE_ACCESS_TOKEN}`,
    },
    method: 'GET',
  };

  try {
    const response = await fetch(accountAdminsUrl, fetchOptions);
    const data = await response.json() as { result: string[] };
    console.log('\x1b[33m%s\x1b[0m', `getAccountAdmins for address ${address}:`, JSON.stringify(data, null, 2));
    return data.result;
  } catch (error) {
    console.error(`Error getting account admins for address ${address}:`, error);
    throw error;
  }
}

export const addAccountAdmin = async ({
  address, adminAddress, idempotencyKey
}: {
  address: string, adminAddress: string, idempotencyKey: string
}) => {
  const addAccountAdminUrl = new URL(`${env.THIRDWEB_ENGINE_URL}/contract/${CHAIN.id}/${address}/account/admins/grant`);

  const fetchOptions = {
    headers: {
      Authorization: `Bearer ${env.THIRDWEB_ENGINE_ACCESS_TOKEN}`,
      'Content-Type': 'application/json',
      'X-Backend-Wallet-Address': THIRDWEB_ENGINE_BACKEND_EOA_WALLET,
      'X-Idempotency-Key': idempotencyKey,
    },
    method: 'POST',
    body: JSON.stringify({
      signerAddress: adminAddress,
    })
  };

  try {
    const response = await fetch(addAccountAdminUrl, fetchOptions);
    const data = await response.json() as { result: { queueId: string } };
    console.log('\x1b[33m%s\x1b[0m', `addAccountAdmin for address ${address} admin ${adminAddress}:`, JSON.stringify(data, null, 2));
    return data.result;
  } catch (error) {
    console.error(`Error adding account admin for address ${address} admin ${adminAddress}:`, error);
    throw error;
  }
}

export const transferTips = async ({
  senderAddress, toAddress, amount, idempotencyKey
}: {
  senderAddress: string, toAddress: string, amount: string, idempotencyKey: string
}) => {
  const transferUrl = new URL(`${env.THIRDWEB_ENGINE_URL}/contract/${CHAIN.id}/${TIP_TOKEN}/erc20/transfer`);

  const fetchOptions = {
    headers: {
      Authorization: `Bearer ${env.THIRDWEB_ENGINE_ACCESS_TOKEN}`,
      'Content-Type': 'application/json',
      'X-Backend-Wallet-Address': THIRDWEB_ENGINE_BACKEND_EOA_WALLET,
      'X-Account-Address': senderAddress,
      'X-Idempotency-Key': idempotencyKey,
    },
    method: 'POST',
    body: JSON.stringify({
      toAddress,
      amount,
    })
  };

  try {
    const response = await fetch(transferUrl, fetchOptions);
    const data = await response.json() as { result: { queueId: string } };
    console.log('\x1b[33m%s\x1b[0m', `transferTips for address ${senderAddress} to ${toAddress} amount ${amount}:`, JSON.stringify(data, null, 2));
    return data.result;
  } catch (error) {
    console.error(`Error transferring tips for address ${senderAddress} to ${toAddress} amount ${amount}:`, error);
    throw error;
  }
}