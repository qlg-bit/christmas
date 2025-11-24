import React, { useState } from 'react';
import { Calendar, MapPin, Info, CheckCircle2, TreePine, CalendarX2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { InfoCard } from './components/InfoCard';
import { RsvpModal } from './components/RsvpModal';
import { RsvpStatus, GuestFormData } from './types';

interface PolkaDotGiftBoxProps {
  variant: 'green' | 'black';
  className?: string;
  onClick?: () => void;
}

// Recreated SVG based on the attached images (Green/Red and Black/Grey with Polka Dots)
const PolkaDotGiftBox: React.FC<PolkaDotGiftBoxProps> = ({ variant, className, onClick }) => {
  const isGreen = variant === 'green';

  // Colors based on the request
  const colors = {
    box: isGreen ? '#34d399' : '#1f2937', // Green-400 or Slate-800
    dots: isGreen ? '#6ee7b7' : '#374151', // Green-300 or Slate-700
    ribbon: isGreen ? '#ef4444' : '#9ca3af', // Red-500 or Gray-400
    bow: isGreen ? '#ef4444' : '#9ca3af', // Red-500 or Gray-400
    bowInside: isGreen ? '#b91c1c' : '#4b5563', // Red-700 or Gray-600
  };

  return (
    <div 
      className={`relative drop-shadow-2xl filter ${className || ''} ${onClick ? 'cursor-pointer hover:scale-105 transition-transform' : ''}`}
      onClick={onClick}
    >
      <svg width="180" height="180" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        
        {/* Box Base */}
        <rect x="20" y="35" width="60" height="50" rx="2" fill={colors.box} />
        
        {/* Polka Dots Pattern on Box */}
        <circle cx="30" cy="45" r="4" fill={colors.dots} />
        <circle cx="30" cy="75" r="4" fill={colors.dots} />
        <circle cx="70" cy="45" r="4" fill={colors.dots} />
        <circle cx="70" cy="75" r="4" fill={colors.dots} />
        <circle cx="50" cy="60" r="4" fill={colors.dots} />
        
        {/* Lid */}
        <rect x="15" y="20" width="70" height="15" rx="2" fill={colors.box} />
        
        {/* Polka Dots Pattern on Lid */}
        <circle cx="25" y="27.5" r="3" fill={colors.dots} />
        <circle cx="75" y="27.5" r="3" fill={colors.dots} />

        {/* Vertical Ribbon (Box) */}
        <rect x="45" y="35" width="10" height="50" fill={colors.ribbon} />
        {/* Vertical Ribbon (Lid) */}
        <rect x="45" y="20" width="10" height="15" fill={colors.ribbon} />

        {/* Bow */}
        <path d="M50 20 C50 20, 30 0, 15 10 C10 15, 40 25, 50 20" fill={colors.ribbon} />
        <path d="M50 20 C50 20, 70 0, 85 10 C90 15, 60 25, 50 20" fill={colors.ribbon} />
        
        {/* Bow Knot */}
        <rect x="45" y="15" width="10" height="10" rx="2" fill={colors.ribbon} />
      </svg>
    </div>
  );
};

function App() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<RsvpStatus>(RsvpStatus.UNDECIDED);
  const [submittedData, setSubmittedData] = useState<GuestFormData | null>(null);
  const [isHoveringNotAttending, setIsHoveringNotAttending] = useState(false);
  
  // Animation States
  const [showNotAttendingOverlay, setShowNotAttendingOverlay] = useState(false);

  const triggerSnow = () => {
    const duration = 2000;
    const end = Date.now() + duration;

    (function frame() {
      // Confetti from left
      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#ffffff', '#e2e8f0', '#dbeafe'],
        shapes: ['circle'],
        drift: 0.5,
        gravity: 0.8,
        scalar: 0.8
      });
      // Confetti from right
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#ffffff', '#e2e8f0', '#dbeafe'],
        shapes: ['circle'],
        drift: -0.5,
        gravity: 0.8,
        scalar: 0.8
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    }());
  };

  const handleOpenRsvp = (status: RsvpStatus) => {
    if (status === RsvpStatus.ATTENDING) {
      // Trigger Snow Effect
      triggerSnow();
      
      // Open modal after a brief delay to enjoy the snow
      setTimeout(() => {
        setSelectedStatus(status);
        setModalOpen(true);
      }, 800);
    } else {
      // Trigger Not Attending Flow (Overlay)
      setShowNotAttendingOverlay(true);
      setSelectedStatus(status);
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleCloseOverlay = () => {
    // Attempt to close the tab/window
    try {
      window.close();
    } catch (e) {
      console.log('Close rejected', e);
    }
    
    // Fallback behavior if browser blocks window.close()
    const win = window.open("about:blank", "_self");
    if (win) win.close();
  };

  const handleFormSubmit = (data: GuestFormData) => {
    console.log("Submitting RSVP:", data);
    setSubmittedData(data);
  };

  // Render Confirmation Screen
  if (submittedData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-holiday-cream p-4">
        <div className="bg-white max-w-lg w-full rounded-2xl shadow-xl p-8 text-center animate-in zoom-in-95 duration-500">
          <div className="w-16 h-16 bg-holiday-green/10 text-holiday-green rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={32} />
          </div>
          <h1 className="font-serif text-3xl font-bold text-slate-900 mb-2">RSVP Confirmed</h1>
          <p className="text-slate-600 mb-6">
            Thank you, {submittedData.name}! <br/>
            We have reserved your spot. See you at the party!
          </p>
          <button 
            onClick={() => setSubmittedData(null)}
            className="mt-4 text-sm text-slate-400 hover:text-slate-600 underline"
          >
            Modify Response
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex flex-col items-center bg-holiday-cream selection:bg-holiday-red selection:text-white pb-20 transition-all duration-700 ease-in-out ${isHoveringNotAttending ? 'grayscale brightness-90 bg-slate-200' : ''}`}>
      
      {/* Not Attending Overlay (Black & White Gift Box) */}
      {showNotAttendingOverlay && (
        <div className="fixed inset-0 z-[100] bg-slate-100/95 backdrop-blur-md flex items-center justify-center animate-in fade-in duration-500">
          <div className="flex flex-col items-center animate-in zoom-in-50 duration-500 slide-in-from-bottom-10">
            <div className="relative group cursor-pointer" onClick={handleCloseOverlay}>
              {/* Click Me - Moved to top */}
              <div className="absolute -top-12 left-1/2 -translate-x-1/2 whitespace-nowrap text-slate-500 font-serif italic text-lg animate-bounce">
                Click me
              </div>
              <PolkaDotGiftBox 
                variant="black" 
                className="hover:scale-105 transition-transform duration-300"
              />
            </div>
            {/* Replaced Text */}
            <p className="mt-12 text-slate-400 font-sans text-sm tracking-widest uppercase">here's a little gift for you</p>
          </div>
        </div>
      )}

      {/* 1. Banner Section */}
      <div className="w-full h-[40vh] md:h-[50vh] relative overflow-hidden transition-all duration-700">
        <img 
          src="/banner.png" 
          onError={(e) => {
            const target = e.currentTarget;
            target.src = "https://i.postimg.cc/Ss2BqTb8/Christmas-banner.png";
          }}
          alt="Christmas Party Hosts" 
          // object-top ensures faces are visible if image is cropped on small screens
          className="w-full h-full object-cover object-top"
        />
      </div>

      {/* Main Content Container */}
      <div className="w-full max-w-4xl px-4 -mt-16 z-30 relative">
        <div className={`bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100 transition-all duration-500 ${isHoveringNotAttending ? 'shadow-2xl scale-[0.99]' : 'shadow-xl'}`}>
          
          {/* New Title Section */}
          <div className="p-8 pb-4 text-center">
            <span className="text-holiday-gold font-medium tracking-widest text-xs md:text-sm uppercase mb-2 block">
              You are invited to
            </span>
            <h1 className="font-serif text-3xl md:text-5xl font-bold text-slate-900">
              A Christmas Party
            </h1>
            <div className="w-24 h-1 bg-holiday-red/20 rounded-full mx-auto mt-4"></div>
          </div>

          {/* 3. CTA Buttons */}
          <div className="grid grid-cols-2 gap-0 relative">
            
            {/* Attending Button */}
            <button 
              onClick={() => handleOpenRsvp(RsvpStatus.ATTENDING)}
              className={`
                group relative h-64 md:h-80 flex flex-col items-center justify-center p-4 md:p-8 
                transition-all duration-500 text-white 
                border-r border-green-800/20 z-10 overflow-hidden
                ${isHoveringNotAttending ? 'opacity-40 grayscale blur-[1px]' : 'bg-holiday-green hover:bg-[#106932]'}
              `}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative z-10 flex flex-col items-center transform group-hover:-translate-y-2 transition-transform duration-300">
                <div className="mb-4 md:mb-6 p-3 md:p-4 rounded-full bg-white/10 group-hover:bg-white/20 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 shadow-lg">
                  <TreePine className="w-8 h-8 md:w-10 md:h-10 group-hover:animate-bounce" />
                </div>
                <span className="font-serif text-xl md:text-3xl font-semibold mb-2 drop-shadow-sm text-center">Attending</span>
                <span className="hidden md:block opacity-80 text-sm tracking-wider uppercase group-hover:opacity-100 transition-opacity">I can't wait!</span>
              </div>
            </button>
            
            {/* Not Attending Button */}
            <button 
              onMouseEnter={() => setIsHoveringNotAttending(true)}
              onMouseLeave={() => setIsHoveringNotAttending(false)}
              onClick={() => handleOpenRsvp(RsvpStatus.NOT_ATTENDING)}
              className="group relative h-64 md:h-80 flex flex-col items-center justify-center p-4 md:p-8 bg-slate-50 hover:bg-slate-100 transition-all duration-500 text-slate-700 z-20"
            >
              <div className="relative z-10 flex flex-col items-center transform group-hover:scale-95 transition-transform duration-500">
                <div className={`
                  mb-4 md:mb-6 p-3 md:p-4 rounded-full transition-all duration-500 shadow-sm
                  ${isHoveringNotAttending ? 'bg-slate-800 text-white scale-110' : 'bg-slate-200 text-slate-600'}
                `}>
                  <CalendarX2 className="w-8 h-8 md:w-10 md:h-10" />
                </div>
                <span className={`font-serif text-xl md:text-3xl font-semibold mb-2 transition-colors duration-300 text-center ${isHoveringNotAttending ? 'text-slate-900' : 'text-slate-700'}`}>
                  Not Attending
                </span>
                <span className="hidden md:block opacity-60 text-sm tracking-wider uppercase group-hover:text-red-900 transition-colors">Maybe next year</span>
              </div>
            </button>
          </div>

          {/* 4. Information Section */}
          <div className="grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-100 bg-white relative z-10">
            <InfoCard 
              icon={Calendar} 
              title="When" 
              details={["Saturday, December 24th", "Starts at 7:00 PM"]} 
            />
            <InfoCard 
              icon={MapPin} 
              title="Where" 
              details={["The Smith Residence", "123 Snowflake Lane", "North Pole, NP 99999"]} 
            />
            <InfoCard 
              icon={Info} 
              title="Details" 
              details={["Dress Code: Festive Cocktail", "Secret Santa Exchange ($20)"]} 
            />
          </div>
        </div>
      </div>

      {/* Footer / Extra Space */}
      <footer className="mt-12 text-slate-400 text-sm font-medium transition-opacity duration-300">
        <p>Please RSVP by December 10th</p>
      </footer>

      {/* RSVP Modal - Only for Attending now */}
      <RsvpModal 
        isOpen={modalOpen} 
        onClose={handleCloseModal} 
        status={selectedStatus}
        onSubmit={handleFormSubmit}
      />

    </div>
  );
}

export default App;