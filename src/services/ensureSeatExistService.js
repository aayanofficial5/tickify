import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase";
import { seedSeats } from "@/utils/seedSeats";


export const ensureSeatsExist = async (showtimeId, basePrice = 100) => {
  const seatsRef = collection(db, `showtimes/${showtimeId}/seats`);
  const seatDocs = await getDocs(seatsRef);

  // ✅ If no seat documents exist, seed them
  if (seatDocs.empty) {
    // console.log(`⛔ No seats found for showtime ${showtimeId}. Seeding now...`);
    await seedSeats(showtimeId, basePrice);
    // console.log("✅ Seats created.");
  } else {
    // console.log(`✅ Seats already exist for showtime ${showtimeId}.`);
  }
};
