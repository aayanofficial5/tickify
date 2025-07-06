// export interface Movie {
//   id: string;
//   title: string;
//   description: string;
//   genre: string[];
//   duration: number; // in minutes
//   rating: number; // out of 10
//   poster: string;
//   releaseDate: string;
//   language: string;
//   cast: string[];
//   director: string;
//   showtimes: string[];
//   price: number;
// }

import show1 from "../assets/matrix.jpg";
import show2 from "../assets/inception.jpg";
import show3 from "../assets/avengers.jpg";
import show4 from "../assets/interstellar.jpg";
import show5 from "../assets/johnwick.jpg";
import show6 from "../assets/matrix.jpg";
import show7 from "../assets/inception.jpg";
import show8 from "../assets/avengers.jpg";
import show9 from "../assets/interstellar.jpg";
import show10 from "../assets/johnwick.jpg";

export const sampleMovies = [
  {
    id: "1",
    title: "The Matrix Reloaded",
    description:
      "Neo, Trinity, and Morpheus continue their fight against the machines, as they uncover deeper secrets within the Matrix and face new challenges that test their beliefs and destiny.",
    genre: ["Sci-Fi", "Action"],
    duration: 138,
    rating: 7.2,
    poster: show1,
    releaseDate: "2003-05-15",
    language: "English",
    cast: [
      "Keanu Reeves",
      "Carrie-Anne Moss",
      "Laurence Fishburne",
      "Hugo Weaving",
    ],
    director: "Lana Wachowski, Lilly Wachowski",
    showtimes: ["12:00 PM", "3:30 PM", "6:00 PM", "9:30 PM"],
    price: 12.99,
  },
  {
    id: "2",
    title: "Inception",
    description:
      "A skilled thief, Dom Cobb, is given the chance to have his criminal history erased if he can successfully plant an idea into a target's subconscious through shared dreaming.",
    genre: ["Sci-Fi", "Thriller", "Action"],
    duration: 148,
    rating: 8.8,
    poster: show2,
    releaseDate: "2010-07-16",
    language: "English",
    cast: [
      "Leonardo DiCaprio",
      "Joseph Gordon-Levitt",
      "Elliot Page",
      "Tom Hardy",
    ],
    director: "Christopher Nolan",
    showtimes: ["2:00 PM", "5:00 PM", "8:00 PM", "11:00 PM"],
    price: 14.99,
  },
  {
    id: "3",
    title: "Avengers: Endgame",
    description:
      "After the devastating events of Infinity War, the Avengers assemble once more to undo the damage caused by Thanos and restore balance to the universe.",
    genre: ["Action", "Sci-Fi", "Adventure"],
    duration: 181,
    rating: 8.4,
    poster: show3,
    releaseDate: "2019-04-26",
    language: "English",
    cast: [
      "Robert Downey Jr.",
      "Chris Evans",
      "Scarlett Johansson",
      "Chris Hemsworth",
    ],
    director: "Anthony Russo, Joe Russo",
    showtimes: ["1:00 PM", "4:30 PM", "8:00 PM", "11:30 PM"],
    price: 16.99,
  },
  {
    id: "4",
    title: "Interstellar",
    description:
      "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival on a distant habitable planet.",
    genre: ["Sci-Fi", "Adventure", "Drama"],
    duration: 169,
    rating: 8.6,
    poster: show4,
    releaseDate: "2014-11-07",
    language: "English",
    cast: [
      "Matthew McConaughey",
      "Anne Hathaway",
      "Jessica Chastain",
      "Michael Caine",
    ],
    director: "Christopher Nolan",
    showtimes: ["11:00 AM", "2:30 PM", "6:00 PM", "9:30 PM"],
    price: 15.99,
  },
  {
    id: "5",
    title: "John Wick 4",
    description:
      "John Wick uncovers a path to defeating the High Table, but before he can earn his freedom, he must face a new enemy with powerful alliances across the globe.",
    genre: ["Action", "Thriller", "Crime"],
    duration: 169,
    rating: 7.9,
    poster: show5,
    releaseDate: "2023-03-24",
    language: "English",
    cast: [
      "Keanu Reeves",
      "Donnie Yen",
      "Laurence Fishburne",
      "Bill Skarsgård",
    ],
    director: "Chad Stahelski",
    showtimes: ["12:30 PM", "4:00 PM", "7:30 PM", "10:45 PM"],
    price: 14.49,
  },
  {
    id: "6",
    title: "Dune: Part Two",
    description:
      "Paul Atreides unites with the Fremen to wage war against House Harkonnen and fulfill his destiny on the desert planet Arrakis.",
    genre: ["Sci-Fi", "Adventure", "Drama"],
    duration: 165,
    rating: 8.5,
    poster: show6,
    releaseDate: "2024-03-01",
    language: "English",
    cast: ["Timothée Chalamet", "Zendaya", "Rebecca Ferguson", "Javier Bardem"],
    director: "Denis Villeneuve",
    showtimes: ["10:00 AM", "1:45 PM", "5:15 PM", "9:00 PM"],
    price: 17.49,
  },
  {
    id: "7",
    title: "The Batman",
    description:
      "In his second year of fighting crime, Batman uncovers corruption in Gotham City that connects to his own family while facing the serial killer known as the Riddler.",
    genre: ["Action", "Crime", "Drama"],
    duration: 176,
    rating: 7.8,
    poster: show7,
    releaseDate: "2022-03-04",
    language: "English",
    cast: ["Robert Pattinson", "Zoë Kravitz", "Jeffrey Wright", "Paul Dano"],
    director: "Matt Reeves",
    showtimes: ["11:30 AM", "3:00 PM", "6:30 PM", "10:00 PM"],
    price: 15.49,
  },
  {
    id: "8",
    title: "Top Gun: Maverick",
    description:
      "After more than thirty years of service, Maverick is still pushing the envelope as a top naval aviator but must confront ghosts of his past when training a new generation of pilots.",
    genre: ["Action", "Drama"],
    duration: 131,
    rating: 8.3,
    poster: show8,
    releaseDate: "2022-05-27",
    language: "English",
    cast: ["Tom Cruise", "Miles Teller", "Jennifer Connelly", "Jon Hamm"],
    director: "Joseph Kosinski",
    showtimes: ["10:30 AM", "2:00 PM", "5:30 PM", "9:00 PM"],
    price: 14.99,
  },
  {
    id: "9",
    title: "Oppenheimer",
    description:
      "The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb during World War II.",
    genre: ["Drama", "Biography", "History"],
    duration: 180,
    rating: 8.6,
    poster: show9,
    releaseDate: "2023-07-21",
    language: "English",
    cast: ["Cillian Murphy", "Emily Blunt", "Matt Damon", "Robert Downey Jr."],
    director: "Christopher Nolan",
    showtimes: ["11:00 AM", "2:30 PM", "6:00 PM", "9:30 PM"],
    price: 17.99,
  },
  {
    id: "10",
    title: "Mission: Impossible – Dead Reckoning Part One",
    description:
      "Ethan Hunt and his IMF team embark on their most dangerous mission yet: tracking down a terrifying new weapon that threatens humanity.",
    genre: ["Action", "Thriller"],
    duration: 163,
    rating: 7.7,
    poster: show10,
    releaseDate: "2023-07-12",
    language: "English",
    cast: ["Tom Cruise", "Hayley Atwell", "Ving Rhames", "Simon Pegg"],
    director: "Christopher McQuarrie",
    showtimes: ["12:00 PM", "3:30 PM", "7:00 PM", "10:30 PM"],
    price: 16.49,
  },
];
