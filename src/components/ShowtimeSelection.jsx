import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { setSelectedShowtime } from "@/redux/slices/bookingSlice";
import { formatTo12Hour } from "@/utils/formatTime";

export const ShowtimeSelection = ({ onNext, selectedMovie }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTheater, setSelectedTheater] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const availableTimes = selectedMovie?.showtimes || [];

  // Group showtimes by date
  const groupedByDate = availableTimes.reduce((acc, datetime) => {
    const dateObj = new Date(datetime);
    const dateKey = dateObj.toLocaleDateString("en-CA");
    const timeVal = dateObj.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(timeVal);
    return acc;
  }, {});
  // console.log(groupedByDate);

  const next7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    return date;
  });

  const theaters = [{ name: "Pacific Mall", distance: "0.5 miles" }];

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setSelectedTheater(null);
    setSelectedTime(null);
  };

  const handleTimeClick = (theater, time) => {
    if (!selectedDate) {
      toast.error("Please select a date first.");
      return;
    }
    setSelectedTheater(theater.name);
    setSelectedTime(time);
  };

  const handleNext = () => {
    if (!selectedDate || !selectedTheater || !selectedTime) return;
    const showtimeObj = {
      date: selectedDate.toLocaleDateString("en-CA"),
      time: selectedTime,
      theater: selectedTheater,
    };
    // console.log(showtimeObj);
    dispatch(setSelectedShowtime(showtimeObj));
    onNext();
  };

  const hasFullSelection = selectedDate && selectedTheater && selectedTime;

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
          <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-7 gap-2">
            {next7Days.map((date, index) => {
              const isSelected =
                selectedDate?.toDateString() === date.toDateString();
              return (
                <Button
                  key={index}
                  onClick={() => handleDateSelect(date)}
                  className={`flex-col h-auto py-3 w-full ${
                    isSelected
                      ? "bg-cinema-gold text-cinema-dark"
                      : "border border-cinema-border bg-cinema-dark hover:bg-muted-foreground/20 text-foreground"
                  }`}
                >
                  <span className="text-xs">
                    {date.toLocaleDateString("en-US", { weekday: "short" })}
                  </span>
                  <span className="text-lg font-bold">{date.getDate()}</span>
                  <span className="text-xs">
                    {date.toLocaleDateString("en-US", { month: "short" })}
                  </span>
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Theater + Time Selection */}
      <div className="space-y-4">
        {theaters.map((theater) => (
          <Card
            key={theater.name}
            className="bg-gradient-card border-cinema-border"
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-foreground">
                    {theater.name}
                  </CardTitle>
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
                {selectedDate &&
                groupedByDate[selectedDate.toLocaleDateString("en-CA")]
                  ?.length > 0 ? (
                  groupedByDate[selectedDate.toLocaleDateString("en-CA")].map(
                    (time) => {
                      const isActive =
                        selectedTheater === theater.name &&
                        selectedTime === time;
                      return (
                        <Button
                          key={`${theater.name}-${time}`}
                          onClick={() => handleTimeClick(theater, time)}
                          className={`${
                            isActive
                              ? "bg-cinema-gold text-cinema-dark"
                              : "border border-cinema-border hover:bg-muted-foreground/20 text-foreground bg-cinema-dark"
                          }`}
                        >
                          {formatTo12Hour(time)}
                        </Button>
                      );
                    }
                  )
                ) : (
                  <div className="col-span-2 text-center py-1 bg-cinema-dark text-base text-foreground border border-cinema-border rounded-md">
                    Not available for this date.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-6">
        <Button
          variant="outline"
          className="border-cinema-border hover:bg-cinema-purple/30"
          onClick={() => navigate(-1)}
        >
          Back
        </Button>
        <Button
          onClick={handleNext}
          disabled={!hasFullSelection}
          className={`bg-gradient-primary hover:shadow-glow px-4 ${
            hasFullSelection ? "cursor-pointer" : " cursor-not-allowed"
          }`}
        >
          Next
        </Button>
      </div>
    </div>
  );
};
