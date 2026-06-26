import { useState } from 'react';
import { useLenis } from '@/hooks/useLenis';
import Navigation from '@/components/Navigation';
import Hero from '@/sections/Hero';
import MissionStats from '@/sections/MissionStats';
import Services from '@/sections/Services';
import Projects from '@/sections/Projects';
import Testimonials from '@/sections/Testimonials';
import CTAContact from '@/sections/CTAContact';
import Footer from '@/sections/Footer';
import MeetingModal from '@/components/MeetingModal';

function App() {
  useLenis();
  const [isMeetingOpen, setIsMeetingOpen] = useState(false);

  return (
    <div className="relative">
      <Navigation />
      <main>
        <Hero />
        <MissionStats />
        <Services />
        <Projects />
        <Testimonials />
        <CTAContact />
      </main>
      <Footer onBookMeeting={() => setIsMeetingOpen(true)} />
      <MeetingModal isOpen={isMeetingOpen} onClose={() => setIsMeetingOpen(false)} />
    </div>
  );
}

export default App;
