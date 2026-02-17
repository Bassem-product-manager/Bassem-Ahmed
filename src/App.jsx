import Hero from './components/Hero';
import PortfolioSection from './components/PortfolioSection';
import Timeline from './components/Timeline';
import GlassDeck from './components/GlassDeck';
import GitHubPortfolioSection from './components/GitHubPortfolioSection';
import ConnectMeSection from './components/ConnectMeSection';

export default function App() {
  return (
    <>
      <Hero />
      <Timeline />
      <GlassDeck />
      <PortfolioSection />
      <GitHubPortfolioSection />
      <ConnectMeSection />
    </>
  );
}
