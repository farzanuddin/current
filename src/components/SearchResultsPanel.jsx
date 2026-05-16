import styled, { useTheme } from "styled-components";
import PropTypes from "prop-types";
import { LoadingOutlined } from "@ant-design/icons";
import { getImageUrl } from "../api";
import { APP_COPY } from "../constants";

export const SearchResultsPanel = ({
  query,
  minCharacters,
  isLoading,
  results,
  error,
  emptyText,
  hint,
  onSelectMovie,
}) => {
  const hasQuery = query.trim().length > 0;
  const canSearch = query.trim().length >= minCharacters;
  const theme = useTheme();
  const getPosterBackground = (movie) => `linear-gradient(
    180deg,
    ${theme.alpha.dark06} 0%,
    ${theme.alpha.dark32} 100%
  ), url(${getImageUrl(movie.poster_path || movie.backdrop_path)})`;

  if (!hasQuery) {
    return null;
  }

  return (
    <Panel>
      {!canSearch ? <PanelText>{hint}</PanelText> : null}
      {canSearch && isLoading ? (
        <PanelText>
          <LoadingOutlined />
          {APP_COPY.searchingStatus}
        </PanelText>
      ) : null}
      {canSearch && !isLoading && error ? <PanelText>{error}</PanelText> : null}
      {canSearch && !isLoading && !error && results.length === 0 ? <PanelText>{emptyText}</PanelText> : null}

      {canSearch && !isLoading && !error && results.length > 0 ? (
        <ResultsList>
          {results.map((movie) => (
            <ResultButton
              key={`${movie.media_type || "movie"}-${movie.id}`}
              onClick={() => onSelectMovie(movie)}
            >
              <Poster
                style={{
                  backgroundImage: getPosterBackground(movie),
                }}
              />
              <ResultBody>
                <ResultTitle>{movie.title}</ResultTitle>
                <ResultMeta>
                  <span>{movie.release_date?.slice(0, 4) || "TBA"}</span>
                  <span>{movie.vote_average ? movie.vote_average.toFixed(1) : "NR"}</span>
                </ResultMeta>
              </ResultBody>
            </ResultButton>
          ))}
        </ResultsList>
      ) : null}
    </Panel>
  );
};

SearchResultsPanel.propTypes = {
  query: PropTypes.string.isRequired,
  minCharacters: PropTypes.number,
  isLoading: PropTypes.bool,
  results: PropTypes.array,
  error: PropTypes.string,
  emptyText: PropTypes.string,
  hint: PropTypes.string,
  onSelectMovie: PropTypes.func,
};

const Panel = styled.div`
  display: grid;
  gap: 1.2rem;
  padding: 1.6rem;
  max-height: min(46rem, 65vh);
  overflow-y: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background: rgba(30, 40, 43, 0.94);
  backdrop-filter: blur(20px) saturate(125%);
  -webkit-backdrop-filter: blur(20px) saturate(125%);
  border: 1px solid ${({ theme }) => theme.alpha.white06};
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.04),
    0 1.2rem 3rem rgba(0, 0, 0, 0.32);

  &::-webkit-scrollbar {
    width: 0;
    height: 0;
    display: none;
  }

  &::-webkit-scrollbar-thumb {
    background: transparent;
    border-radius: ${({ theme }) => theme.borderRadius.pill};
  }
`;

const PanelText = styled.p`
  display: inline-flex;
  align-items: center;
  gap: 0.8rem;
  color: ${({ theme }) => theme.text.secondary};
  font-size: ${({ theme }) => theme.fontSizes.md};
`;

const ResultsList = styled.div`
  display: grid;
  gap: 1rem;
`;

const ResultButton = styled.button`
  display: grid;
  grid-template-columns: 5.6rem minmax(0, 1fr);
  gap: 1rem;
  align-items: center;
  width: 100%;
  padding: 0.8rem;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  text-align: left;

  &:hover {
    background: rgba(255, 255, 255, 0.09);
  }
`;

const Poster = styled.div`
  width: 5.6rem;
  height: 7.2rem;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background-color: ${({ theme }) => theme.surface.muted};
  background-size: cover;
  background-position: center;
`;

const ResultBody = styled.div`
  display: grid;
  gap: 0.45rem;
  min-width: 0;
`;

const ResultTitle = styled.p`
  color: ${({ theme }) => theme.text.primary};
  font-size: ${({ theme }) => theme.fontSizes.md};
  font-weight: 700;
`;

const ResultMeta = styled.div`
  display: flex;
  gap: 1rem;
  color: ${({ theme }) => theme.text.tertiary};
  font-size: ${({ theme }) => theme.fontSizes.sm};
`;
