import { Link, useNavigate } from 'react-router-dom'
import styled, { keyframes } from 'styled-components'
import cityImage from '../assets/city.jpg'

const floatLeft = keyframes`
  0% { transform: translate3d(0, 0, 0) scale(1); }
  50% { transform: translate3d(-24px, -18px, 0) scale(1.06); }
  100% { transform: translate3d(0, 0, 0) scale(1); }
`

const floatRight = keyframes`
  0% { transform: translate3d(0, 0, 0) scale(1); }
  50% { transform: translate3d(22px, 14px, 0) scale(0.98); }
  100% { transform: translate3d(0, 0, 0) scale(1); }
`

const fadeUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(18px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`

function Pattern() {
  return (
    <PatternWrapper>
      <div className="background" />
    </PatternWrapper>
  )
}

const PatternWrapper = styled.div`
  .background {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    background: white;
    background: radial-gradient(125% 125% at 50% 10%, rgba(255, 255, 255, 0.96) 40%, rgba(102, 51, 238, 0.98) 100%);
    z-index: -10;
  }
`

const Page = styled.main`
  position: relative;
  min-height: 100dvh;
  overflow: hidden;
  color: #19152c;
`

const CityBlend = styled.div`
  position: absolute;
  inset: 0 0 auto 0;
  height: clamp(320px, 58vh, 640px);
  pointer-events: none;
  z-index: -9;
  background-image:
    linear-gradient(
      180deg,
      rgba(255, 255, 255, 0.86) 0%,
      rgba(255, 255, 255, 0.62) 34%,
      rgba(255, 255, 255, 0.28) 62%,
      rgba(255, 255, 255, 0.02) 100%
    ),
    url(${cityImage});
  background-position: center top, center top;
  background-size: cover, cover;
  background-repeat: no-repeat;
  opacity: 0.82;
  filter: saturate(0.9) contrast(0.94);
  -webkit-mask-image: linear-gradient(180deg, rgba(0, 0, 0, 0.98) 0%, rgba(0, 0, 0, 0.94) 40%, rgba(0, 0, 0, 0.36) 78%, rgba(0, 0, 0, 0) 100%);
  mask-image: linear-gradient(180deg, rgba(0, 0, 0, 0.98) 0%, rgba(0, 0, 0, 0.94) 40%, rgba(0, 0, 0, 0.36) 78%, rgba(0, 0, 0, 0) 100%);
`

const GlassOrb = styled.div`
  position: absolute;
  border-radius: 999px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.68), rgba(231, 217, 255, 0.3));
  border: 1px solid rgba(255, 255, 255, 0.46);
  backdrop-filter: blur(6px);
  box-shadow: 0 24px 60px -36px rgba(20, 0, 80, 0.35);
`

const TopOrb = styled(GlassOrb)`
  right: -90px;
  top: -50px;
  width: 280px;
  height: 280px;
  animation: ${floatRight} 8s ease-in-out infinite;
`

const BottomOrb = styled(GlassOrb)`
  left: -70px;
  bottom: -70px;
  width: 260px;
  height: 260px;
  animation: ${floatLeft} 9s ease-in-out infinite;
`

const Nav = styled.nav`
  animation: ${fadeUp} 550ms ease both;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 22px clamp(20px, 5vw, 56px);
`

const Brand = styled.span`
  font-size: clamp(1.4rem, 1.8vw, 1.8rem);
  font-weight: 900;
  letter-spacing: 0.02em;
  color: #4b2ca7;
`

const NavActions = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`

const GhostBtn = styled(Link)`
  text-decoration: none;
  color: #2f2456;
  font-weight: 700;
  padding: 10px 18px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.34);
  border: 1px solid rgba(255, 255, 255, 0.5);
`

const SolidBtn = styled(Link)`
  text-decoration: none;
  color: #fff;
  font-weight: 800;
  padding: 10px 18px;
  border-radius: 999px;
  background: linear-gradient(135deg, #592fd6, #7949ff);
  box-shadow: 0 18px 28px -20px rgba(67, 31, 184, 0.75);
`

const Hero = styled.section`
  animation: ${fadeUp} 760ms ease both;
  max-width: 1020px;
  margin: 0 auto;
  padding: clamp(24px, 6vw, 72px) clamp(20px, 5vw, 56px) 40px;
  text-align: center;
`

const Badge = styled.p`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin: 0;
  padding: 8px 14px;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.5);
  background: rgba(255, 255, 255, 0.28);
  color: #3d2f71;
  font-weight: 700;
  font-size: 0.86rem;
`

