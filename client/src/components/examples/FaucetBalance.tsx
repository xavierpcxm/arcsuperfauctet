import { FaucetBalance } from "../FaucetBalance";

export default function FaucetBalanceExample() {
  return (
    <div className="flex flex-col gap-4 max-w-md">
      <FaucetBalance balance={BigInt(2500000000)} isLoading={false} />
      <FaucetBalance balance={BigInt(0)} isLoading={false} />
      <FaucetBalance balance={BigInt(0)} isLoading={true} />
    </div>
  );
}
