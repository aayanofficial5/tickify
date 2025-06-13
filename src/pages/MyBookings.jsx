import { useEffect, useState } from "react";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { db } from "../firebase";
import { getAuth } from "firebase/auth";

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const auth = getAuth();
  const user = auth.currentUser;
  // console.log(user);
  useEffect(() => {
    const fetchBookings = async () => {
      if (!user) return;

      try {
        const q = query(
          collection(db, "bookings"),
          where("userId", "==", user.uid),
          orderBy("timestamp", "desc")
        );

        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setBookings(data);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      }
    };

    fetchBookings();
  }, []);

  return (
    <div className="p-6 min-h-screen bg-gray-100">
      <h2 className="text-2xl font-bold mb-4">🎟️ My Bookings</h2>

      {bookings.length === 0 ? (
        <p className="text-gray-700">No bookings found.</p>
      ) : (
        <div className="grid gap-4">
          {bookings.map((booking) => (
            <div key={booking.id} className="bg-white shadow rounded p-4">
              <p>
                <strong>🎬 Show:</strong> {booking.showTitle}
              </p>
              <p>
                <strong>🪑 Seats:</strong> {booking.seats.join(", ")}
              </p>
              <p>
                <strong>💵 Amount:</strong> ₹{booking.amount}
              </p>
              <p>
                <strong>🧾 Payment ID:</strong> {booking.paymentId}
              </p>
              <p>
                <strong>🕒 Time:</strong>{" "}
                {booking.timestamp?.toDate().toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookings;
