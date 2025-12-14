import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader2, Zap } from "lucide-react";
import { formatCountdown, CLAIM_AMOUNT } from "@/lib/blockchain";
import { useEffect, useState } from "react";

interface ClaimButtonProps {
  isConnected: boolean;
  isCorrectNetwork: boolean;
  isClaiming: boolean;
  timeUntilNextClaim: number;
  faucetEmpty: boolean;
  onClaim: () => void;
  onSwitchNetwork: () => void;
}

export function ClaimButton({
  isConnected,
  isCorrectNetwork,
  isClaiming,
  timeUntilNextClaim,
  faucetEmpty,
  onClaim,
  onSwitchNetwork,
}: ClaimButtonProps) {
  const [countdown, setCountdown] = useState(timeUntilNextClaim);

  useEffect(() => {
    setCountdown(timeUntilNextClaim);
  }, [timeUntilNextClaim]);

  useEffect(() => {
    if (countdown <= 0) return;

    const interval = setInterval(() => {
      setCountdown((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(interval);
  }, [countdown]);

  const canClaim = isConnected && isCorrectNetwork && countdown === 0 && !faucetEmpty;
  const isOnCooldown = countdown > 0;

  const getButtonContent = () => {
    if (!isConnected) {
      return "Connect wallet to enable claiming";
    }
    if (!isCorrectNetwork) {
      return "Switch to Arc Testnet";
    }
    if (isClaiming) {
      return (
        <>
          <Loader2 className="h-5 w-5 mr-2 animate-spin" />
          Claiming...
        </>
      );
    }
    if (faucetEmpty) {
      return "Faucet empty";
    }
    if (isOnCooldown) {
      return `You can claim again in ${formatCountdown(countdown)}`;
    }
    return (
      <>
        <Zap className="h-5 w-5 mr-2" />
        Claim ${CLAIM_AMOUNT}
      </>
    );
  };

  const handleClick = () => {
    if (!isConnected) return;
    if (!isCorrectNetwork) {
      onSwitchNetwork();
      return;
    }
    if (canClaim) {
      onClaim();
    }
  };

  return (
    <Card className="p-6">
      <Button
        className="w-full h-14 text-lg font-semibold"
        size="lg"
        disabled={!canClaim || isClaiming}
        onClick={handleClick}
        data-testid="button-claim"
      >
        {getButtonContent()}
      </Button>

      {isOnCooldown && isConnected && isCorrectNetwork && (
        <div className="mt-4 text-center">
          <p className="text-sm text-muted-foreground">
            Cooldown active
          </p>
          <p className="font-mono text-2xl font-bold mt-1" data-testid="text-countdown">
            {formatCountdown(countdown)}
          </p>
        </div>
      )}
    </Card>
  );
}
