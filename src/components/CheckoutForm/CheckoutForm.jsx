import {
  CardElement,
  useStripe,
  useElements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
} from "@stripe/react-stripe-js";
import { useState } from "react";
import "./CheckoutForm.css";
import { useFeedback } from "../../context/FeedbackContext";

export default function CheckoutForm({ clientSecret, formData }) {
  const stripe = useStripe();
  const elements = useElements();
  const { showFeedback } = useFeedback();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setLoading(true);

    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
        billing_details: {
          name: `${formData.name} ${formData.surname}`,
          email: formData.email,
          address: {
            country: formData.creditCardCountry,
          },
        },
      },
    });

    setLoading(false);

    if (result.error) {
      showFeedback("error", result.error.message);
    } else {
      if (result.paymentIntent.status === "succeeded") {
        showFeedback("success", "Registration has been successfully paid!");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="checkout-form">
      <label>Card Number</label>
      <CardNumberElement />

      <label>Expiration Date</label>
      <CardExpiryElement />

      <label>CVC</label>
      <CardCvcElement />
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
