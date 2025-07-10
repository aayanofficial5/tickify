import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image, // ✅ Add this
} from "@react-pdf/renderer";
import { formatTo12Hour } from "@/utils/formatter";
import logo from "@/assets/logo.png";

const styles = StyleSheet.create({
  page: {
    backgroundColor: "#111827",
    color: "#F9FAFB",
    padding: 32,
    fontSize: 12,
    fontFamily: "Times-Roman",
  },
  logo: {
    position: "absolute",
    bottom: 40,
    height: 28,
    width: 90,
    alignSelf: "center",
  },
  heading: {
    fontSize: 20,
    textAlign: "center",
    marginBottom: 24,
    color: "#FBBF24",
    fontWeight: "bold",
    textDecoration: "underline",
  },
  section: {
    marginBottom: 12,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
    borderBottom: "0.5px solid #1F2937",
    paddingBottom: 4,
  },
  column: {
    flexDirection: "column",
    gap: 2,
  },
  label: {
    color: "#D1D5DB",
    fontWeight: "bold",
  },
  value: {
    color: "#F9FAFB",
  },
  footer: {
    position: "absolute",
    bottom: 10,
    left: 0,
    width: "100vw",
    textAlign: "center",
    fontSize: 10,
    color: "#939aa9",
    borderTop: "0.5px solid #3c4653",
    paddingTop: 10,
    marginBottom: 5,
  },
});

export const TicketPDF = ({ booking }) => (
  <Document>
    <Page
      size={booking.seatDetails.length < 5 ? "A6" : "A5"}
      style={styles.page}
    >
      <Text style={styles.heading}>Movie Ticket</Text>

      <View style={styles.section}>
        <View style={styles.row}>
          <Text style={styles.label}>Movie</Text>
          <Text style={styles.value}>{booking.movieTitle}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Theater</Text>
          <Text style={styles.value}>{booking.theater}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Date</Text>
          <Text style={styles.value}>{booking.date}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Time</Text>
          <Text style={styles.value}>{formatTo12Hour(booking.time)}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Seats</Text>
          <View style={styles.column}>
            {booking.seatDetails?.map((s, i) => (
              <Text key={i} style={styles.value}>
                {s.row}
                {s.number} ({s.type})
              </Text>
            ))}
          </View>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Total</Text>
          <Text style={styles.value}>Rs. {booking.totalAmount}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Status</Text>
          <Text style={styles.value}>{booking.status}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Payment ID</Text>
          <Text style={styles.value}>{booking.paymentId || "N/A"}</Text>
        </View>
      </View>

      {/* ✅ Logo Image */}
      <Image style={styles.logo} src={logo} />
      <Text style={styles.footer}>
        Thank you for booking with Tickify. Enjoy your show!
      </Text>
    </Page>
  </Document>
);
