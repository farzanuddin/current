import styled from "styled-components";
import {
  CompassOutlined,
  HeartOutlined,
  HomeFilled,
  QuestionCircleOutlined,
  RiseOutlined,
  SettingOutlined,
  ClockCircleOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import PropTypes from "prop-types";
import { APP_COPY } from "../constants";
import { getImageUrl } from "../api";

const iconMap = {
  home: HomeFilled,
  heart: HeartOutlined,
  compass: ClockCircleOutlined,
  trending: RiseOutlined,
  settings: SettingOutlined,
  support: QuestionCircleOutlined,
};

const SidebarGroup = ({ items, onNavigate }) => (
  <NavList>
    {items.map((item) => {
      const Icon = iconMap[item.icon] || CompassOutlined;
      return (
        <li key={item.key}>
          <NavButton $active={item.active} onClick={() => onNavigate && onNavigate(item)}>
            <Icon />
            <span>{item.label}</span>
          </NavButton>
        </li>
      );
    })}
  </NavList>
);

const StaticCWCard = ({ title, label, progress, backdrop }) => {
  const imageUrl = getImageUrl(backdrop);
  const progressValue = Number.parseInt(progress, 10) || 0;

  return (
    <CWCard style={{ backgroundImage: `url(${imageUrl})` }}>
      <CWTopRow>
        <CWTitle>{title}</CWTitle>
      </CWTopRow>
      <CWBottomRow>
        <CWPlayBtn>
          <svg width="10" height="12" viewBox="0 0 10 12" fill="currentColor">
            <path d="M1 0.5L9 6L1 11.5V0.5Z" />
          </svg>
        </CWPlayBtn>
        <CWMetaPill $progress={Math.min(progressValue, 100)}>
          <CWLabel>{label}</CWLabel>
          <CWPercent>{progress}</CWPercent>
        </CWMetaPill>
      </CWBottomRow>
    </CWCard>
  );
};

export const DashboardSidebar = ({ primaryLinks, onNavigate, onClose }) => {
  const staticItems = [
    {
      title: "The Rookie",
      label: "S7.E18",
      progress: "68%",
      backdrop: "/2m1Mu0xPj4SikiqkaolTRUcNtWH.jpg",
    },
    {
      title: "Lilo & Stitch",
      label: "44min",
      progress: "43%",
      backdrop: "/7Zx3wDG5bBtcfk8lcnCWDOLM4Y4.jpg",
    },
    {
      title: "Whiplash",
      label: "1h 18min",
      progress: "73%",
      backdrop: "/wbQa0EnWUyRzQ5d1pHLNRlmsCUP.jpg",
    },
  ];

  return (
    <Sidebar>
      <SidebarHeader>
        <BrandLockup>
          <BrandLogo src="/logo.svg" alt={APP_COPY.appLogoAlt} />
          <span>{APP_COPY.brand}</span>
        </BrandLockup>
        {onClose ? (
          <CloseButton type="button" aria-label="Close menu" onClick={onClose}>
            <CloseOutlined />
          </CloseButton>
        ) : null}
      </SidebarHeader>
      <SidebarStack>
        <SidebarGroup items={primaryLinks.slice(0, 4)} onNavigate={onNavigate} />
        <NavDivider />
        <SidebarGroup items={primaryLinks.slice(4)} onNavigate={onNavigate} />
      </SidebarStack>

      <ContinueWatchingSection>
        <CWHeader>{APP_COPY.sidebarLibraryTitle}</CWHeader>
        <CWList>
          {staticItems.map((item, i) => (
            <StaticCWCard key={i} {...item} />
          ))}
        </CWList>
      </ContinueWatchingSection>
    </Sidebar>
  );
};

SidebarGroup.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      label: PropTypes.string,
      icon: PropTypes.string,
      active: PropTypes.bool,
    })
  ).isRequired,
  onNavigate: PropTypes.func,
};

StaticCWCard.propTypes = {
  title: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  progress: PropTypes.string.isRequired,
  backdrop: PropTypes.string.isRequired,
};

DashboardSidebar.propTypes = {
  primaryLinks: PropTypes.array.isRequired,
  onNavigate: PropTypes.func,
  onClose: PropTypes.func,
};

const SidebarHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
`;

const BrandLockup = styled.div`
  display: flex;
  align-items: center;
  gap: 1.2rem;
  min-height: 4.15rem;
  padding: 0 0.35rem 2.7rem;
  flex-shrink: 0;

  span {
    font-size: ${({ theme }) => theme.fontSizes.xl};
    font-weight: 800;
    letter-spacing: 0;
  }
`;

const BrandLogo = styled.img`
  width: 2.45rem;
  height: 2.45rem;
  display: block;
`;

const CloseButton = styled.button`
  display: none;
  place-items: center;
  width: 3.2rem;
  height: 3.2rem;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background: ${({ theme }) => theme.alpha.white08};
  color: ${({ theme }) => theme.text.primary};
  font-size: 1.25rem;
  flex-shrink: 0;

  &:hover {
    background: ${({ theme }) => theme.alpha.white12};
  }

  @media (max-width: 1100px) {
    display: grid;
  }
