import { createThirdwebClient, getContract } from "thirdweb";
import { baseSepolia } from "thirdweb/chains";
import { env } from "~/env";

export const CHAIN = baseSepolia;
export const ACCOUNT_FACTORY = "0x9e351f4cbf336d2d59e719a5355c564a88ec19ea";
export const ACCOUNT_FACTORY_ADMIN = "0x9036464e4ecD2d40d21EE38a0398AEdD6805a09B";
export const THIRDWEB_ENGINE_BACKEND_WALLET = "0x9036464e4ecD2d40d21EE38a0398AEdD6805a09B";
export const TIP_TOKEN = "0x216665E6f1d9d6C403e39a484f6031cBAADC671E";
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
