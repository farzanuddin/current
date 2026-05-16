export const AUTH_KEY = import.meta.env.VITE_TMDB_AUTH_KEY || "";
export const URL_BASE = "https://api.themoviedb.org/3";
export const IMAGE_URL_BASE = "https://image.tmdb.org/t/p/original";

export const SIDEBAR_PRIMARY_LINKS = [
  { key: "home", label: "Home", icon: "home", active: true },
  { key: "favorites", label: "Favorites", icon: "heart" },
  { key: "comingsoon", label: "Coming soon", icon: "compass" },
  { key: "trending", label: "Trending", icon: "trending" },
  { key: "settings", label: "Settings", icon: "settings" },
  { key: "support", label: "Support", icon: "support" },
];

export const CATEGORY_PILLS = [
  { key: "trending", label: "Trending" },
  { key: "adventure", label: "Adventure" },
  { key: "action", label: "Action", active: true },
  { key: "comedy", label: "Comedy" },
  { key: "crime", label: "Crime" },
  { key: "drama", label: "Drama" },
  { key: "fantasy", label: "Fantasy" },
  { key: "horror", label: "Horror" },
];

export const DASHBOARD_SECTIONS = [
  {
    key: "actionMovies",
    title: "Action Movies",
    endpoint: "/discover/movie",
    params: { with_genres: "28", sort_by: "popularity.desc" },
  },
];

export const FEATURED_COLLECTION = {
  key: "featured",
  endpoint: "/trending/movie/week",
  badge: "Featured",
};

export const APP_COPY = {
  brand: "current",
  searchPlaceholder: "Search for movies, shows, and more...",
  searchHint: "Type at least 2 characters to search TMDB live.",
  searchEmpty: "No matching films found.",
  sidebarLibraryTitle: "Continue Watching",
  searchingStatus: "Searching TMDB...",
  drawerTitle: "Movie details",
  noSynopsis: "No synopsis available.",
  continueWatchingLabel: "Continue Watching",
  watchNowLabel: "Watch Now",
  searchAriaLabel: "Search movies",
  closeDetailsAria: "Close movie details",
  heroDefaultTitle: "Cinema, curated beautifully",
  errorLoadMovies: "Unable to load movies right now.",
  errorSearchUnavailable: "Search is unavailable right now.",
  errorLoadDetails: "Unable to load movie details.",
  appLogoAlt: "App logo",
  menuLabel: "Menu",
  detailsAction: "Watch Trailer",
  detailsFallback: "No trailer available",
  userDisplayName: "Farzan U.",
  userPlan: "Premium",
  userAvatarUrl: "https://github.com/farzanuddin.png",
};

export const SEARCH_MIN_CHARACTERS = 2;
