import styled, { keyframes } from "styled-components";
import { APP_COPY } from "../constants";
import PropTypes from "prop-types";
import { HeartOutlined, InfoCircleOutlined } from "@ant-design/icons";
import { getImageUrl } from "../api";

const formatRuntime = (runtime) => {
  if (!runtime) return null;

  if (runtime < 60) {
    return `${runtime}min`;
  }

  return `${Math.floor(runtime / 60)}h ${runtime % 60}min`;
};

const heroReveal = keyframes`
  0% {
    opacity: 0;
    transform: translateX(1.2rem) scale(1.025);
    filter: saturate(0.86) brightness(0.86);
    background-size: 106%;
  }

  100% {
    opacity: 1;
    transform: translateX(0) scale(1);
    filter: saturate(1) brightness(1);
    background-size: 100%;
  }
`;

const contentReveal = keyframes`
  0% {
    opacity: 0;
    transform: translateY(0.8rem);
  }

  100% {
    opacity: 1;
    transform: translateY(0);
  }
`;

export const HeroBanner = ({ movie, onOpenDetails }) => {
  const imageUrl = getImageUrl(movie?.backdrop_path || movie?.poster_path);
  const genres = movie?.genres?.filter((genre) => genre?.name).slice(0, 3) || [];
  const runtime = formatRuntime(movie?.runtime);

  return (
    <Hero style={{ backgroundImage: `url(${imageUrl})` }}>
      <HeroOverlay />
      <TagRow>
        {runtime ? <Tag>{runtime}</Tag> : null}
        {genres.map((genre) => (
          <Tag key={genre.id}>{genre.name}</Tag>
        ))}
      </TagRow>
      <HeroContent>
        <DetailsButton onClick={() => onOpenDetails(movie)}>
          <InfoCircleOutlined />
          <span>
            <strong>{movie?.title || APP_COPY.heroDefaultTitle}</strong>
            View details
          </span>
        </DetailsButton>
      </HeroContent>
      <HeartButton aria-label="Add to favorites">
        <HeartOutlined />
      </HeartButton>
    </Hero>
  );
};

HeroBanner.propTypes = {
  movie: PropTypes.object,
  onOpenDetails: PropTypes.func,
};

const Hero = styled.section`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  min-height: clamp(25rem, 46vh, 36rem);
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  background-color: ${({ theme }) => theme.surface.elevated};
  background-position: center 32%;
  background-repeat: no-repeat;
  background-size: cover;
  overflow: hidden;
  border: 0;
  box-shadow: ${({ theme }) => theme.shadow.soft};
  animation: ${heroReveal} 620ms cubic-bezier(0.22, 1, 0.36, 1) both;

  @media (max-width: 900px) {
    min-height: 24rem;
    background-position: center top;
  }
`;

const HeroOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(
    180deg,
    rgba(0, 0, 0, 0.03) 0%,
    transparent 35%,
    rgba(0, 0, 0, 0.34) 62%,
    rgba(0, 0, 0, 0.86) 100%
  );
  pointer-events: none;
`;

const HeroContent = styled.div`
  position: relative;
  z-index: 2;
  padding: 1.45rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  animation: ${contentReveal} 700ms 110ms cubic-bezier(0.22, 1, 0.36, 1) both;

  @media (max-width: 900px) {
    padding: 1.6rem;
  }
`;

const TagRow = styled.div`
  position: absolute;
  top: 1.45rem;
  left: 1.45rem;
  z-index: 3;
  display: flex;
  flex-wrap: wrap;
  gap: 0.7rem;
  align-items: center;
  animation: ${contentReveal} 640ms 90ms cubic-bezier(0.22, 1, 0.36, 1) both;
`;

const Tag = styled.span`
  padding: 0.38rem 0.75rem;
  border-radius: ${({ theme }) => theme.borderRadius.pill};
  background: rgba(255, 255, 255, 0.24);
  color: ${({ theme }) => theme.text.primary};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: 800;
  backdrop-filter: blur(10px);
  cursor: pointer;
  transition:
    background 150ms ease,
    transform 150ms ease;

  &:hover {
    background: rgba(255, 255, 255, 0.34);
    transform: translateY(-1px);
  }
`;

const DetailsButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 1rem;
  padding: 0;
  border-radius: 0;
  background: transparent;
  color: ${({ theme }) => theme.text.primary};
  font-size: ${({ theme }) => theme.fontSizes.md};
  font-weight: 700;
  border: 0;
  cursor: pointer;
  width: fit-content;
  transition: color 150ms ease;

  &:hover {
    color: ${({ theme }) => theme.accent.primary};
  }

  svg {
    display: grid;
    place-items: center;
    width: 3.7rem;
    height: 3.7rem;
    padding: 0.7rem;
    border-radius: ${({ theme }) => theme.borderRadius.circle};
    background: rgba(255, 255, 255, 0.24);
    color: ${({ theme }) => theme.text.primary};
    font-size: 1.6rem;
    box-sizing: border-box;
  }

  span {
    display: grid;
    gap: 0.1rem;
    justify-items: start;
    text-align: left;
  }

  span > :not(strong) {
    font-size: ${({ theme }) => theme.fontSizes.sm};
    font-weight: 500;
    color: ${({ theme }) => theme.text.secondary};
  }

  strong {
    color: ${({ theme }) => theme.text.primary};
    font-size: ${({ theme }) => theme.fontSizes.lg};
  }
`;

const HeartButton = styled.button`
  position: absolute;
  bottom: 1.25rem;
  right: 1.25rem;
  z-index: 3;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3rem;
  height: 3rem;
  border-radius: ${({ theme }) => theme.borderRadius.circle};
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(4px);
  color: ${({ theme }) => theme.text.primary};
  font-size: 1.3rem;
  border: 1px solid rgba(255, 255, 255, 0.15);
  cursor: pointer;
  transition:
    background 150ms ease,
    color 150ms ease;

  &:hover {
    background: rgba(255, 255, 255, 0.15);
    color: #ff4d6a;
  }
`;
