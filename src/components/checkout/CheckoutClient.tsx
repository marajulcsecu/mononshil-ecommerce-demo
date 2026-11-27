"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  CreditCard,
  Info,
  Lock,
  ShoppingBag,
  Smartphone,
  Truck,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useCart } from "@/context/CartContext";
import {
  FREE_SHIPPING_THRESHOLD,
  INSIDE_DHAKA_FEE,
  OUTSIDE_DHAKA_FEE,
  calculateDeliveryFee,
  formatBdt,
  generateOrderId,
  getEstimatedDeliveryText,
  validateBangladeshPhone,
} from "@/lib/commerce";
import type { DeliveryZone, OrderRecord, PaymentMethod } from "@/types/commerce";

interface FormErrors {
  fullName?: string;
  phone?: string;
  email?: string;
  area?: string;
  address?: string;
  mfsNumber?: string;
  cardNumber?: string;
  cardExpiry?: string;
  cardCvc?: string;
}

const PAYMENT_OPTIONS: {
  id: PaymentMethod;
  label: string;
  description: string;
  icon: typeof Truck;
}[] = [
  {
    id: "cod",
    label: "Cash on Delivery",
    description: "Pay in cash upon receiving your order at your doorstep.",
    icon: Truck,
  },
  {
    id: "bkash",
    label: "bKash (Demo)",
    description: "Simulated mobile wallet confirmation — no real charge.",
    icon: Smartphone,
  },
  {
    id: "nagad",
    label: "Nagad (Demo)",
    description: "Simulated mobile wallet confirmation — no real charge.",
    icon: Smartphone,
  },
  {
    id: "card",
    label: "Debit / Credit Card (Demo)",
    description: "Visa / Mastercard demonstration entry — no live billing.",
    icon: CreditCard,
  },
];

