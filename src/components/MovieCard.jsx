import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { setSelectedMovie } from "@/redux/slices/bookingSlice";
import { Clock, Star, Play, Calendar } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

// Optional: map genre IDs to names (partial example)
const genreMap = {
  28: "Action",
  12: "Adventure",
  16: "Animation",
  35: "Comedy",
  80: "Crime",
  99: "Documentary",
  18: "Drama",
  10751: "Family",
  14: "Fantasy",
  36: "History",
  27: "Horror",
  10402: "Music",
  9648: "Mystery",
  10749: "Romance",
  878: "Science Fiction",
  10770: "TV Movie",
  53: "Thriller",
  10752: "War",
  37: "Western",
};

export const MovieCard = ({ movie }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const handleBookNow = (e) => {
    e.stopPropagation();
    dispatch(setSelectedMovie(movie));
    navigate(`/booking/${movie.id}`);
  };

  const handleCardClick = () => {
    dispatch(setSelectedMovie(movie));
    navigate(`/movie/${movie.id}`);
  };

  return (
    <Card
      className="group cursor-pointer bg-transparent hover:shadow-premium transition-all duration-500 hover:scale-105 hover:-translate-y-2 overflow-hidden gap-0"
      onClick={handleCardClick}
    >
      <div className="relative overflow-hidden border rounded-t-xl border-cinema-border border-b-0">
        <img
          src={`https://image.tmdb.org/t/p/w500${
            movie.backdrop_path || movie.poster_path
          }`}
          alt={movie.original_title}
          className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-cinema-dark/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Rating Badge */}
        <div className="absolute top-3 right-3 bg-cinema-gold/90 backdrop-blur-sm px-2 py-1 rounded-full transform group-hover:scale-110 transition-transform duration-300">
          <div className="flex items-center gap-1 text-cinema-dark text-sm font-semibold">
            <Star className="h-3 w-3 fill-current" />
            {movie.vote_average?.toFixed(1)}
          </div>
        </div>

        {/* Hover Play Button */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="bg-cinema-gold/20 backdrop-blur-md rounded-full p-4 transform scale-0 group-hover:scale-100 transition-transform duration-300">
            <Play className="h-8 w-8 text-cinema-gold" />
          </div>
        </div>
      </div>

      <CardContent className="border border-t-0 border-cinema-border rounded-b-xl p-4 bg-gradient-card">
        <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-cinema-gold truncate transition-colors duration-300">
          {movie.original_title}
        </h3>

        <div className="flex items-center gap-2 text-muted-foreground text-sm mb-3">
          <Calendar className="h-3 w-3" />
          <span>{movie.release_date?.split("-")[0]}</span>
          <span>•</span>
          <span className="truncate">
            {(movie.genre_ids || [])
              .slice(0, 3)
              .map((id) => genreMap[id])
              .join(", ")}
          </span>
        </div>

        <p className="text-muted-foreground text-sm mb-4 line-clamp-2 group-hover:text-foreground transition-colors duration-300">
          {movie.overview}
        </p>

        <div className="flex items-center justify-between">
          <div className="text-cinema-gold font-bold text-lg transform group-hover:scale-110 transition-transform duration-300">
            ₹{parseInt(movie?.price)||100}
          </div>
          {!(user?.admin)&&<Button
            onClick={handleBookNow}
            className="btn-gradient hover:shadow-glow transition-all duration-300 transform hover:scale-105"
          >
            Book Now
          </Button>}
        </div>
      </CardContent>
    </Card>
  );
};
