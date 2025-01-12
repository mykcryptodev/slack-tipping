import { createThirdwebClient, getContract } from "thirdweb";
import { baseSepolia } from "thirdweb/chains";
import { env } from "~/env";

export const CHAIN = baseSepolia;
export const THIRDWEB_ENGINE_BACKEND_EOA_WALLET = "0x9036464e4ecD2d40d21EE38a0398AEdD6805a09B";
export const THIRDWEB_ENGINE_BACKEND_WALLET = "0x14550cc02BFB53c0B6f410D4C43f109cc2Ca1142";
export const ACCOUNT_FACTORY_ADMIN = THIRDWEB_ENGINE_BACKEND_EOA_WALLET;
export const ACCOUNT_FACTORY = "0x1bfe9d13b03155d90cfd7f2ee343a0ebd0b60f83";
export const TIP_TOKEN = "0xd615172887BBAb8447412b981CdDAb9A909838f2";
export const TIP_INDICATOR = ":taco:";
export const CLIENT = createThirdwebClient({
  secretKey: env.THIRDWEB_SECRET_KEY,
});
export const CONTRACT = getContract({
  chain: CHAIN,
  client: CLIENT,
  address: TIP_TOKEN,
});
export const ACCOUNT_FACTORY_CONTRACT = getContract({
  chain: CHAIN,
  client: CLIENT,
  address: ACCOUNT_FACTORY,
});
