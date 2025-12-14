import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NetworkAlertProps {
  isVisible: boolean;
  onSwitchNetwork: () => void;
}

export function NetworkAlert({ isVisible, onSwitchNetwork }: NetworkAlertProps) {
  if (!isVisible) return null;

  return (
    <div className="bg-destructive/10 border border-destructive/20 rounded-md p-4 flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <AlertTriangle className="h-5 w-5 text-destructive" />
        <div>
          <p className="font-medium text-destructive" data-testid="text-wrong-network">
            Wrong Network
          </p>
          <p className="text-sm text-muted-foreground">
            Please switch to Arc Testnet to use the faucet
          </p>
        </div>
      </div>
      <Button
        variant="destructive"
        onClick={onSwitchNetwork}
        data-testid="button-switch-network"
      >
        Switch Network
      </Button>
    </div>
  );
}
