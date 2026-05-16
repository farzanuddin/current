import styled from "styled-components";
import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";
import { APP_COPY } from "../constants";
import {
  MenuOutlined,
  SearchOutlined,
  BellOutlined,
  DownOutlined,
  SlidersOutlined,
  CloseOutlined,
} from "@ant-design/icons";

const MEDIA_OPTIONS = ["Movies", "Shows", "Anime"];

export const TopBar = ({
  placeholder,
  searchValue,
  selectedMedia,
  onMediaChange,
  onSearchChange,
  onSearchFocus,
  onToggleSidebar,
}) => {
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);
  const [isMediaMenuOpen, setIsMediaMenuOpen] = useState(false);

  useEffect(() => {
    const onPointerDown = (event) => {
      if (!dropdownRef.current?.contains(event.target)) {
        setIsMediaMenuOpen(false);
      }
    };

    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, []);

  return (
    <Bar>
      <LeftSection>
        <Hamburger aria-label={APP_COPY.menuLabel} onClick={onToggleSidebar}>
          <MenuOutlined />
        </Hamburger>
        <BrandLockup>
          <BrandIcon>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="2" y="5" width="20" height="14" rx="3" fill="#e6b91e"/>
              <rect x="4" y="7" width="16" height="10" rx="1.5" fill="#0a0a0f"/>
              <circle cx="12" cy="12" r="2.5" fill="#e6b91e"/>
              <rect x="2" y="9" width="20" height="2" fill="#e6b91e" opacity="0.3"/>
              <rect x="2" y="13" width="20" height="2" fill="#e6b91e" opacity="0.3"/>
            </svg>
          </BrandIcon>
          <BrandName>{APP_COPY.brand}</BrandName>
        </BrandLockup>
      </LeftSection>

      <CenterSection>
        <MediaDropdownWrap ref={dropdownRef}>
          <MediaDropdown
            type="button"
            aria-haspopup="listbox"
            aria-expanded={isMediaMenuOpen}
            onClick={() => setIsMediaMenuOpen((isOpen) => !isOpen)}
          >
            <span>{selectedMedia}</span>
            <DownOutlined style={{ fontSize: "0.7rem" }} />
          </MediaDropdown>
          {isMediaMenuOpen ? (
            <MediaMenu role="listbox" aria-label="Content type">
              {MEDIA_OPTIONS.map((option) => (
                <MediaOption
                  key={option}
                  type="button"
                  role="option"
                  aria-selected={selectedMedia === option}
                  $active={selectedMedia === option}
                  onClick={() => {
                    onMediaChange(option);
                    setIsMediaMenuOpen(false);
                  }}
                >
                  {option}
                </MediaOption>
              ))}
            </MediaMenu>
          ) : null}
        </MediaDropdownWrap>
        <SearchWrap onClick={() => inputRef.current && inputRef.current.focus()}>
          <SearchIcon>
            <SearchOutlined />
          </SearchIcon>
          <Input
            ref={inputRef}
            type="text"
            placeholder={placeholder}
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            onFocus={onSearchFocus}
            aria-label={APP_COPY.searchAriaLabel}
          />
          {searchValue ? (
            <ClearSearchButton
              type="button"
              aria-label="Clear search"
              onClick={(event) => {
                event.stopPropagation();
                onSearchChange("");
                inputRef.current?.focus();
              }}
            >
              <CloseOutlined />
            </ClearSearchButton>
          ) : null}
          <FilterButton aria-label="Filter search">
            <SlidersOutlined />
          </FilterButton>
        </SearchWrap>
      </CenterSection>

      <RightSection>
        <BellButton aria-label="Notifications">
          <BellOutlined />
          <NotificationDot />
        </BellButton>
        <UserBadge>
          <UserAvatar src={APP_COPY.userAvatarUrl} alt={`${APP_COPY.userDisplayName} avatar`} />
          <UserInfo>
            <UserName>{APP_COPY.userDisplayName}</UserName>
            <UserPlan>{APP_COPY.userPlan}</UserPlan>
          </UserInfo>
        </UserBadge>
      </RightSection>
    </Bar>
  );
};

TopBar.propTypes = {
  placeholder: PropTypes.string,
  searchValue: PropTypes.string,
  selectedMedia: PropTypes.string,
  onMediaChange: PropTypes.func,
  onSearchChange: PropTypes.func,
  onSearchFocus: PropTypes.func,
  onToggleSidebar: PropTypes.func,
};

const Bar = styled.div`
  display: flex;
  align-items: center;
  gap: 1.4rem;
  width: 100%;
  padding: 0 0 0.2rem;

  @media (max-width: 1100px) {
    flex-wrap: wrap;
    gap: 0.8rem;
    padding: 0.5rem 0;
  }
`;

const LeftSection = styled.div`
  display: none;
  align-items: center;
  gap: 0.6rem;
  flex-shrink: 0;

  @media (max-width: 1100px) {
    display: flex;
  }
`;

const BrandLockup = styled.div`
  display: none;
  align-items: center;
  gap: 0.5rem;
  flex-shrink: 0;
`;

const BrandIcon = styled.span`
  display: flex;
  align-items: center;
  flex-shrink: 0;
`;

const BrandName = styled.span`
  font-size: 1.15rem;
  font-weight: 700;
  color: ${({ theme }) => theme.text.primary};
  letter-spacing: -0.02em;
`;

const CenterSection = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
  max-width: 70rem;
  gap: 1.15rem;

  @media (max-width: 1100px) {
    order: 3;
    max-width: 100%;
    flex-basis: 100%;
  }
`;

const MediaDropdownWrap = styled.div`
  position: relative;
  flex-shrink: 0;