const Title = styled.h1`
  margin: 16px 0 14px;
  font-size: clamp(2.2rem, 5vw, 4.9rem);
  line-height: 1.02;
  letter-spacing: -0.03em;
  color: #1f163e;
`

const Subtitle = styled.p`
  margin: 0 auto;
  max-width: 760px;
  font-size: clamp(1rem, 1.4vw, 1.25rem);
  font-weight: 500;
  color: #2f2554;
  opacity: 0.9;
`

const Ctas = styled.div`
  margin-top: 28px;
  display: flex;
  justify-content: center;
  gap: 12px;
  flex-wrap: wrap;
`

const StartRideButtonWrap = styled.div`
  .button {
    --h-button: 48px;
    --w-button: 102px;
    --round: 0.75rem;
    cursor: pointer;
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    transition: all 0.25s ease;
    background: radial-gradient(
        65.28% 65.28% at 50% 100%,
        rgba(223, 113, 255, 0.8) 0%,
        rgba(223, 113, 255, 0) 100%
      ),
      linear-gradient(0deg, #7a5af8, #7a5af8);
    border-radius: var(--round);
    border: none;
    outline: none;
    padding: 14px 26px;
    min-width: 240px;
  }

  .button::before,
  .button::after {
    content: '';
    position: absolute;
    inset: var(--space);
    transition: all 0.5s ease-in-out;
    border-radius: calc(var(--round) - var(--space));
    z-index: 0;
  }

  .button::before {
    --space: 1px;
    background: linear-gradient(
      177.95deg,
      rgba(255, 255, 255, 0.19) 0%,
      rgba(255, 255, 255, 0) 100%
    );
  }

  .button::after {
    --space: 2px;
    background: radial-gradient(
        65.28% 65.28% at 50% 100%,
        rgba(223, 113, 255, 0.8) 0%,
        rgba(223, 113, 255, 0) 100%
      ),
      linear-gradient(0deg, #7a5af8, #7a5af8);
  }

  .button:active {
    transform: scale(0.95);
  }

  .fold {
    z-index: 1;
    position: absolute;
    top: 0;
    right: 0;
    height: 1rem;
    width: 1rem;
    display: inline-block;
    transition: all 0.5s ease-in-out;
    background: radial-gradient(
      100% 75% at 55%,
      rgba(223, 113, 255, 0.8) 0%,
      rgba(223, 113, 255, 0) 100%
    );
    box-shadow: 0 0 3px black;
    border-bottom-left-radius: 0.5rem;
    border-top-right-radius: var(--round);
  }

  .fold::after {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    width: 150%;
    height: 150%;
    transform: rotate(45deg) translateX(0%) translateY(-18px);
    background-color: #e8e8e8;
    pointer-events: none;
  }

  .button:hover .fold {
    margin-top: -1rem;
    margin-right: -1rem;
  }

  .points_wrapper {
    overflow: hidden;
    width: 100%;
    height: 100%;
    pointer-events: none;
    position: absolute;
    z-index: 1;
  }

  .points_wrapper .point {
    bottom: -10px;
    position: absolute;
    animation: floating-points infinite ease-in-out;
    pointer-events: none;
    width: 2px;
    height: 2px;
    background-color: #fff;
    border-radius: 9999px;
  }

  @keyframes floating-points {
    0% {
      transform: translateY(0);
    }

    85% {
      opacity: 0;
    }

    100% {
      transform: translateY(-55px);
      opacity: 0;
    }
  }

  .points_wrapper .point:nth-child(1) {
    left: 10%;
    opacity: 1;
    animation-duration: 2.35s;
    animation-delay: 0.2s;
  }

  .points_wrapper .point:nth-child(2) {
    left: 30%;
    opacity: 0.7;
    animation-duration: 2.5s;
    animation-delay: 0.5s;
  }

  .points_wrapper .point:nth-child(3) {
    left: 25%;
    opacity: 0.8;
    animation-duration: 2.2s;
    animation-delay: 0.1s;
  }

  .points_wrapper .point:nth-child(4) {
    left: 44%;
    opacity: 0.6;
    animation-duration: 2.05s;
  }

  .points_wrapper .point:nth-child(5) {
    left: 50%;
    opacity: 1;
    animation-duration: 1.9s;
  }

  .points_wrapper .point:nth-child(6) {
    left: 75%;
    opacity: 0.5;
    animation-duration: 1.5s;
    animation-delay: 1.5s;
  }

  .points_wrapper .point:nth-child(7) {
    left: 88%;
    opacity: 0.9;
    animation-duration: 2.2s;
    animation-delay: 0.2s;
  }

  .points_wrapper .point:nth-child(8) {
    left: 58%;
    opacity: 0.8;
    animation-duration: 2.25s;
    animation-delay: 0.2s;
  }

  .points_wrapper .point:nth-child(9) {
    left: 98%;
    opacity: 0.6;
    animation-duration: 2.6s;
    animation-delay: 0.1s;
  }

  .points_wrapper .point:nth-child(10) {
    left: 65%;
    opacity: 1;
    animation-duration: 2.5s;
    animation-delay: 0.2s;
  }

  .inner {
    z-index: 2;
    gap: 8px;
    position: relative;
    width: 100%;
    color: white;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    font-weight: 700;
    line-height: 1.5;
    transition: color 0.2s ease-in-out;
  }

  .inner svg.icon {
    width: 18px;
    height: 18px;
    transition: fill 0.1s linear;
  }

  .button:focus svg.icon {
    fill: white;
  }

  .button:hover svg.icon {
    fill: transparent;
    animation:
      dasharray 1s linear forwards,
      filled 0.1s linear forwards 0.95s;
  }

  @keyframes dasharray {
    from {
      stroke-dasharray: 0 0 0 0;
    }

    to {
      stroke-dasharray: 68 68 0 0;
    }
  }

  @keyframes filled {
    to {
      fill: white;
    }
  }
`

