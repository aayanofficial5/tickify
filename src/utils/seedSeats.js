import { setDoc, doc } from "firebase/firestore";
import { db } from "@/firebase";

export async function seedSeats(showtimeId, basePrice = 100) {
  const rows = ["A", "B", "C", "D", "E", "F", "G", "H"];
  const seatsPerRow = 12;

  for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
    const row = rows[rowIndex];
    for (let seatNum = 1; seatNum <= seatsPerRow; seatNum++) {
      const seatType = rowIndex < 2 ? "standard" : rowIndex < 5 ? "premium" : "vip";
      const price =
        seatType === "vip" ? basePrice * 2 : seatType === "premium" ? basePrice * 1.5 : basePrice;

      const seatId = `${row}${seatNum}`;
      await setDoc(doc(db, `showtimes/${showtimeId}/seats/${seatId}`), {
        id: seatId,
        row,
        number: seatNum,
        type: seatType,
        price,
        status: "available",
        blockedBy: null,
        expiresAt: null,
      });
    }
  }

  // console.log("✅ Seats seeded for showtime:", showtimeId);
}