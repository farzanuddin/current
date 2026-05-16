import axios from "axios";
import { AUTH_KEY, IMAGE_URL_BASE, URL_BASE } from "./constants";

const cache = {};
const pendingRequests = {};

const buildEndpoint = (endpoint, params = {}) => {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") {
      return;
    }

    searchParams.set(key, String(value));
  });

  return `${endpoint}${searchParams.size ? `?${searchParams.toString()}` : ""}`;
};

const getDataFromAPI = async (endpoint, params = {}) => {
  try {
    if (!AUTH_KEY) {
      throw new Error("Missing VITE_TMDB_AUTH_KEY environment variable.");
    }

    const fullEndpoint = buildEndpoint(endpoint, params);

    if (cache[fullEndpoint]) {
      return cache[fullEndpoint];
    }

    if (pendingRequests[fullEndpoint]) {
      return await pendingRequests[fullEndpoint];
    }

    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${AUTH_KEY}`,
      },
    };

    const constructedUrl = URL_BASE + fullEndpoint;

    pendingRequests[fullEndpoint] = axios.get(constructedUrl, options);
    const response = await pendingRequests[fullEndpoint];

    if (response.status !== 200) {
      throw new Error(`Failed to fetch data. Status: ${response.status}`);
    }

    cache[fullEndpoint] = response.data;
    return response.data;
  } finally {
    delete pendingRequests[buildEndpoint(endpoint, params)];
  }
};

const getGenreMap = async (mediaType = "movie") => {
  const genreResponse = await getDataFromAPI(`/genre/${mediaType}/list`);

  return new Map(genreResponse?.genres?.map((genre) => [genre.id, genre.name]));
};

export const getMoviesWithGenres = async (endpoint, options = {}, mediaType = "movie") => {
  const response = await getDataFromAPI(endpoint, options);

  if (!response || !response.results) {
    throw new Error("Invalid response format");
  }

  const genreMap = await getGenreMap(mediaType);
  const moviesWithGenres = response?.results?.map((movie) => ({
    ...movie,
    genres: movie?.genre_ids?.map((genreId) => ({
      id: genreId,
      name: genreMap.get(genreId),
    })),
  }));

  return { ...response, results: moviesWithGenres };
};

const searchMovies = async (query) => {
  const sanitizedQuery = query?.trim();

  if (!sanitizedQuery) {
    return [];
  }

  const response = await getMoviesWithGenres("/search/movie", {
    query: sanitizedQuery,
    include_adult: false,
  });

  return response?.results?.filter((movie) => movie.poster_path || movie.backdrop_path) || [];
};

const normalizeSearchResult = (item, mediaType) => ({
  ...item,
  media_type: mediaType,
  title: item.title || item.name,
  release_date: item.release_date || item.first_air_date,
});

export const searchContent = async (query, mediaFilter = "Movies") => {
  const sanitizedQuery = query?.trim();

  if (!sanitizedQuery) {
    return [];
  }

  if (mediaFilter === "Shows") {
    const response = await getMoviesWithGenres(
      "/search/tv",
      {
        query: sanitizedQuery,
        include_adult: false,
      },
      "tv"
    );

    return (
      response?.results
        ?.filter((show) => show.poster_path || show.backdrop_path)
        ?.map((show) => normalizeSearchResult(show, "tv")) || []
    );
  }

  if (mediaFilter === "Anime") {
    const [movieResponse, tvResponse] = await Promise.all([
      getMoviesWithGenres(
        "/search/movie",
        {
          query: sanitizedQuery,
          include_adult: false,
        },
        "movie"
      ),
      getMoviesWithGenres(
        "/search/tv",
        {
          query: sanitizedQuery,
          include_adult: false,
        },
        "tv"
      ),
    ]);

    return [
      ...(movieResponse?.results || []).map((movie) => normalizeSearchResult(movie, "movie")),
      ...(tvResponse?.results || []).map((show) => normalizeSearchResult(show, "tv")),
    ].filter(
      (item) =>
        (item.poster_path || item.backdrop_path) &&
        (item.genre_ids?.includes(16) || item.origin_country?.includes("JP"))
    );
  }

  return (await searchMovies(sanitizedQuery)).map((movie) => normalizeSearchResult(movie, "movie"));
};

export const getContentDetails = async (item) => {
  if (!item?.id) {
    return null;
  }

  const mediaType = item.media_type === "tv" ? "tv" : "movie";
  const response = await getDataFromAPI(`/${mediaType}/${item.id}`, {
    append_to_response: "credits,videos",
  });

  const runtime = mediaType === "tv" ? response?.episode_run_time?.[0] : response?.runtime;
  const trailer =
    response?.videos?.results?.find(
      (video) => video.site === "YouTube" && video.type === "Trailer"
    ) || null;

  return {
    ...response,
    media_type: mediaType,
    title: response?.title || response?.name,
    release_date: response?.release_date || response?.first_air_date,
    runtime,
    genres: response?.genres || [],
    cast: response?.credits?.cast?.slice(0, 6) || [],
    trailer,
  };
};

export const getMovieDetails = async (movieId) =>
  getContentDetails({ id: movieId, media_type: "movie" });

export const getImageUrl = (path) => {
  if (!path) {
    return "";
  }

  return `${IMAGE_URL_BASE}${path}`;
};