const SecondaryCta = styled(Link)`
  text-decoration: none;
  color: #2e2255;
  font-weight: 800;
  font-size: 1.02rem;
  border-radius: 999px;
  padding: 14px 30px;
  border: 1px solid rgba(255, 255, 255, 0.58);
  background: rgba(255, 255, 255, 0.3);
`

const Stats = styled.section`
  animation: ${fadeUp} 920ms ease both;
  max-width: 980px;
  margin: 30px auto 0;
  padding: 0 clamp(20px, 5vw, 56px) 48px;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;

  @media (max-width: 880px) {
    grid-template-columns: 1fr;
  }
`

const StatCard = styled.article`
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.36);
  border: 1px solid rgba(255, 255, 255, 0.48);
  backdrop-filter: blur(6px);
  padding: 18px 18px;
`

const StatNumber = styled.p`
  margin: 0;
  color: #4c2bb0;
  font-size: 1.8rem;
  font-weight: 900;
`

const StatLabel = styled.p`
  margin: 4px 0 0;
  color: #3a2e6b;
  font-size: 0.95rem;
  font-weight: 700;
`

export default function LandingPage() {
  const navigate = useNavigate()

  return (
    <Page>
      <Pattern />
      <CityBlend />
      <TopOrb />
      <BottomOrb />

      <Nav>
        <Brand>OnMyWay</Brand>
        <NavActions>
          <GhostBtn to="/signin">Sign in</GhostBtn>
          <SolidBtn to="/signup">Create account</SolidBtn>
        </NavActions>
      </Nav>

      <Hero>
        <Badge>Trusted Senior Ride Concierge</Badge>
        <Title>Comfortable Rides, Caring Drivers, Right On Time.</Title>
        <Subtitle>
          Coordinate safe rides for appointments, hospital visits, and daily errands with drivers trained for
          elder-friendly assistance.
        </Subtitle>

        <Ctas>
          <StartRideButtonWrap>
            <button type="button" className="button" onClick={() => navigate('/signin')}>
              <span className="fold" />
              <div className="points_wrapper">
                <i className="point" />
                <i className="point" />
                <i className="point" />
                <i className="point" />
                <i className="point" />
                <i className="point" />
                <i className="point" />
                <i className="point" />
                <i className="point" />
                <i className="point" />
              </div>

              <span className="inner">
                <svg
                  className="icon"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                >
                  <polyline points="13.18 1.37 13.18 9.64 21.45 9.64 10.82 22.63 10.82 14.36 2.55 14.36 13.18 1.37" />
                </svg>
                Start Your First Ride
              </span>
            </button>
          </StartRideButtonWrap>
        </Ctas>
      </Hero>

      <Stats>
        <StatCard>
          <StatNumber>12,000+</StatNumber>
          <StatLabel>Safe rides completed</StatLabel>
        </StatCard>
        <StatCard>
          <StatNumber>4.9/5</StatNumber>
          <StatLabel>Average rider satisfaction</StatLabel>
        </StatCard>
        <StatCard>
          <StatNumber>24/7</StatNumber>
          <StatLabel>Live concierge support</StatLabel>
        </StatCard>
      </Stats>
    </Page>
  )
}
