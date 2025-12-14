import { Header } from "@/components/Header";
import { FaucetBalance } from "@/components/FaucetBalance";
import { ClaimButton } from "@/components/ClaimButton";
import { UserStats } from "@/components/UserStats";
import { GlobalStats } from "@/components/GlobalStats";
import { NetworkAlert } from "@/components/NetworkAlert";
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
    <div className="min-h-screen bg-background">
      <Header
        address={address}
        isConnected={isConnected}
        isConnecting={isConnecting}
        onConnect={connect}
        onDisconnect={disconnect}
      />

      <main className="max-w-4xl mx-auto px-4 py-8">
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

          <FaucetBalance balance={faucetBalance} isLoading={isLoading} />

          <ClaimButton
            isConnected={isConnected}
            isCorrectNetwork={isCorrectNetwork}
            isClaiming={isClaiming}
            timeUntilNextClaim={timeUntilNextClaim}
            faucetEmpty={faucetEmpty}
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
              isLoading={isLoading}
            />
          </div>

          <div className="text-center text-sm text-muted-foreground pt-6 border-t border-border">
            <p>
              All data is read directly from the Arc blockchain.{" "}
              <a
                href={`https://explorer-testnet.arcblockchain.io/address/0x0dCA4156d4b138EbA6578B2e771297D80637B840`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
                data-testid="link-contract"
              >
                View Contract
              </a>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
