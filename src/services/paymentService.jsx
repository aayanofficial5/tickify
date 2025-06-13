import toast from "react-hot-toast";
import { saveBookingToFirestore } from "./bookingService";

function loadScript(src) {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      resolve(false);
    };
    document.body.appendChild(script);
  });
}

export async function buyTicket(show,seats,user,navigate) {
  const toastId = toast.loading(
    "Redirecting to Razorpay for payment, please wait..."
  );
  try {
    const res = await loadScript(
      "https://checkout.razorpay.com/v1/checkout.js"
    );

    if (!res) {
      toast.error("Razorpay failed to load!");
      return;
    }

    const amount = seats.length * 100 * 100; // ₹100 per seat

    const options = {
      key: import.meta.env.VITE_RAZORPAY_ID,
      amount: amount,
      currency: "INR",
      name: "Ticket Booking App",
      description: `${show.title} - ${seats.join(", ")}`,
      handler: async function (response) {
        // Booking Confirmed!
        toast.success("Payment Successful!");
        console.log("Payment ID:", response.razorpay_payment_id);

        // Save receipt to localStorage
        localStorage.setItem(
          "receipt",
          JSON.stringify({
            paymentId: response.razorpay_payment_id,
            show,
            seats,
            timestamp: new Date(),
          })
        );

        navigate("/receipt", {
          state: { show, seats, paymentId: response.razorpay_payment_id },
        });
        
        if (user) {
          await saveBookingToFirestore({
            userId: user.uid,
            show,
            seats,
            paymentId: response.razorpay_payment_id,
          });
        }
      },
      theme: {
        color: "#3399cc",
      },
    };
    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
    paymentObject.on("payment.failed", (response) => {
      console.error("Payment failed:", response);
      toast.error("Payment failed, please try again.");
    });
  } catch (error) {
    console.error("Error in payment:", error);
    toast.error("Something went wrong, please try again later.");
  } finally {
    toast.dismiss(toastId);
  }
}