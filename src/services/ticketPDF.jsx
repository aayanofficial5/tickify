import { pdf } from "@react-pdf/renderer";
import { TicketPDF } from "../components/TicketPDF";

export const generateTicketPDF = async (booking) => {
  const blob = await pdf(<TicketPDF booking={booking} />).toBlob();

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `CinemaFlix-Ticket-${booking.movieTitle}.pdf`;
  a.click();
  URL.revokeObjectURL(url);
};

export const handlePreviewPDF = async (booking) => {
  const blob = await pdf(<TicketPDF booking={booking} />).toBlob();
  const url = URL.createObjectURL(blob);
  window.open(url, "_blank"); // opens in new tab for preview
};
