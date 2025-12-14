import { ClaimButton } from "../ClaimButton";
import { useState } from "react";

export default function ClaimButtonExample() {
  const [isClaiming, setIsClaiming] = useState(false);

  const handleClaim = () => {
    setIsClaiming(true);
    setTimeout(() => setIsClaiming(false), 2000);
  };

  return (
    <div className="flex flex-col gap-4 max-w-md">
      <p className="text-sm text-muted-foreground">Ready to claim:</p>
      <ClaimButton
        isConnected={true}
        isCorrectNetwork={true}
        isClaiming={isClaiming}
        timeUntilNextClaim={0}
        faucetEmpty={false}
        onClaim={handleClaim}
        onSwitchNetwork={() => {}}
      />

      <p className="text-sm text-muted-foreground mt-4">On cooldown:</p>
      <ClaimButton
        isConnected={true}
        isCorrectNetwork={true}
        isClaiming={false}
        timeUntilNextClaim={43200}
        faucetEmpty={false}
        onClaim={() => {}}
        onSwitchNetwork={() => {}}
      />

      <p className="text-sm text-muted-foreground mt-4">Not connected:</p>
      <ClaimButton
        isConnected={false}
        isCorrectNetwork={false}
        isClaiming={false}
        timeUntilNextClaim={0}
        faucetEmpty={false}
        onClaim={() => {}}
        onSwitchNetwork={() => {}}
      />
    </div>
  );
}
