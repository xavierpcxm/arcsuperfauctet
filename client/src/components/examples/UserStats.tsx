import { UserStats } from "../UserStats";

export default function UserStatsExample() {
  return (
    <div className="flex flex-col gap-4 max-w-md">
      <p className="text-sm text-muted-foreground">Connected:</p>
      <UserStats
        address="0x1234567890abcdef1234567890abcdef12345678"
        totalClaimed={BigInt(1500000000)}
        isLoading={false}
        isConnected={true}
      />

      <p className="text-sm text-muted-foreground mt-4">Not connected:</p>
      <UserStats
        address={null}
        totalClaimed={BigInt(0)}
        isLoading={false}
        isConnected={false}
      />

      <p className="text-sm text-muted-foreground mt-4">Loading:</p>
      <UserStats
        address="0x1234567890abcdef1234567890abcdef12345678"
        totalClaimed={BigInt(0)}
        isLoading={true}
        isConnected={true}
      />
    </div>
  );
}
