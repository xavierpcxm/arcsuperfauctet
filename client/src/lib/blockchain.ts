import { BrowserProvider, Contract, formatUnits } from "ethers";

export const ARC_TESTNET = {
  chainId: "0x1b59", // 7001 in hex
  chainName: "Arc Testnet",
  nativeCurrency: {
    name: "ARC",
    symbol: "ARC",
    decimals: 18,
  },
  rpcUrls: ["https://rpc-testnet.arcblockchain.io"],
  blockExplorerUrls: ["https://explorer-testnet.arcblockchain.io"],
};

export const FAUCET_CONTRACT_ADDRESS = "0x0dCA4156d4b138EbA6578B2e771297D80637B840";

export const USDC_ADDRESS = "0x0dCA4156d4b138EbA6578B2e771297D80637B840";

export const FAUCET_ABI = [
  "function claim() external",
  "function totalClaimedByUser(address user) view returns (uint256)",
  "function timeUntilNextClaim(address user) view returns (uint256)",
  "function totalUSDCDistributed() view returns (uint256)",
  "function totalClaims() view returns (uint256)",
];

export const USDC_ABI = [
  "function balanceOf(address account) view returns (uint256)",
];

export const CLAIM_AMOUNT = 500;
export const USDC_DECIMALS = 6;

export function formatUSDC(value: bigint): string {
  const formatted = formatUnits(value, USDC_DECIMALS);
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(parseFloat(formatted));
}

export function formatCountdown(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

export async function switchToArcTestnet(): Promise<boolean> {
  if (!window.ethereum) return false;

  try {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: ARC_TESTNET.chainId }],
    });
    return true;
  } catch (switchError: any) {
    if (switchError.code === 4902) {
      try {
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [ARC_TESTNET],
        });
        return true;
      } catch {
        return false;
      }
    }
    return false;
  }
}

export function getProvider(): BrowserProvider | null {
  if (!window.ethereum) return null;
  return new BrowserProvider(window.ethereum);
}

export function getFaucetContract(provider: BrowserProvider): Contract {
  return new Contract(FAUCET_CONTRACT_ADDRESS, FAUCET_ABI, provider);
}

export function getUSDCContract(provider: BrowserProvider): Contract {
  return new Contract(USDC_ADDRESS, USDC_ABI, provider);
}

declare global {
  interface Window {
    ethereum?: any;
  }
}
