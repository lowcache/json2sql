import { createRoot } from "react-dom/client";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import App from "./App";
import "./index.css";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
);

createRoot(document.getElementById("root")!).render(
  <Elements stripe={stripePromise}>
    <App />
  </Elements>,
);