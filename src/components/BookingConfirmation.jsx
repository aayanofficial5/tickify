import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  CreditCard,
  Mail,
  User,
  Phone,
  Calendar,
  Clock,
  MapPin,
  Ticket,
} from "lucide-react";
import { toast } from "sonner";

export const BookingConfirmation = ({
  movie,
  selectedSeats,
  selectedShowtime,
  onConfirm,
  onBack,
}) => {
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [isProcessing, setIsProcessing] = useState(false);

  const totalPrice = selectedSeats.reduce((sum, seat) => sum + seat.price, 0);
  const serviceFee = 2.99;
  const finalTotal = totalPrice + serviceFee;

  const handleConfirmBooking = async () => {
    if (!customerInfo.name || !customerInfo.email) {
      toast.error("Missing Information", {
        description: "Please fill in all required fields.",
      });
      return;
    }

    setIsProcessing(true);

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000));

    toast("Booking Confirmed! 🎉", {
      description: `Your tickets for ${movie.title} have been booked successfully!`,
      icon: "🎫",
      duration: 4000,
    });
    setIsProcessing(false);
    onConfirm();
  };

  return (
    <div className="space-y-6">
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Booking Summary */}
        <Card className="bg-gradient-card border-cinema-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Ticket className="h-5 w-5 text-cinema-gold" />
              Booking Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Movie Info */}
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
                    {new Date().toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    {selectedShowtime}
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    CinemaFlix Downtown
                  </div>
                </div>
              </div>
            </div>

            <Separator className="bg-cinema-border" />

            {/* Selected Seats */}
            <div>
              <h4 className="font-semibold mb-2 text-foreground">
                Selected Seats
              </h4>
              <div className="flex flex-wrap gap-2">
                {selectedSeats.map((seat) => (
                  <Badge
                    key={seat.id}
                    variant="secondary"
                    className="bg-cinema-gold/20 text-cinema-gold border-cinema-gold/30"
                  >
                    {seat.row}
                    {seat.number} ({seat.type})
                  </Badge>
                ))}
              </div>
            </div>

            <Separator className="bg-cinema-border" />

            {/* Price Breakdown */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  Tickets ({selectedSeats.length}x)
                </span>
                <span className="text-foreground">
                  ${totalPrice.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Service Fee</span>
                <span className="text-foreground">
                  ${serviceFee.toFixed(2)}
                </span>
              </div>
              <Separator className="bg-cinema-border" />
              <div className="flex justify-between text-lg font-bold">
                <span className="text-foreground">Total</span>
                <span className="text-cinema-gold">
                  ${finalTotal.toFixed(2)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Customer Information */}
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
                  className="bg-cinema-card border-cinema-border text-foreground"
                  placeholder="Enter your full name"
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
                  className="bg-cinema-card border-cinema-border text-foreground"
                  placeholder="Enter your email"
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
                  className="bg-cinema-card border-cinema-border text-foreground"
                  placeholder="Enter your phone number"
                />
              </div>
            </CardContent>
          </Card>
          {/* Action Buttons */}
          <div className="flex gap-4 justify-end">
            <Button
              variant="outline"
              onClick={onBack}
              className="border-cinema-border hover:bg-cinema-card"
            >
              Back to Seats
            </Button>
            <Button
              onClick={handleConfirmBooking}
              disabled={isProcessing}
              className="bg-gradient-primary hover:shadow-glow transition-all duration-300 px-8"
            >
              {isProcessing
                ? "Processing..."
                : `Confirm Booking - $${finalTotal.toFixed(2)}`}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
