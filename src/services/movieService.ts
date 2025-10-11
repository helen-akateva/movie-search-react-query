import axios from "axios";
import type { Movie } from "../types/movie";

const BASE_URL = "https://api.themoviedb.org";
axios.defaults.baseURL = BASE_URL;


interface MovieResponse {
    page: number,
  results: Movie[],
  total_pages: number,

}
export async function fetchMovies(query: string, page: number = 1): Promise<MovieResponse> {
  const response = await axios.get<MovieResponse>("/3/search/movie", {
      params: {
      query,
         page,
    },
    headers: {
      Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`,
    },
  });
  return response.data;
}
