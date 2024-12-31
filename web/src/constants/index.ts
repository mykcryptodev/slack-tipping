import { createThirdwebClient, getContract } from "thirdweb";
import { baseSepolia } from "thirdweb/chains";
import { env } from "~/env";

export const CHAIN = baseSepolia;
export const ACCOUNT_FACTORY = "0x9153DbD27d9895BD1ca2839D2Dd0A7E68eE2e24f";
export const ACCOUNT_FACTORY_ADMIN = "0x14550cc02BFB53c0B6f410D4C43f109cc2Ca1142";
export const THIRDWEB_ENGINE_BACKEND_WALLET = "0x14550cc02BFB53c0B6f410D4C43f109cc2Ca1142";
export const TIP_TOKEN = "0x90331b4b52a1e4f32adba4fcdc7c623d9606fc77";
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
