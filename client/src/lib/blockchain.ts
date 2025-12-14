import { BrowserProvider, Contract, formatUnits } from "ethers";

export const ARC_TESTNET = {
  chainId: "0x1B59",
  chainName: "Arc Testnet",
  nativeCurrency: {
    name: "ARC",
    symbol: "ARC",
    decimals: 18,
  },
  rpcUrls: ["https://rpc-testnet.arc.io"],
  blockExplorerUrls: ["https://testnet.arcscan.io"],
};

export const FAUCET_CONTRACT_ADDRESS = "0x0dCA4156d4b138EbA6578B2e771297D80637B840";

export const USDC_TOKEN_ADDRESS = "0x14A22AD4b53b23363d35C0F893E74c965a040d63";

export const FAUCET_ABI = [
  "function claim() external",
  "function totalClaimedByUser(address user) view returns (uint256)",
  "function timeUntilNextClaim(address user) view returns (uint256)",
  "function totalUSDCDistributed() view returns (uint256)",
  "function totalClaims() view returns (uint256)",
];

export const ERC20_ABI = [
  "function balanceOf(address account) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)",
];

export const CLAIM_AMOUNT = 500;
export const USDC_DECIMALS = 6;

export function formatUSDC(value: bigint): string {
  const formatted = formatUnits(value, USDC_DECIMALS);
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
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
          params: [{
            chainId: ARC_TESTNET.chainId,
            chainName: ARC_TESTNET.chainName,
            nativeCurrency: ARC_TESTNET.nativeCurrency,
            rpcUrls: ARC_TESTNET.rpcUrls,
            blockExplorerUrls: ARC_TESTNET.blockExplorerUrls,
          }],
        });
        return true;
      } catch {
        return false;
      }
    }
    return false;
  }
}

export async function getCurrentChainId(): Promise<string | null> {
  if (!window.ethereum) return null;
  try {
    const chainId = await window.ethereum.request({ method: "eth_chainId" });
    return chainId;
  } catch {
    return null;
  }
}

export async function isOnArcTestnet(): Promise<boolean> {
  const chainId = await getCurrentChainId();
  return chainId?.toLowerCase() === ARC_TESTNET.chainId.toLowerCase();
}

export function getProvider(): BrowserProvider | null {
  if (!window.ethereum) return null;
  return new BrowserProvider(window.ethereum);
}

export function getFaucetContract(providerOrSigner: any): Contract {
  return new Contract(FAUCET_CONTRACT_ADDRESS, FAUCET_ABI, providerOrSigner);
}

export function getUSDCContract(providerOrSigner: any): Contract {
  return new Contract(USDC_TOKEN_ADDRESS, ERC20_ABI, providerOrSigner);
}

declare global {
  interface Window {
    ethereum?: any;
  }
}
