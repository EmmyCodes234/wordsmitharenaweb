import React, { useState, useEffect } from 'react';
import { Shield, Book, Zap, ArrowRight, Trophy, Medal, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

const RevealOnScroll: React.FC<{ children: React.ReactNode; delay?: number; direction?: 'up' | 'down' | 'left' | 'right'; className?: string }> = ({ children, delay = 0, direction = 'up', className = '' }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [delay]);

  let transformValue = 'translateY(40px)';
  if (direction === 'down') transformValue = 'translateY(-40px)';
  if (direction === 'left') transformValue = 'translateX(40px)';
  if (direction === 'right') transformValue = 'translateX(-40px)';

  return (
    <div
      ref={ref}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translate(0,0)' : transformValue,
        transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
      className={className}
    >
      {children}
    </div>
  );
};

const FAQItem: React.FC<{ question: string; answer: string }> = ({ question, answer }) => {
  const [open, setOpen] = useState(false);
  return (
    <div 
      className="bg-white hover:bg-black/[0.02] border border-black/5 rounded-2xl p-5 sm:p-6 px-6 sm:px-8 cursor-pointer transition-colors shadow-sm"
      onClick={() => setOpen(!open)}
    >
      <div className="flex justify-between items-center gap-4">
        <span className="text-base sm:text-lg font-medium text-black">{question}</span>
        <div className="w-8 h-8 rounded-full bg-black/5 flex items-center justify-center flex-shrink-0 transition-transform duration-300" style={{ transform: open ? 'rotate(45deg)' : 'rotate(0deg)' }}>
          <span className="text-xl font-light text-black/60 leading-none mb-1">+</span>
        </div>
      </div>
      <div className={`overflow-hidden transition-all duration-300 ${open ? 'max-h-96 mt-4 opacity-100' : 'max-h-0 opacity-0'}`}>
        <p className="text-black/60 font-light text-sm leading-relaxed">{answer}</p>
      </div>
    </div>
  );
};

const faqData = [
  { 
    q: "Why should I choose The Wordsmiths Arena for competitive Scrabble?", 
    a: "The Wordsmiths Arena is built by Scrabble players, for Scrabble players. We focus on creating an intimate, well-organized retreat where every detail — from boards and timers to pairings and prizes — is handled so you can focus entirely on your game." 
  },
  { 
    q: "What lexicon is used in your tournaments?", 
    a: "We use the CSW24 (Collins Scrabble Words 2024) lexicon for all our tournaments. This is the internationally recognized word list used in WESPA-rated events worldwide." 
  },
  { 
    q: "How does the pairing system work?", 
    a: "Pairings are managed by DirektorPro, a professional tournament management tool developed by Emmanuel Enyi. The format is structured across 10 rounds: the first 2 rounds are Random (no repeats), rounds 3–7 use Lagged pairings (no repeats), and the final 3 rounds are King of the Hill (with repeats allowed) for a thrilling finish." 
  },
  { 
    q: "Are electronic timers and specialized boards provided?", 
    a: "Boards and timers are not provided at the venue. All players are advised to bring their own Scrabble boards and electronic timers to the retreat." 
  }
];

