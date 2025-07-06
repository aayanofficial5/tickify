import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import {toast} from "sonner";
import { getAuth } from "firebase/auth";
import { buyTicket } from "../services/paymentService";

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { show, seats } = location.state || {};
  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    if (!show || !seats) {
      toast.error("Invalid booking data");
      navigate("/");
    }
  }, [show, seats, navigate]);

  const handlePayment = async () => {
    await buyTicket(show,seats,user,navigate);
  };

  return (
    <div className="p-6 min-h-screen text-center bg-gray-50">
      <h2 className="text-2xl font-bold mb-2">Checkout</h2>
      <p className="mb-2">🎬 {show?.title}</p>
      <p className="mb-4">🪑 Seats: {seats?.join(", ")}</p>
      <p className="mb-6">💵 Total: ₹{seats?.length * 100}</p>

      <button
        onClick={handlePayment}
        className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
      >
        Pay Now with Razorpay
      </button>
    </div>
  );
};

export default Checkout;
