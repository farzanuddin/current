import { startTransition, useDeferredValue, useEffect, useState, useRef } from "react";
import styled, { ThemeProvider } from "styled-components";
import { LoadingOutlined, WarningOutlined, RightOutlined, LeftOutlined } from "@ant-design/icons";
import { getContentDetails, getImageUrl, getMovieDetails, getMoviesWithGenres, searchContent } from "./api";
import {
  APP_COPY,
  CATEGORY_PILLS,
  DASHBOARD_SECTIONS,
  FEATURED_COLLECTION,
  SEARCH_MIN_CHARACTERS,
  SIDEBAR_PRIMARY_LINKS,
} from "./constants";
import {
  DashboardSidebar,
  HeroBanner,
  MediaShelf,
  MovieDetailsDrawer,
  SearchResultsPanel,
  TopBar,
} from "./components";
import { GlobalStyles } from "./styles/Global.styled";
import { theme } from "./styles/theme";
import Drawer from "react-modern-drawer";
import "react-modern-drawer/dist/index.css";

const CARD_MODE_MIN_WIDTH = 1534;
const CARD_MODE_MIN_HEIGHT = 864;

const getZoomScale = () => {
  if (typeof window === "undefined") return 1;

  return window.outerWidth && window.innerWidth ? window.outerWidth / window.innerWidth : 1;
};

const shouldUseCardMode = () => {
  if (typeof window === "undefined") return false;

  const hasRoomForCard =
    window.innerWidth >= CARD_MODE_MIN_WIDTH && window.innerHeight >= CARD_MODE_MIN_HEIGHT;

  return window.innerWidth > 1100 && (hasRoomForCard || getZoomScale() < 0.98);
};

