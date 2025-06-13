import { db } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export const saveBookingToFirestore = async ({ userId, show, seats, paymentId }) => {
  try {
    await addDoc(collection(db, "bookings"), {
      userId,
      showTitle: show.title,
      showId: show.id,
      seats,
      paymentId,
      amount: seats.length * 100,
      timestamp: serverTimestamp(),
    });
    console.log("Booking saved to Firestore ✅");
  } catch (error) {
    console.error("Error saving booking:", error);
  }
};
