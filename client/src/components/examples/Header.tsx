import { Header } from "../Header";
import { useState } from "react";

export default function HeaderExample() {
  const [isConnected, setIsConnected] = useState(false);

  return (
    <div className="w-full">
      <Header
        address={isConnected ? "0x1234567890abcdef1234567890abcdef12345678" : null}
        isConnected={isConnected}
        isConnecting={false}
        onConnect={() => setIsConnected(true)}
        onDisconnect={() => setIsConnected(false)}
      />
    </div>
  );
}
