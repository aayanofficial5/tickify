const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: "Bearer " + import.meta.env.VITE_TMDB_API_TOKEN,
  },
};

export const fetchPopularMovies = async () => {
  try {
    const response = await fetch(
      "https://api.themoviedb.org/3/movie/popular?language=en-US&page=1",
      options
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const result = data.results.filter((movie)=>movie.original_language=="en").sort((a, b) => b.vote_average - a.vote_average);
    // console.log(result);
    return result;
  } catch (error) {
    console.error("Error fetching popular movies:", error);
    return null; // or []
  }
};

