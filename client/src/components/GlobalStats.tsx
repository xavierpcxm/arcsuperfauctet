import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatUSDC } from "@/lib/blockchain";
import { Globe, TrendingUp, Users } from "lucide-react";

interface GlobalStatsProps {
  totalDistributed: bigint;
  totalClaims: bigint;
  isLoading: boolean;
}

export function GlobalStats({
  totalDistributed,
  totalClaims,
  isLoading,
}: GlobalStatsProps) {
  return (
    <Card className="p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-md bg-primary/10">
          <Globe className="h-5 w-5 text-primary" />
        </div>
        <h2 className="text-lg font-semibold">Global Stats</h2>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-muted-foreground">
            <TrendingUp className="h-4 w-4" />
            <span className="text-sm">Total Distributed</span>
          </div>
          {isLoading ? (
            <Skeleton className="h-5 w-24" />
          ) : (
            <span className="font-mono font-semibold" data-testid="text-total-distributed">
              ${formatUSDC(totalDistributed)}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Users className="h-4 w-4" />
            <span className="text-sm">Total Claims</span>
          </div>
          {isLoading ? (
            <Skeleton className="h-5 w-16" />
          ) : (
            <span className="font-mono font-semibold" data-testid="text-total-claims">
              {totalClaims.toString()}
            </span>
          )}
        </div>
      </div>
    </Card>
  );
}
