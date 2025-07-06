import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { sampleMovies } from "@/data/movies";
import { Button } from "@/components/ui/button";
import { SeatSelection } from "@/components/SeatSelection";
import { BookingConfirmation } from "@/components/BookingConfirmation";
import { ShowtimeSelection } from "@/components/ShowtimeSelection";
import NavBar from "@/components/NavBar";

export const Booking = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const movie = sampleMovies.find(m => m.id === id);
  const [step, setStep] = useState("showtime");
  const [selectedShowtime, setSelectedShowtime] = useState("");
  const [selectedSeats, setSelectedSeats] = useState([]);
  
  if (!movie) {
    return (
      <div className="min-h-screen bg-gradient-dark">
        <NavBar/>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-foreground">Movie not found</h1>
          <Button onClick={() => navigate("/")} className="mt-4">
            Back to Movies
          </Button>
        </div>
      </div>
    );
  }

  const handleConfirmBooking = () => {
    // In a real app, this would save to database
    navigate("/bookings");
  };

  return (
    <div className="min-h-screen bg-gradient-dark px-5 md:px-20">
      <NavBar/>
      <div className="mx-auto px-4 py-8">
        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center gap-4">
            <div className={`flex items-center gap-2 ${step === "showtime" ? "text-cinema-gold" : "text-muted-foreground"}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                step === "showtime" ? "border-cinema-gold bg-cinema-gold text-cinema-dark" : "border-muted"
              }`}>
                1
              </div>
              <span>Select Time</span>
            </div>
            <div className="w-12 h-0.5 bg-cinema-border"></div>
            <div className={`flex items-center gap-2 ${step === "seats" ? "text-cinema-gold" : "text-muted-foreground"}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                step === "seats" ? "border-cinema-gold bg-cinema-gold text-cinema-dark" : "border-muted"
              }`}>
                2
              </div>
              <span>Choose Seats</span>
            </div>
            <div className="w-12 h-0.5 bg-cinema-border"></div>
            <div className={`flex items-center gap-2 ${step === "confirmation" ? "text-cinema-gold" : "text-muted-foreground"}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                step === "confirmation" ? "border-cinema-gold bg-cinema-gold text-cinema-dark" : "border-muted"
              }`}>
                3
              </div>
              <span>Confirm</span>
            </div>
          </div>
        </div>

        {/* Movie Header */}
        <div className="text-center mb-8">
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
            movie={movie}
            selectedShowtime={selectedShowtime}
            onShowtimeSelect={(time) => {
              setSelectedShowtime(time);
              setStep("seats");
            }}
          />
        )}

        {step === "seats" && (
          <SeatSelection 
            moviePrice={movie.price}
            onSeatSelect={(seats) => {
              setSelectedSeats(seats);
              if (seats.length > 0) {
                setTimeout(() => setStep("confirmation"), 500);
              }
            }}
          />
        )}

        {step === "confirmation" && (
          <BookingConfirmation 
            movie={movie}
            selectedSeats={selectedSeats}
            selectedShowtime={selectedShowtime}
            onConfirm={handleConfirmBooking}
            onBack={() => setStep("seats")}
          />
        )}
      </div>
    </div>
  );
};