`;

const MediaDropdown = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.8rem;
  min-width: 10.8rem;
  height: 3.8rem;
  padding: 0 1.25rem;
  background: rgba(43, 54, 58, 0.82);
  color: ${({ theme }) => theme.text.primary};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: 600;
  border: 0;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  backdrop-filter: blur(18px) saturate(125%);
  -webkit-backdrop-filter: blur(18px) saturate(125%);
  white-space: nowrap;
  cursor: pointer;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.035);

  &:hover {
    background: rgba(51, 63, 67, 0.88);
  }
`;

const MediaMenu = styled.div`
  position: absolute;
  top: calc(100% + 0.65rem);
  left: 0;
  z-index: 40;
  display: grid;
  gap: 0.2rem;
  width: 15.2rem;
  padding: 0.45rem;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background: rgba(30, 40, 43, 0.94);
  backdrop-filter: blur(20px) saturate(125%);
  -webkit-backdrop-filter: blur(20px) saturate(125%);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.04),
    0 1.2rem 3rem rgba(0, 0, 0, 0.32);
`;

const MediaOption = styled.button`
  width: 100%;
  padding: 0.7rem 0.85rem;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  color: ${({ $active, theme }) => ($active ? theme.text.primary : theme.text.secondary)};
  background: ${({ $active }) => ($active ? "rgba(255, 255, 255, 0.12)" : "transparent")};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: 700;
  text-align: left;

  &:hover {
    color: ${({ theme }) => theme.text.primary};
    background: rgba(255, 255, 255, 0.09);
  }
`;

const SearchWrap = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
  min-width: 0;
  height: 3.8rem;
  padding: 0 0.25rem 0 1.1rem;
  background: rgba(43, 54, 58, 0.82);
  border: 0;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  backdrop-filter: blur(18px) saturate(125%);
  -webkit-backdrop-filter: blur(18px) saturate(125%);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.035);
  cursor: text;
`;

const SearchIcon = styled.span`
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.text.tertiary};
  font-size: 1.15rem;
  margin-right: 0.8rem;
  flex-shrink: 0;
`;

const Input = styled.input`
  background: transparent;
  border: none;
  outline: none;
  color: ${({ theme }) => theme.text.primary};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  width: 100%;
  min-width: 0;

  &::placeholder {
    color: ${({ theme }) => theme.text.tertiary};
    opacity: 0.8;
  }

  &:focus-visible {
    outline: none !important;
    outline-offset: 0 !important;
  }
`;

const ClearSearchButton = styled.button`
  display: grid;
  place-items: center;
  width: 2.5rem;
  height: 2.5rem;
  margin-right: 0.45rem;
  border-radius: ${({ theme }) => theme.borderRadius.circle};
  color: ${({ theme }) => theme.text.tertiary};
  font-size: 0.85rem;
  flex-shrink: 0;
  cursor: pointer;

  &:hover {
    background: ${({ theme }) => theme.alpha.white08};
    color: ${({ theme }) => theme.text.primary};
  }
`;

const FilterButton = styled.button`
  display: grid;
  place-items: center;
  width: 3.6rem;
  align-self: stretch;
  color: ${({ theme }) => theme.text.tertiary};
  border-left: 1px solid rgba(255, 255, 255, 0.07);
  font-size: 1.1rem;
  flex-shrink: 0;

  &:hover {
    color: ${({ theme }) => theme.text.primary};
  }
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 0.9rem;
  flex-shrink: 0;
  margin-left: auto;

  @media (max-width: 1100px) {
    margin-left: auto;
  }
`;

const BellButton = styled.button`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3.8rem;
  height: 3.8rem;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background: rgba(43, 54, 58, 0.82);
  border: 0;
  backdrop-filter: blur(18px) saturate(125%);
  -webkit-backdrop-filter: blur(18px) saturate(125%);
  color: ${({ theme }) => theme.text.secondary};
  font-size: 1.3rem;
  cursor: pointer;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.035);

  &:hover {
    color: ${({ theme }) => theme.text.primary};
    background: rgba(51, 63, 67, 0.88);
  }
`;

const NotificationDot = styled.span`
  position: absolute;
  top: 1.25rem;
  right: 1.25rem;
  width: 0.45rem;
  height: 0.45rem;
  border-radius: ${({ theme }) => theme.borderRadius.circle};
  background: ${({ theme }) => theme.danger.base};
`;

const UserBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 0.6rem;
  min-height: 3.8rem;
  padding: 0.35rem 0.9rem 0.35rem 0.35rem;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background: rgba(43, 54, 58, 0.82);
  border: 0;
  backdrop-filter: blur(18px) saturate(125%);
  -webkit-backdrop-filter: blur(18px) saturate(125%);
  cursor: pointer;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.035);

  &:hover {
    background: rgba(51, 63, 67, 0.88);
  }
`;

const UserAvatar = styled.img`
  display: block;
  width: 2.9rem;
  height: 2.9rem;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  object-fit: cover;
  background: ${({ theme }) => theme.surface.muted};
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  line-height: 1.15;
`;

const UserName = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: 700;
  color: ${({ theme }) => theme.text.primary};
`;

const UserPlan = styled.span`
  font-size: 0.85rem;
  color: ${({ theme }) => theme.accent.primary};
  font-weight: 700;
`;

const Hamburger = styled.button`
  display: none;
  background: rgba(43, 54, 58, 0.82);
  border: none;
  color: ${({ theme }) => theme.text.primary};
  font-size: 1.3rem;
  width: 3.8rem;
  height: 3.8rem;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  place-items: center;
  backdrop-filter: blur(18px) saturate(125%);
  -webkit-backdrop-filter: blur(18px) saturate(125%);
  cursor: pointer;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.035);

  &:hover {
    background: rgba(51, 63, 67, 0.88);
  }

  @media (max-width: 1100px) {
    display: grid;
  }
`;
