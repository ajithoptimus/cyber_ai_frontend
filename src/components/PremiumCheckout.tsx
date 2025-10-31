// src/components/PremiumCheckout.tsx
function PremiumCheckout() {
  const payWithStripe = async () => {
    const res = await fetch('/api/payments/stripe/create-session', { method: 'POST' });
    const { sessionUrl } = await res.json();
    window.location.href = sessionUrl;
  };

  const payWithRazorpay = async () => {
    const res = await fetch('/api/payments/razorpay/create-order', { method: 'POST' });
    const { order, key } = await res.json();
    const options = {
      key,
      amount: order.amount,
      currency: order.currency,
      order_id: order.id,
      handler: function(response: any) {
        // Optionally verify from backend and show receipt
        // fetch('/api/payments/razorpay/verify', { method: 'POST', ... })
      }
    };
    const rzp = new (window as any).Razorpay(options);
    rzp.open();
  };

  return (
    <div>
      <h2>Choose payment method:</h2>
      <button onClick={payWithStripe}>Pay Internationally (Stripe)</button>
      <button onClick={payWithRazorpay}>Pay India/UPI/Card (Razorpay)</button>
    </div>
  );
}
export default PremiumCheckout;
