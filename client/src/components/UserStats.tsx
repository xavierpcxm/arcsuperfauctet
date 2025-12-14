import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatUSDC } from "@/lib/blockchain";
import { User, Clock, Coins } from "lucide-react";

interface UserStatsProps {
  address: string | null;
  totalClaimed: bigint;
  isLoading: boolean;
  isConnected: boolean;
}

function truncateAddress(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function UserStats({
  address,
  totalClaimed,
  isLoading,
  isConnected,
}: UserStatsProps) {
  if (!isConnected) {
    return (
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-md bg-muted">
            <User className="h-5 w-5 text-muted-foreground" />
          </div>
          <h2 className="text-lg font-semibold">Your Stats</h2>
        </div>
        <p className="text-muted-foreground text-center py-4">
          Connect wallet to view your stats
        </p>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-md bg-primary/10">
          <User className="h-5 w-5 text-primary" />
        </div>
        <h2 className="text-lg font-semibold">Your Stats</h2>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Coins className="h-4 w-4" />
            <span className="text-sm">Wallet</span>
          </div>
          {isLoading ? (
            <Skeleton className="h-5 w-32" />
          ) : (
            <span className="font-mono text-sm" data-testid="text-user-address">
              {address ? truncateAddress(address) : "-"}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span className="text-sm">Total Claimed</span>
          </div>
          {isLoading ? (
            <Skeleton className="h-5 w-24" />
          ) : (
            <span className="font-mono font-semibold" data-testid="text-user-total-claimed">
              ${formatUSDC(totalClaimed)}
            </span>
          )}
        </div>
      </div>
    </Card>
  );
}