export function CheckoutClient() {
  const router = useRouter();
  const { items, subtotal, isHydrated, clearCart, saveOrder } = useCart();

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [zone, setZone] = useState<DeliveryZone>("inside-dhaka");
  const [area, setArea] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cod");

  const [mfsNumber, setMfsNumber] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCardCvc] = useState("");

  const [errors, setErrors] = useState<FormErrors>({});

  const deliveryFee = calculateDeliveryFee(subtotal, zone);
  const grandTotal = subtotal + deliveryFee;
  const freeShippingEligible = subtotal >= FREE_SHIPPING_THRESHOLD;

  if (!isHydrated) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8" aria-busy="true">
        <div className="h-9 w-48 animate-pulse rounded-sm bg-surface-muted" />
        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="h-96 animate-pulse rounded-sm bg-surface-muted lg:col-span-7" />
          <div className="h-80 animate-pulse rounded-sm bg-surface-muted lg:col-span-5" />
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto flex max-w-xl flex-col items-center px-4 py-24 text-center sm:px-6">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-surface-muted text-ink-muted">
          <ShoppingBag className="h-6 w-6" strokeWidth={1.5} />
        </div>
        <h1 className="font-display mt-5 text-3xl font-medium text-ink">Your bag is empty</h1>
        <p className="mt-2 text-sm text-ink-secondary">
          Add footwear, apparel, or pantry items to your bag before proceeding to checkout.
        </p>
        <Link
          href="/shop"
          className="mt-7 inline-flex h-11 items-center gap-2 rounded-sm bg-accent px-6 text-sm font-medium text-white transition-colors hover:bg-accent-hover"
        >
          <span>Explore Mononshil Catalog</span>
        </Link>
      </div>
    );
  }

  const validate = (): FormErrors => {
    const nextErrors: FormErrors = {};
    if (fullName.trim().length < 2) {
      nextErrors.fullName = "Please enter your full name.";
    }
    if (!validateBangladeshPhone(phone)) {
      nextErrors.phone = "Enter a valid Bangladesh mobile number (e.g. 01712345678).";
    }
    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      nextErrors.email = "Enter a valid email address or leave blank.";
    }
    if (area.trim().length < 2) {
      nextErrors.area = "Please enter your area or thana (e.g. Banani, Dhanmondi).";
    }
    if (address.trim().length < 6) {
      nextErrors.address = "Please enter a complete house, road, and street address.";
    }

    if (paymentMethod === "bkash" || paymentMethod === "nagad") {
      if (!validateBangladeshPhone(mfsNumber)) {
        nextErrors.mfsNumber = `Enter a valid 11-digit ${
          paymentMethod === "bkash" ? "bKash" : "Nagad"
        } wallet number for the demo receipt.`;
      }
    }

    if (paymentMethod === "card") {
      const digits = cardNumber.replace(/\D/g, "");
      if (digits.length < 13 || digits.length > 19) {
        nextErrors.cardNumber = "Enter a 16-digit demo card number.";
      }
      if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(cardExpiry.trim())) {
        nextErrors.cardExpiry = "Use MM/YY format (e.g. 08/29).";
      }
      if (!/^\d{3,4}$/.test(cardCvc.trim())) {
        nextErrors.cardCvc = "Enter a 3-digit CVC.";
      }
    }

    return nextErrors;
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    let paymentSummary = "Cash on Delivery (Pay upon delivery)";
    if (paymentMethod === "bkash") {
      const normalized = mfsNumber.replace(/[\s-]/g, "");
      paymentSummary = `bKash Demo Wallet (****${normalized.slice(-4)})`;
    } else if (paymentMethod === "nagad") {
      const normalized = mfsNumber.replace(/[\s-]/g, "");
      paymentSummary = `Nagad Demo Wallet (****${normalized.slice(-4)})`;
    } else if (paymentMethod === "card") {
      const digits = cardNumber.replace(/\D/g, "");
      paymentSummary = `Demo Card ending in ${digits.slice(-4)}`;
    }

    const order: OrderRecord = {
      orderId: generateOrderId(),
      createdAt: new Date().toISOString(),
      customer: {
        fullName: fullName.trim(),
        phone: phone.trim(),
        email: email.trim() || undefined,
        area: area.trim(),
        address: address.trim(),
        zone,
        notes: notes.trim() || undefined,
      },
      paymentMethod,
      paymentSummary,
      items: [...items],
      subtotal,
      deliveryFee,
      total: grandTotal,
      estimatedDelivery: getEstimatedDeliveryText(zone),
    };

    saveOrder(order);
    clearCart();
    router.push("/order-confirmation");
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <Link
        href="/shop"
        className="inline-flex items-center gap-1.5 text-xs font-medium text-ink-secondary hover:text-ink"
      >
        <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.6} />
        <span>Continue Shopping</span>
      </Link>

      <div className="mt-4 flex flex-col justify-between gap-4 border-b border-border pb-6 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-muted">
            Mononshil Checkout
          </p>
          <h1 className="font-display mt-1.5 text-3xl font-medium text-ink sm:text-4xl">
            Complete Your Order
          </h1>
        </div>
        <div className="inline-flex items-center gap-2 text-xs text-ink-secondary">
          <Lock className="h-4 w-4 text-accent" strokeWidth={1.6} />
          <span>Interactive storefront demo — no live payment processed</span>
        </div>
      </div>

      <div className="mt-6 flex items-start gap-3 rounded-sm border border-accent/25 bg-accent-soft/70 px-4 py-3 text-xs leading-relaxed text-ink">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-accent" strokeWidth={1.6} />
        <p>
          <span className="font-semibold">Client Preview Notice:</span> This checkout demonstrates
          Mononshil&apos;s end-to-end Bangladesh ordering flow. Submitting the form clears your bag
          and generates a printable demonstration order receipt locally in your browser.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        noValidate
        className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-12"
      >
        <div className="space-y-8 lg:col-span-7">
          <section className="rounded-sm border border-border bg-surface p-6">
            <h2 className="font-display text-xl font-medium text-ink">
              1. Contact &amp; Delivery Address
            </h2>

            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label htmlFor="fullName" className="block text-xs font-medium text-ink">
                  Full Name *
                </label>
                <input
                  id="fullName"
                  type="text"
                  autoComplete="name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Tanvir Ahmed"
                  aria-invalid={Boolean(errors.fullName)}
                  className={`mt-1.5 h-11 w-full rounded-sm border bg-canvas px-3.5 text-sm text-ink placeholder:text-ink-muted focus:border-ink focus:outline-none ${
                    errors.fullName ? "border-error" : "border-border"
                  }`}
                />
                {errors.fullName ? (
                  <p role="alert" className="mt-1 text-xs text-error">
                    {errors.fullName}
                  </p>
                ) : null}
              </div>

              <div>
                <label htmlFor="phone" className="block text-xs font-medium text-ink">
                  Mobile Number (Bangladesh) *
                </label>
                <input
                  id="phone"
                  type="tel"
                  autoComplete="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="017XXXXXXXX"
                  aria-invalid={Boolean(errors.phone)}
                  className={`mt-1.5 h-11 w-full rounded-sm border bg-canvas px-3.5 text-sm text-ink placeholder:text-ink-muted focus:border-ink focus:outline-none ${
                    errors.phone ? "border-error" : "border-border"
                  }`}
                />
                {errors.phone ? (
                  <p role="alert" className="mt-1 text-xs text-error">
                    {errors.phone}
                  </p>
                ) : null}
              </div>

              <div>
                <label htmlFor="email" className="block text-xs font-medium text-ink">
                  Email Address (Optional)
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  aria-invalid={Boolean(errors.email)}
                  className={`mt-1.5 h-11 w-full rounded-sm border bg-canvas px-3.5 text-sm text-ink placeholder:text-ink-muted focus:border-ink focus:outline-none ${
                    errors.email ? "border-error" : "border-border"
                  }`}
                />
                {errors.email ? (
                  <p role="alert" className="mt-1 text-xs text-error">
                    {errors.email}
                  </p>
                ) : null}
              </div>

              <div className="sm:col-span-2 pt-2">
                <span className="block text-xs font-medium text-ink">Delivery Zone *</span>
                <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => setZone("inside-dhaka")}
                    aria-pressed={zone === "inside-dhaka"}
                    className={`flex items-start justify-between rounded-sm border p-3.5 text-left transition-colors cursor-pointer ${
                      zone === "inside-dhaka"
                        ? "border-accent bg-accent-soft/50 ring-1 ring-accent"
                        : "border-border bg-canvas hover:border-ink"
                    }`}
                  >
                    <div>
                      <p className="text-sm font-medium text-ink">Inside Dhaka Metro</p>
                      <p className="mt-0.5 text-xs text-ink-secondary">Within 24 hours</p>
                    </div>
                    <span className="price-num text-xs font-semibold text-accent">
                      {freeShippingEligible ? "Free" : formatBdt(INSIDE_DHAKA_FEE)}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setZone("outside-dhaka")}
                    aria-pressed={zone === "outside-dhaka"}
                    className={`flex items-start justify-between rounded-sm border p-3.5 text-left transition-colors cursor-pointer ${
                      zone === "outside-dhaka"
                        ? "border-accent bg-accent-soft/50 ring-1 ring-accent"
                        : "border-border bg-canvas hover:border-ink"
                    }`}
                  >
                    <div>
                      <p className="text-sm font-medium text-ink">Outside Dhaka</p>
                      <p className="mt-0.5 text-xs text-ink-secondary">2 to 4 business days</p>
                    </div>
                    <span className="price-num text-xs font-semibold text-accent">
                      {freeShippingEligible ? "Free" : formatBdt(OUTSIDE_DHAKA_FEE)}
                    </span>
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="area" className="block text-xs font-medium text-ink">
                  Area / Thana / City *
                </label>
                <input
                  id="area"
                  type="text"
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  placeholder="e.g. Banani, Dhaka"
                  aria-invalid={Boolean(errors.area)}
                  className={`mt-1.5 h-11 w-full rounded-sm border bg-canvas px-3.5 text-sm text-ink placeholder:text-ink-muted focus:border-ink focus:outline-none ${
                    errors.area ? "border-error" : "border-border"
                  }`}
                />
                {errors.area ? (
                  <p role="alert" className="mt-1 text-xs text-error">
                    {errors.area}
                  </p>
                ) : null}
              </div>

              <div>
                <label htmlFor="notes" className="block text-xs font-medium text-ink">
                  Delivery Note (Optional)
                </label>
                <input
                  id="notes"
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Call before arrival"
                  className="mt-1.5 h-11 w-full rounded-sm border border-border bg-canvas px-3.5 text-sm text-ink placeholder:text-ink-muted focus:border-ink focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="address" className="block text-xs font-medium text-ink">
                  Detailed Street Address *
                </label>
                <textarea
                  id="address"
                  rows={2}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="House, Road, Block, Floor / Apartment"
                  aria-invalid={Boolean(errors.address)}
                  className={`mt-1.5 w-full rounded-sm border bg-canvas px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-muted focus:border-ink focus:outline-none ${
                    errors.address ? "border-error" : "border-border"
                  }`}
                />
                {errors.address ? (
                  <p role="alert" className="mt-1 text-xs text-error">
                    {errors.address}
                  </p>
                ) : null}
              </div>
            </div>
          </section>

          <section className="rounded-sm border border-border bg-surface p-6">
            <h2 className="font-display text-xl font-medium text-ink">2. Payment Method</h2>

            <div className="mt-5 space-y-3">
              {PAYMENT_OPTIONS.map((option) => {
                const Icon = option.icon;
                const isSelected = paymentMethod === option.id;
                return (
                  <div
                    key={option.id}
                    className={`rounded-sm border transition-colors ${
                      isSelected ? "border-accent bg-accent-soft/35" : "border-border bg-canvas"
                    }`}
                  >
                    <label className="flex items-start gap-3.5 p-4 cursor-pointer">
                      <input
                        type="radio"
                        name="payment-method"
                        checked={isSelected}
                        onChange={() => {
                          setPaymentMethod(option.id);
                          setErrors((prev) => ({
                            ...prev,
                            mfsNumber: undefined,
                            cardNumber: undefined,
                            cardExpiry: undefined,
                            cardCvc: undefined,
                          }));
                        }}
                        className="mt-1 h-4 w-4 accent-accent"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <Icon className="h-4 w-4 text-accent" strokeWidth={1.6} />
                          <span className="text-sm font-medium text-ink">{option.label}</span>
                        </div>
                        <p className="mt-0.5 text-xs text-ink-secondary">{option.description}</p>
                      </div>
                    </label>

                    {isSelected && (option.id === "bkash" || option.id === "nagad") ? (
                      <div className="border-t border-border/70 px-4 pb-4 pt-3">
                        <label htmlFor="mfsNumber" className="block text-xs font-medium text-ink">
                          {option.id === "bkash" ? "bKash" : "Nagad"} Wallet Number (Demo) *
                        </label>
                        <input
                          id="mfsNumber"
                          type="tel"
                          value={mfsNumber}
                          onChange={(e) => setMfsNumber(e.target.value)}
                          placeholder="017XXXXXXXX"
                          aria-invalid={Boolean(errors.mfsNumber)}
                          className={`mt-1.5 h-10 w-full rounded-sm border bg-surface px-3 text-sm text-ink placeholder:text-ink-muted focus:border-ink focus:outline-none sm:max-w-xs ${
                            errors.mfsNumber ? "border-error" : "border-border"
                          }`}
                        />
                        {errors.mfsNumber ? (
                          <p role="alert" className="mt-1 text-xs text-error">
                            {errors.mfsNumber}
                          </p>
                        ) : null}
                      </div>
                    ) : null}

                    {isSelected && option.id === "card" ? (
                      <div className="grid grid-cols-1 gap-3 border-t border-border/70 px-4 pb-4 pt-3 sm:grid-cols-3">
                        <div className="sm:col-span-3">
                          <label htmlFor="cardNumber" className="block text-xs font-medium text-ink">
                            Demo Card Number *
                          </label>
                          <input
                            id="cardNumber"
                            type="text"
                            inputMode="numeric"
                            value={cardNumber}
                            onChange={(e) => setCardNumber(e.target.value)}
                            placeholder="4242 4242 4242 4242"
                            aria-invalid={Boolean(errors.cardNumber)}
                            className={`mt-1.5 h-10 w-full rounded-sm border bg-surface px-3 text-sm text-ink placeholder:text-ink-muted focus:border-ink focus:outline-none ${
                              errors.cardNumber ? "border-error" : "border-border"
                            }`}
                          />
                          {errors.cardNumber ? (
                            <p role="alert" className="mt-1 text-xs text-error">
                              {errors.cardNumber}
                            </p>
                          ) : null}
                        </div>

                        <div className="sm:col-span-2">
                          <label htmlFor="cardExpiry" className="block text-xs font-medium text-ink">
                            Expiry (MM/YY) *
                          </label>
                          <input
                            id="cardExpiry"
                            type="text"
                            value={cardExpiry}
                            onChange={(e) => setCardExpiry(e.target.value)}
                            placeholder="08/29"
                            aria-invalid={Boolean(errors.cardExpiry)}
                            className={`mt-1.5 h-10 w-full rounded-sm border bg-surface px-3 text-sm text-ink placeholder:text-ink-muted focus:border-ink focus:outline-none ${
                              errors.cardExpiry ? "border-error" : "border-border"
                            }`}
                          />
                          {errors.cardExpiry ? (
                            <p role="alert" className="mt-1 text-xs text-error">
                              {errors.cardExpiry}
                            </p>
                          ) : null}
                        </div>

                        <div>
                          <label htmlFor="cardCvc" className="block text-xs font-medium text-ink">
                            CVC *
                          </label>
                          <input
                            id="cardCvc"
                            type="text"
                            inputMode="numeric"
                            value={cardCvc}
                            onChange={(e) => setCardCvc(e.target.value)}
                            placeholder="123"
                            aria-invalid={Boolean(errors.cardCvc)}
                            className={`mt-1.5 h-10 w-full rounded-sm border bg-surface px-3 text-sm text-ink placeholder:text-ink-muted focus:border-ink focus:outline-none ${
                              errors.cardCvc ? "border-error" : "border-border"
                            }`}
                          />
                          {errors.cardCvc ? (
                            <p role="alert" className="mt-1 text-xs text-error">
                              {errors.cardCvc}
                            </p>
                          ) : null}
                        </div>
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </section>
        </div>

        <aside className="lg:col-span-5">
          <div className="sticky top-24 rounded-sm border border-border bg-surface p-6">
            <h2 className="font-display text-xl font-medium text-ink">Order Summary</h2>

            <ul className="mt-5 divide-y divide-border">
              {items.map((item) => (
                <li key={item.key} className="flex gap-3.5 py-3.5">
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-sm border border-border bg-surface-muted">
                    <Image
                      src={item.image}
                      alt={item.imageAlt}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-ink">{item.name}</p>
                    <p className="mt-0.5 text-xs text-ink-muted">
                      {item.variantLabel ? `${item.variantLabel} · ` : ""}Qty {item.quantity}
                    </p>
                  </div>
                  <p className="price-num text-sm font-semibold text-ink">
                    {formatBdt(item.unitPrice * item.quantity)}
                  </p>
                </li>
              ))}
            </ul>

            <dl className="mt-4 space-y-2.5 border-t border-border pt-4 text-sm">
              <div className="flex items-center justify-between text-ink-secondary">
                <dt>Subtotal</dt>
                <dd className="price-num font-medium text-ink">{formatBdt(subtotal)}</dd>
              </div>
              <div className="flex items-center justify-between text-ink-secondary">
                <dt>Delivery ({zone === "inside-dhaka" ? "Dhaka Metro" : "Nationwide"})</dt>
                <dd
                  className={`price-num font-medium ${
                    deliveryFee === 0 ? "text-accent" : "text-ink"
                  }`}
                >
                  {deliveryFee === 0 ? "Complimentary" : formatBdt(deliveryFee)}
                </dd>
              </div>
              <div className="flex items-center justify-between border-t border-border pt-3 text-base font-semibold text-ink">
                <dt>Total Payable</dt>
                <dd className="price-num text-lg">{formatBdt(grandTotal)}</dd>
              </div>
            </dl>

            <Button type="submit" variant="primary" size="lg" fullWidth className="mt-6">
              Place Demo Order — {formatBdt(grandTotal)}
            </Button>

            <p className="mt-3 text-center text-[11px] text-ink-muted">
              Estimated delivery: {getEstimatedDeliveryText(zone)}
            </p>
          </div>
        </aside>
      </form>
    </div>
  );
}
