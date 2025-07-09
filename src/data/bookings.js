
export const sampleBookings=[
  {
    id: "BK001",
    movieId: "1",
    movieTitle: "Quantum Nexus",
    moviePoster: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=400&h=600&fit=crop",
    date: "2024-07-08",
    showtime: "8:30 PM",
    seats: [
      { id: "F7", row: "F", number: 7, type: "premium" },
      { id: "F8", row: "F", number: 8, type: "premium" }
    ],
    totalPrice: 50.97,
    status: "confirmed",
    theater: "CinemaFlix Downtown",
    bookingDate: "2024-07-04",
    confirmationCode: "CF2024070801"
  },
  {
    id: "BK002",
    movieId: "5",
    movieTitle: "Galaxy Warriors",
    moviePoster: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=600&fit=crop",
    date: "2024-07-02",
    showtime: "5:30 PM",
    seats: [
      { id: "A5", row: "A", number: 5, type: "vip" },
      { id: "A6", row: "A", number: 6, type: "vip" }
    ],
    totalPrice: 73.97,
    status: "completed",
    theater: "CinemaFlix Downtown",
    bookingDate: "2024-06-28",
    confirmationCode: "CF2024062801"
  },
  {
    id: "BK003",
    movieId: "3",
    movieTitle: "Enchanted Realms",
    moviePoster: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=600&fit=crop",
    date: "2024-07-12",
    showtime: "2:00 PM",
    seats: [
      { id: "D3", row: "D", number: 3, type: "standard" },
      { id: "D4", row: "D", number: 4, type: "standard" },
      { id: "D5", row: "D", number: 5, type: "standard" }
    ],
    totalPrice: 53.96,
    status: "confirmed",
    theater: "CinemaFlix Mall",
    bookingDate: "2024-07-03",
    confirmationCode: "CF2024070302"
  },
  {
    id: "BK004",
    movieId: "2",
    movieTitle: "Midnight Heist",
    moviePoster: "https://images.unsplash.com/photo-1489599894726-140b4f93b3fb?w=400&h=600&fit=crop",
    date: "2024-06-25",
    showtime: "11:00 PM",
    seats: [
      { id: "G9", row: "G", number: 9, type: "standard" }
    ],
    totalPrice: 17.98,
    status: "cancelled",
    theater: "CinemaFlix Downtown",
    bookingDate: "2024-06-20",
    confirmationCode: "CF2024062001"
  }
];