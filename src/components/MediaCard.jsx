import styled from "styled-components";
import PropTypes from "prop-types";
import { StarFilled } from "@ant-design/icons";
import { getImageUrl } from "../api";

export const MediaCard = ({ movie, onSelectMovie }) => {
  const posterUrl = getImageUrl(movie?.poster_path || movie?.backdrop_path);
  const rating = movie?.vote_average ? movie.vote_average.toFixed(1) : "6.0";
  const year = movie?.release_date?.slice(0, 4) || "2024";

  return (
    <Card onClick={() => onSelectMovie(movie)}>
      <PosterWrap>
        <PosterImage style={{ backgroundImage: `url(${posterUrl})` }} />
      </PosterWrap>
      <CardMeta>
        <CardTitle>{movie?.title || "Unknown"}</CardTitle>
        <CardStats>
          <span>{year}</span>
          <span>
            <StarFilled />
            {rating}
          </span>
        </CardStats>
      </CardMeta>
    </Card>
  );
};

MediaCard.propTypes = {
  movie: PropTypes.object.isRequired,
  onSelectMovie: PropTypes.func.isRequired,
  showProgress: PropTypes.bool,
};

const Card = styled.button`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  min-width: 13.2rem;
  max-width: 13.2rem;
  padding: 0;
  background: transparent;
  border: none;
  text-align: left;
  cursor: pointer;
  flex-shrink: 0;
  transition: transform 180ms ease;

  &:hover {
    transform: translateY(-2px);
  }

  @media (max-width: 900px) {
    min-width: 12.5rem;
    max-width: 12.5rem;
  }
`;

const PosterWrap = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 4 / 5;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  overflow: hidden;
  background: ${({ theme }) => theme.surface.elevated};
  border: 1px solid ${({ theme }) => theme.alpha.white06};
`;

const PosterImage = styled.div`
  width: 100%;
  height: 100%;
  background-color: ${({ theme }) => theme.surface.muted};
  background-size: cover;
  background-position: center;
  transition: transform 200ms ease;

  ${Card}:hover & {
    transform: scale(1.03);
  }
`;

const CardMeta = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding: 0 0.1rem;
`;

const CardTitle = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.md};
  font-weight: 700;
  color: ${({ theme }) => theme.text.primary};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const CardStats = styled.p`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: ${({ theme }) => theme.fontSizes.md};
  color: ${({ theme }) => theme.text.tertiary};

  span:last-child {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    color: ${({ theme }) => theme.accent.primary};
    font-weight: 800;
  }

  svg {
    font-size: 1rem;
  }
`;
