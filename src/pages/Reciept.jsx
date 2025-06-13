import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";

const Receipt = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { show, seats, paymentId } = location.state || {};

  useEffect(() => {
    if (!show || !seats || !paymentId) {
      navigate("/");
    }
  }, [show, seats, paymentId, navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full text-center">
        <h2 className="text-2xl font-bold mb-4 text-green-600">🎉 Booking Confirmed!</h2>

        <p className="text-gray-800 mb-2">🎬 <strong>Show:</strong> {show?.title}</p>
        <p className="text-gray-800 mb-2">🪑 <strong>Seats:</strong> {seats?.join(", ")}</p>
        <p className="text-gray-800 mb-2">💵 <strong>Total:</strong> ₹{seats?.length * 100}</p>
        <p className="text-gray-800 mb-2">🧾 <strong>Payment ID:</strong> {paymentId}</p>
        <p className="text-gray-800 mb-4">🕒 <strong>Date:</strong> {new Date().toLocaleString()}</p>

        <button
          onClick={() => navigate("/")}
          className="mt-4 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Book Another Ticket
        </button>
      </div>
    </div>
  );
};

export default Receipt;
