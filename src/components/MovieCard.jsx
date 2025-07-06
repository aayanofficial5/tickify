import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, Star, Play } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const MovieCard = ({ movie }) => {
  const navigate = useNavigate();

  const handleBookNow = (e) => {
    e.stopPropagation();
    navigate(`/booking/${movie.id}`);
  };

  const handleCardClick = () => {
    navigate(`/movie/${movie.id}`);
  };

  return (
    <Card 
      className="group cursor-pointer bg-gradient-card border-cinema-border hover:shadow-premium transition-all duration-500 hover:scale-105 hover:-translate-y-2 overflow-hidden"
      onClick={handleCardClick}
    >
      <div className="relative overflow-hidden">
        <img
          src={movie.poster}
          alt={movie.title}
          className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-cinema-dark/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Rating Badge */}
        <div className="absolute top-3 right-3 bg-cinema-gold/90 backdrop-blur-sm px-2 py-1 rounded-full transform group-hover:scale-110 transition-transform duration-300">
          <div className="flex items-center gap-1 text-cinema-dark text-sm font-semibold">
            <Star className="h-3 w-3 fill-current" />
            {movie.rating}
          </div>
        </div>
        
        {/* Hover Play Button */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="bg-cinema-gold/20 backdrop-blur-md rounded-full p-4 transform scale-0 group-hover:scale-100 transition-transform duration-300">
            <Play className="h-8 w-8 text-cinema-gold" />
          </div>
        </div>
      </div>
      
      <CardContent className="p-4">
        <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-cinema-gold transition-colors duration-300">
          {movie.title}
        </h3>
        
        <div className="flex items-center gap-2 text-muted-foreground text-sm mb-3">
          <Clock className="h-4 w-4" />
          <span>{movie.duration} min</span>
          <span>•</span>
          <span className="truncate">{movie.genre.slice(0, 2).join(", ")}{movie.genre.length > 2 ? "..." : ""}</span>
        </div>
        
        <p className="text-muted-foreground text-sm mb-4 line-clamp-2 group-hover:text-foreground transition-colors duration-300">
          {movie.description}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="text-cinema-gold font-bold text-lg transform group-hover:scale-110 transition-transform duration-300">
            ${movie.price}
          </div>
          <Button 
            onClick={handleBookNow}
            className="btn-gradient  hover:shadow-glow transition-all duration-300 transform hover:scale-105"
          >
            Book Now
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};