import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatUSDC } from "@/lib/blockchain";
import { Droplets } from "lucide-react";

interface FaucetBalanceProps {
  balance: bigint;
  isLoading: boolean;
}

export function FaucetBalance({ balance, isLoading }: FaucetBalanceProps) {
  const isEmpty = balance === BigInt(0);

  return (
    <Card className="p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-md bg-primary/10">
          <Droplets className="h-5 w-5 text-primary" />
        </div>
        <h2 className="text-lg font-semibold">Faucet Balance</h2>
      </div>

      <div className="text-center py-4">
        {isLoading ? (
          <Skeleton className="h-16 w-48 mx-auto" />
        ) : (
          <div
            className={`font-mono text-5xl font-bold ${isEmpty ? "text-destructive" : ""}`}
            data-testid="text-faucet-balance"
          >
            ${formatUSDC(balance)}
          </div>
        )}

        {isEmpty && !isLoading && (
          <p className="text-destructive mt-2 text-sm" data-testid="text-faucet-empty">
            Faucet empty - check back later
          </p>
        )}
      </div>
    </Card>
  );
}
