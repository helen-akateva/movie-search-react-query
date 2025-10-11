import axios from "axios";
import type { Movie } from "../types/movie";

const BASE_URL = "https://api.themoviedb.org";
axios.defaults.baseURL = BASE_URL;


interface MovieResponse {
    page: number,
    results: Movie[],

}
export async function fetchMovies(query: string): Promise<MovieResponse> {
  const response = await axios.get<MovieResponse>("/3/search/movie", {
      params: {
          query,
    },
    headers: {
      Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`,
    },
  });
  return response.data;
}
