import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Calendar,
  Clock,
  MapPin,
  Ticket,
  Star,
  Download,
  View,
} from "lucide-react";
import { toast } from "sonner";
import NavBar from "@/components/NavBar";
import { getAuth } from "firebase/auth";
import { db } from "@/firebase";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { generateTicketPDF, handlePreviewPDF } from "@/services/ticketPDF";
import {
  cancelBookingAndReleaseSeats,
  markBookingAsCompletedIfExpired,
} from "@/services/firebaseDatabase";

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [filterStatus, setFilterStatus] = useState("all");

  const auth = getAuth();
  const user = auth?.currentUser;

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    if (!user) return;

    try {
      const q = query(
        collection(db, "bookings"),
        where("userId", "==", user?.uid),
        orderBy("bookedAt", "desc")
      );

      const querySnapshot = await getDocs(q);
      const data = await Promise.all(
        querySnapshot.docs.map(async (docSnap) => {
          const booking = { id: docSnap.id, ...docSnap.data() };
          const updatedBooking = await markBookingAsCompletedIfExpired(booking);
          return updatedBooking || booking;
        })
      );
      setBookings(data);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
  };

  const filteredBookings =
    filterStatus === "all"
      ? bookings
      : bookings?.filter((booking) => booking?.status === filterStatus);

  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed":
        return "bg-cinema-gold/20 text-cinema-gold border-cinema-gold/30";
      case "completed":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "cancelled":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const handlePreview = async (booking) => {
    await handlePreviewPDF(booking);
  };

  const handleDownloadTicket = async (booking) => {
    try {
      await generateTicketPDF(booking);
      toast.success("Ticket Downloaded", {
        description: "Your ticket has been saved as a PDF.",
      });
    } catch (err) {
      toast.error("Download Failed", {
        description: err.message,
      });
    }
  };

  const handleCancelBooking = async (id) => {
    await cancelBookingAndReleaseSeats(id);
    fetchBookings();
  };

  const BookingCard = ({ booking }) => (
    <Card className="bg-gradient-card border-cinema-border hover:shadow-premium transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex gap-4">
          <img
            src={booking.poster}
            alt={booking.movieTitle}
            className="w-20 h-28 object-cover rounded border border-cinema-border"
          />
          <div className="flex-1 space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-bold text-foreground">
                  {booking.movieTitle}
                </h3>
                <p className="text-sm text-muted-foreground">
                  Payment ID: {booking.paymentId}
                </p>
              </div>
              <Badge className={getStatusColor(booking.status)}>
                {booking.status.charAt(0).toUpperCase() +
                  booking.status.slice(1)}
              </Badge>
            </div>

            <div className="grid md:grid-cols-2 gap-3 text-sm">
              <div className="space-y-2 text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {new Date(booking.date).toLocaleDateString("en-IN", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  {booking.time}
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  {booking.theater}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <div>
                  Seats:{" "}
                  {booking.seatDetails
                    ?.map((s) => `${s.row}${s.number} (${s.type})`)
                    .join(", ")}
                    </div>
                </div>
                <div className="text-lg font-bold text-cinema-gold">
                  Total: ₹{booking.totalAmount?.toFixed(2)}
                </div>
                <div className="text-xs text-muted-foreground">
                  Booked on{" "}
                  {new Date(booking.bookedAt?.toDate?.()).toLocaleDateString(
                    "en-IN"
                  )}
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              {booking.status === "confirmed" && (
                <>
                  <Button
                    size="sm"
                    onClick={() => handlePreview(booking)}
                    className="bg-gradient-primary text-cinema-dark hover:bg-cinema-gold/90"
                  >
                    <View className="h-4 w-4 mr-2" />
                    Preview Ticket
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleDownloadTicket(booking)}
                    className="bg-cinema-gold text-cinema-dark hover:bg-cinema-gold/90"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download Ticket
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleCancelBooking(booking.id)}
                    className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                  >
                    Cancel Booking
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-dark">
      <NavBar />
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            My Bookings
          </h1>
          <p className="text-lg text-muted-foreground">
            Manage your movie tickets and booking history
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gradient-card border-cinema-border">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-cinema-gold">
                {bookings.length}
              </div>
              <div className="text-sm text-muted-foreground">
                Total Bookings
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-card border-cinema-border">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-cinema-gold">
                {bookings.filter((b) => b.status === "confirmed").length}
              </div>
              <div className="text-sm text-muted-foreground">Upcoming</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-card border-cinema-border">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-cinema-gold">
                {bookings.filter((b) => b.status === "completed").length}
              </div>
              <div className="text-sm text-muted-foreground">Watched</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-card border-cinema-border">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-cinema-gold">
                ₹
                {bookings
                  .reduce((sum, b) => sum + (b.totalAmount || 0), 0)
                  .toFixed(0)}
              </div>
              <div className="text-sm text-muted-foreground">Total Spent</div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs
          value={filterStatus}
          onValueChange={setFilterStatus}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-4 bg-cinema-card border border-cinema-border">
            {["all", "confirmed", "completed", "cancelled"].map((status) => (
              <TabsTrigger
                key={status}
                value={status}
                className="data-[state=active]:bg-cinema-gold data-[state=active]:text-cinema-dark"
              >
                {status.charAt(0).toUpperCase() + status.slice(1)} (
                {status === "all"
                  ? bookings.length
                  : bookings.filter((b) => b.status === status).length}
                )
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value={filterStatus} className="space-y-4">
            {filteredBookings.length > 0 ? (
              filteredBookings.map((booking) => (
                <BookingCard key={booking.id} booking={booking} />
              ))
            ) : (
              <Card className="bg-gradient-card border-cinema-border">
                <CardContent className="p-12 text-center">
                  <Ticket className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    No {filterStatus !== "all" ? filterStatus : ""} bookings
                    found
                  </h3>
                  <p className="text-muted-foreground">
                    {filterStatus === "all"
                      ? "Start booking tickets to see them here!"
                      : `You don't have any ${filterStatus} bookings.`}
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
