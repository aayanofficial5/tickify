import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, Star, Calendar, Users, Play, X } from "lucide-react";
import NavBar from "@/components/NavBar";
import { useSelector } from "react-redux";
import { IMG_URL } from "@/utils/constants";
import Loader from "@/components/Loader";

export const MovieDetail = () => {
  const TMDB_API = import.meta.env.VITE_TMDB_API_TOKEN;
  const BASE_URL = "https://api.themoviedb.org/3";

  const { id } = useParams();
  const navigate = useNavigate();

  const [movie, setMovie] = useState(null);
  const [cast, setCast] = useState([]);
  const [director, setDirector] = useState(null);
  const [showTrailer, setShowTrailer] = useState(false);
  const [trailerKey, setTrailerKey] = useState(null);

  const { selectedMovie } = useSelector((state) => state.booking);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const movieRes = await fetch(`${BASE_URL}/movie/${id}?language=en-US`, {
          headers: {
            Authorization: `Bearer ${TMDB_API}`,
            accept: "application/json",
          },
        });
        const movieData = await movieRes.json();
        setMovie(movieData);

        const creditsRes = await fetch(`${BASE_URL}/movie/${id}/credits`, {
          headers: {
            Authorization: `Bearer ${TMDB_API}`,
            accept: "application/json",
          },
        });
        const creditsData = await creditsRes.json();
        setCast(creditsData.cast.slice(0, 6));
        const dir = creditsData.crew.find(
          (member) => member.job === "Director"
        );
        setDirector(dir?.name || "Unknown");

        const videoRes = await fetch(`${BASE_URL}/movie/${id}/videos`, {
          headers: {
            Authorization: `Bearer ${TMDB_API}`,
            accept: "application/json",
          },
        });
        const videoData = await videoRes.json();
        const trailer = videoData.results.find(
          (vid) => vid.type === "Trailer" && vid.site === "YouTube"
        );
        setTrailerKey(trailer?.key || null);
      } catch (err) {
        console.error("Failed to load movie details", err);
      }
    };

    fetchDetails();
  }, [id]);

  const handleBookNow = () => {
    navigate(`/booking/${movie.id}`);
  };

  if (!movie) {
    return (
      <div className="min-h-screen bg-gradient-dark">
        <NavBar />
        <Loader label1="Loading Show Details..." fullscreen={true} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-dark relative">
      <NavBar />
      <div className="container mx-auto px-6 py-10">
        <div className="grid lg:grid-cols-3 gap-10">
          {/* Poster with Play Button */}
          <div className="lg:col-span-1 relative group hover:scale-105 transition-all duration-500">
            <img
              src={`${IMG_URL}${movie?.poster_path}`}
              alt={movie?.title}
              className="w-full h-[73vh] object-cover rounded-2xl border-2 border-cinema-border"
            />

            {trailerKey && (
              <div
                className="absolute inset-0 flex flex-col gap-5 items-center justify-center border-2 border-cinema-border rounded-2xl bg-black/50 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer"
                onClick={() => setShowTrailer(true)}
              >
                <div className="bg-cinema-gold/20 p-4 rounded-full hover:scale-120 transition-transform">
                  <Play className="h-8 w-8 text-cinema-gold" />
                </div>
                <p className="text-cinema-gold font-semibold text-xl">Watch Trailer</p>
              </div>
            )}
          </div>

          {/* Movie Details */}
          <div className="lg:col-span-2 flex flex-col justify-center space-y-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-3">
                {movie?.title}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-muted-foreground mb-4">
                <div className="flex items-center gap-1">
                  <Star className="h-5 w-5 text-cinema-gold fill-current" />
                  <span className="text-cinema-gold font-medium">
                    {movie?.vote_average}/10
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-5 w-5" />
                  <span>{movie?.runtime} min</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-5 w-5" />
                  <span>{movie?.release_date.split("-")[0]}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-2">
                {movie?.genres.map((genre) => (
                  <span
                    key={genre.id}
                    className="px-3 py-1 bg-cinema-purple/20 text-cinema-purple rounded-full text-sm border border-cinema-purple/30"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>
            </div>

            {/* Synopsis */}
            <Card className="bg-gradient-card border-cinema-border rounded-xl">
              <CardContent className="px-6 py-4">
                <h3 className="text-xl font-bold text-foreground mb-2">
                  Synopsis
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {movie?.overview}
                </p>
              </CardContent>
            </Card>

            {/* Booking */}
            <div className="flex items-center justify-between p-6 bg-gradient-card border border-cinema-border rounded-xl">
              <div>
                <span className="text-2xl font-bold text-cinema-gold">
                  ₹{parseInt(selectedMovie?.price) || 100}
                </span>
                <span className="text-muted-foreground ml-2">per ticket</span>
              </div>
              {!(user?.admin)&&<Button
                onClick={handleBookNow}
                size="lg"
                className="btn-gradient hover:shadow-glow transition-all duration-300 px-8"
              >
                Book Tickets Now
              </Button>}
            </div>
          </div>
        </div>

        {/* Cast Section */}
        <div className="mt-12">
          <Card className="bg-gradient-card border-cinema-border rounded-xl">
            <CardContent className="px-6 py-6">
              <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                <Users className="h-5 w-5" />
                Cast & Crew
              </h3>

              <div className="mb-4 text-muted-foreground">
                <span className="text-cinema-gold font-semibold">
                  Director:
                </span>{" "}
                {director}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                {cast.map((actor) => (
                  <div key={actor.id} className="text-center">
                    <img
                      src={
                        actor.profile_path
                          ? `${IMG_URL}${actor.profile_path}`
                          : "https://via.placeholder.com/150x220?text=No+Image"
                      }
                      alt={actor.name}
                      className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover mx-auto shadow-md border border-cinema-border"
                    />
                    <p className="mt-2 text-sm text-foreground font-semibold truncate">
                      {actor.name}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      as {actor.character}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modal for Trailer */}
      {showTrailer && trailerKey && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="relative w-[70%] h-[90%] flex flex-col gap-6 items-center justify-center p-4 bg-gray-800">
         <h1 className="text-3xl font-bold">{movie.title}'s Trailer</h1>
          <div className="w-full max-w-4xl aspect-video rounded-lg overflow-hidden shadow-lg">
            <iframe
              src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1`}
              title="YouTube Trailer"
              allow="autoplay; encrypted-media"
              allowFullScreen
              className="w-full h-full rounded-md"
            />
            <button
              onClick={() => setShowTrailer(false)}
              className="absolute top-5 right-5 text-white hover:bg-red-500 px-5 py-2"
            >
              <X className="w-7 h-7" />
            </button>
          </div>
          </div>
        </div>
      )}
    </div>
  );
};
