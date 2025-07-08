import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Calendar, Clock, MapPin, Ticket, User } from "lucide-react";
import { toast } from "sonner";
import { formatRupee } from "@/lib/utils";
import { bookTicket, buyTicket } from "@/services/paymentService";
import { useSelector } from "react-redux";

export const BookingConfirmation = ({ movie, onBack }) => {
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();

  const { selectedSeats, selectedShowtime } = useSelector(
    (state) => state.booking
  );
  const { user } = useSelector((state) => state.auth);
  console.log(selectedSeats, selectedShowtime);
  const totalPrice = selectedSeats.reduce((sum, s) => sum + (s.price || 0), 0);
  const serviceFee = 59;
  const finalTotal = totalPrice + serviceFee;

  const handleConfirmBooking = async () => {
    if (!customerInfo.name || !customerInfo.email) {
      toast.error("Missing Information", {
        description: "Please fill in all required fields.",
      });
      return;
    }

    setIsProcessing(true);
    try {
      const show = {
        id: `${movie.docId}_${selectedShowtime.date}T${
          selectedShowtime.time.split(" ")[0]
        }`,
        title: movie.title,
        poster: movie.poster,
        theater: selectedShowtime.theater,
        time: selectedShowtime.time,
        date: selectedShowtime.date,
        customerInfo,
        total: finalTotal,
        showDateTime: `${selectedShowtime.date} ${selectedShowtime.time}`,
      };

      await buyTicket(show, selectedSeats, user, navigate);
      // await bookTicket(null, show, selectedSeats, user, navigate, finalTotal);
    } catch (err) {
      toast.error("Payment failed", { description: err.message });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Summary */}
        <Card className="bg-gradient-card border-cinema-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Ticket className="h-5 w-5 text-cinema-gold" />
              Booking Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Movie */}
            <div className="flex gap-4">
              <img
                src={movie.poster}
                alt={movie.title}
                className="w-20 h-28 object-cover rounded border border-cinema-border"
              />
              <div className="flex-1">
                <h3 className="font-bold text-foreground">{movie.title}</h3>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {new Date(selectedShowtime.date).toLocaleDateString(
                      "en-IN",
                      {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    {selectedShowtime?.time}
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    {selectedShowtime?.theater}
                  </div>
                </div>
              </div>
            </div>

            <Separator className="bg-cinema-border" />

            {/* Seats */}
            <div>
              <h4 className="font-semibold mb-2 text-foreground">
                Selected Seats
              </h4>
              <div className="flex flex-wrap gap-2">
                {selectedSeats.map((s) => (
                  <Badge
                    key={s.id}
                    variant="secondary"
                    className="bg-cinema-gold/20 text-cinema-gold border-cinema-gold/30"
                  >
                    {s.row}
                    {s.number} ({s.type})
                  </Badge>
                ))}
              </div>
            </div>

            <Separator className="bg-cinema-border" />

            {/* Pricing */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  Tickets ({selectedSeats.length})
                </span>
                <span className="text-foreground">
                  {formatRupee(totalPrice)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Service Fee</span>
                <span className="text-foreground">
                  {formatRupee(serviceFee)}
                </span>
              </div>
              <Separator className="bg-cinema-border" />
              <div className="flex justify-between text-lg font-bold">
                <span className="text-foreground">Total</span>
                <span className="text-cinema-gold">
                  {formatRupee(finalTotal)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Form */}
        <div className="space-y-6">
          <Card className="bg-gradient-card border-cinema-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <User className="h-5 w-5 text-cinema-gold" />
                Customer Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={customerInfo.name}
                  onChange={(e) =>
                    setCustomerInfo({ ...customerInfo, name: e.target.value })
                  }
                  placeholder="Your full name"
                  className="bg-cinema-card border-cinema-border text-foreground"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={customerInfo.email}
                  onChange={(e) =>
                    setCustomerInfo({ ...customerInfo, email: e.target.value })
                  }
                  placeholder="you@example.com"
                  className="bg-cinema-card border-cinema-border text-foreground"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={customerInfo.phone}
                  onChange={(e) =>
                    setCustomerInfo({ ...customerInfo, phone: e.target.value })
                  }
                  placeholder="10-digit phone"
                  className="bg-cinema-card border-cinema-border text-foreground"
                />
              </div>
            </CardContent>
          </Card>

          {/* Buttons */}
          <div className="flex gap-4 justify-end">
            <Button
              variant="outline"
              onClick={onBack}
              className="border-cinema-border hover:bg-cinema-purple/30 px-4"
            >
              Back to Seats
            </Button>
            <Button
              onClick={handleConfirmBooking}
              disabled={isProcessing}
              className="bg-gradient-primary hover:shadow-glow px-4"
            >
              {isProcessing
                ? "Processing…"
                : `Confirm Booking – ${formatRupee(finalTotal)}`}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
