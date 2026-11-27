"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Printer, Receipt } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useCart } from "@/context/CartContext";
import { formatBdt } from "@/lib/commerce";

export function OrderConfirmationClient() {
  const { lastOrder, isHydrated } = useCart();

  if (!isHydrated) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6" aria-busy="true">
        <div className="h-10 w-64 animate-pulse rounded-sm bg-surface-muted" />
        <div className="mt-6 h-80 animate-pulse rounded-sm bg-surface-muted" />
      </div>
    );
  }

  if (!lastOrder) {
    return (
      <div className="mx-auto flex max-w-xl flex-col items-center px-4 py-24 text-center sm:px-6">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-surface-muted text-ink-muted">
          <Receipt className="h-6 w-6" strokeWidth={1.5} />
        </div>
        <h1 className="font-display mt-5 text-3xl font-medium text-ink">No recent order found</h1>
        <p className="mt-2 text-sm text-ink-secondary">
          Once you place a demonstration order through checkout, your itemized Mononshil receipt
          will appear here.
        </p>
        <Link
          href="/shop"
          className="mt-7 inline-flex h-11 items-center gap-2 rounded-sm bg-accent px-6 text-sm font-medium text-white transition-colors hover:bg-accent-hover"
        >
          <span>Browse Products</span>
          <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
        </Link>
      </div>
    );
  }

  const formattedDate = new Intl.DateTimeFormat("en-BD", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(lastOrder.createdAt));

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:py-16">
      <div className="rounded-sm border border-border bg-surface p-6 sm:p-10">
        <div className="flex flex-col items-start justify-between gap-4 border-b border-border pb-6 sm:flex-row sm:items-center">
          <div className="flex items-start gap-3.5">
            <CheckCircle2 className="mt-0.5 h-8 w-8 shrink-0 text-accent" strokeWidth={1.6} />
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
                Order Confirmed
              </p>
              <h1 className="font-display mt-1 text-2xl font-medium text-ink sm:text-3xl">
                Thank you, {lastOrder.customer.fullName}
              </h1>
              <p className="mt-1 text-xs text-ink-secondary">
                Placed on {formattedDate} · Reference{" "}
                <span className="price-num font-semibold text-ink">{lastOrder.orderId}</span>
              </p>
            </div>
          </div>

          <span className="rounded-sm border border-border bg-canvas px-3 py-1 text-[11px] font-medium uppercase tracking-wider text-ink-secondary">
            Demo Receipt
          </span>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 border-b border-border pb-6 text-sm sm:grid-cols-3">
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
              Shipping To
            </h2>
            <p className="mt-2 font-medium text-ink">{lastOrder.customer.fullName}</p>
            <p className="mt-0.5 text-xs text-ink-secondary">{lastOrder.customer.phone}</p>
            <p className="mt-1 text-xs leading-relaxed text-ink-secondary">
              {lastOrder.customer.address}, {lastOrder.customer.area}
            </p>
          </div>

          <div>
            <h2 className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
              Delivery Estimate
            </h2>
            <p className="mt-2 text-xs font-medium text-ink">{lastOrder.estimatedDelivery}</p>
            <p className="mt-1 text-xs text-ink-secondary">
              {lastOrder.customer.zone === "inside-dhaka"
                ? "Inside Dhaka Metro Courier"
                : "Nationwide Express Courier"}
            </p>
          </div>

          <div>
            <h2 className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
              Payment Method
            </h2>
            <p className="mt-2 text-xs font-medium text-ink">{lastOrder.paymentSummary}</p>
            <p className="mt-1 text-xs text-ink-secondary">
              Simulated checkout — no live charge applied.
            </p>
          </div>
        </div>

        <div className="mt-6">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
            Order Items
          </h2>
          <ul className="mt-4 divide-y divide-border">
            {lastOrder.items.map((item) => (
              <li key={item.key} className="flex items-center gap-4 py-3.5">
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-sm border border-border bg-surface-muted">
                  <Image
                    src={item.image}
                    alt={item.imageAlt}
                    fill
                    sizes="56px"
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-ink">{item.name}</p>
                  <p className="text-xs text-ink-muted">
                    {item.variantLabel ? `${item.variantLabel} · ` : ""}
                    {formatBdt(item.unitPrice)} x {item.quantity}
                  </p>
                </div>
                <p className="price-num text-sm font-semibold text-ink">
                  {formatBdt(item.unitPrice * item.quantity)}
                </p>
              </li>
            ))}
          </ul>
        </div>

        <dl className="mt-6 space-y-2 border-t border-border pt-5 text-sm">
          <div className="flex justify-between text-ink-secondary">
            <dt>Subtotal</dt>
            <dd className="price-num font-medium text-ink">{formatBdt(lastOrder.subtotal)}</dd>
          </div>
          <div className="flex justify-between text-ink-secondary">
            <dt>Delivery Fee</dt>
            <dd
              className={`price-num font-medium ${
                lastOrder.deliveryFee === 0 ? "text-accent" : "text-ink"
              }`}
            >
              {lastOrder.deliveryFee === 0 ? "Complimentary" : formatBdt(lastOrder.deliveryFee)}
            </dd>
          </div>
          <div className="flex justify-between border-t border-border pt-3 text-base font-semibold text-ink">
            <dt>Total</dt>
            <dd className="price-num text-lg">{formatBdt(lastOrder.total)}</dd>
          </div>
        </dl>

        <div className="no-print mt-8 flex flex-wrap items-center gap-3 border-t border-border pt-6">
          <Button variant="outline" onClick={() => window.print()}>
            <Printer className="h-4 w-4" strokeWidth={1.6} />
            <span>Print Receipt</span>
          </Button>
          <Link
            href="/shop"
            className="inline-flex h-11 items-center gap-2 rounded-sm bg-accent px-5 text-sm font-medium text-white transition-colors hover:bg-accent-hover"
          >
            <span>Continue Shopping</span>
            <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
          </Link>
        </div>
      </div>
    </div>
  );
}
