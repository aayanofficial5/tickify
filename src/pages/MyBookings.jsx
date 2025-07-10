import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Ticket, X } from "lucide-react";
import { toast } from "sonner";
import NavBar from "@/components/Common/NavBar";
import { db } from "@/firebase";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import {
  cancelBookingAndReleaseSeats,
  markBookingAsCompletedIfExpired,
} from "@/services/firebaseDatabase";
import { useSelector } from "react-redux";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { BookingCard } from "@/components/Core/MyBookings/BookingCard";
import Loader from '@/components/Common/Loader';

export default function MyBookings() {
  const [bookings, setBookings] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const { user } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    if (!user) return;

    try {
      const q = query(
        collection(db, "bookings"),
        where("userId", "==", user?.id),
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

  const handleCancelBooking = async () => {
    try {
      setLoading(true);
      await cancelBookingAndReleaseSeats(cancelOpen);
      fetchBookings();
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setLoading(false);
      setCancelOpen(null);
    }
  };

  if (!bookings) {
    return (
      <div className="min-h-screen">
        <NavBar />
        <Loader
          fullscreen="true"
          label1="Loading Bookings..."
          label2="Go Back"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-dark">
      <NavBar />
      <div className="container mx-auto px-8 sm:px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl md:text-4xl font-bold text-foreground mb-4">
            My Bookings
          </h1>
          <p className="md:text-lg text-muted-foreground">
            Manage your movie tickets and booking history
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gradient-card border-cinema-border">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-cinema-gold">
                {bookings?.length}
              </div>
              <div className="text-sm text-muted-foreground">
                Total Bookings
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-card border-cinema-border">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-cinema-gold">
                {bookings?.filter((b) => b.status === "confirmed").length}
              </div>
              <div className="text-sm text-muted-foreground">Upcoming</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-card border-cinema-border">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-cinema-gold">
                {bookings?.filter((b) => b.status === "completed").length}
              </div>
              <div className="text-sm text-muted-foreground">Watched</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-card border-cinema-border">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-cinema-gold">
                ₹
                {bookings
                  ?.reduce((sum, b) => sum + (b.totalAmount || 0), 0)
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
                className="data-[state=active]:bg-cinema-gold data-[state=active]:text-cinema-dark text-[10px] md:text-sm"
              >
                {status.charAt(0).toUpperCase() + status.slice(1)} (
                {status === "all"
                  ? bookings?.length
                  : bookings?.filter((b) => b.status === status).length}
                )
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value={filterStatus} className="space-y-4">
            {filteredBookings?.length > 0 ? (
              filteredBookings?.map((booking) => (
                <BookingCard
                  key={booking.id}
                  booking={booking}
                  setCancelOpen={setCancelOpen}
                />
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
      <AlertDialog open={cancelOpen} onOpenChange={setCancelOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Booking?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will permanently cancel your booking and release the
              resevered seats.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              className="bg-gray-700 hover:bg-gray-800 cursor-pointer"
              disabled={loading}
            >
              Close
            </AlertDialogCancel>
            <AlertDialogCancel
              className="absolute top-1 right-1 hover:bg-red-500"
              disabled={loading}
            >
              <X />
            </AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={loading}
              className="hover:opacity-60 cursor-pointer"
              onClick={handleCancelBooking}
            >
              {loading ? "Cancelling…" : "Cancel Booking"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
