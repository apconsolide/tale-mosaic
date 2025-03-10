
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

const showcaseItems = [
  {
    id: "history",
    title: "Historical Events",
    description: "Create timelines for significant historical periods with rich context and multiple layers of information.",
    image: "https://images.unsplash.com/photo-1461360370896-922624d12aa1?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=1200",
    alt: "Ancient historical manuscript with timeline visualization"
  },
  {
    id: "education",
    title: "Educational Tools",
    description: "Engage students with interactive timelines that make learning history a visual and immersive experience.",
    image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=1200",
    alt: "Students using interactive timeline in classroom"
  },
  {
    id: "research",
    title: "Academic Research",
    description: "Visualize complex historical relationships and discover patterns across different time periods and regions.",
    image: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=1200",
    alt: "Researcher analyzing complex historical data visualizations"
  },
  {
    id: "museums",
    title: "Museum Exhibits",
    description: "Create engaging digital exhibits that bring artifacts and historical narratives to life for visitors.",
    image: "https://images.unsplash.com/photo-1564399579883-451a5cb44f17?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=1200",
    alt: "Modern museum with interactive historical timeline display"
  }
];

const ShowcaseSection = () => {
  const [activeTab, setActiveTab] = useState("history");
  
  return (
    <section className="py-24 bg-background">
      <div className="container px-6 mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-serif font-medium mb-4">Bring History to Life</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            See how Chronograph transforms historical data into compelling visual stories across different contexts.
          </p>
        </div>
        
        <Tabs 
          defaultValue="history" 
          value={activeTab}
          onValueChange={setActiveTab}
          className="max-w-5xl mx-auto"
        >
          <div className="flex justify-center mb-8">
            <TabsList className="bg-secondary">
              {showcaseItems.map((item) => (
                <TabsTrigger 
                  key={item.id} 
                  value={item.id}
                  className="text-sm px-5 py-2 data-[state=active]:text-primary"
                >
                  {item.title}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
          
          {showcaseItems.map((item) => (
            <TabsContent 
              key={item.id} 
              value={item.id}
              className="focus-visible:outline-none focus-visible:ring-0"
            >
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div 
                  className={`
                    order-2 md:order-1 
                    ${activeTab === item.id ? 'animate-fade-in' : ''}
                  `}
                >
                  <h3 className="text-2xl font-serif font-medium mb-4">{item.title}</h3>
                  <p className="text-lg text-muted-foreground mb-6">{item.description}</p>
                  <Button className="group">
                    <span>Learn more</span>
                    <ChevronRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
                
                <div 
                  className={`
                    order-1 md:order-2 glass-panel rounded-lg overflow-hidden shadow-lg 
                    ${activeTab === item.id ? 'animate-scale-in' : ''}
                  `}
                >
                  <AspectRatio ratio={16 / 9}>
                    <img 
                      src={item.image} 
                      alt={item.alt}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </AspectRatio>
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
};

export default ShowcaseSection;
