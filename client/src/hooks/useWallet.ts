import { useState, useEffect, useCallback } from "react";
import { BrowserProvider, Contract } from "ethers";
import {
  ARC_TESTNET,
  FAUCET_CONTRACT_ADDRESS,
  USDC_TOKEN_ADDRESS,
  FAUCET_ABI,
  ERC20_ABI,
  switchToArcTestnet,
  isOnArcTestnet,
} from "@/lib/blockchain";

interface WalletState {
  address: string | null;
  isConnected: boolean;
  isCorrectNetwork: boolean;
  isConnecting: boolean;
}

interface FaucetData {
  faucetBalance: bigint;
  userUsdcBalance: bigint;
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
  });

  const [faucetData, setFaucetData] = useState<FaucetData>({
    faucetBalance: BigInt(0),
    userUsdcBalance: BigInt(0),
    userTotalClaimed: BigInt(0),
    timeUntilNextClaim: 0,
    totalDistributed: BigInt(0),
    totalClaims: BigInt(0),
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);
  const [claimError, setClaimError] = useState<string | null>(null);

  const checkNetwork = useCallback(async (): Promise<boolean> => {
    return await isOnArcTestnet();
  }, []);

  const refreshData = useCallback(async () => {
    if (!window.ethereum || !wallet.address) return;

    const isCorrect = await checkNetwork();
    if (!isCorrect) {
      setWallet((prev) => ({ ...prev, isCorrectNetwork: false }));
      return;
    }

    setIsLoading(true);

    try {
      const provider = new BrowserProvider(window.ethereum);

      const faucetContract = new Contract(
        FAUCET_CONTRACT_ADDRESS,
        FAUCET_ABI,
        provider
      );
      const usdcContract = new Contract(
        USDC_TOKEN_ADDRESS,
        ERC20_ABI,
        provider
      );

      const [
        faucetBalance,
        userBalance,
        userClaimed,
        timeUntil,
        totalDist,
        claims,
      ] = await Promise.all([
        usdcContract.balanceOf(FAUCET_CONTRACT_ADDRESS),
        usdcContract.balanceOf(wallet.address),
        faucetContract.totalClaimedByUser(wallet.address),
        faucetContract.timeUntilNextClaim(wallet.address),
        faucetContract.totalUSDCDistributed(),
        faucetContract.totalClaims(),
      ]);

      setFaucetData({
        faucetBalance,
        userUsdcBalance: userBalance,
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
  }, [wallet.address, checkNetwork]);

  const connect = useCallback(async () => {
    if (!window.ethereum) {
      alert("Please install MetaMask to use this faucet");
      return;
    }

    setWallet((prev) => ({ ...prev, isConnecting: true }));

    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      if (!accounts || accounts.length === 0) {
        setWallet((prev) => ({ ...prev, isConnecting: false }));
        return;
      }

      let isCorrect = await checkNetwork();

      if (!isCorrect) {
        const switched = await switchToArcTestnet();
        if (switched) {
          await new Promise((resolve) => setTimeout(resolve, 500));
          isCorrect = await checkNetwork();
        }
      }

      setWallet({
        address: accounts[0],
        isConnected: true,
        isCorrectNetwork: isCorrect,
        isConnecting: false,
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
    });
    setFaucetData({
      faucetBalance: BigInt(0),
      userUsdcBalance: BigInt(0),
      userTotalClaimed: BigInt(0),
      timeUntilNextClaim: 0,
      totalDistributed: BigInt(0),
      totalClaims: BigInt(0),
    });
  }, []);

  const claim = useCallback(async () => {
    if (!window.ethereum || !wallet.address) return;
    setIsClaiming(true);
    setClaimError(null);

    try {
      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
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
  }, [wallet.address, refreshData]);

  const switchNetwork = useCallback(async () => {
    const switched = await switchToArcTestnet();
    if (switched) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const isCorrect = await checkNetwork();
      setWallet((prev) => ({ ...prev, isCorrectNetwork: isCorrect }));
      if (isCorrect && wallet.address) {
        await refreshData();
      }
    }
  }, [checkNetwork, wallet.address, refreshData]);

  useEffect(() => {
    if (wallet.isConnected && wallet.isCorrectNetwork && wallet.address) {
      refreshData();
    }
  }, [wallet.isConnected, wallet.isCorrectNetwork, wallet.address, refreshData]);

  useEffect(() => {
    if (!window.ethereum) return;

    const handleAccountsChanged = async (accounts: string[]) => {
      if (accounts.length === 0) {
        disconnect();
      } else {
        setWallet((prev) => ({ ...prev, address: accounts[0] }));
      }
    };

    const handleChainChanged = async () => {
      const isCorrect = await checkNetwork();
      setWallet((prev) => ({ ...prev, isCorrectNetwork: isCorrect }));
      if (isCorrect && wallet.address) {
        await refreshData();
      }
    };

    window.ethereum.on("accountsChanged", handleAccountsChanged);
    window.ethereum.on("chainChanged", handleChainChanged);

    return () => {
      window.ethereum?.removeListener("accountsChanged", handleAccountsChanged);
      window.ethereum?.removeListener("chainChanged", handleChainChanged);
    };
  }, [disconnect, checkNetwork, wallet.address, refreshData]);

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
