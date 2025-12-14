import { WalletButton } from "../WalletButton";
import { useState } from "react";

export default function WalletButtonExample() {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = () => {
    setIsConnecting(true);
    setTimeout(() => {
      setIsConnecting(false);
      setIsConnected(true);
    }, 1000);
  };

  return (
    <div className="flex flex-col gap-4">
      <WalletButton
        address={isConnected ? "0x1234567890abcdef1234567890abcdef12345678" : null}
        isConnected={isConnected}
        isConnecting={isConnecting}
        onConnect={handleConnect}
        onDisconnect={() => setIsConnected(false)}
      />
    </div>
  );
}
