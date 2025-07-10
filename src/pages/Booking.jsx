import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Button } from "@/components/ui/button";
import { SeatSelection } from "@/components/Booking/SeatSelection";
import { BookingConfirmation } from "@/components/Booking/BookingConfirmation";
import { ShowtimeSelection } from "@/components/Booking/ShowtimeSelection";
import NavBar from "@/components/NavBar";
import { IMG_URL } from "@/utils/constants";
import { nextStep, prevStep } from "@/redux/slices/bookingSlice";
import RenderSteps from "@/components/Booking/RenderSteps";
import Loader from "@/components/Loader";

const TMDB_API = import.meta.env.VITE_TMDB_API_TOKEN;
const BASE_URL = "https://api.themoviedb.org/3";

export const Booking = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { step, selectedMovie, selectedShowtime } = useSelector((state) => state.booking);
  const { user } = useSelector((state) => state.auth);

  const [movie, setMovie] = useState(null);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const res = await fetch(`${BASE_URL}/movie/${id}?language=en-US`, {
          headers: {
            Authorization: `Bearer ${TMDB_API}`,
            accept: "application/json",
          },
        });
        const data = await res.json();
        setMovie({
          docId: selectedMovie.docId,
          id: data.id,
          poster: `${IMG_URL}${data.backdrop_path}`,
          title: data.title,
          duration: data.runtime,
          rating: data.vote_average,
          genre: data.genres.map((g) => g.name),
          price: selectedMovie.price,
        });
      } catch (error) {
        console.error("Failed to fetch movie for booking:", error);
      }
    };

    fetchMovie();
  }, [id]);

  const handleConfirmBooking = () => {
    navigate("/bookings");
  };

  if (!movie) {
    return (
      <div className="min-h-screen bg-gradient-dark">
        <NavBar />
        <div className="container mx-auto px-4 py-16 text-center">
          <Loader label1="Loading Show times..." label2="Back to Movie Details"/>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-dark px-4 sm:px-6 md:px-10 lg:px-20">
      <NavBar />
      <div className="mx-auto max-w-6xl px-2 sm:px-4 py-6 sm:py-8">
        <RenderSteps/>

        {/* Movie Info */}
        <div className="text-center mb-10 px-2">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">{movie?.title}</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            {movie?.genre.join(", ")} • {movie?.duration} min • {movie?.rating}/10
          </p>
        </div>

        {/* Step Content */}
        <div className="w-full">
          {step === 1 && (
            <ShowtimeSelection
              onNext={() => dispatch(nextStep())}
              selectedMovie={selectedMovie}
            />
          )}

          {step === 2 && (
            <SeatSelection
              moviePrice={parseInt(movie.price)}
              onBack={() => dispatch(prevStep())}
              onNext={() => dispatch(nextStep())}
              showtimeId={`${selectedMovie.docId}_${selectedShowtime.date}T${selectedShowtime.time.split(" ")[0]}`}
              userId={user.id}
            />
          )}

          {step === 3 && (
            <BookingConfirmation
              movie={movie}
              onConfirm={handleConfirmBooking}
              onBack={() => dispatch(prevStep())}
            />
          )}
        </div>
      </div>
    </div>
  );
};
