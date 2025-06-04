import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useState } from "react";
import "./CheckoutForm.css";

export default function CheckoutForm({ clientSecret }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setLoading(true);

    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
        billing_details: {
          name: "Nom Test",
        },
      },
    });

    setLoading(false);

    if (result.error) {
      alert(result.error.message);
    } else {
      if (result.paymentIntent.status === "succeeded") {
        alert("Paiement réussi !");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="checkout-form">
      <CardElement />
      <button
        type="submit"
        disabled={!stripe || loading}
        className="button small"
      >
        {loading ? "Processing..." : "Pay"}
      </button>
    </form>
  );
}
