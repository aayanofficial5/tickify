import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { toast } from "sonner";

export const fetchMoviesFromFirestore = async () => {
  try {
    const snapshot = await getDocs(collection(db, "movies"));
    const movies = snapshot.docs.map((doc) => ({
      docId: doc.id,
      ...doc.data(),
    }));
    // console.log(movies);
    return movies;
  } catch (error) {
    console.error("Error fetching movies from Firestore:", error);
    return [];
  }
};

export const cancelBookingAndReleaseSeats = async (bookingId) => {
  try {
    const bookingRef = doc(db, "bookings", bookingId);
    const bookingSnap = await getDoc(bookingRef);

    if (!bookingSnap.exists()) {
      throw new Error("Booking not found");
    }

    const booking = bookingSnap.data();
    const { showtimeId, seatDetails = [] } = booking;

    if (!showtimeId || seatDetails.length === 0) {
      throw new Error("Invalid booking data.");
    }

    // Release each seat
    const seatUpdatePromises = seatDetails.map((seat) => {
      const seatRef = doc(db, `showtimes/${showtimeId}/seats/${seat.id}`);
      return updateDoc(seatRef, {
        status: "available",
        blockedBy: null,
        expiresAt: null,
      });
    });

    await Promise.all(seatUpdatePromises);

    // Update booking status to 'cancelled'
    await updateDoc(bookingRef, {
      status: "cancelled",
      cancelledAt: new Date(),
    });

    toast.success("Booking Cancelled", {
      description: "Your seats have been released.",
    });
  } catch (error) {
    console.error("❌ Error cancelling booking:", error);
    toast.error("Cancellation Failed", {
      description: error.message,
    });
  }
};

export const markBookingAsCompletedIfExpired = async (booking) => {
  const now = new Date();
  const showDateTime = new Date(`${booking.date} ${booking.time}`);

  if (booking.status === "confirmed" && showDateTime < now) {
    const bookingRef = doc(db, "bookings", booking.id);
    await updateDoc(bookingRef, {
      status: "completed",
      completedAt: now,
    });

    return {
      ...booking,
      status: "completed",
      completedAt: now,
    };
  }

  return null;
};