`;

const Sidebar = styled.aside`
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 0 0 0.4rem;
  gap: 1.1rem;

  @media (max-width: 1100px) {
    min-height: 100vh;
    height: 100%;
    padding: 2.4rem 1.6rem;
    display: block;
    background: ${({ theme }) => theme.background};
  }
`;

const NavDivider = styled.div`
  height: 2.4rem;
`;

const SidebarStack = styled.div`
  display: grid;
  gap: 0.3rem;
  flex-shrink: 0;
`;

const NavList = styled.ul`
  display: grid;
  gap: 0.65rem;
`;

const NavButton = styled.button`
  display: flex;
  align-items: center;
  gap: 1rem;
  width: 100%;
  padding: 0.4rem 0.6rem;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background: transparent;
  color: ${({ $active, theme }) => ($active ? theme.text.primary : theme.text.tertiary)};
  border: none;
  font-size: ${({ theme }) => theme.fontSizes.md};
  font-weight: ${({ $active }) => ($active ? "600" : "500")};
  cursor: pointer;
  transition: color 150ms ease;

  &:hover {
    color: ${({ theme }) => theme.text.primary};
  }

  svg {
    font-size: 1.75rem;
    opacity: ${({ $active }) => ($active ? "1" : "0.7")};
  }
`;

const ContinueWatchingSection = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  margin-top: 1.15rem;
`;

const CWHeader = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.md};
  font-weight: 700;
  color: ${({ theme }) => theme.text.tertiary};
  letter-spacing: 0;
  padding: 0 0.6rem 0.8rem;
  flex-shrink: 0;
`;

const CWList = styled.div`
  display: grid;
  gap: 0.7rem;
  overflow-y: auto;
  min-height: 0;
  padding-right: 0.3rem;
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.08) transparent;
`;

const CWCard = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 10.7rem;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background-color: ${({ theme }) => theme.surface.muted};
  background-size: cover;
  background-position: center 35%;
  overflow: hidden;
  cursor: pointer;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.18);
  transition:
    box-shadow 150ms ease,
    transform 150ms ease;

  &::after {
    content: "";
    position: absolute;
    inset: 0;
    background:
      linear-gradient(180deg, rgba(0, 0, 0, 0.18) 0%, rgba(0, 0, 0, 0.08) 48%, rgba(0, 0, 0, 0.28) 100%),
      linear-gradient(90deg, rgba(0, 0, 0, 0.28) 0%, transparent 58%);
    pointer-events: none;
  }

  &:hover {
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.24),
      0 0.85rem 1.8rem rgba(0, 0, 0, 0.2);
    transform: translateY(-1px);
  }
`;

const CWTopRow = styled.div`
  position: relative;
  z-index: 1;
  padding: 0.95rem 1.1rem 0;
`;

const CWTitle = styled.p`
  font-size: 1.45rem;
  font-weight: 700;
  color: ${({ theme }) => theme.text.primary};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-shadow: 0 1px 6px rgba(0, 0, 0, 0.42);
`;

const CWBottomRow = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 0.38rem;
  padding: 0 1.05rem 0.85rem;
`;

const CWPlayBtn = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.55rem;
  height: 2.55rem;
  border-radius: ${({ theme }) => theme.borderRadius.circle};
  background: rgba(113, 119, 118, 0.72);
  backdrop-filter: blur(9px);
  -webkit-backdrop-filter: blur(9px);
  color: ${({ theme }) => theme.text.primary};
  flex-shrink: 0;

  svg {
    width: 0.72rem;
    height: 0.86rem;
  }
`;

const CWMetaPill = styled.div`
  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  width: min(10.2rem, calc(100% - 3.4rem));
  margin-left: auto;
  height: 2.55rem;
  overflow: hidden;
  border-radius: ${({ theme }) => theme.borderRadius.pill};
  background: rgba(86, 91, 90, 0.72);
  backdrop-filter: blur(9px);
  -webkit-backdrop-filter: blur(9px);
  color: ${({ theme }) => theme.text.primary};

  &::before {
    content: "";
    position: absolute;
    inset: 0 auto 0 0;
    width: ${({ $progress }) => `${$progress}%`};
    background: rgba(150, 155, 152, 0.76);
    border-radius: inherit;
  }
`;

const CWLabel = styled.span`
  position: relative;
  z-index: 1;
  display: grid;
  place-items: center;
  height: 100%;
  min-width: 0;
  padding: 0 0.5rem;
  font-size: 0.98rem;
  font-weight: 700;
  white-space: nowrap;
`;

const CWPercent = styled.span`
  position: relative;
  z-index: 1;
  display: grid;
  place-items: center;
  min-width: 0;
  padding: 0 0.5rem;
  font-size: 0.98rem;
  font-weight: 700;
  color: ${({ theme }) => theme.text.primary};
  white-space: nowrap;
`;
