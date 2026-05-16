# Current

A cinematic movie and TV discovery dashboard built with Vite and React. Search TMDB content, browse
featured movies, filter by media type, and open rich detail drawers with cast, metadata, trailers,
and continue-watching UI.

[https://farzanuddin.github.io/current](https://farzanuddin.github.io/current/)

![preview](./.github/assets/demo.png)

## Objective

The goal of this project was to build a polished streaming-dashboard interface while exploring a few
frontend concepts: a dark glassy UI with responsive card-mode layouts and live requests to the
**TMDB API**,

## Features

- **Live TMDB data** — fetches trending, discovery, search, details, credits, videos, and images
- **Movie details drawer** — opens a right-side panel with hero artwork, metadata, genres, overview,
  cast, and trailer actions
- **Responsive layout** — mobile hamburger navigation, sticky top search, and contained card mode on
  larger screens

## Tech Stack

| Technology                                                                   | Version | Role                       |
| ---------------------------------------------------------------------------- | :-----: | -------------------------- |
| [React](https://react.dev/)                                                  | ^18.2.0 | UI framework               |
| [Vite](https://vitejs.dev/)                                                  | ^5.0.8  | Build tool & dev server    |
| [Styled Components](https://styled-components.com/)                          | ^6.1.8  | Component-scoped styling   |
| [Axios](https://axios-http.com/)                                             | ^1.6.5  | TMDB API requests          |
| [Ant Design Icons](https://ant.design/components/icon/)                      | ^5.2.6  | Icon system                |
| [React Modern Drawer](https://github.com/Farzin-Firoozi/react-modern-drawer) | ^1.2.2  | Slide-out drawer UI        |
| [PropTypes](https://github.com/facebook/prop-types)                          | ^15.8.1 | Runtime prop type checking |
| [ESLint](https://eslint.org/)                                                | ^8.55.0 | Code linting               |

## TMDB API Note

This app uses a TMDB bearer token from `VITE_TMDB_AUTH_KEY`. Because this is a browser-only app, the
token is included in client-side requests and should not be treated as a private secret.

## Getting Started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create your local environment file:

   ```bash
   cp .env.example .env
   ```

   Open `.env` and replace `your_tmdb_bearer_token` with a TMDB API bearer token.

3. Start the dev server:

   ```bash
   npm run dev
   ```
