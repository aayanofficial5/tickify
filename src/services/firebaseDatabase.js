import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { toast } from "sonner";

export const fetchMoviesFromFirestore = async () => {
  try {
    const snapshot = await getDocs(collection(db, "movies"));
    const now = new Date();

    const allMovies = snapshot.docs.map((doc) => ({
      docId: doc.id,
      ...doc.data(),
    }));

    // 1. Filter movies that have at least one future showtime
    const upcomingMovies = allMovies.filter((movie) =>
      Array.isArray(movie.showtimes) &&
      movie.showtimes.some((time) => new Date(time) > now)
    );

    // 2. If we have at least 5 upcoming movies, return them
    if (upcomingMovies.length >= 5) return upcomingMovies;

    // 3. Otherwise, get fallback movies (recent ones that may not have future showtimes)
    const fallbackMovies = allMovies
      .filter((movie) => !upcomingMovies.includes(movie)) // avoid duplicates
      .sort((a, b) => new Date(b.release_date) - new Date(a.release_date)); // newest first

    // 4. Combine upcoming with fallback to make at least 5
    const combined = [...upcomingMovies, ...fallbackMovies.slice(0, 5 - upcomingMovies.length)];

    return combined;
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

