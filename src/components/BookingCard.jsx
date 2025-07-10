import { generateTicketPDF, handlePreviewPDF } from "@/services/ticketPDF";
import { toast } from "sonner";
import { Calendar, Clock, MapPin, Download, View } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const BookingCard = ({ booking, setCancelOpen }) => {
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

  return (
    <Card className="bg-gradient-card border-cinema-border hover:shadow-premium transition-all duration-300">
      <CardContent className="p-4 sm:p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <img
            src={booking?.poster}
            alt={booking?.movieTitle}
            className="w-24 h-32 object-cover rounded border border-cinema-border mx-auto md:mx-0"
          />

          <div className="flex-1 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-foreground">
                  {booking?.movieTitle}
                </h3>
                <p className="text-sm text-muted-foreground">
                  Payment ID: {booking?.paymentId}
                </p>
              </div>
              <Badge className={`${getStatusColor(booking?.status)} w-fit`}>
                {booking?.status.charAt(0).toUpperCase() +
                  booking?.status.slice(1)}
              </Badge>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 text-sm">
              <div className="space-y-2 text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {new Date(booking?.date).toLocaleDateString("en-IN", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  {booking?.time}
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  {booking?.theater}
                </div>
              </div>

              <div className="space-y-2 text-muted-foreground">
                <div className="flex flex-wrap gap-1 text-xs md:text-sm">
                  Seats:
                  {booking?.seatDetails?.map((s, i) => (
                    <span key={i} className="ml-1">
                      {s.row}
                      {s.number} ({s.type})
                      {i !== booking?.seatDetails?.length - 1 ? "," : ""}
                    </span>
                  ))}
                </div>
                <div className="text-base md:text-lg font-bold text-cinema-gold">
                  Total: ₹{booking?.totalAmount?.toFixed(2)}
                </div>
                <div className="text-xs">
                  Booked on{" "}
                  {new Date(booking?.bookedAt?.toDate?.()).toLocaleDateString(
                    "en-IN"
                  )}
                </div>
              </div>
            </div>

            {booking?.status === "confirmed" && (
              <div className="flex flex-wrap gap-2 pt-2">
                <Button
                  size="sm"
                  onClick={() => handlePreview(booking)}
                  className="bg-gradient-primary text-cinema-dark hover:bg-cinema-gold/90"
                >
                  <View className="h-4 w-4 mr-2" />
                  Preview
                </Button>
                <Button
                  size="sm"
                  onClick={() => handleDownloadTicket(booking)}
                  className="bg-cinema-gold text-cinema-dark hover:bg-cinema-gold/90"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setCancelOpen(booking?.id)}
                  className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                >
                  Cancel
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

