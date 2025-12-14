import { GlobalStats } from "../GlobalStats";

export default function GlobalStatsExample() {
  return (
    <div className="flex flex-col gap-4 max-w-md">
      <GlobalStats
        totalDistributed={BigInt(125000000000)}
        totalClaims={BigInt(250)}
        isLoading={false}
      />

      <p className="text-sm text-muted-foreground mt-4">Loading:</p>
      <GlobalStats
        totalDistributed={BigInt(0)}
        totalClaims={BigInt(0)}
        isLoading={true}
      />
    </div>
  );
}
