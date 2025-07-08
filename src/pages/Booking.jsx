import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { SeatSelection } from "@/components/SeatSelection";
import { BookingConfirmation } from "@/components/BookingConfirmation";
import { ShowtimeSelection } from "@/components/ShowtimeSelection";
import NavBar from "@/components/NavBar";
import { IMG_URL } from "@/utils/constants";
import { useSelector } from "react-redux";

const TMDB_API = import.meta.env.VITE_TMDB_API_TOKEN;
const BASE_URL = "https://api.themoviedb.org/3";

export const Booking = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [movie, setMovie] = useState(null);
  const [step, setStep] = useState("showtime");
  const {selectedMovie} = useSelector((state)=>state.booking);
  const {user} = useSelector((state)=>state.auth);
  const {  selectedShowtime } = useSelector(
    (state) => state.booking
  );
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
        // console.log(data);
        setMovie({
          docId:selectedMovie.docId,
          id: data.id,
          poster:`${IMG_URL}${data.backdrop_path}`,
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
    // In real use-case: store booking to DB or context
    navigate("/bookings");
  };

  if (!movie) {
    return (
      <div className="min-h-screen bg-gradient-dark">
        <NavBar />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-foreground">
            Loading movie...
          </h1>
          <Button onClick={() => navigate("/")} className="mt-4">
            Back to Movies
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-dark px-5 md:px-20">
      <NavBar />
      <div className="mx-auto px-4 py-8 max-w-6xl">
        {/* Progress Indicator */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center gap-4 flex-wrap text-sm md:text-base">
            {["showtime", "seats", "confirmation"].map((stepName, index) => {
              const stepTitles = {
                showtime: "Select Showtime", // Updated
                seats: "Choose Seats",
                confirmation: "Confirm",
              };
              const isActive = step === stepName;
              const isDone =
                step !== stepName && ["seats", "confirmation"].includes(step);

              return (
                <div className="flex items-center gap-2" key={stepName}>
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center border-2 font-bold transition-all ${
                      isActive
                        ? "border-cinema-gold bg-cinema-gold text-cinema-dark"
                        : isDone
                        ? "border-muted text-cinema-gold"
                        : "border-muted text-muted-foreground"
                    }`}
                  >
                    {index + 1}
                  </div>
                  <span
                    className={`transition-all ${
                      isActive
                        ? "text-cinema-gold font-medium"
                        : "text-muted-foreground"
                    }`}
                  >
                    {stepTitles[stepName]}
                  </span>
                  {index < 2 && (
                    <div className="w-10 h-0.5 bg-cinema-border mx-1" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Movie Heading */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            {movie.title}
          </h1>
          <p className="text-muted-foreground">
            {movie.genre.join(", ")} • {movie.duration} min • {movie.rating}/10
          </p>
        </div>

        {/* Step Content */}
        {step === "showtime" && (
          <ShowtimeSelection
            onNext={() => setStep("seats")}
            selectedMovie={selectedMovie}
          />
        )}

        {step === "seats" && (
          <SeatSelection
            moviePrice={parseInt(movie.price)}
            onBack={() => setStep("showtime")}
            onNext={() => setStep("confirmation")}
            showtimeId={`${selectedMovie.docId}_${selectedShowtime.date}T${selectedShowtime.time.split(" ")[0]}`}
            userId={user.id}
          />
        )}

        {step === "confirmation" && (
          <BookingConfirmation
            movie={movie}
            onConfirm={handleConfirmBooking}
            onBack={() => setStep("seats")}
          />
        )}
      </div>
    </div>
  );
};
