import { SiX, SiGithub, SiYoutube, SiInstagram, SiTelegram, SiDiscord } from "react-icons/si";
import { FAUCET_CONTRACT_ADDRESS } from "@/lib/blockchain";

const socialLinks = [
  { icon: SiX, href: "https://x.com/madnessinvestor", label: "X" },
  { icon: SiGithub, href: "https://github.com/madnessinvestor", label: "GitHub" },
  { icon: SiYoutube, href: "https://www.youtube.com/@madnessinvestor", label: "YouTube" },
  { href: "https://farcaster.xyz/madnessinvestor", label: "Farcaster", isFarcaster: true },
  { icon: SiInstagram, href: "https://www.instagram.com/madnessinvestor", label: "Instagram" },
  { icon: SiTelegram, href: "https://web.telegram.org/k/#@madnessinvestor", label: "Telegram" },
  { icon: SiDiscord, href: "https://discord.com/users/madnessinvestor", label: "Discord" },
];

const otherDapps = [
  { name: "ArcDashboard", href: "https://arcdashboard.up.railway.app/", icon: "grid" },
  { name: "ArcMiner", href: "https://arcminer.up.railway.app/", icon: "layers" },
  { name: "ArcRevoke", href: "https://arcrevoke.up.railway.app/", icon: "shield" },
  { name: "GojoSwap", href: "https://gojoswap.up.railway.app/", icon: "arrow" },
  { name: "ArcMessage", href: "https://messagearc-onchain.up.railway.app/", icon: "message" },
  { name: "ArcMintSBT", href: "https://mintsbtarc-onchain.up.railway.app/", icon: "image" },
];

function FarcasterIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.24 3.6H5.76a2.16 2.16 0 0 0-2.16 2.16v12.48a2.16 2.16 0 0 0 2.16 2.16h12.48a2.16 2.16 0 0 0 2.16-2.16V5.76a2.16 2.16 0 0 0-2.16-2.16ZM8.4 15.6V8.4h1.44v7.2H8.4Zm3.12 0V8.4h1.44v3.12L14.88 8.4h1.68l-2.16 2.52 2.4 4.68h-1.68l-1.68-3.36-.48.6v2.76h-1.44Z" />
    </svg>
  );
}

function DappIcon({ type }: { type: string }) {
  switch (type) {
    case "grid":
      return (
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="7" height="7" rx="1" />
        </svg>
      );
    case "layers":
      return (
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2L2 7l10 5 10-5-10-5Z" />
          <path d="M2 17l10 5 10-5" />
          <path d="M2 12l10 5 10-5" />
        </svg>
      );
    case "shield":
      return (
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <path d="M9 12l2 2 4-4" />
        </svg>
      );
    case "arrow":
      return (
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M7 17L17 7" />
          <path d="M7 7h10v10" />
        </svg>
      );
    case "message":
      return (
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      );
    case "image":
      return (
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <path d="M21 15l-5-5L5 21" />
        </svg>
      );
    default:
      return null;
  }
}

export function Footer() {
  return (
    <footer className="border-t border-border mt-12 pt-8 pb-6">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-6">
          <p className="text-sm text-muted-foreground mb-2">Contract Address</p>
          <a
            href={`https://testnet.arcscan.io/address/${FAUCET_CONTRACT_ADDRESS}`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-sm text-primary hover:underline break-all"
            data-testid="link-contract-address"
          >
            {FAUCET_CONTRACT_ADDRESS}
          </a>
        </div>

        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {socialLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-md bg-card border border-card-border hover-elevate active-elevate-2 transition-colors"
              data-testid={`link-social-${link.label.toLowerCase()}`}
              title={link.label}
            >
              {link.isFarcaster ? (
                <FarcasterIcon className="h-5 w-5" />
              ) : (
                link.icon && <link.icon className="h-5 w-5" />
              )}
            </a>
          ))}
        </div>

        <div className="text-center mb-6">
          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-4">
            Other dApps
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {otherDapps.map((dapp) => (
              <a
                key={dapp.name}
                href={dapp.href}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-md bg-card border border-card-border hover-elevate active-elevate-2 transition-colors"
                data-testid={`link-dapp-${dapp.name.toLowerCase()}`}
                title={dapp.name}
              >
                <DappIcon type={dapp.icon} />
              </a>
            ))}
          </div>
        </div>

        <div className="text-center text-sm text-muted-foreground">
          <p>2025 Arc Super Faucet - Built on Arc Network. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