const App = () => {
  const [heroMovies, setHeroMovies] = useState([]);
  const [activeHeroIndex, setActiveHeroIndex] = useState(0);
  const [shelves, setShelves] = useState([]);
  const [status, setStatus] = useState({ loading: true, error: "" });
  const [searchValue, setSearchValue] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedSearchMedia, setSelectedSearchMedia] = useState("Movies");
  const deferredSearchValue = useDeferredValue(searchValue);
  const [searchState, setSearchState] = useState({ loading: false, error: "", results: [] });
  const [drawerState, setDrawerState] = useState({
    isOpen: false,
    isLoading: false,
    error: "",
    movie: null,
  });
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isCardMode, setIsCardMode] = useState(shouldUseCardMode);
  const [activeCategory, setActiveCategory] = useState("Action");
  const genreFilterRef = useRef(null);
  const [drawerSize, setDrawerSize] = useState(() =>
    typeof window !== "undefined" && window.innerWidth <= 1100 ? "100vw" : "min(86%, 34rem)"
  );

  useEffect(() => {
    const onResize = () => {
      setDrawerSize(window.innerWidth <= 1100 ? "100vw" : "min(86%, 34rem)");
      setIsCardMode(shouldUseCardMode());
    };

    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const bodyOverflowRef = useRef(null);
  const topAreaRef = useRef(null);
  const searchRequestRef = useRef(0);

  useEffect(() => {
    if (typeof document === "undefined") return;

    const shouldLock = isMobileSidebarOpen || drawerState.isOpen;

    if (shouldLock) {
      if (bodyOverflowRef.current === null) {
        bodyOverflowRef.current = document.body.style.overflow;
      }
      document.body.style.overflow = "hidden";
    } else {
      if (bodyOverflowRef.current !== null) {
        document.body.style.overflow = bodyOverflowRef.current;
        bodyOverflowRef.current = null;
      } else {
        document.body.style.overflow = "";
      }
    }
  }, [isMobileSidebarOpen, drawerState.isOpen]);

  useEffect(() => {
    const onPointerDown = (event) => {
      if (!topAreaRef.current?.contains(event.target)) {
        setIsSearchOpen(false);
      }
    };

    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, []);

  useEffect(() => {
    let isMounted = true;

    const loadDashboard = async () => {
      try {
        setStatus({ loading: true, error: "" });

        const [featuredResponse, ...sectionResponses] = await Promise.all([
          getMoviesWithGenres(FEATURED_COLLECTION.endpoint),
          ...DASHBOARD_SECTIONS.map((section) =>
            getMoviesWithGenres(section.endpoint, section.params || {})
          ),
        ]);

        if (!isMounted) {
          return;
        }

        const spotlight =
          featuredResponse?.results?.find((movie) => movie.backdrop_path) ||
          featuredResponse?.results?.[0] ||
          null;
        const heroCandidates =
          featuredResponse?.results
            ?.filter((movie) => movie.backdrop_path || movie.poster_path)
            ?.slice(0, 3) || [];
        const detailedHeroMovies = await Promise.all(
          heroCandidates.map(async (movie) => {
            const details = await getMovieDetails(movie.id);
            return details ? { ...movie, ...details } : movie;
          })
        );

        const mappedShelves = DASHBOARD_SECTIONS.map((section, index) => {
          const limit = 10;

          return {
            ...section,
            items:
              sectionResponses[index]?.results
                ?.filter((movie) => movie.backdrop_path || movie.poster_path)
                ?.slice(0, limit) || [],
          };
        });

        setHeroMovies(
          detailedHeroMovies.length ? detailedHeroMovies : spotlight ? [spotlight] : []
        );
        setActiveHeroIndex(0);
        setShelves(mappedShelves);
        setStatus({ loading: false, error: "" });
      } catch (error) {
        if (!isMounted) {
          return;
        }

        setStatus({
          loading: false,
          error: error.message || APP_COPY.errorLoadMovies,
        });
      }
    };

    loadDashboard();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isCancelled = false;
    const trimmedQuery = deferredSearchValue.trim();

    if (!trimmedQuery) {
      setSearchState({ loading: false, error: "", results: [] });
      return;
    }

    if (trimmedQuery.length < SEARCH_MIN_CHARACTERS) {
      setSearchState({ loading: false, error: "", results: [] });
      return;
    }

    const timeoutId = window.setTimeout(() => {
      const requestId = searchRequestRef.current + 1;
      searchRequestRef.current = requestId;

      (async () => {
        try {
          setSearchState((currentState) => ({ ...currentState, loading: true, error: "" }));
          const results = await searchContent(trimmedQuery, selectedSearchMedia);
          if (isCancelled || requestId !== searchRequestRef.current) return;
          startTransition(() => {
            setSearchState({
              loading: false,
              error: "",
              results: results.slice(0, 5),
            });
          });
        } catch (error) {
          if (isCancelled || requestId !== searchRequestRef.current) return;
          setSearchState({
            loading: false,
            error: error.message || APP_COPY.errorSearchUnavailable,
            results: [],
          });
        }
      })();
    }, 280);

    return () => {
      isCancelled = true;
      window.clearTimeout(timeoutId);
    };
  }, [deferredSearchValue, selectedSearchMedia]);

  const handleOpenMovieDetails = async (movie) => {
    if (!movie?.id) {
      return;
    }

    setSearchValue("");

    setDrawerState({
      isOpen: true,
      isLoading: true,
      error: "",
      movie,
    });

    try {
      const detailedMovie = await getContentDetails(movie);

      setDrawerState({
        isOpen: true,
        isLoading: false,
        error: "",
        movie: detailedMovie || movie,
      });
    } catch (error) {
      setDrawerState({
        isOpen: true,
        isLoading: false,
        error: error.message || APP_COPY.errorLoadDetails,
        movie,
      });
    }
  };

  const handleCloseDrawer = () => {
    setDrawerState((currentState) => ({
      ...currentState,
      isOpen: false,
    }));
  };

  const scrollGenreFilters = (direction) => {
    genreFilterRef.current?.scrollBy({
      left: direction === "left" ? -240 : 240,
      behavior: "smooth",
    });
  };

  const activeHeroMovie = heroMovies[activeHeroIndex] || null;
  const heroPreviewMovies =
    heroMovies.length > 1
      ? [
          heroMovies[(activeHeroIndex + 1) % heroMovies.length],
          heroMovies[(activeHeroIndex + 2) % heroMovies.length],
        ]
          .filter(Boolean)
          .filter((movie) => movie.id !== activeHeroMovie?.id)
          .filter((movie, index, movies) => movies.findIndex((item) => item.id === movie.id) === index)
      : [];

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <PageWrapper $isCardMode={isCardMode}>
        <AppContainer $isCardMode={isCardMode}>
          <DashboardShell>
            <SidebarColumn>
              <DashboardSidebar primaryLinks={SIDEBAR_PRIMARY_LINKS} />
            </SidebarColumn>
            <MainPanel>
              <TopArea ref={topAreaRef}>
                <TopBar
                  placeholder={APP_COPY.searchPlaceholder}
                  searchValue={searchValue}
                  selectedMedia={selectedSearchMedia}
                  onMediaChange={(media) => {
                    setSelectedSearchMedia(media);
                    setIsSearchOpen(Boolean(searchValue.trim()));
                  }}
                  onSearchChange={(value) => {
                    setSearchValue(value);
                    setIsSearchOpen(Boolean(value.trim()));
                  }}
                  onSearchFocus={() => setIsSearchOpen(Boolean(searchValue.trim()))}
                  onToggleSidebar={() => setIsMobileSidebarOpen((s) => !s)}
                />
                <SearchOverlay>
                  {isSearchOpen ? (
                    <SearchResultsPanel
                      query={searchValue}
                      minCharacters={SEARCH_MIN_CHARACTERS}
                      isLoading={searchState.loading}
                      results={searchState.results}
                      error={searchState.error}
                      emptyText={APP_COPY.searchEmpty}
                      hint={APP_COPY.searchHint}
                      onSelectMovie={handleOpenMovieDetails}
                    />
                  ) : null}
                </SearchOverlay>
              </TopArea>

              {status.loading ? (
                <StateCard>
                  <LoadingOutlined />
                  <div>
                    <StateTitle>Loading your movie dashboard</StateTitle>
                    <StateText>Fetching trending releases and curated rows from TMDB.</StateText>
                  </div>
                </StateCard>
              ) : null}

              {!status.loading && status.error ? (
                <StateCard>
                  <WarningOutlined />
                  <div>
                    <StateTitle>Couldn&apos;t load the catalog</StateTitle>
                    <StateText>{status.error}</StateText>
                  </div>
                </StateCard>
              ) : null}

              {!status.loading && !status.error ? (
                <ContentStack>
                  <HeroStage>
                    <HeroBanner
                      key={activeHeroMovie?.id || "hero"}
                      movie={activeHeroMovie}
                      onOpenDetails={handleOpenMovieDetails}
                    />
                    {heroPreviewMovies.map((movie, index) => (
                      <StackedPreview
                        key={movie.id}
                        type="button"
                        $tone={index === 0 ? "gold" : "cool"}
                        $imageUrl={getImageUrl(movie.backdrop_path || movie.poster_path)}
                        aria-label={`Show ${movie.title}`}
                        onClick={() =>
                          setActiveHeroIndex((activeHeroIndex + index + 1) % heroMovies.length)
                        }
                      />
                    ))}
                    <CarouselDots aria-label="Featured movies">
                      {heroMovies.map((movie, index) => (
                        <CarouselDot
                          key={movie.id}
                          type="button"
                          $active={activeHeroIndex === index}
                          aria-label={`Show ${movie.title}`}
                          aria-current={activeHeroIndex === index ? "true" : undefined}
                          onClick={() => setActiveHeroIndex(index)}
                        />
                      ))}
                    </CarouselDots>
                  </HeroStage>

                  <GenreFilterBar ref={genreFilterRef}>
                    {CATEGORY_PILLS.map((pill) => (
                      <GenrePill
                        key={pill.key}
                        $active={activeCategory === pill.label}
                        onClick={() => setActiveCategory(pill.label)}
                      >
                        {pill.label}
                      </GenrePill>
                    ))}
                    <GenreNavGroup>
                      <GenreNavArrow
                        type="button"
                        aria-label="Previous category"
                        onClick={() => scrollGenreFilters("left")}
                      >
                        <LeftOutlined />
                      </GenreNavArrow>
                      <GenreNavArrow
                        type="button"
                        aria-label="Next category"
                        onClick={() => scrollGenreFilters("right")}
                      >
                        <RightOutlined />
                      </GenreNavArrow>
                    </GenreNavGroup>
                  </GenreFilterBar>

                  {shelves.map((section) => (
                    <MediaShelf
                      key={section.key}
                      sectionKey={section.key}
                      title={section.title}
                      items={section.items}
                      onSelectMovie={handleOpenMovieDetails}
                    />
                  ))}
                </ContentStack>
              ) : null}
            </MainPanel>
          </DashboardShell>
          <Drawer
            open={isMobileSidebarOpen}
            onClose={() => setIsMobileSidebarOpen(false)}
            direction="left"
            size={drawerSize}
            className="mobile-sidebar-drawer"
          >
            <DashboardSidebar
              primaryLinks={SIDEBAR_PRIMARY_LINKS}
              onNavigate={() => setIsMobileSidebarOpen(false)}
              onClose={() => setIsMobileSidebarOpen(false)}
            />
          </Drawer>
          <MovieDetailsDrawer
            isOpen={drawerState.isOpen}
            onClose={handleCloseDrawer}
            movie={drawerState.movie}
            isLoading={drawerState.isLoading}
            error={drawerState.error}
            primaryAction={APP_COPY.detailsAction}
            fallbackAction={APP_COPY.detailsFallback}
          />
        </AppContainer>
      </PageWrapper>
    </ThemeProvider>
  );
};

const PageWrapper = styled.div`
  width: 100%;
  min-height: 100vh;
  display: flex;
  align-items: ${({ $isCardMode }) => ($isCardMode ? "center" : "stretch")};
  justify-content: ${({ $isCardMode }) => ($isCardMode ? "center" : "stretch")};
  box-sizing: border-box;
  padding: ${({ $isCardMode }) => ($isCardMode ? "2rem" : "0")};
  overflow: auto;
  background: ${({ theme }) => theme.background};
  background-image: ${({ $isCardMode }) =>
    $isCardMode
      ? `linear-gradient(145deg, rgba(52, 75, 80, 0.9) 0%, rgba(34, 54, 59, 0.96) 42%, rgba(18, 32, 35, 1) 100%),
        linear-gradient(90deg, rgba(255, 210, 28, 0.08) 0%, transparent 34%, rgba(136, 167, 175, 0.14) 100%)`
      : `linear-gradient(145deg, rgba(46, 68, 73, 0.92) 0%, rgba(23, 39, 43, 0.96) 38%, rgba(7, 17, 19, 1) 100%),
        linear-gradient(90deg, rgba(255, 210, 28, 0.08) 0%, transparent 34%, rgba(136, 167, 175, 0.12) 100%)`};
  background-position: center;
  background-size: cover;

  @media (max-width: 1100px) {
    padding: 0;
  }
`;

const AppContainer = styled.div`
  position: relative;
  width: ${({ $isCardMode }) => ($isCardMode ? "1470px" : "100%")};
  height: ${({ $isCardMode }) => ($isCardMode ? "800px" : "100vh")};
  min-height: ${({ $isCardMode }) => ($isCardMode ? "0" : "100vh")};
  overflow: hidden;
  max-width: none;
  max-height: none;
  border-radius: ${({ $isCardMode, theme }) => ($isCardMode ? theme.borderRadius.md : "0")};
  border: ${({ $isCardMode }) =>
    $isCardMode ? "1px solid rgba(255, 255, 255, 0.055)" : "0"};
  box-shadow: ${({ $isCardMode, theme }) => ($isCardMode ? theme.shadow.panel : "none")};
  background:
    linear-gradient(120deg, rgba(16, 28, 31, 0.98), rgba(8, 16, 18, 0.99) 42%, rgba(8, 16, 18, 0.96)),
    ${({ theme }) => theme.background};

  @media (max-width: 1100px) {
    height: auto;
    min-height: 100vh;
    overflow: visible;
    border-radius: 0;
    border: 0;
  }
`;

const DashboardShell = styled.div`
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: 20.5rem minmax(0, 1fr);
  gap: 1.55rem;
  height: 100%;
  padding: 2.4rem 2rem 1.7rem 1.7rem;
  align-items: start;

  @media (max-width: 1100px) {
    grid-template-columns: 1fr;
    height: auto;
    padding: 1rem;
  }
`;

const SidebarColumn = styled.div`
  position: sticky;
  top: 0;
  align-self: start;
  height: 100%;

  @media (max-width: 1100px) {
    display: none;
  }
`;

const MainPanel = styled.main`
  display: grid;
  grid-template-rows: auto minmax(0, 1fr);
  gap: 1.3rem;
  min-width: 0;
  height: 100%;
  min-height: 0;
  overflow: visible;

  @media (max-width: 1100px) {
    height: auto;
    overflow: visible;
  }
`;

const TopArea = styled.div`
  position: relative;
  z-index: 10;

  @media (max-width: 1100px) {
    position: sticky;
    top: 0;
    z-index: 20;
    padding-top: 0.4rem;
  }
`;

const SearchOverlay = styled.div`
  position: absolute;
  top: calc(100% + 0.4rem);
  left: 0;
  width: min(42rem, 100%);
  z-index: 30;

  @media (max-width: 1100px) {
    top: calc(100% + 0.4rem);
    left: 0;
    width: 100%;
  }
`;

const ContentStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.15rem;
  min-height: 0;
  overflow-y: auto;
  overflow-x: visible;
  padding-right: 0.3rem;
  scrollbar-width: none;
  -ms-overflow-style: none;

  &::-webkit-scrollbar {
    width: 0;
    height: 0;
    display: none;
  }
`;

const HeroStage = styled.div`
  position: relative;
  isolation: isolate;
  padding-right: 8.8rem;

  @media (max-width: 1100px) {
    padding-right: 0;
  }
`;

const StackedPreview = styled.button`
  position: absolute;
  top: 2.4rem;
  bottom: 2.4rem;
  right: ${({ $tone }) => ($tone === "gold" ? "3.35rem" : "0.75rem")};
  width: 12rem;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  overflow: hidden;
  appearance: none;
  background:
    linear-gradient(180deg, rgba(0, 0, 0, 0.05), rgba(0, 0, 0, 0.32)),
    url(${({ $imageUrl }) => $imageUrl}),
    ${({ theme }) => theme.surface.muted};
  background-position: center;
  background-size: cover;
  filter: blur(1.5px);
  border: 0;
  box-shadow: none;
  transform: translateX(${({ $tone }) => ($tone === "gold" ? "0" : "0.9rem")});
  z-index: ${({ $tone }) => ($tone === "gold" ? "-1" : "-2")};
  opacity: ${({ $tone }) => ($tone === "gold" ? "0.9" : "0.72")};
  cursor: pointer;

  @media (max-width: 1100px) {
    display: none;
  }
`;

const CarouselDots = styled.div`
  position: absolute;
  top: 0.35rem;
  right: 2.1rem;
  display: flex;
  gap: 0.7rem;

  @media (max-width: 1100px) {
    display: none;
  }
`;

const CarouselDot = styled.button`
  width: 0.52rem;
  height: 0.52rem;
  border-radius: ${({ theme }) => theme.borderRadius.circle};
  background: ${({ $active, theme }) =>
    $active ? theme.text.primary : "rgba(255, 255, 255, 0.18)"};
  border: 0;
  padding: 0;
  transition:
    background 150ms ease,
    transform 150ms ease;

  &:hover {
    transform: scale(1.15);
    background: ${({ theme }) => theme.text.primary};
  }
`;

const GenreFilterBar = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  overflow-x: auto;
  scrollbar-width: none;
  padding: 1.2rem 0 0.2rem;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const GenrePill = styled.button`
  flex: 0 0 auto;
  min-width: 8rem;
  padding: 0.65rem 1rem;
  border-radius: ${({ theme }) => theme.borderRadius.pill};
  background: ${({ $active, theme }) => ($active ? theme.text.primary : theme.surface.elevated)};
  color: ${({ $active, theme }) => ($active ? theme.background : theme.text.secondary)};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: 700;
  border: none;
  white-space: nowrap;
  cursor: pointer;
  transition: all 180ms;

  &:hover {
    background: ${({ $active, theme }) => ($active ? theme.text.primary : theme.alpha.white12)};
  }
`;

const GenreNavArrow = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3rem;
  height: 3rem;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background: ${({ theme }) => theme.surface.elevated};
  color: ${({ theme }) => theme.text.secondary};
  border: none;
  cursor: pointer;
  flex-shrink: 0;

  &:hover {
    background: ${({ theme }) => theme.surface.muted};
    color: ${({ theme }) => theme.text.primary};
  }

  svg {
    font-size: 1rem;
  }
`;

const GenreNavGroup = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-left: auto;
  padding-left: 1rem;
  position: sticky;
  right: 0;
  background: linear-gradient(90deg, transparent, ${({ theme }) => theme.background} 22%);
`;

const StateCard = styled.div`
  display: flex;
  align-items: center;
  gap: 1.2rem;
  padding: 2rem;
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  background: ${({ theme }) => theme.surface.elevated};
  border: 1px solid ${({ theme }) => theme.alpha.white06};
  color: ${({ theme }) => theme.text.secondary};
  font-size: ${({ theme }) => theme.fontSizes.sm};
`;

const StateTitle = styled.p`
  font-weight: 700;
  color: ${({ theme }) => theme.text.primary};
  margin-bottom: 0.3rem;
`;

const StateText = styled.p`
  color: ${({ theme }) => theme.text.tertiary};
`;

export default App;
