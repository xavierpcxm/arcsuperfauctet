import { useState, useEffect, useCallback } from "react";
import { BrowserProvider, Contract } from "ethers";
import {
  ARC_TESTNET,
  FAUCET_CONTRACT_ADDRESS,
  FAUCET_ABI,
  USDC_ABI,
  switchToArcTestnet,
} from "@/lib/blockchain";

interface WalletState {
  address: string | null;
  isConnected: boolean;
  isCorrectNetwork: boolean;
  isConnecting: boolean;
  provider: BrowserProvider | null;
  faucetContract: Contract | null;
}

interface FaucetData {
  faucetBalance: bigint;
  userTotalClaimed: bigint;
  timeUntilNextClaim: number;
  totalDistributed: bigint;
  totalClaims: bigint;
}

export function useWallet() {
  const [wallet, setWallet] = useState<WalletState>({
    address: null,
    isConnected: false,
    isCorrectNetwork: false,
    isConnecting: false,
    provider: null,
    faucetContract: null,
  });

  const [faucetData, setFaucetData] = useState<FaucetData>({
    faucetBalance: BigInt(0),
    userTotalClaimed: BigInt(0),
    timeUntilNextClaim: 0,
    totalDistributed: BigInt(0),
    totalClaims: BigInt(0),
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);
  const [claimError, setClaimError] = useState<string | null>(null);

  const checkNetwork = useCallback(async () => {
    if (!window.ethereum) return false;
    const chainId = await window.ethereum.request({ method: "eth_chainId" });
    return chainId === ARC_TESTNET.chainId;
  }, []);

  const refreshData = useCallback(async () => {
    if (!wallet.provider || !wallet.address) return;
    setIsLoading(true);

    try {
      const faucetContract = new Contract(
        FAUCET_CONTRACT_ADDRESS,
        FAUCET_ABI,
        wallet.provider
      );
      const usdcContract = new Contract(
        FAUCET_CONTRACT_ADDRESS,
        USDC_ABI,
        wallet.provider
      );

      const [balance, userClaimed, timeUntil, totalDist, claims] =
        await Promise.all([
          usdcContract.balanceOf(FAUCET_CONTRACT_ADDRESS),
          faucetContract.totalClaimedByUser(wallet.address),
          faucetContract.timeUntilNextClaim(wallet.address),
          faucetContract.totalUSDCDistributed(),
          faucetContract.totalClaims(),
        ]);

      setFaucetData({
        faucetBalance: balance,
        userTotalClaimed: userClaimed,
        timeUntilNextClaim: Number(timeUntil),
        totalDistributed: totalDist,
        totalClaims: claims,
      });
    } catch (error) {
      console.error("Error fetching faucet data:", error);
    } finally {
      setIsLoading(false);
    }
  }, [wallet.provider, wallet.address]);

  const connect = useCallback(async () => {
    if (!window.ethereum) {
      alert("Please install MetaMask to use this faucet");
      return;
    }

    setWallet((prev) => ({ ...prev, isConnecting: true }));

    try {
      const provider = new BrowserProvider(window.ethereum);
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      const isCorrectNetwork = await checkNetwork();
      if (!isCorrectNetwork) {
        await switchToArcTestnet();
      }

      const faucetContract = new Contract(
        FAUCET_CONTRACT_ADDRESS,
        FAUCET_ABI,
        provider
      );

      setWallet({
        address: accounts[0],
        isConnected: true,
        isCorrectNetwork: await checkNetwork(),
        isConnecting: false,
        provider,
        faucetContract,
      });
    } catch (error) {
      console.error("Error connecting wallet:", error);
      setWallet((prev) => ({ ...prev, isConnecting: false }));
    }
  }, [checkNetwork]);

  const disconnect = useCallback(() => {
    setWallet({
      address: null,
      isConnected: false,
      isCorrectNetwork: false,
      isConnecting: false,
      provider: null,
      faucetContract: null,
    });
    setFaucetData({
      faucetBalance: BigInt(0),
      userTotalClaimed: BigInt(0),
      timeUntilNextClaim: 0,
      totalDistributed: BigInt(0),
      totalClaims: BigInt(0),
    });
  }, []);

  const claim = useCallback(async () => {
    if (!wallet.provider || !wallet.address) return;
    setIsClaiming(true);
    setClaimError(null);

    try {
      const signer = await wallet.provider.getSigner();
      const faucetContract = new Contract(
        FAUCET_CONTRACT_ADDRESS,
        FAUCET_ABI,
        signer
      );

      const tx = await faucetContract.claim();
      await tx.wait();

      await refreshData();
    } catch (error: any) {
      console.error("Error claiming:", error);
      setClaimError(error.reason || error.message || "Failed to claim");
    } finally {
      setIsClaiming(false);
    }
  }, [wallet.provider, wallet.address, refreshData]);

  const switchNetwork = useCallback(async () => {
    const success = await switchToArcTestnet();
    if (success) {
      setWallet((prev) => ({ ...prev, isCorrectNetwork: true }));
    }
  }, []);

  useEffect(() => {
    if (wallet.isConnected && wallet.isCorrectNetwork) {
      refreshData();
    }
  }, [wallet.isConnected, wallet.isCorrectNetwork, refreshData]);

  useEffect(() => {
    if (!window.ethereum) return;

    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        disconnect();
      } else {
        setWallet((prev) => ({ ...prev, address: accounts[0] }));
      }
    };

    const handleChainChanged = async () => {
      const isCorrect = await checkNetwork();
      setWallet((prev) => ({ ...prev, isCorrectNetwork: isCorrect }));
    };

    window.ethereum.on("accountsChanged", handleAccountsChanged);
    window.ethereum.on("chainChanged", handleChainChanged);

    return () => {
      window.ethereum?.removeListener("accountsChanged", handleAccountsChanged);
      window.ethereum?.removeListener("chainChanged", handleChainChanged);
    };
  }, [disconnect, checkNetwork]);

  return {
    ...wallet,
    ...faucetData,
    isLoading,
    isClaiming,
    claimError,
    connect,
    disconnect,
    claim,
    refreshData,
    switchNetwork,
  };
}
