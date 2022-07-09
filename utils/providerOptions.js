import WalletConnect from "@walletconnect/web3-provider";
import CoinbaseWalletSDK from "@coinbase/wallet-sdk";

export const providerOptions = {
  walletlink: {
    package: CoinbaseWalletSDK, // Required
    options: {
      appName: "NFT Minter", // Required
      infuraId: "0e91e36eaa2547cd900e33082493bc48",
    },
  },
  walletconnect: {
    package: WalletConnect, // required
    options: {
      infuraId: "0e91e36eaa2547cd900e33082493bc48",
      rpc: "",
      chainId: 4,
      appLogoUrl: null,
      darkMode: true, // required
    },
  },
  binancechainwallet: {
    package: true,
  },
};
