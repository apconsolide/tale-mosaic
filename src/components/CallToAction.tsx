
import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const CallToAction = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div 
          className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10" 
          aria-hidden="true"
        ></div>
        <div 
          className="absolute -left-40 -top-40 w-96 h-96 rounded-full bg-primary/10 mix-blend-multiply blur-3xl" 
          aria-hidden="true"
        ></div>
        <div 
          className="absolute right-0 bottom-0 w-full h-1/2 bg-secondary" 
          aria-hidden="true"
        ></div>
      </div>
      
      <div className="container px-6 mx-auto relative z-10">
        <div className="max-w-4xl mx-auto glass-panel rounded-2xl shadow-xl p-10 md:p-16 text-center">
          <span className="inline-block font-medium text-primary mb-4">Start Your Historical Journey</span>
          <h2 className="text-3xl md:text-4xl font-serif font-medium mb-6">
            Ready to Transform How You Tell Historical Stories?
          </h2>
          <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto">
            Join thousands of historians, educators, and storytellers who are using Chronograph to create stunning visual narratives.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button size="lg" className="px-8 py-6 text-base">
              <span>Start Creating Now</span>
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button size="lg" variant="outline" className="px-8 py-6 text-base">
              <span>Schedule a Demo</span>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
