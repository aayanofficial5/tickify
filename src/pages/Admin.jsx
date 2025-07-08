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
  arrayUnion,
} from "firebase/firestore";
import { ensureSeatsExist } from "@/services/ensureSeatExistService";
import NavBar from "@/components/NavBar";
import { toast } from "sonner";
import { fetchPopularMovies } from "@/services/movieFetchingService";
import { IMG_URL } from "@/utils/constants";

export const Admin = () => {
  const [tmdbMovies, setTmdbMovies] = useState([]);
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [newShowPrice, setNewShowPrice] = useState(100);
  const [newShowDateTime, setNewShowDateTime] = useState("");
  const [newShowDateTimes, setNewShowDateTimes] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
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
      snap.forEach((doc) => movieList.push({ id: doc.id, ...doc.data() }));
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

  const handleAddMovieWithShowtime = async (movie) => {
    if (!movie || newShowDateTimes.length === 0 || !newShowPrice) {
      toast.error("Please select at least one date-time and a price.");
      return;
    }

    const existingMovie = movies.find((m) => m.title === movie.title);

    if (existingMovie) {
      const newTimes = newShowDateTimes.filter(
        (dt) => !existingMovie.showtimes.includes(dt)
      );
      if (newTimes.length === 0) {
        toast.error("All selected showtimes already exist.");
        return;
      }
      setIsAdding(true);
      const movieDoc = doc(db, "movies", existingMovie.id);
      await updateDoc(movieDoc, {
        showtimes: arrayUnion(...newTimes),
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
            ? { ...m, showtimes: [...m.showtimes, ...newTimes] }
            : m
        )
      );
      toast.success("Showtimes added to existing movie");
    } else {
      setIsAdding(true);
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
        price: parseInt(newShowPrice) || 100,
      };

      const movieRef = await addDoc(collection(db, "movies"), newMovie);

      for (const dt of newShowDateTimes) {
        await ensureSeatsExist(`${movieRef.id}_${dt}`, parseInt(newShowPrice));
      }

      setMovies([...movies, { id: movieRef.id, ...newMovie }]);
      toast.success("New movie added with showtimes");
      setIsAdding(false);
    }

    setNewShowDateTimes([]);
    setNewShowDateTime("");
    setNewShowPrice(100);
    setSelectedMovie(null);
  };

  return (
    <div className="min-h-screen bg-gradient-dark">
      <NavBar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-6">
          Admin Dashboard
        </h1>

        <h2 className="text-2xl text-white font-semibold mb-4">
          Now Playing Movies
        </h2>
        <div className="flex overflow-x-auto gap-4 pb-4">
          {tmdbMovies.map((movie) => (
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
                onClick={() => setSelectedMovie(movie)}
              >
                Add Show
              </Button>
            </div>
          ))}
        </div>

        {selectedMovie && (
          <div className="mt-6 p-6 bg-gradient-card rounded-lg border border-cinema-border w-fit">
            <h3 className="text-lg font-semibold text-white mb-2">
              {selectedMovie.title} - Add Showtimes
            </h3>
            <label htmlFor="price" className="text-sm">
              Show Price
            </label>
            <Input
              type="number"
              placeholder="Enter show price"
              value={newShowPrice}
              onChange={(e) => setNewShowPrice(e.target.value)}
              className="mb-2 text-foreground bg-cinema-dark border-cinema-border"
              id="price"
            />
            <label htmlFor="dateandtime" className="text-sm ">
              Select Date-Time
            </label>
            <div className="flex gap-2 mb-2">
              <Input
                className="bg-cinema-dark text-white file:text-white [&::-webkit-calendar-picker-indicator]:invert border-cinema-border"
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
              onClick={() => handleAddMovieWithShowtime(selectedMovie)}
            >
              {isAdding ? "Adding Show..." : "Add Show"}
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
