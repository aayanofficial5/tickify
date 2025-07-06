import { useParams, useNavigate } from "react-router-dom";
import { shows } from "../data/shows";
import { useEffect, useState } from "react";
import {toast} from "sonner";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase";

const dummySeats = Array.from({ length: 30 }, (_, i) => ({
  number: i + 1,
}));

const ShowDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [show, setShow] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [seats, setSeats] = useState(dummySeats);
  const [bookedSeats, setBookedSeats] = useState([]);

  useEffect(() => {
    const foundShow = shows.find((s) => s.id === id);
    if (!foundShow) {
      toast.error("Show not found");
      navigate("/");
    } else {
      setShow(foundShow);
    }
  }, [id, navigate]);

  useEffect(() => {
    if (!show) return;
    // console.log("Fetching bookings for show ID:", show.id);
    fetchBookedSeats();
  }, [show]);

  const fetchBookedSeats = async () => {
    try {
      const q = query(
        collection(db, "bookings"),
        where("showId", "==", show.id)
      );

      const querySnapshot = await getDocs(q);
      // console.log("Query snapshot size:", querySnapshot.size);

      const allBooked = [];
      querySnapshot.forEach((doc) => {
        // console.log("Booking Doc:", doc.data()); 
        allBooked.push(...doc.data().seats);
      });

      setBookedSeats(allBooked);
      // console.log("All Booked Seats:", allBooked); 
    } catch (err) {
      console.error("Error fetching booked seats:", err);
    }
  };

  const handleSeatClick = (number) => {
    if (bookedSeats.includes(number)) return;

    if (selectedSeats.includes(number)) {
      setSelectedSeats((prev) => prev.filter((n) => n !== number));
    } else {
      setSelectedSeats((prev) => [...prev, number]);
    }
  };

  const handleProceed = () => {
    if (selectedSeats.length === 0) {
      toast.error("Please select at least 1 seat");
      return;
    }

    navigate(`/checkout`, {
      state: {
        show,
        seats: selectedSeats,
      },
    });
  };

  return (
    <div className="p-6 min-h-screen bg-white text-center">
      {show && (
        <>
          <h2 className="text-3xl font-bold mb-2">{show.title}</h2>
          <p className="text-gray-600 mb-4">Show Time: {show.time}</p>
          <img
            src={show.poster}
            alt={show.title}
            className="mx-auto w-72 h-96 object-cover mb-6"
          />

          <h3 className="text-xl font-semibold mb-2">Select Your Seats</h3>
          {/* {console.log(bookedSeats)} */}
          <div className="grid grid-cols-6 gap-3 justify-center my-4">
            {seats.map((seat) => {
              const isBooked = bookedSeats.includes(seat.number);
              const isSelected = selectedSeats.includes(seat.number);

              return (
                <button
                  key={seat.number}
                  disabled={isBooked}
                  className={`w-10 h-10 border rounded font-medium transition-all
                    ${
                      isBooked
                        ? "bg-gray-400 text-white cursor-not-allowed"
                        : isSelected
                        ? "bg-green-600 text-white"
                        : "bg-gray-100 hover:bg-blue-200"
                    }
                  `}
                  onClick={() => handleSeatClick(seat.number)}
                >
                  {seat.number}
                </button>
              );
            })}
          </div>

          <div className="flex gap-4 justify-center mb-6">
            <span className="flex items-center gap-2">
              <div className="w-5 h-5 bg-gray-100 border rounded" /> Available
            </span>
            <span className="flex items-center gap-2">
              <div className="w-5 h-5 bg-green-600 border rounded" /> Selected
            </span>
            <span className="flex items-center gap-2">
              <div className="w-5 h-5 bg-gray-400 border rounded" /> Booked
            </span>
          </div>

          <button
            onClick={handleProceed}
            className="mt-4 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Proceed to Checkout
          </button>
        </>
      )}
    </div>
  );
};

export default ShowDetails;
