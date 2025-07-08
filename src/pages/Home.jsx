import { MovieCard } from "@/components/MovieCard";
import NavBar from "@/components/NavBar";
import { sampleMovies } from "@/data/movies";
import { resetBooking, setSelectedMovie } from "@/redux/slices/bookingSlice";
import { fetchMoviesFromFirestore } from "@/services/firebaseDatabase";
import { ArrowRight, Check, Play, Ticket } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

export default function Home() {
  const { user } = useSelector((state) => state.auth);
  const [movies, setMovies] = useState([]);
  const dispatch = useDispatch();
  

  async function fetchMovies() {
    const result = await fetchMoviesFromFirestore();
    console.log(result);
    if (result) {
      setMovies(result);
    } else {
      setMovies(sampleMovies);
    }
  }

  useEffect(() => {
    fetchMovies();
    dispatch(setSelectedMovie(null));
    dispatch(resetBooking());
  }, [dispatch]);

  return (
    <div className="min-h-screen text-white bg-gradient-dark">
      <NavBar />
      {/* Hero Section */}
      {!user && (
        <section className="relative bg-gradient-dark flex flex-col min-h-[90vh]">
          <div className="flex flex-col items-center justify-center flex-grow text-center px-4">
            <h1 className="text-5xl md:text-6xl font-bold text-gradient mb-6 animate-pulse">
              Tickify
            </h1>
            <p className="text-lg md:text-xl text-gray-300 max-w-2xl mb-8">
              Discover & book your favorite movies effortlessly. Premium
              theaters, seamless booking, and a cinematic experience like no
              other.
            </p>
            <div className="flex space-x-4">
              <button
                className="btn-gradient"
                onClick={() =>
                  document
                    .getElementById("now-playing")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
              >
                <Play />
                Browse Movies
              </button>

              <Link to="/auth?mode=signup">
                <button className="btn-dark">
                  Get Started
                  <ArrowRight />
                </button>
              </Link>
            </div>
          </div>

          {/* Floating Design Elements */}
          <div className="absolute top-10 left-10 w-20 h-20 bg-amber-400/20 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-32 h-32 bg-purple-800/20 rounded-full blur-xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-white/10 rounded-full blur-lg animate-pulse delay-500"></div>
        </section>
      )}

      {/* Now Playing Section */}
      <section id="now-playing" className="py-8 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Now Playing
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              Explore the latest releases and timeless classics. Book your seats
              today for the ultimate cinematic experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {movies?.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>

          {movies?.length === 0 && (
            <div className="text-center py-12">
              <p className="text-xl text-muted-foreground">
                No movies available right now!
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-[rgb(17,19,23)]">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Ticket className="h-8 w-8 text-cinema-dark" />}
              title="Easy Booking"
              description="Book your tickets in just a few clicks with our intuitive interface."
            />
            <FeatureCard
              icon={<Play className="h-8 w-8 text-cinema-dark" />}
              title="Premium Experience"
              description="Enjoy state-of-the-art sound and visual technology in every theater."
            />
            <FeatureCard
              icon={<Ticket className="h-8 w-8 text-cinema-dark" />}
              title="Secure Payments"
              description="Safe and secure payment processing with multiple payment options."
            />
          </div>
        </div>
      </section>
    </div>
  );
}

// Simple reusable FeatureCard component
function FeatureCard({ icon, title, description }) {
  return (
    <div className="text-center">
      <div className="btn-gradient !p-0 w-16 h-16 !rounded-full flex items-center justify-center mx-auto mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-foreground mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}
