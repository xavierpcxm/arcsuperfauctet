import { Button } from "@/components/ui/button";
import { Wallet, LogOut, Loader2 } from "lucide-react";
import { formatUSDC } from "@/lib/blockchain";

interface WalletButtonProps {
  address: string | null;
  isConnected: boolean;
  isConnecting: boolean;
  userUsdcBalance?: bigint;
  onConnect: () => void;
  onDisconnect: () => void;
}

function truncateAddress(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function WalletButton({
  address,
  isConnected,
  isConnecting,
  userUsdcBalance = BigInt(0),
  onConnect,
  onDisconnect,
}: WalletButtonProps) {
  if (isConnected && address) {
    return (
      <div className="flex items-center gap-2">
        <div className="flex flex-col items-end px-3 py-2 rounded-md bg-card border border-card-border">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <span className="font-mono text-sm" data-testid="text-wallet-address">
              {truncateAddress(address)}
            </span>
          </div>
          <span className="font-mono text-xs text-muted-foreground" data-testid="text-user-balance">
            ${formatUSDC(userUsdcBalance)} USDC
          </span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onDisconnect}
          data-testid="button-disconnect"
        >
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <Button
      onClick={onConnect}
      disabled={isConnecting}
      data-testid="button-connect-wallet"
    >
      {isConnecting ? (
        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
      ) : (
        <Wallet className="h-4 w-4 mr-2" />
      )}
      {isConnecting ? "Connecting..." : "Connect Wallet"}
    </Button>
  );
}
