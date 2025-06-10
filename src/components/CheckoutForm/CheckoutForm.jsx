import {
  useStripe,
  useElements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
} from "@stripe/react-stripe-js";
import { useState } from "react";
import "./CheckoutForm.css";
import { useFeedback } from "../../context/FeedbackContext";

export default function CheckoutForm({ clientSecret, formData, totalFees }) {
  const stripe = useStripe();
  const elements = useElements();
  const { showFeedback } = useFeedback();
  const [loading, setLoading] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);

    const cardNumber = elements.getElement(CardNumberElement);

    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardNumber,
        billing_details: {
          name: `${formData.name} ${formData.surname}`,
          email: formData.email,
        },
      },
    });

    setLoading(false);

    if (result.error) {
      showFeedback("error", result.error.message);
    } else {
      if (result.paymentIntent.status === "succeeded") {
        setPaymentSuccess(true);
        setPaymentDetails(result.paymentIntent);
        showFeedback("success", "Registration has been successfully paid!");
      }
    }
  };

  if (paymentSuccess) {
    return (
      <div className="checkout-confirmation">
        <h2 className="success-title">🎉 Payment Successful!</h2>
        <p>
          Thank you, <strong>{formData.name}</strong>. Your registration has
          been confirmed.
        </p>
        <div className="payment-summary">
          <p>
            <strong>Amount Paid:</strong> {paymentDetails.amount / 100}€
          </p>
          <p>
            <strong>Payment ID:</strong> {paymentDetails.id}
          </p>
          <p>
            <strong>Status:</strong> {paymentDetails.status}
          </p>
        </div>
        {/* Optional: Add download receipt or return button here */}
        {/* <button className="button small" onClick={() => navigate("/")}>Return to Home</button> */}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="checkout-form">
      <h2 className="card-title">
        Total due: <strong className="primary">{totalFees.total}€</strong>
      </h2>
      <div className="form-group">
        <label>Card Number</label>
        <div className="stripe-element-wrapper">
          <CardNumberElement />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group half">
          <label>Expiration Date</label>
          <div className="stripe-element-wrapper">
            <CardExpiryElement />
          </div>
        </div>

        <div className="form-group half">
          <label>CVC</label>
          <div className="stripe-element-wrapper">
            <CardCvcElement />
          </div>
        </div>
      </div>

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
