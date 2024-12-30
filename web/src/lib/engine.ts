import { ACCOUNT_FACTORY, ACCOUNT_FACTORY_ADMIN, CONTRACT, THIRDWEB_ENGINE_BACKEND_WALLET, TIP_TOKEN } from "~/constants";
import { registerAccount as registerAccountTx, tip } from "~/thirdweb/84532/0xa2f642e706c44eac9ad11747edcfa7ab573d55e9";
import { CHAIN } from "~/constants";
import { env } from "~/env";
import { encode, toWei } from "thirdweb";

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
    const data = await response.json() as { result: { queueId: string } };
    console.log('\x1b[33m%s\x1b[0m', `sendBatchTxns:`, JSON.stringify(data, null, 2));
    return data.result;
  } catch (error) {
    console.error(`Error sending batch transactions:`, error);
    throw error;
  }
}

export const getAddressByUserId = async (userId: string) => {
  const baseUrl = new URL(`${env.THIRDWEB_ENGINE_URL}/contract/${CHAIN.id}/${ACCOUNT_FACTORY}/account-factory`);

  const getAddressUrl = new URL(`${baseUrl}/predict-account-address`);
  getAddressUrl.searchParams.set('adminAddress', ACCOUNT_FACTORY_ADMIN);
  getAddressUrl.searchParams.set('extraData', userId);

  const fetchOptions = {
    headers: {
      Authorization: `Bearer ${env.THIRDWEB_ENGINE_ACCESS_TOKEN}`,
    },
    method: 'GET',
  };

  try {
    const addressResponse = await fetch(getAddressUrl, fetchOptions);
    const addressData = await addressResponse.json() as { result: string };
    console.log('\x1b[33m%s\x1b[0m', `getAddressByUserId for userId ${userId}:`, JSON.stringify(addressData, null, 2));
    return addressData.result;
  } catch (error) {
    console.error(`Error getting address for user ${userId}:`, error);
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

export const isAddressDeployed = async (address: string) => {
  const baseUrl = new URL(`${env.THIRDWEB_ENGINE_URL}/contract/${CHAIN.id}/${ACCOUNT_FACTORY}/account-factory`);
  const isDeployedUrl = new URL(`${baseUrl}/is-account-deployed`);
  isDeployedUrl.searchParams.set('adminAddress', ACCOUNT_FACTORY_ADMIN);
  isDeployedUrl.searchParams.set('address', address);

  const fetchOptions = {
    headers: {
      Authorization: `Bearer ${env.THIRDWEB_ENGINE_ACCESS_TOKEN}`,
    },
    method: 'GET',
  };

  try {
    const response = await fetch(isDeployedUrl, fetchOptions);
    const data = await response.json() as { result: boolean };
    console.log('\x1b[33m%s\x1b[0m', `isDeployed for address ${address}:`, JSON.stringify(data, null, 2));
    return data.result;
  } catch (error) {
    console.error(`Error getting isDeployed for address ${address}:`, error);
    throw error;
  }
};

export const deployAccount = async (userId: string, idempotencyKey: string) => {
  const baseUrl = new URL(`${env.THIRDWEB_ENGINE_URL}/contract/${CHAIN.id}/${ACCOUNT_FACTORY}/account-factory`);
  const createAccountUrl = new URL(`${baseUrl}/create-account`);

  const fetchOptions = {
    headers: {
      'Authorization': `Bearer ${env.THIRDWEB_ENGINE_ACCESS_TOKEN}`,
      'Content-Type': 'application/json',
      'x-backend-wallet-address': ACCOUNT_FACTORY_ADMIN,
      'x-idempotency-key': idempotencyKey,
      'x-account-factory-address': ACCOUNT_FACTORY,
      'x-account-salt': userId
    },
    method: 'POST',
    body: JSON.stringify({
      adminAddress: ACCOUNT_FACTORY_ADMIN,
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
    console.log('\x1b[33m%s\x1b[0m', `deployAccount for user ${userId}:`, JSON.stringify(data, null, 2));
    return data.result;
  } catch (error) {
    console.error(`Error deploying account for user ${userId}:`, error);
    throw error;
  }
}

export const getTipTxns = async (senderAddress: string, toAddresses: string[], amount: number) => {
  const txns = [];
  for (const toAddress of toAddresses) {
    const tx = tip({
      contract: CONTRACT,
      to: toAddress,
      from: senderAddress,
      amount: toWei(amount.toString()),
    });
    txns.push({
      toAddress: TIP_TOKEN,
      data: await encode(tx),
      value: "0",
    });
  }
  return txns;
}