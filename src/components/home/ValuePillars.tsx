import { RefreshCw, ShieldCheck, Truck, Wallet } from "lucide-react";

const PILLARS = [
  {
    icon: Truck,
    title: "24-Hour Dhaka Dispatch",
    description: "Reliable next-day courier delivery inside Dhaka Metro and 2 to 4 days nationwide.",
  },
  {
    icon: RefreshCw,
    title: "7-Day Size Exchange",
    description: "Easy doorstep exchanges on unworn footwear and apparel with zero complicated forms.",
  },
  {
    icon: ShieldCheck,
    title: "Single-Origin Pantry",
    description: "Direct harvests from Sundarbans, Dinajpur, Sylhet, Pabna, and Bandarban growers.",
  },
  {
    icon: Wallet,
    title: "Flexible Checkout",
    description: "Pay on delivery or test bKash, Nagad, and Card options in our interactive checkout.",
  },
];

export function ValuePillars() {
  return (
    <section className="border-y border-border bg-surface-muted">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 py-14 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
        {PILLARS.map((pillar) => {
          const Icon = pillar.icon;
          return (
            <div key={pillar.title} className="flex flex-col">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-sm border border-border bg-surface text-accent">
                <Icon className="h-5 w-5" strokeWidth={1.5} />
              </div>
              <h3 className="mt-4 text-sm font-semibold text-ink">{pillar.title}</h3>
              <p className="mt-1.5 text-xs leading-relaxed text-ink-secondary">
                {pillar.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
