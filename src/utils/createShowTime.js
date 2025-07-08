import { addDoc, collection } from "firebase/firestore";
import { db } from "@/firebase";
import { toast } from "sonner";
import { ensureSeatsExist } from "@/services/ensureSeatExistService";

export const handleCreateShowtime = async (movieId, showData) => {
  const showtimeRef = await addDoc(collection(db, "showtimes"), {
    ...showData,
    movieId,
    createdAt: new Date(),
  });

  const showtimeId = showtimeRef.id;

  // 🧠 Ensure seats exist (idempotent)
  await ensureSeatsExist(showtimeId, showData.basePrice || 100);

  toast.success("Showtime and seats setup done!");
};
