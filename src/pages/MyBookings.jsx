// import { useEffect, useState } from "react";
// import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
// import { db } from "../firebase";
// import { getAuth } from "firebase/auth";

// const MyBookings = () => {
//   const [bookings, setBookings] = useState([]);
//   const auth = getAuth();
//   const user = auth.currentUser;
//   // console.log(user);
//   useEffect(() => {
//     const fetchBookings = async () => {
//       if (!user) return;

//       try {
//         const q = query(
//           collection(db, "bookings"),
//           where("userId", "==", user.uid),
//           orderBy("timestamp", "desc")
//         );

//         const querySnapshot = await getDocs(q);
//         const data = querySnapshot.docs.map((doc) => ({
//           id: doc.id,
//           ...doc.data(),
//         }));
//         setBookings(data);
//       } catch (error) {
//         console.error("Error fetching bookings:", error);
//       }
//     };

//     fetchBookings();
//   }, []);

//   return (
//     <div className="p-6 min-h-screen bg-gray-100">
//       <h2 className="text-2xl font-bold mb-4">🎟️ My Bookings</h2>

//       {bookings.length === 0 ? (
//         <p className="text-gray-700">No bookings found.</p>
//       ) : (
//         <div className="grid gap-4">
//           {bookings.map((booking) => (
//             <div key={booking.id} className="bg-white shadow rounded p-4">
//               <p>
//                 <strong>🎬 Show:</strong> {booking.showTitle}
//               </p>
//               <p>
//                 <strong>🪑 Seats:</strong> {booking.seats.join(", ")}
//               </p>
//               <p>
//                 <strong>💵 Amount:</strong> ₹{booking.amount}
//               </p>
//               <p>
//                 <strong>🧾 Payment ID:</strong> {booking.paymentId}
//               </p>
//               <p>
//                 <strong>🕒 Time:</strong>{" "}
//                 {booking.timestamp?.toDate().toLocaleString()}
//               </p>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default MyBookings;

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, MapPin, Ticket, Star, Download } from "lucide-react";
import { toast } from "sonner"; // or your toast provider
import { sampleBookings } from "@/data/bookings"; // your data source
import NavBar from "@/components/NavBar";

export default function MyBookings() {
  const [bookings] = useState(sampleBookings);
  const [filterStatus, setFilterStatus] = useState("all");

  const filteredBookings =
    filterStatus === "all"
      ? bookings
      : bookings.filter((booking) => booking.status === filterStatus);

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

  const handleDownloadTicket = (booking) => {
    toast("Downloading Ticket", {
      description: `Ticket for ${booking.movieTitle} is being downloaded.`,
    });
  };

  const handleCancelBooking = () => {
    toast.error("Booking Cancelled", {
      description: "Your booking has been cancelled successfully.",
    });
  };

  const BookingCard = ({ booking }) => (
    <Card className="bg-gradient-card border-cinema-border hover:shadow-premium transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex gap-4">
          <img
            src={booking.moviePoster}
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
                  Confirmation: {booking.confirmationCode}
                </p>
              </div>
              <Badge className={getStatusColor(booking.status)}>
                {booking.status.charAt(0).toUpperCase() +
                  booking.status.slice(1)}
              </Badge>
            </div>

            <div className="grid md:grid-cols-2 gap-3 text-sm">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  {new Date(booking.date).toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  {booking.showtime}
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  {booking.theater}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Ticket className="h-4 w-4" />
                  Seats:{" "}
                  {booking.seats
                    .map((seat) => `${seat.row}${seat.number}`)
                    .join(", ")}
                </div>
                <div className="text-lg font-bold text-cinema-gold">
                  Total: ${booking.totalPrice.toFixed(2)}
                </div>
                <div className="text-xs text-muted-foreground">
                  Booked on {new Date(booking.bookingDate).toLocaleDateString()}
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              {booking.status === "confirmed" && (
                <>
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

              {booking.status === "completed" && (
                <Button
                  size="sm"
                  variant="outline"
                  className="border-cinema-border hover:bg-cinema-card"
                >
                  <Star className="h-4 w-4 mr-2" />
                  Rate Movie
                </Button>
              )}

              {booking.status === "cancelled" && (
                <Button
                  size="sm"
                  disabled
                  variant="outline"
                  className="opacity-50 cursor-not-allowed"
                >
                  Cancelled
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-dark">
      <NavBar/>
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            My Bookings
          </h1>
          <p className="text-lg text-muted-foreground">
            Manage your movie tickets and booking history
          </p>
        </div>

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
                ${bookings.reduce((sum, b) => sum + b.totalPrice, 0).toFixed(0)}
              </div>
              <div className="text-sm text-muted-foreground">Total Spent</div>
            </CardContent>
          </Card>
        </div>

        <Tabs
          value={filterStatus}
          onValueChange={(value) => setFilterStatus(value)}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-4 bg-cinema-card border border-cinema-border">
            <TabsTrigger
              value="all"
              className="data-[state=active]:bg-cinema-gold data-[state=active]:text-cinema-dark"
            >
              All ({bookings.length})
            </TabsTrigger>
            <TabsTrigger
              value="confirmed"
              className="data-[state=active]:bg-cinema-gold data-[state=active]:text-cinema-dark"
            >
              Upcoming (
              {bookings.filter((b) => b.status === "confirmed").length})
            </TabsTrigger>
            <TabsTrigger
              value="completed"
              className="data-[state=active]:bg-cinema-gold data-[state=active]:text-cinema-dark"
            >
              Completed (
              {bookings.filter((b) => b.status === "completed").length})
            </TabsTrigger>
            <TabsTrigger
              value="cancelled"
              className="data-[state=active]:bg-cinema-gold data-[state=active]:text-cinema-dark"
            >
              Cancelled (
              {bookings.filter((b) => b.status === "cancelled").length})
            </TabsTrigger>
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
