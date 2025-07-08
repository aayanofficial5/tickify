import {
  addDoc,
  collection,
  updateDoc,
  doc,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/firebase";

export const storeBooking = async ({
  userId,
  showtimeId,
  movie,
  seats,
  paymentId,
  totalAmount,
}) => {
  const seatDetails = seats.map((s) => ({
    id: s.id,
    row: s.row,
    number: s.number,
    type: s.type,
    price: s.price,
  }));

  await addDoc(collection(db, "bookings"), {
    userId,
    showtimeId,
    movieTitle: movie.title,
    poster: movie.poster,
    theater: movie.theater,
    date: movie.date,
    time: movie.time,
    seats: seats.map((s) => s.id),
    seatDetails,
    totalAmount,
    paymentId,
    customerInfo: movie.customerInfo || {},
    status: "confirmed",
    showDateTime: movie.showDateTime,
    bookedAt: Timestamp.now(),
  });
};

export const bookSeatsInFirestore = async (showtimeId, selectedSeats) => {
  for (const seat of selectedSeats) {
    const seatRef = doc(db, `showtimes/${showtimeId}/seats/${seat.id}`);
    await updateDoc(seatRef, {
      status: "booked",
      blockedBy: null,
      expiresAt: null,
    });
  }
};
