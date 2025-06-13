import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";

const ShowCard = ({ id, title, time, poster }) => {
  const navigate = useNavigate();

  const handleBooking = ()=>{
    onAuthStateChanged(auth, (currentUser) => {
    if(!currentUser) navigate("/login")
    else navigate(`/show/${id}`)
    });
  }

  return (
    <div className="bg-white rounded shadow-md overflow-hidden w-64 hover:scale-105 transition">
      <img src={poster} alt={title} className="w-full h-60  object-contain bg-gray-400" />
      <div className="p-4 space-y-2">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-gray-600">Showtime: {time}</p>
        <button
          onClick={handleBooking}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Book Now
        </button>
      </div>
    </div>
  );
};

export default ShowCard;
