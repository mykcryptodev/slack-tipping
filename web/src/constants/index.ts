import { createThirdwebClient, getContract } from "thirdweb";
import { baseSepolia } from "thirdweb/chains";
import { env } from "~/env";

export const CHAIN = baseSepolia;
export const ACCOUNT_FACTORY = "0x8f52B8E1eA59756EE4E68961D291C37DCb3A8766";
export const ACCOUNT_FACTORY_ADMIN = "0xb503723beC0E8142aC24aCf55Fc11c7fC809e723";
export const THIRDWEB_ENGINE_BACKEND_WALLET = "0xb503723beC0E8142aC24aCf55Fc11c7fC809e723";
export const TIP_TOKEN = "0xa2f642e706c44eac9ad11747edcfa7ab573d55e9";
export const TIP_INDICATOR = ":taco:";
export const CLIENT = createThirdwebClient({
  clientId: env.THIRDWEB_CLIENT_ID,
});
export const CONTRACT = getContract({
  chain: CHAIN,
  client: CLIENT,
  address: TIP_TOKEN,
});