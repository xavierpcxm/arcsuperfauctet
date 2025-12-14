import { NetworkAlert } from "../NetworkAlert";

export default function NetworkAlertExample() {
  return (
    <div className="max-w-lg">
      <NetworkAlert
        isVisible={true}
        onSwitchNetwork={() => console.log("Switch network clicked")}
      />
    </div>
  );
}
