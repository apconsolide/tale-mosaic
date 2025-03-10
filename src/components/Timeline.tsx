
import React, { useRef, useEffect, useState } from 'react';
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from "lucide-react";
import { Button } from "@/components/ui/button";

// Sample timeline data
const timelineEvents = [
  {
    id: 1,
    year: 1492,
    title: "Columbus reaches America",
    description: "Christopher Columbus completes his first voyage across the Atlantic Ocean, landing in the Bahamas.",
    category: "exploration",
  },
  {
    id: 2,
    year: 1517,
    title: "Protestant Reformation begins",
    description: "Martin Luther publishes his Ninety-five Theses, challenging the Catholic Church's practices.",
    category: "religion",
  },
  {
    id: 3,
    year: 1687,
    title: "Newton's Principia published",
    description: "Isaac Newton publishes Philosophiæ Naturalis Principia Mathematica, establishing the foundation for classical mechanics.",
    category: "science",
  },
  {
    id: 4,
    year: 1789,
    title: "French Revolution begins",
    description: "The storming of the Bastille in Paris marks the beginning of the French Revolution.",
    category: "politics",
  },
  {
    id: 5,
    year: 1859,
    title: "Darwin's Origin of Species",
    description: "Charles Darwin publishes On the Origin of Species, introducing the theory of evolution by natural selection.",
    category: "science",
  },
  {
    id: 6,
    year: 1914,
    title: "World War I begins",
    description: "Archduke Franz Ferdinand is assassinated, triggering a chain of events leading to World War I.",
    category: "war",
  },
  {
    id: 7,
    year: 1969,
    title: "First Moon Landing",
    description: "Apollo 11 mission successfully lands the first humans on the Moon with Neil Armstrong and Buzz Aldrin.",
    category: "science",
  },
];

// Category styling
const categoryStyles: Record<string, string> = {
  exploration: "bg-blue-100 text-blue-800 border-blue-200",
  religion: "bg-purple-100 text-purple-800 border-purple-200",
  science: "bg-green-100 text-green-800 border-green-200",
  politics: "bg-orange-100 text-orange-800 border-orange-200",
  war: "bg-red-100 text-red-800 border-red-200",
};

