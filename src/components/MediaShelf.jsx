import { useRef } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { MediaCard } from "./MediaCard";

export const MediaShelf = ({ sectionKey, title, items, onSelectMovie }) => {
  const showProgress = sectionKey === "continueWatching";
  const showHeader = sectionKey !== "actionMovies";
  const rowRef = useRef(null);

  const scrollRow = (direction) => {
    if (rowRef.current) {
      const scrollAmount = 300;
      rowRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <Section>
      {showHeader ? (
        <ShelfHeader>
          <ShelfTitle>{title}</ShelfTitle>
          <ShelfArrows>
            <ArrowButton aria-label={`Scroll ${title} left`} onClick={() => scrollRow("left")}>
              <LeftOutlined />
            </ArrowButton>
            <ArrowButton aria-label={`Scroll ${title} right`} onClick={() => scrollRow("right")}>
              <RightOutlined />
            </ArrowButton>
          </ShelfArrows>
        </ShelfHeader>
      ) : null}

      <CardRow ref={rowRef} $showProgress={showProgress}>
        {items.map((movie) => (
          <MediaCard
            key={movie.id}
            movie={movie}
            onSelectMovie={onSelectMovie}
            showProgress={showProgress}
          />
        ))}
      </CardRow>
    </Section>
  );
};

MediaShelf.propTypes = {
  sectionKey: PropTypes.string,
  title: PropTypes.string,
  items: PropTypes.array.isRequired,
  onSelectMovie: PropTypes.func,
};

const Section = styled.section`
  display: grid;
  gap: 0.85rem;
`;

const ShelfHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
`;

const ShelfTitle = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: 800;
  color: ${({ theme }) => theme.text.primary};
`;

const ShelfArrows = styled.div`
  display: flex;
  gap: 0.75rem;
  flex-shrink: 0;
`;

const ArrowButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3rem;
  height: 3rem;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background: ${({ theme }) => theme.surface.elevated};
  border: 0;
  color: ${({ theme }) => theme.text.secondary};
  font-size: 0.7rem;
  cursor: pointer;

  &:hover {
    color: ${({ theme }) => theme.text.primary};
    background: ${({ theme }) => theme.surface.muted};
  }
`;

const CardRow = styled.div`
  display: flex;
  gap: 1rem;
  overflow-x: auto;
  overflow-y: visible;
  padding: 0 0.2rem 0.6rem;
  scrollbar-width: none;
  -ms-overflow-style: none;
  scroll-behavior: smooth;

  &::-webkit-scrollbar {
    height: 0;
    width: 0;
    display: none;
  }
`;
