import { useParams, useNavigate } from "react-router-dom";
import { sampleMovies } from "@/data/movies";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, Star, Calendar, Users } from "lucide-react";
import NavBar from "@/components/NavBar";


export const MovieDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const movie = sampleMovies.find(m => m.id === id);
  
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

  const handleBookNow = () => {
    navigate(`/booking/${movie.id}`);
  };

  return (
    <div className="min-h-screen bg-gradient-dark">
      <NavBar/>
      <div className="mx-auto px-10 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Movie Poster */}
          <div className="lg:col-span-1">
            <Card className="bg-gradient-card border-cinema-border overflow-hidden">
              <img
                src={movie.poster}
                alt={movie.title}
                className="h-[75vh] object-cover"
              />
            </Card>
          </div>

          {/* Movie Details */}
          <div className="lg:col-span-2 space-y-6 pt-2">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">
                {movie.title}
              </h1>
              <div className="flex items-center gap-4 text-muted-foreground mb-4">
                <div className="flex items-center gap-1">
                  <Star className="h-5 w-5 text-cinema-gold fill-current" />
                  <span className="font-semibold text-cinema-gold">{movie.rating}/10</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-5 w-5" />
                  <span>{movie.duration} min</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-5 w-5" />
                  <span>{new Date(movie.releaseDate).getFullYear()}</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                {movie.genre.map((genre) => (
                  <span
                    key={genre}
                    className="px-3 py-1 bg-cinema-purple/20 text-cinema-purple rounded-full text-sm border border-cinema-purple/30"
                  >
                    {genre}
                  </span>
                ))}
              </div>
            </div>

            <Card className="bg-gradient-card border-cinema-border">
              <CardContent className="px-6">
                <h3 className="text-xl font-bold text-foreground mb-3">Synopsis</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {movie.description}
                </p>
              </CardContent>
            </Card>

              <Card className="bg-gradient-card border-cinema-border">
                <CardContent className="px-6">
                  <h3 className="text-lg font-bold text-foreground mb-3 flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Cast & Crew
                  </h3>
                  <div className="space-y-2">
                    <div>
                      <span className="text-cinema-gold font-semibold">Director: </span>
                      <span className="text-muted-foreground">{movie.director}</span>
                    </div>
                    <div>
                      <span className="text-cinema-gold font-semibold">Cast: </span>
                      <span className="text-muted-foreground">{movie.cast.join(", ")}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

            <div className="flex items-center justify-between p-6 bg-gradient-card rounded-lg border border-cinema-border">
              <div>
                <span className="text-2xl font-bold text-cinema-gold">${movie.price}</span>
                <span className="text-muted-foreground ml-2">per ticket</span>
              </div>
              <Button 
                onClick={handleBookNow}
                size="lg"
                className="btn-gradient hover:shadow-glow transition-all duration-300 px-8"
              >
                Book Tickets Now
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};