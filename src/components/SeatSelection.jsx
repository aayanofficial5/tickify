// ✅ FULLY UPDATED SEAT SELECTION COMPONENT WITH REDUX

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn, formatRupee } from "@/lib/utils";
import { db } from "@/firebase";
import {
  collection,
  doc,
  onSnapshot,
  updateDoc,
  getDoc,
  Timestamp,
} from "firebase/firestore";
import { useDispatch } from "react-redux";
import { setSelectedSeats } from "@/redux/slices/bookingSlice";
import { toast } from "sonner";

export const SeatSelection = ({
  onBack,
  onNext,
  moviePrice,
  showtimeId,
  userId,
}) => {
  const [seats, setSeats] = useState([]);
  const [currentSelectedSeats, setCurrentSelectedSeatss] = useState([]);
  const dispatch = useDispatch();
  // useEffect(()=>{
  //   dispatch(setSelectedSeats([]));
  // },[])
  useEffect(() => {
    const seatRef = collection(db, `showtimes/${showtimeId}/seats`);
    const unsub = onSnapshot(seatRef, async (snapshot) => {
      const seatData = await Promise.all(
        snapshot.docs.map(async (docSnap) => {
          const data = docSnap.data();
          const seatRef = docSnap.ref;

          // Auto-unblock expired seats
          if (
            data.status === "blocked" &&
            data.expiresAt?.toDate() < new Date()
          ) {
            await updateDoc(seatRef, {
              status: "available",
              blockedBy: null,
              expiresAt: null,
            });
            return { ...data, id: docSnap.id, status: "available" };
          }

          return { ...data, id: docSnap.id };
        })
      );

      setSeats(seatData);
    });

    return () => unsub();
  }, [showtimeId]);

  const handleSeatClick = (seat) => {
    if (seat.status !== "available") return;
    const isSelected = currentSelectedSeats.some((s) => s.id === seat.id);

    if (isSelected) {
      setCurrentSelectedSeatss(
        currentSelectedSeats.filter((s) => s.id !== seat.id)
      );
    } else {
      if (currentSelectedSeats.length >= 8)
        toast.error("Can not book more than 8 seats at a time!");
      else setCurrentSelectedSeatss([...currentSelectedSeats, seat]);
    }
  };

  const getSeatStyle = (seat) => {
    const isSelected = currentSelectedSeats.some((s) => s.id === seat.id);

    if (seat.status === "booked")
      return "bg-muted opacity-70 cursor-not-allowed";
    if (seat.status === "blocked")
      return "bg-muted opacity-50 cursor-not-allowed";
    if (isSelected) return "bg-cinema-gold text-cinema-dark border-cinema-gold";

    switch (seat.type) {
      case "vip":
        return "bg-cinema-purple/20 border-cinema-purple hover:bg-cinema-purple/40 text-cinema-purple/80";
      case "premium":
        return "bg-cinema-gold/10 border-cinema-gold hover:bg-cinema-gold/20 text-cinema-gold/80";
      default:
        return "bg-cinema-card border-foreground/60 hover:bg-muted text-foreground/70";
    }
  };

  const totalPrice = currentSelectedSeats?.reduce(
    (sum, seat) => sum + (seat?.price || 0),
    0
  );

  const handleNext = async () => {
    if (currentSelectedSeats.length === 0) return;

    try {
      const expiresAt = Timestamp.fromDate(new Date(Date.now() + 5 * 60000));
      onNext();
      for (const seat of currentSelectedSeats) {
        const seatRef = doc(db, `showtimes/${showtimeId}/seats/${seat.id}`);
        const seatSnap = await getDoc(seatRef);
        const data = seatSnap.data();

        if (data.status !== "available") {
          toast.error(`Seat ${seat.id} just got taken. Please reselect.`);
          return;
        }

        await updateDoc(seatRef, {
          status: "blocked",
          blockedBy: userId,
          expiresAt,
        });
      }
      dispatch(setSelectedSeats(currentSelectedSeats));
    } catch (error) {
      onBack();
      console.error("Seat blocking failed", error);
      toast.error("Something went wrong while blocking your seats.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="mx-auto w-2/4 h-2 bg-gradient-primary rounded-full mb-2" />
        <p className="text-muted-foreground text-sm">SCREEN</p>
      </div>

      <div className="flex flex-wrap justify-center gap-4 text-sm">
        <Legend
          color="bg-cinema-card"
          label={`Standard (${formatRupee(moviePrice)})`}
        />
        <Legend
          color="bg-cinema-gold/10"
          label={`Premium (${formatRupee(moviePrice * 1.5)})`}
        />
        <Legend
          color="bg-cinema-purple/20"
          label={`VIP (${formatRupee(moviePrice * 2)})`}
        />
        <Legend color="bg-muted" label="Booked / Blocked" />
        <Legend color="bg-cinema-gold" label="Selected" />
      </div>

      <Card className="bg-gradient-card border-cinema-border p-6">
        <div className="grid gap-3 lg:gap-4">
          {["A", "B", "C", "D", "E", "F", "G", "H"].map((row) => (
            <Row
              key={row}
              row={row}
              seats={seats}
              handleSeatClick={handleSeatClick}
              getSeatStyle={getSeatStyle}
            />
          ))}
        </div>
      </Card>

      {currentSelectedSeats?.length > 0 && (
        <Card className="bg-gradient-card border-cinema-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-foreground mb-2">
                  Selected Seats
                </h3>
                <div className="flex flex-wrap gap-2">
                  {currentSelectedSeats.map((seat) => (
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
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-2xl font-bold text-cinema-gold">
                  {formatRupee(totalPrice)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex justify-between pt-6">
        <Button
          variant="outline"
          className="border-cinema-border hover:bg-cinema-purple/30"
          onClick={onBack}
        >
          Back
        </Button>
        <Button
          onClick={handleNext}
          disabled={currentSelectedSeats?.length === 0}
          className={`bg-gradient-primary hover:shadow-glow px-4 ${
            currentSelectedSeats?.length === 0
              ? "cursor-not-allowed"
              : "cursor-pointer"
          }`}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

const Legend = ({ color, label }) => (
  <div className="flex items-center gap-2">
    <div className={`w-4 h-4 border rounded ${color}`} />
    <span>{label}</span>
  </div>
);

const Row = ({ row, seats, handleSeatClick, getSeatStyle }) => {
  const rowSeats = seats
    .filter((s) => s.row === row)
    .sort((a, b) => parseInt(a.number) - parseInt(b.number));

  return (
    <div className="flex justify-around items-center">
      <div className="w-6 text-center text-muted-foreground font-semibold">
        {row}
      </div>
      <div className="flex gap-4">
        <div className="flex gap-2">
          {rowSeats.slice(0, 6).map((seat) => (
            <button
              key={seat.id}
              onClick={() => handleSeatClick(seat)}
              className={cn(
                "w-6 h-6 lg:w-10 lg:h-10 rounded border-2 text-xs lg:text-lg font-medium transition-all hover:scale-105",
                getSeatStyle(seat)
              )}
              disabled={seat.status !== "available"}
            >
              {seat.number}
            </button>
          ))}
        </div>
        <div className="w-6" />
        <div className="flex gap-2">
          {rowSeats.slice(6).map((seat) => (
            <button
              key={seat.id}
              onClick={() => handleSeatClick(seat)}
              className={cn(
                "w-6 h-6 lg:w-10 lg:h-10 rounded border-2 text-xs lg:text-lg font-medium transition-all hover:scale-105",
                getSeatStyle(seat)
              )}
              disabled={seat.status !== "available"}
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
  );
};
