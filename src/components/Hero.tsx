
import React, { useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { ChevronDown, Clock, Globe, BookOpen, Layers } from "lucide-react";
import { cn } from "@/lib/utils";

const Hero = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  
  // Smooth parallax effect on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (!heroRef.current) return;
      const scrollY = window.scrollY;
      
      // Apply parallax to hero content
      const heroContent = heroRef.current.querySelector('.hero-content');
      if (heroContent instanceof HTMLElement) {
        heroContent.style.transform = `translateY(${scrollY * 0.2}px)`;
        heroContent.style.opacity = String(1 - scrollY * 0.002);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section 
      ref={heroRef} 
      className="relative h-screen overflow-hidden flex items-center justify-center hero-gradient"
    >
      {/* Background circles decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -right-20 top-20 w-96 h-96 rounded-full bg-primary/5 animate-float"></div>
        <div className="absolute -left-40 top-40 w-80 h-80 rounded-full bg-primary/10 animate-float animate-delay-200"></div>
        <div className="absolute right-60 bottom-20 w-64 h-64 rounded-full bg-primary/5 animate-float animate-delay-300"></div>
      </div>
      
      {/* Main Content */}
      <div className="hero-content text-center relative z-10 px-6 max-w-4xl">
        <div className="inline-block mb-8">
          <div className="px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-sm font-medium text-primary animate-fade-in">
            Introducing Chronograph — The Future of Historical Storytelling
          </div>
        </div>
        
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-medium tracking-tight mb-6 animate-slide-down">
          Transform History into <br />
          <span className="text-primary">Interactive Narratives</span>
        </h1>
        
        <p className="text-lg md:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto text-balance animate-fade-in animate-delay-200">
          Create stunning visual narratives and infographics that bring historical stories to life with our intuitive, powerful timeline generation platform.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 animate-fade-in animate-delay-300">
          <Button size="lg" className="px-8 py-6 text-base">
            Start Creating
          </Button>
          <Button size="lg" variant="outline" className="px-8 py-6 text-base">
            Explore Examples
          </Button>
        </div>
        
        {/* Feature badges */}
        <div className="mt-16 flex flex-wrap justify-center gap-4 text-sm text-muted-foreground animate-fade-in animate-delay-400">
          <FeatureBadge icon={Clock} text="Dynamic Timelines" />
          <FeatureBadge icon={Globe} text="Geographic Mapping" />
          <FeatureBadge icon={BookOpen} text="Narrative Analysis" />
          <FeatureBadge icon={Layers} text="Multi-layered Visualization" />
        </div>
      </div>
      
      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center animate-bounce">
        <ChevronDown className="w-6 h-6 text-primary" />
      </div>
    </section>
  );
};

interface FeatureBadgeProps {
  icon: React.FC<{ className?: string }>;
  text: string;
}

const FeatureBadge = ({ icon: Icon, text }: FeatureBadgeProps) => (
  <div className={cn(
    "flex items-center gap-2 px-4 py-2 rounded-full",
    "bg-background border border-border",
    "transition-all hover:border-primary/20 hover:bg-primary/5"
  )}>
    <Icon className="w-4 h-4 text-primary" />
    <span>{text}</span>
  </div>
);

export default Hero;
