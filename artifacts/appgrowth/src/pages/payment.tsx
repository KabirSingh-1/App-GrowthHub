import { useState } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { CheckCircle, CreditCard, Lock } from "lucide-react";

export default function Payment() {
  const [, setLocation] = useLocation();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Extract amount from URL parameters
  const params = new URLSearchParams(window.location.search);
  const amount = params.get("amount") || "0.00";
  const service = params.get("service") || "Order";

  const handlePayment = () => {
    setIsProcessing(true);
    // Simulate payment processing delay
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
    }, 2000);
  };

  return (
    <AppLayout>
      <div className="max-w-xl mx-auto space-y-6 pt-10">
        {!isSuccess ? (
          <>
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-foreground">Secure Checkout</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Complete your payment to start your {service.toLowerCase()} campaign.
              </p>
            </div>

            <div className="bg-card rounded-lg border border-border p-6 shadow-sm space-y-6">
              <div className="flex items-center justify-between pb-6 border-b border-border">
                <span className="font-medium">Total Amount</span>
                <span className="text-2xl font-semibold">${amount}</span>
              </div>

              <div className="space-y-4">
                <label className="text-sm font-medium text-foreground">Payment Method</label>
                
                {/* Dummy Credit Card Form */}
                <div className="space-y-4 bg-muted/30 p-4 rounded-md border border-border/50">
                  <div className="flex items-center gap-2 mb-2 text-muted-foreground">
                    <CreditCard className="h-4 w-4" />
                    <span className="text-sm font-medium">Credit / Debit Card</span>
                  </div>
                  
                  <input
                    type="text"
                    placeholder="Card Number"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    defaultValue="4111 1111 1111 1111"
                  />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="MM/YY"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      defaultValue="12/28"
                    />
                    <input
                      type="text"
                      placeholder="CVC"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      defaultValue="123"
                    />
                  </div>
                </div>
              </div>

              <Button
                className="w-full h-12 text-base font-medium"
                onClick={handlePayment}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <span className="flex items-center gap-2">
                    <div className="h-4 w-4 rounded-full border-2 border-primary-foreground border-r-transparent animate-spin" />
                    Processing...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Lock className="h-4 w-4" /> Pay ${amount}
                  </span>
                )}
              </Button>
            </div>
          </>
        ) : (
          <div className="bg-card rounded-lg border border-border p-8 text-center space-y-6 shadow-sm">
            <div className="mx-auto w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="h-8 w-8" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold tracking-tight">Payment Successful!</h2>
              <p className="text-muted-foreground mt-2">
                Your payment of ${amount} has been processed successfully. Your {service.toLowerCase()} campaign will begin shortly.
              </p>
            </div>
            <div className="pt-6">
              <Button onClick={() => setLocation("/orders")} className="px-8">
                View My Orders
              </Button>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
