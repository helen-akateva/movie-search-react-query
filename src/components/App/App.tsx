import { useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import ReactPaginate from "react-paginate";
import SearchBar from "../SearchBar/SearchBar";
import MovieGrid from "../MovieGrid/MovieGrid";
import MovieModal from "../MovieModal/MovieModal";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import { fetchMovies } from "../../services/movieService";
import type { Movie } from "../../types/movie";
import css from "./App.module.css";

export default function App() {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["movies", query, page],
    queryFn: () => fetchMovies(query, page),
    enabled: query !== "",
  });

  const handleSubmit = (searchQuery: string) => {
    setQuery(searchQuery);
    setPage(1);
  };

  const handleSelect = (movie: Movie) => {
    setSelectedMovie(movie);
  };

  const handleCloseModal = () => {
    setSelectedMovie(null);
  };

  const validMovies =
    data?.results.filter((movie) => movie.poster_path && movie.backdrop_path) ||
    [];

  const showNoResults = query && !isLoading && validMovies.length === 0;

  if (showNoResults) {
    toast.error("No movies found for your request.");
  }

  return (
    <div className={css.app}>
      <SearchBar onSubmit={handleSubmit} />
      <Toaster />

      {isLoading && <Loader />}
      {isError && <ErrorMessage />}
      {!isLoading && !isError && validMovies.length > 0 && (
        <>
          {" "}
          {data && data.total_pages > 1 && (
            <ReactPaginate
              pageCount={data.total_pages}
              pageRangeDisplayed={5}
              marginPagesDisplayed={1}
              onPageChange={({ selected }) => setPage(selected + 1)}
              forcePage={page - 1}
              containerClassName={css.pagination}
              activeClassName={css.active}
              nextLabel="→"
              previousLabel="←"
            />
          )}
          <MovieGrid movies={validMovies} onSelect={handleSelect} />
        </>
      )}

      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={handleCloseModal} />
      )}
    </div>
  );
}
