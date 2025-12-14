# Arc Super Faucet - Design Guidelines

## Design Approach
**Reference-Based**: Inspired by https://easyfaucetarc.xyz/ - a minimal, trustless blockchain faucet interface. The design emphasizes transparency and real-time onchain data verification.

## Core Design Principles
1. **Radical Simplicity**: Every element serves a functional purpose. No decorative elements.
2. **Trust Through Transparency**: All data visibly pulls from blockchain, no ambiguity
3. **Dark Mode Only**: Professional, crypto-native aesthetic
4. **Currency Clarity**: Always display $ symbol, never "USDC" label

## Typography
- **Primary Font**: Inter or similar modern sans-serif via Google Fonts
- **Hierarchy**:
  - Hero numbers (balance, claim amounts): 48-64px, bold weight
  - Section headers: 24-32px, semibold
  - Body text: 16px, regular
  - Helper text/countdowns: 14px, medium
- **Number Formatting**: Monospace font for all currency values and countdown timers for precision clarity

## Layout System
- **Spacing Scale**: Tailwind units of 4, 6, 8, 12, 16 (p-4, p-6, p-8, etc.)
- **Container**: max-w-4xl centered, responsive padding
- **Section Spacing**: py-12 between major sections

## Component Structure

### Header
- Wallet connection button (top-right)
- App title/logo (top-left or centered)
- Connected address display (truncated: 0x1234...5678)

### Main Content - Three Clear Sections

**1. Faucet Balance Section** (Primary Focus)
- Large display: Current faucet balance ($X,XXX format)
- Prominent claim button: "Claim $500"
- Real-time balance updates after claims

**2. User Stats Panel**
- Connected wallet address
- Total claimed by user: $X,XXX
- Cooldown timer: "Next claim in: HH:MM:SS" (when active)

**3. Global Stats Panel**
- Total $ distributed (all-time)
- Total number of claims (all-time)
- Real-time updates after each claim

### UX States & Messages

**Pre-Connection State**:
- Disabled claim button
- Message: "Connect wallet to enable claiming"
- All user stats hidden/grayed out

**Wrong Network State**:
- Alert banner: "Please switch to Arc Testnet"
- Network switch prompt
- Disabled claim functionality

**Ready to Claim State**:
- Enabled claim button with hover state
- Clear call-to-action styling

**Cooldown Active State**:
- Disabled claim button
- Prominent countdown: "You can claim again in HH:MM:SS"
- Live countdown updating every second

**Faucet Empty State**:
- Disabled button
- Clear message: "Faucet empty - check back later"

**Post-Claim State**:
- Success feedback
- All values refresh from blockchain
- Updated countdown display

## Visual Treatment
- **Background**: Dark (near-black, #0a0a0a to #121212)
- **Cards/Panels**: Subtle borders, slightly lighter background (#1a1a1a)
- **Text Hierarchy**: White for primary, gray for secondary (#a0a0a0)
- **Accent**: Single accent color for CTAs and success states
- **Currency Values**: High contrast, prominent display

## Interaction Design
- Smooth state transitions (200ms)
- Loading states during blockchain reads
- Transaction pending indicators
- Success/error toast notifications
- Button states: default, hover, disabled, loading

## Accessibility
- Clear disabled states for buttons
- High contrast text (WCAG AA minimum)
- Descriptive labels for all interactive elements
- Loading/pending states clearly communicated

## Images
**No hero image required** - this is a utility application focused on functionality over marketing appeal. The design relies on clear typography, data display, and functional UI elements.