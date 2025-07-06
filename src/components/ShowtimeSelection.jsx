import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Calendar, Clock, MapPin } from "lucide-react";



export const ShowtimeSelection = ({ movie, selectedShowtime, onShowtimeSelect }) => {
  // Generate dates for the next 7 days
  const dates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    return date;
  });

  const theaters = [
    { name: "CinemaFlix Downtown", distance: "0.5 miles" },
    { name: "CinemaFlix Mall", distance: "1.2 miles" },
    { name: "CinemaFlix North", distance: "2.8 miles" }
  ];

  return (
    <div className="space-y-6">
      {/* Date Selection */}
      <Card className="bg-gradient-card border-cinema-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Calendar className="h-5 w-5 text-cinema-gold" />
            Select Date
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-2">
            {dates.map((date, index) => (
              <Button
                key={index}
                variant={index === 0 ? "default" : "outline"}
                className={index === 0 
                  ? "bg-cinema-gold text-cinema-dark flex-col h-auto py-3"
                  : "border-cinema-border hover:bg-muted-foreground/30 flex-col h-auto py-3"
                }
              >
                <span className="text-xs">
                  {date.toLocaleDateString('en-US', { weekday: 'short' })}
                </span>
                <span className="text-lg font-bold">
                  {date.getDate()}
                </span>
                <span className="text-xs">
                  {date.toLocaleDateString('en-US', { month: 'short' })}
                </span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Theater and Showtime Selection */}
      <div className="space-y-4">
        {theaters.map((theater) => (
          <Card key={theater.name} className="bg-gradient-card border-cinema-border">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-foreground">{theater.name}</CardTitle>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    {theater.distance}
                  </div>
                </div>
                <div className="flex items-center gap-1 text-cinema-gold">
                  <Clock className="h-4 w-4" />
                  <span className="text-sm">Available</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 md:grid-cols-6 gap-3">
                {movie.showtimes.map((time) => (
                  <Button
                    key={`${theater.name}-${time}`}
                    variant={selectedShowtime === time ? "default" : "outline"}
                    onClick={() => onShowtimeSelect(time)}
                    className={selectedShowtime === time
                      ? "bg-cinema-gold text-cinema-dark"
                      : "border-cinema-border hover:bg-muted-foreground/20"
                    }
                  >
                    {time}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};