const Timeline = () => {
  const timelineRef = useRef<HTMLDivElement>(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [visibleTimespan, setVisibleTimespan] = useState({ start: 1450, end: 2000 });
  
  // Handle zoom functionality
  const handleZoom = (direction: 'in' | 'out') => {
    const newZoomLevel = direction === 'in' 
      ? Math.min(zoomLevel + 0.25, 3) 
      : Math.max(zoomLevel - 0.25, 0.5);
    
    setZoomLevel(newZoomLevel);
    
    // Adjust visible timespan based on zoom
    const midpoint = (visibleTimespan.start + visibleTimespan.end) / 2;
    const range = (visibleTimespan.end - visibleTimespan.start) * (direction === 'in' ? 0.9 : 1.1);
    
    setVisibleTimespan({
      start: Math.floor(midpoint - range / 2),
      end: Math.ceil(midpoint + range / 2)
    });
  };
  
  // Handle timeline navigation
  const handleNavigate = (direction: 'left' | 'right') => {
    const timespan = visibleTimespan.end - visibleTimespan.start;
    const shift = timespan * 0.2;
    
    if (direction === 'left') {
      setVisibleTimespan({
        start: visibleTimespan.start - shift,
        end: visibleTimespan.end - shift
      });
    } else {
      setVisibleTimespan({
        start: visibleTimespan.start + shift,
        end: visibleTimespan.end + shift
      });
    }
  };

  // Calculate position based on year
  const calculatePosition = (year: number) => {
    const timelineStart = visibleTimespan.start;
    const timelineEnd = visibleTimespan.end;
    const timelineWidth = timelineEnd - timelineStart;
    
    // Calculate percentage along the timeline
    return ((year - timelineStart) / timelineWidth) * 100;
  };
  
  // Filter events to show only those in visible timespan
  const visibleEvents = timelineEvents.filter(
    event => event.year >= visibleTimespan.start && event.year <= visibleTimespan.end
  );
  
  // Create decade markers
  const createDecadeMarkers = () => {
    const markers = [];
    const startDecade = Math.floor(visibleTimespan.start / 10) * 10;
    const endDecade = Math.ceil(visibleTimespan.end / 10) * 10;
    
    for (let year = startDecade; year <= endDecade; year += 10) {
      if (year >= visibleTimespan.start && year <= visibleTimespan.end) {
        const position = calculatePosition(year);
        markers.push(
          <div 
            key={year} 
            className="absolute h-4 border-l border-gray-300 transform -translate-x-1/2"
            style={{ left: `${position}%` }}
          >
            {year % 50 === 0 && (
              <div className="absolute -bottom-6 text-xs text-gray-500 transform -translate-x-1/2">
                {year}
              </div>
            )}
          </div>
        );
      }
    }
    
    return markers;
  };

  // Animation for timeline events on mount
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('opacity-100', 'translate-y-0');
            entry.target.classList.remove('opacity-0', 'translate-y-4');
          }
        });
      },
      { threshold: 0.1 }
    );

    const eventElements = document.querySelectorAll('.timeline-event');
    eventElements.forEach(el => observer.observe(el));

    return () => {
      eventElements.forEach(el => observer.unobserve(el));
    };
  }, [visibleEvents]);

  return (
    <section className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-serif font-medium mb-4">Explore History on an Interactive Timeline</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Navigate through different eras and zoom in to discover detailed events.
          </p>
        </div>
        
        <div 
          ref={timelineRef}
          className="relative glass-panel rounded-xl p-8 shadow-lg overflow-hidden"
        >
          {/* Timeline controls */}
          <div className="flex justify-between items-center mb-10">
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => handleNavigate('left')}
                aria-label="Navigate left"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => handleNavigate('right')}
                aria-label="Navigate right"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="text-sm font-medium">
              {visibleTimespan.start} — {visibleTimespan.end}
            </div>
            
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => handleZoom('out')}
                aria-label="Zoom out"
                disabled={zoomLevel <= 0.5}
              >
                <ZoomOut className="w-4 h-4" />
              </Button>
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => handleZoom('in')}
                aria-label="Zoom in"
                disabled={zoomLevel >= 3}
              >
                <ZoomIn className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          {/* Timeline ruler */}
          <div className="relative h-8 mb-8 border-b border-gray-200">
            {createDecadeMarkers()}
          </div>
          
          {/* Timeline events */}
          <div 
            className="relative pt-4"
            style={{ height: `${Math.max(visibleEvents.length * 80, 200)}px` }}
          >
            {visibleEvents.map((event, index) => {
              const position = calculatePosition(event.year);
              
              // Alternate vertical position to avoid overlap
              const verticalPosition = index % 2 === 0 ? 0 : 150;
              
              return (
                <div 
                  key={event.id}
                  className={cn(
                    "timeline-event absolute w-64 transition-all duration-500",
                    "opacity-0 translate-y-4",
                  )}
                  style={{ 
                    left: `${position}%`, 
                    top: `${verticalPosition}px`,
                    transitionDelay: `${index * 100}ms`,
                    transform: `translateX(-${position > 80 ? 100 : position < 20 ? 0 : 50}%)`
                  }}
                >
                  <div className="timeline-card">
                    <span 
                      className={cn(
                        "inline-block px-2 py-0.5 text-xs rounded-full border mb-2",
                        categoryStyles[event.category] || "bg-gray-100 text-gray-800 border-gray-200"
                      )}
                    >
                      {event.category}
                    </span>
                    <h3 className="text-lg font-medium mb-1">{event.title}</h3>
                    <div className="text-sm font-bold text-primary mb-2">{event.year}</div>
                    <p className="text-sm text-muted-foreground">{event.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Timeline;
