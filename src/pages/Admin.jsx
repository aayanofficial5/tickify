import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/firebase";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";

import NavBar from "@/components/Common/NavBar";
import { toast } from "sonner";
import { fetchPopularMovies } from "@/services/tmdbService";
import { IMG_URL } from "@/utils/constants";
import { ensureSeatsExist } from "../services/firebaseDatabase";

export const Admin = () => {
  const [tmdbMovies, setTmdbMovies] = useState([]);
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [newShowPrice, setNewShowPrice] = useState();
  const [newShowDateTime, setNewShowDateTime] = useState("");
  const [newShowDateTimes, setNewShowDateTimes] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchTMDB = async () => {
      try {
        const data = await fetchPopularMovies();
        if (data) setTmdbMovies(data.slice(0, 10));
      } catch (error) {
        console.error("TMDB Error:", error);
      }
    };

    const fetchMovies = async () => {
      const snap = await getDocs(collection(db, "movies"));
      const movieList = [];
      snap.forEach((doc) => movieList.push({ ...doc.data(), id: doc.id }));
      setMovies(movieList);
    };

    fetchTMDB();
    fetchMovies();
  }, []);

  const handleAddDateTime = () => {
    if (!newShowDateTime) return;
    if (newShowDateTimes.includes(newShowDateTime)) {
      toast.error("This date-time is already added.");
      return;
    }
    setNewShowDateTimes([...newShowDateTimes, newShowDateTime]);
    setNewShowDateTime("");
  };

  const handleRemoveDateTime = (dt) => {
    setNewShowDateTimes(newShowDateTimes.filter((item) => item !== dt));
  };

  const handleAddOrEditMovie = async (movie) => {
    if (!movie || newShowDateTimes.length === 0 || !newShowPrice) {
      toast.error("Please select at least one date-time and a price.");
      return;
    }

    const existingMovie = movies.find((m) => m.title === movie.title);
    setIsAdding(true);

    if (existingMovie) {
      const movieDoc = doc(db, "movies", existingMovie.id);
      const existingShowtimes = Array.isArray(existingMovie.showtimes)
        ? existingMovie.showtimes
        : [];

      const newTimes = newShowDateTimes.filter(
        (dt) => !existingShowtimes.includes(dt)
      );

      await updateDoc(movieDoc, {
        showtimes: newShowDateTimes,
        price: parseInt(newShowPrice),
      });

      for (const dt of newTimes) {
        await ensureSeatsExist(
          `${existingMovie.id}_${dt}`,
          parseInt(newShowPrice)
        );
      }

      setMovies(
        movies.map((m) =>
          m.id === existingMovie.id
            ? {
                ...m,
                showtimes: [...newShowDateTimes],
                price: parseInt(newShowPrice),
              }
            : m
        )
      );
      toast.success("Showtimes updated for existing movie");
    } else {
      const newMovie = {
        id: movie.id,
        title: movie.title,
        original_title: movie.original_title,
        overview: movie.overview,
        genre_ids: movie.genre_ids,
        vote_average: movie.vote_average,
        vote_count: movie.vote_count,
        popularity: movie.popularity,
        release_date: movie.release_date,
        poster_path: movie.poster_path,
        backdrop_path: movie.backdrop_path,
        original_language: movie.original_language,
        adult: movie.adult,
        video: movie.video,
        showtimes: newShowDateTimes,
        price: parseInt(newShowPrice),
      };

      const movieRef = await addDoc(collection(db, "movies"), newMovie);

      for (const dt of newShowDateTimes) {
        await ensureSeatsExist(`${movieRef.id}_${dt}`, parseInt(newShowPrice));
      }

      setMovies([...movies, { id: movieRef.id, ...newMovie }]);
      toast.success("New movie added with showtimes");
    }

    setIsAdding(false);
    setSelectedMovie(null);
    setNewShowDateTimes([]);
    setNewShowDateTime("");
  };

  return (
    <div className="min-h-screen bg-gradient-dark">
      <NavBar />
      <div className="container mx-auto px-7 md:px-4 py-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-6">
          Admin Dashboard
        </h1>

        <h2 className="lg:text-lg sm:text-xl md:text-2xl text-white font-semibold mb-4">
          Now Playing Movies
        </h2>
        <div className="flex overflow-x-auto gap-4 pb-4">
          {tmdbMovies.map((movie) => {
            const existing = movies.find((m) => m.title === movie.title);
            return (
              <div key={movie.id} className="w-40 flex-shrink-0 text-white">
                <img
                  src={`${IMG_URL}${movie.poster_path}`}
                  className="rounded-md mb-2"
                  alt={movie.title}
                />
                <p className="font-semibold text-sm truncate">{movie.title}</p>
                <p className="text-xs text-muted-foreground">
                  {movie.release_date}
                </p>
                <p className="text-xs text-pink-400">
                  ⭐ {movie.vote_average.toFixed(1)} | {movie.vote_count} Votes
                </p>
                <Button
                  size="sm"
                  className="mt-2 w-full bg-gradient-primary"
                  onClick={() => {
                    setSelectedMovie(movie);
                    if (existing) {
                      setNewShowPrice(existing.price);
                      setNewShowDateTimes(existing.showtimes || []);
                      setIsEditing(true);
                    } else {
                      setNewShowDateTimes([]);
                      setIsEditing(false);
                    }
                  }}
                >
                  {existing ? "Edit Show" : "Add Show"}
                </Button>
              </div>
            );
          })}
        </div>

        {selectedMovie && (
          <div className="mt-6 p-6 bg-gradient-card rounded-lg border border-cinema-border md:w-fit">
            <h3 className="text-lg font-semibold text-white mb-2">
              {selectedMovie.title} -{" "}
              {isEditing ? "Edit Showtimes" : "Add Showtimes"}
            </h3>
            <label htmlFor="price" className="text-sm">
              Show Price
            </label>
            <Input
              type="number"
              placeholder="Enter show price"
              value={newShowPrice}
              onChange={(e) => setNewShowPrice(e.target.value)}
              className="mb-2 text-foreground bg-cinema-dark border-cinema-border text-sm md:text-base"
              id="price"
            />
            <label htmlFor="dateandtime" className="text-sm">
              Select Date-Time
            </label>
            <div className="flex flex-row gap-2 mb-2">
              <Input
                className="text-xs !px-2 md:text-base bg-cinema-dark text-white file:text-white [&::-webkit-calendar-picker-indicator]:invert border-cinema-border"
                type="datetime-local"
                value={newShowDateTime}
                onChange={(e) => setNewShowDateTime(e.target.value)}
                id="dateandtime"
              />
              <Button
                className="bg-gradient-primary"
                onClick={handleAddDateTime}
              >
                Add Time
              </Button>
            </div>

            {newShowDateTimes.length > 0 && (
              <div className="mb-4">
                <p className="text-white font-semibold mb-1">
                  Selected Date-Time
                </p>
                {newShowDateTimes.map((dt) => {
                  const [date, time] = dt.split("T");
                  return (
                    <div key={dt} className="flex items-center gap-2 mb-1">
                      <span className="text-white">{date}</span>
                      <span className="text-white bg-white/10 px-2 py-1 rounded">
                        {time}
                      </span>
                      <Button
                        size="icon"
                        variant="destructive"
                        className="h-6 w-6"
                        onClick={() => handleRemoveDateTime(dt)}
                      >
                        ✘
                      </Button>
                    </div>
                  );
                })}
              </div>
            )}

            <Button
              disabled={isAdding}
              className="bg-gradient-primary"
              onClick={() => handleAddOrEditMovie(selectedMovie)}
            >
              {isAdding
                ? isEditing
                  ? "Updating..."
                  : "Adding Show..."
                : isEditing
                ? "Update Show"
                : "Add Show"}
            </Button>
            <Button
              variant="outline"
              className="ml-2 border-cinema-border"
              onClick={() => {
                setSelectedMovie(null);
                setNewShowDateTimes([]);
                setNewShowDateTime("");
              }}
            >
              Cancel
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
