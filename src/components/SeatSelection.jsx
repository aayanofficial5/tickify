import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";


export const SeatSelection = ({ onSeatSelect, moviePrice }) => {
  const [selectedSeats, setSelectedSeats] = useState([]);

  // Generate sample theater layout
  const generateSeats = ()=> {
    const seats = [];
    const rows = ["A", "B", "C", "D", "E", "F", "G", "H"];
    const seatsPerRow = 12;
    
    rows.forEach((row, rowIndex) => {
      for (let seatNum = 1; seatNum <= seatsPerRow; seatNum++) {
        const seatType = rowIndex < 2 ? "vip" : rowIndex < 5 ? "premium" : "standard";
        const isOccupied = Math.random() < 0.3; // 30% occupied
        
        seats.push({
          id: `${row}${seatNum}`,
          row,
          number: seatNum,
          type: seatType,
          isOccupied,
          price: seatType === "vip" ? moviePrice * 2 : seatType === "premium" ? moviePrice * 1.5 : moviePrice
        });
      }
    });
    
    return seats;
  };

  const [seats] = useState(generateSeats());

  const handleSeatClick = (seat) => {
    if (seat.isOccupied) return;

    const isSelected = selectedSeats.some(s => s.id === seat.id);
    let newSelectedSeats=[];

    if (isSelected) {
      newSelectedSeats = selectedSeats.filter(s => s.id !== seat.id);
    } else {
      if (selectedSeats.length >= 8) return; // Max 8 seats
      newSelectedSeats = [...selectedSeats, seat];
    }

    setSelectedSeats(newSelectedSeats);
    onSeatSelect(newSelectedSeats);
  };

  const getSeatStyle = (seat) => {
    const isSelected = selectedSeats.some(s => s.id === seat.id);
    
    if (seat.isOccupied) {
      return "bg-muted cursor-not-allowed opacity-50";
    }
    
    if (isSelected) {
      return "bg-cinema-gold text-cinema-dark border-cinema-gold";
    }
    
    switch (seat.type) {
      case "vip":
        return "bg-cinema-purple/20 border-cinema-purple hover:bg-cinema-purple/40 text-cinema-purple";
      case "premium":
        return "bg-accent/20 border-accent hover:bg-accent/40 text-accent";
      default:
        return "bg-cinema-card border-cinema-border hover:bg-muted text-foreground";
    }
  };

  const totalPrice = selectedSeats.reduce((sum, seat) => sum + seat.price, 0);

  return (
    <div className="space-y-6">
      {/* Screen */}
      <div className="text-center">
        <div className="mx-auto w-2/4 h-2 bg-gradient-primary rounded-full mb-2"></div>
        <p className="text-muted-foreground text-sm">SCREEN</p>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-cinema-card border border-cinema-border rounded"></div>
          <span>Standard (${moviePrice})</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-accent/20 border border-accent rounded"></div>
          <span>Premium (${(moviePrice * 1.5).toFixed(2)})</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-cinema-purple/20 border border-cinema-purple rounded"></div>
          <span>VIP (${(moviePrice * 2).toFixed(2)})</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-muted rounded"></div>
          <span>Occupied</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-cinema-gold rounded"></div>
          <span>Selected</span>
        </div>
      </div>

      {/* Seat Map */}
      <Card className="bg-gradient-card border-cinema-border p-6">
        <div className="grid gap-3 lg:gap-4">
          {["A", "B", "C", "D", "E", "F", "G", "H"].map(row => (
            <div key={row} className="flex justify-around items-center">
              <div className="w-6 text-center text-muted-foreground font-semibold">
                {row}
              </div>
              <div className="flex gap-2 md:gap-4 lg:gap-15">
              <div className="flex gap-1 lg:gap-3">
                {seats
                  .filter(seat => seat.row === row)
                  .slice(0, 6)
                  .map(seat => (
                    <button
                      key={seat.id}
                      onClick={() => handleSeatClick(seat)}
                      className={cn(
                        "w-5 lg:w-10 h-5 lg:h-10 rounded border-2 text-[10px] lg:text-lg font-medium transition-all duration-200 hover:scale-105",
                        getSeatStyle(seat)
                      )}
                      disabled={seat.isOccupied}
                    >
                      {seat.number}
                    </button>
                  ))}
              </div>
              
              {/* Aisle */}
              <div className="w-6 lg:w-8"></div>
              
              <div className="flex gap-1 lg:gap-3">
                {seats
                  .filter(seat => seat.row === row)
                  .slice(6, 12)
                  .map(seat => (
                    <button
                      key={seat.id}
                      onClick={() => handleSeatClick(seat)}
                      className={cn(
                        "w-5 lg:w-10 h-5 lg:h-10 rounded border-2 text-[10px] lg:text-lg font-medium transition-all duration-200 hover:scale-105",
                        getSeatStyle(seat)
                      )}
                      disabled={seat.isOccupied}
                    >
                      {seat.number}
                    </button>
                  ))}
              </div>
              </div>
              <div className="w-6 text-center text-muted-foreground font-semibold">
                {row}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Selected Seats Summary */}
      {selectedSeats.length > 0 && (
        <Card className="bg-gradient-card border-cinema-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-foreground mb-2">Selected Seats</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedSeats.map(seat => (
                    <Badge
                      key={seat.id}
                      variant="secondary"
                      className="bg-cinema-gold/20 text-cinema-gold border-cinema-gold/30"
                    >
                      {seat.row}{seat.number} ({seat.type})
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-2xl font-bold text-cinema-gold">${totalPrice.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};