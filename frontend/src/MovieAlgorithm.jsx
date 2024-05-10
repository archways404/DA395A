/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */

import { useEffect, useState } from "react";

function MovieAlgorithm({ genres }) {
  const [movies, setMovies] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("Loading.");
  const [error, setError] = useState("");
  const [updatedGenres, setUpdatedGenres] = useState(genres);

  useEffect(() => {
    fetchMovies(updatedGenres);
  }, [updatedGenres]);

  useEffect(() => {
    let dots = 1;
    const interval = setInterval(() => {
      if (loading) {
        dots = (dots % 3) + 1;
        setLoadingMessage(`Loading${".".repeat(dots)}`);
      }
    }, 300);
    return () => clearInterval(interval);
  }, [loading]);

  const fetchMovies = (genres) => {
    if (!loading && movies.length - currentIndex > 5) {
      return;
    }
    setLoading(true);
    fetch("http://localhost:3000/MovieAlgorithm", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(genres),
    })
      .then((response) => {
        if (!response.ok) throw new Error("Network response was not ok");
        return response.json();
      })
      .then((data) => {
        setMovies((prev) => [...prev, ...data]);
      })
      .catch((error) => {
        console.error("Error:", error);
        setError("An error occurred, please try again later.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleSelectMovie = (selectedMovie) => {
    const newGenres = updatedGenres.map((genre) => ({
      ...genre,
      count: selectedMovie.genre_ids.includes(genre.id)
        ? genre.count + 1
        : genre.count,
    }));
    setUpdatedGenres(newGenres);
    localStorage.setItem("movieGenres", JSON.stringify(newGenres));
    moveToNextPair();
  };

  const moveToNextPair = () => {
    const nextIndex = currentIndex + 2;
    setCurrentIndex(nextIndex);
    if (nextIndex >= movies.length - 5) {
      fetchMovies(updatedGenres);
    }
  };

  if (loading) {
    return (
      <div className="container loadingtext mx-auto px-4 text-center">
        <h2>{loadingMessage}</h2>
      </div>
    );
  }

  const currentPair = movies.slice(currentIndex, currentIndex + 2);

  return (
    <>
      <div className="container mx-auto px-4">
        {error ? (
          <p>{error}</p>
        ) : (
          <>
            <div className="titlecard">
              <h1 className="text-center text-2xl my-4">
                Continue selecting your favorite movie(s)
              </h1>
              <h2 className="text-center text-1xl my-4">
                The more movies you give our Algorithm, the better the
                recommendations will be!
              </h2>
            </div>

            <div className="flex justify-between items-start mb-4 moviebox">
              {currentPair.map((movie, index) => (
                <div key={movie.id} className="w-1/2 px-2">
                  <p className="text-center text-lg my-2 movietext">
                    {movie.title}
                  </p>
                  <img
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.title}
                    className="w-1/2 h-auto mx-auto imgborder"
                  />

                  <div className="text-center">
                    <button
                      onClick={() => handleSelectMovie(movie)}
                      className="button text-white py-2 px-4 neon-text"
                    >
                      Select
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center mb-4">
              <button
                onClick={moveToNextPair}
                className="button text-white py-2 px-4 skip"
              >
                Skip
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default MovieAlgorithm;
