import { toast } from "sonner";
import { storeBooking, bookSeatsInFirestore } from "./bookingService";

function loadScript(src) {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export async function buyTicket(show, seats, user, navigate) {
  const toastId = toast.loading("Redirecting to Razorpay for payment...");

  try {
    const res = await loadScript(
      "https://checkout.razorpay.com/v1/checkout.js"
    );
    if (!res) {
      toast.error("Razorpay SDK failed to load");
      return;
    }

    const options = {
      key: import.meta.env.VITE_RAZORPAY_ID,
      amount: show.total * 100, // convert to paisa
      currency: "INR",
      name: "Tickify Booking",
      description: `${show.title} - ${seats.map((s) => s.id).join(", ")}`,
      handler: (response) =>
        bookTicket(response, show, seats, user, navigate, show.total),
      theme: {
        color: "#3399cc",
      },
    };

    const razorpay = new window.Razorpay(options);
    razorpay.open();

    razorpay.on("payment.failed", (response) => {
      console.error("Payment failed:", response);
      toast.error("Payment failed. Please try again.");
    });
  } catch (error) {
    console.error("Error during payment:", error);
    toast.error("Something went wrong. Try again later.");
  } finally {
    toast.dismiss(toastId);
  }
}

export async function bookTicket(
  response,
  show,
  seats,
  user,
  navigate,
  totalAmount
) {
  response && toast.success("Payment Successful!");
  const paymentId = response?.razorpay_payment_id || "none";

  // ✅ 1. Mark seats as booked
  await bookSeatsInFirestore(show.id, seats);

  // ✅ 2. Store the booking in Firestore
  if (user) {
    await storeBooking({
      userId: user.id,
      showtimeId: show.id,
      movie: show,
      seats,
      paymentId,
      totalAmount,
    });
  }

  // ✅ 3. Navigate to bookings Page
  navigate("/bookings");
  toast.success("Ticked Booking Successful!");
}