export const Home: React.FC = () => {
  const [currentHeroImage, setCurrentHeroImage] = useState(0);

  const heroImages = [
    '/1001876893.jpg',
    '/1001876894.jpg',
    '/1001876956.jpg'
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHeroImage((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [heroImages.length]);

  return (
    <>
      <section id="hero" className="relative h-screen min-h-[600px] md:min-h-[800px] flex flex-col justify-center text-left px-6 sm:px-8 md:px-16 overflow-hidden bg-white">
        {/* Minimalist Background Image Slider */}
        <div className="absolute inset-0 z-0 bg-black">
          {heroImages.map((src, index) => (
            <div 
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                index === currentHeroImage ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <img src={src} alt="Scrabble Event" className="w-full h-full object-cover" />
            </div>
          ))}
          <div className="absolute inset-0 bg-black/40 z-10 transition-opacity"></div>
        </div>

        {/* Content Container positioned center left */}
        <div className="relative z-20 max-w-4xl mt-20 sm:mt-32">
          <RevealOnScroll delay={100}>
            <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-[6rem] font-medium text-white leading-[1.05] tracking-tight mb-6 sm:mb-8">
              Feel at home,<br />everywhere.
            </h1>
          </RevealOnScroll>

          <RevealOnScroll delay={200}>
            <p className="text-white/90 font-light text-lg sm:text-xl md:text-2xl max-w-2xl mb-8 sm:mb-12 leading-relaxed">
              Step into the arena. Compete, connect, and sharpen your game at Nigeria's <span className="underline underline-offset-8 decoration-1">ultimate Scrabble retreat</span>.
            </p>
          </RevealOnScroll>

          <RevealOnScroll delay={300}>
            <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
              <button onClick={() => {
                document.getElementById('next-event')?.scrollIntoView({ behavior: 'smooth' });
              }} className="bg-white text-black font-semibold text-sm md:text-base px-10 py-4 rounded-full hover:bg-gray-100 transition-colors w-full md:w-auto text-center tracking-wide">
                Discover the Arena
              </button>
              <Link to="/wordsmithsarenasecondedition" className="flex items-center justify-center gap-3 bg-[#111111] text-white font-medium text-sm md:text-base px-10 py-4 rounded-full hover:bg-black transition-all w-full md:w-auto text-center tracking-wide group">
                <Zap size={16} className="text-white group-hover:text-noovo-yellow transition-colors" />
                Register Now
              </Link>
            </div>
          </RevealOnScroll>
        </div>
        
        {/* Scroll Indicator (Bottom right like the image) */}
        <div className="absolute bottom-8 right-8 sm:bottom-12 sm:right-12 z-20 flex gap-2">
           <span className="w-8 h-2 rounded-full bg-white shadow-sm"></span>
           <span className="w-2 h-2 rounded-full bg-white/50"></span>
           <span className="w-2 h-2 rounded-full bg-white/50"></span>
        </div>
      </section>

      <main className="pt-20 sm:pt-32 pb-20 sm:pb-40 relative z-10 w-full overflow-hidden">
        {/* Split Image Section a la Noovo */}
        <section id="next-event" className="max-w-[1400px] mx-auto px-6 mb-40">
          <RevealOnScroll>
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl sm:text-5xl md:text-6xl font-medium text-black leading-tight tracking-tight mb-6">
                Competition made easy.<br />No rated experience necessary.
              </h2>
              <p className="text-black/60 text-lg md:text-xl font-light">
                We don't just host exceptional events—we craft a competitive experience that's simple, seamless, and stress-free.
              </p>
              <div className="mt-10">
                 <Link to="/registered-players" className="bg-[#111111] text-white px-8 py-4 rounded-full font-medium hover:bg-black transition-colors inline-block">
                   Discover Contenders
                 </Link>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
              <div className="rounded-[2rem] overflow-hidden aspect-[4/3]">
                <img src="/IMG-20260228-WA0023.jpg" alt="Premium Scrabble Board" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
              </div>
              <div className="rounded-[2rem] overflow-hidden aspect-[4/3]">
                <img src="/IMG-20260228-WA0019.jpg" alt="Players" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
              </div>
            </div>
          </RevealOnScroll>
        </section>

        {/* FAQ Section (Noovo Style) */}
        <section className="max-w-4xl mx-auto px-6 mb-40">
           <RevealOnScroll>
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-medium text-black tracking-tight">Frequently Asked Questions</h2>
            </div>
          </RevealOnScroll>
          
          <div className="flex flex-col gap-4">
            {faqData.map((item, i) => (
              <RevealOnScroll key={i} delay={i * 100}>
                <FAQItem question={item.q} answer={item.a} />
              </RevealOnScroll>
            ))}
          </div>
        </section>

        {/* Noovo Yellow Newsletter Section */}
        <section className="w-full bg-noovo-yellow py-16 sm:py-32 px-6 rounded-t-[2rem] sm:rounded-t-[3rem]">
          <RevealOnScroll>
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl sm:text-5xl md:text-6xl font-medium text-black leading-tight tracking-tight mb-6 sm:mb-8">
                Subscribe to<br />The Arena's Newsletter
              </h2>
              <p className="text-black/70 text-lg md:text-xl font-light mb-12">
                Subscribe for the latest news, updates and adventures.
              </p>
              
              <form className="flex flex-col md:flex-row gap-4 justify-center items-center mb-12" onSubmit={(e) => e.preventDefault()}>
                <input type="text" placeholder="First Name*" className="w-full md:w-48 bg-white border-0 rounded-xl px-6 py-4 text-black placeholder:text-black/40 focus:outline-none focus:ring-2 focus:ring-black" />
                <input type="email" placeholder="Email address*" className="w-full md:w-64 bg-white border-0 rounded-xl px-6 py-4 text-black placeholder:text-black/40 focus:outline-none focus:ring-2 focus:ring-black" />
                <input type="text" placeholder="Zip code*" className="w-full md:w-40 bg-white border-0 rounded-xl px-6 py-4 text-black placeholder:text-black/40 focus:outline-none focus:ring-2 focus:ring-black" />
                <button className="w-full md:w-auto bg-[#111111] text-white font-medium rounded-xl px-10 py-4 hover:bg-black transition-colors">
                  Subscribe
                </button>
              </form>
              
              <p className="text-black/50 text-sm max-w-2xl mx-auto">
                We ask for your name and ZIP code to personalize content and share relevant updates, events, and offers in your area.
              </p>
            </div>
          </RevealOnScroll>
        </section>
      </main>
    </>
  );
};
