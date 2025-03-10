
import React from 'react';
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

const InfoGraphic = () => {
  return (
    <div className="my-10 container px-4 mx-auto">
      <div className="max-w-[2000px] mx-auto">
        <AspectRatio ratio={2.5} className="bg-white border rounded-lg shadow-lg overflow-hidden">
          <div className="w-full h-full p-8 relative">
            {/* Header */}
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground">
                The Evolution of Human Civilization
              </h2>
              <p className="text-muted-foreground mt-2 text-lg">
                A timeline of key historical developments through the ages
              </p>
            </div>
            
            {/* Timeline visualization */}
            <div className="w-full h-[120px] bg-gradient-to-r from-secondary to-muted relative rounded-xl mb-8">
              {/* Timeline points */}
              {[
                { year: "10,000 BCE", label: "Agricultural Revolution", left: "5%" },
                { year: "3,000 BCE", label: "First Civilizations", left: "20%" },
                { year: "500 BCE", label: "Classical Age", left: "35%" },
                { year: "500 CE", label: "Medieval Period", left: "50%" },
                { year: "1500 CE", label: "Renaissance", left: "65%" },
                { year: "1800 CE", label: "Industrial Revolution", left: "80%" },
                { year: "2000 CE", label: "Digital Age", left: "95%" },
              ].map((point, index) => (
                <div 
                  key={index}
                  className="absolute top-1/2 transform -translate-y-1/2"
                  style={{ left: point.left }}
                >
                  <div className="w-4 h-4 bg-primary rounded-full mb-2"></div>
                  <div className="text-sm font-medium whitespace-nowrap">{point.year}</div>
                  <div className="text-xs text-muted-foreground whitespace-nowrap">{point.label}</div>
                </div>
              ))}
              
              {/* Timeline line */}
              <div className="absolute top-1/2 left-0 w-full h-1 bg-primary transform -translate-y-1/2"></div>
            </div>
            
            {/* Main statistics and data points */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {[
                {
                  title: "World Population Growth",
                  stat: "8 Billion",
                  desc: "From just 5 million in 10,000 BCE to 8 billion today",
                  icon: "📈"
                },
                {
                  title: "Written Languages",
                  stat: "7,000+",
                  desc: "Distinct languages developed throughout human history",
                  icon: "🔤"
                },
                {
                  title: "Major Empires",
                  stat: "70+",
                  desc: "Significant imperial powers that shaped human history",
                  icon: "👑"
                },
              ].map((item, index) => (
                <div key={index} className="glass-panel rounded-xl p-6">
                  <div className="text-3xl mb-2">{item.icon}</div>
                  <h3 className="text-xl font-medium mb-1">{item.title}</h3>
                  <div className="text-2xl font-bold text-primary mb-2">{item.stat}</div>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </div>
            
            {/* Key developments section */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[
                {
                  era: "Ancient Period",
                  years: "3000 BCE - 500 BCE",
                  development: "Development of writing, mathematics, early states",
                  color: "bg-blue-50 border-blue-200"
                },
                {
                  era: "Classical Period",
                  years: "500 BCE - 500 CE",
                  development: "Philosophy, democracy, organized religion, empires",
                  color: "bg-green-50 border-green-200"
                },
                {
                  era: "Medieval Period",
                  years: "500 CE - 1500 CE",
                  development: "Feudal systems, spread of major religions, trade networks",
                  color: "bg-yellow-50 border-yellow-200"
                },
                {
                  era: "Modern Period",
                  years: "1500 CE - Present",
                  development: "Scientific method, industrialization, globalization, digital revolution",
                  color: "bg-red-50 border-red-200"
                }
              ].map((era, index) => (
                <div 
                  key={index} 
                  className={`rounded-lg p-4 border ${era.color}`}
                >
                  <h4 className="font-medium text-lg mb-1">{era.era}</h4>
                  <div className="text-xs font-medium text-muted-foreground mb-2">{era.years}</div>
                  <p className="text-sm">{era.development}</p>
                </div>
              ))}
            </div>
            
            {/* Footer with source information */}
            <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center text-xs text-muted-foreground">
              <div>Source: Historical archives and academic research compilations</div>
              <div>© {new Date().getFullYear()} Chronograph - Historical Storytelling</div>
            </div>
            
            {/* Download button */}
            <Button 
              size="sm" 
              className="absolute top-4 right-4"
              variant="outline"
            >
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
          </div>
        </AspectRatio>
      </div>
    </div>
  );
};

export default InfoGraphic;
