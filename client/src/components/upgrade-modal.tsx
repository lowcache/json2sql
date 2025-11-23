import { useState } from "react";
import {
  useStripe,
  useElements,
  PaymentElement,
} from "@stripe/react-stripe-js";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle, Sparkles } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

interface UpgradeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpgradeSuccess: () => void;
}

export function UpgradeModal({
  open,
  onOpenChange,
  onUpgradeSuccess,
}: UpgradeModalProps) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  const stripe = useStripe();
  const elements = useElements();

  const handlePrePurchase = async () => {
    setLoading(true);
    try {
      const response = await apiRequest(
        "POST",
        "/api/stripe/create-payment-intent",
        { email },
      );
      const data = await response.json();
      setClientSecret(data.clientSecret);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async () => {
    if (!stripe || !elements) {
      return;
    }

    setLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: window.location.href,
      },
      redirect: "if_required",
    });

    if (error) {
      console.error(error);
      setLoading(false);
    } else {
      onUpgradeSuccess();
      onOpenChange(false);
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md" data-testid="modal-upgrade">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-6 h-6 text-primary" />
            <DialogTitle className="text-2xl">Unlock Full Access</DialogTitle>
          </div>
          <DialogDescription>
            Get unlimited conversions and advanced features with a one-time purchase
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="bg-card border border-card-border rounded-lg p-4">
            <div className="text-center mb-4">
              <div className="text-4xl font-bold text-foreground">$29</div>
              <div className="text-sm text-muted-foreground">One-time payment</div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className="w-4 h-4 text-primary" />
                <span>Unlimited line conversions</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className="w-4 h-4 text-primary" />
                <span>Advanced conversion options</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className="w-4 h-4 text-primary" />
                <span>Priority support</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className="w-4 h-4 text-primary" />
                <span>Lifetime access</span>
              </div>
            </div>
          </div>

          {!clientSecret && (
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                data-testid="input-email-upgrade"
              />
            </div>
          )}

          {clientSecret && <PaymentElement />}

          <Button
            onClick={clientSecret ? handlePurchase : handlePrePurchase}
            disabled={!email || loading || !stripe || !elements}
            className="w-full"
            size="lg"
            data-testid="button-purchase"
          >
            {loading
              ? "Processing..."
              : clientSecret
              ? "Purchase Now"
              : "Continue"}
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            Secure payment powered by Stripe • 30-day money-back guarantee
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
