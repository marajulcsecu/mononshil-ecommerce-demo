import type { Metadata } from "next";
import { CheckoutClient } from "@/components/checkout/CheckoutClient";

export const metadata: Metadata = {
  title: "Checkout",
  description:
    "Complete your demonstration Mononshil order with Dhaka or nationwide delivery and Cash on Delivery, bKash, Nagad, or Card options.",
};

export default function CheckoutPage() {
  return <CheckoutClient />;
}
