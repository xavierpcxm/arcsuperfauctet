import { Header } from "@/components/Header";
import { FaucetBalance } from "@/components/FaucetBalance";
import { ClaimButton } from "@/components/ClaimButton";
import { UserStats } from "@/components/UserStats";
import { GlobalStats } from "@/components/GlobalStats";
import { NetworkAlert } from "@/components/NetworkAlert";
import { Footer } from "@/components/Footer";
import { useWallet } from "@/hooks/useWallet";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Faucet() {
  const {
    address,
    isConnected,
    isCorrectNetwork,
    isConnecting,
    isLoading,
    isClaiming,
    claimError,
    faucetBalance,
    userUsdcBalance,
    userTotalClaimed,
    timeUntilNextClaim,
    totalDistributed,
    totalClaims,
    connect,
    disconnect,
    claim,
    refreshData,
    switchNetwork,
  } = useWallet();

  const { toast } = useToast();

  useEffect(() => {
    if (claimError) {
      toast({
        title: "Claim Failed",
        description: claimError,
        variant: "destructive",
      });
    }
  }, [claimError, toast]);

  const handleClaim = async () => {
    await claim();
    toast({
      title: "Claim Successful",
      description: "You have successfully claimed $500!",
    });
  };

  const faucetEmpty = faucetBalance === BigInt(0);
  const showNetworkAlert = isConnected && !isCorrectNetwork;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header
        address={address}
        isConnected={isConnected}
        isConnecting={isConnecting}
        userUsdcBalance={userUsdcBalance}
        onConnect={connect}
        onDisconnect={disconnect}
      />

      <main className="flex-1 max-w-4xl mx-auto px-4 py-8 w-full">
        {showNetworkAlert && (
          <div className="mb-6">
            <NetworkAlert isVisible={true} onSwitchNetwork={switchNetwork} />
          </div>
        )}

        <div className="space-y-6">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-2xl font-bold">Claim Your Tokens</h2>
            {isConnected && isCorrectNetwork && (
              <Button
                variant="ghost"
                size="icon"
                onClick={refreshData}
                disabled={isLoading}
                data-testid="button-refresh"
              >
                <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
              </Button>
            )}
          </div>

          <FaucetBalance balance={faucetBalance} isLoading={isLoading && isConnected && isCorrectNetwork} />

          <ClaimButton
            isConnected={isConnected}
            isCorrectNetwork={isCorrectNetwork}
            isClaiming={isClaiming}
            timeUntilNextClaim={timeUntilNextClaim}
            faucetEmpty={faucetEmpty && isConnected && isCorrectNetwork}
            onClaim={handleClaim}
            onSwitchNetwork={switchNetwork}
          />

          <div className="grid md:grid-cols-2 gap-6">
            <UserStats
              address={address}
              totalClaimed={userTotalClaimed}
              isLoading={isLoading}
              isConnected={isConnected}
            />
            <GlobalStats
              totalDistributed={totalDistributed}
              totalClaims={totalClaims}
              isLoading={isLoading && isConnected && isCorrectNetwork}
            />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
