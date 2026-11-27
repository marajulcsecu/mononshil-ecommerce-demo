import type { Metadata } from "next";
import { OrderConfirmationClient } from "@/components/order/OrderConfirmationClient";

export const metadata: Metadata = {
  title: "Order Confirmation",
  description: "Printable demonstration order receipt for your Mononshil order.",
};

export default function OrderConfirmationPage() {
  return <OrderConfirmationClient />;
}
