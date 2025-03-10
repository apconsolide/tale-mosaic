
import { Clock, Globe, Network, FileText, Layers, Palette, MousePointer, Users, Download } from "lucide-react";
import { cn } from "@/lib/utils";

const features = [
  {
    icon: Clock,
    title: "Advanced Timeline Interface",
    description: "Create interactive timelines that scale from millennia to specific days with smooth zooming capabilities.",
    delay: 0,
  },
  {
    icon: Globe,
    title: "Historical Mapping",
    description: "Visualize geographic data with historical borders that dynamically change over time periods.",
    delay: 100,
  },
  {
    icon: Network,
    title: "AI-Assisted Correlations",
    description: "Discover hidden connections between historical events with our intelligent data analysis system.",
    delay: 200,
  },
  {
    icon: FileText,
    title: "Narrative Extraction",
    description: "Automatically process historical texts to extract key events, people, and places.",
    delay: 0,
  },
  {
    icon: Layers,
    title: "Multi-layered Visualization",
    description: "Show cause-effect relationships with beautifully layered visual representations.",
    delay: 100,
  },
  {
    icon: Palette,
    title: "Historical Design Templates",
    description: "Apply design styles based on historical art periods that match your content's era.",
    delay: 200,
  },
  {
    icon: MousePointer,
    title: "Intuitive Interface",
    description: "Drag-and-drop interface makes creating complex visualizations accessible to everyone.",
    delay: 0,
  },
  {
    icon: Users,
    title: "Collaborative Editing",
    description: "Work together with your team in real-time with version control and commenting.",
    delay: 100,
  },
  {
    icon: Download,
    title: "Versatile Export Options",
    description: "Share your work as interactive HTML, static images, or print-ready PDFs.",
    delay: 200,
  },
];

const FeatureSection = () => {
  return (
    <section id="features" className="py-24 bg-secondary">
      <div className="container px-4 mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-serif font-medium mb-4">Powerful Features for Historical Storytelling</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our comprehensive toolset enables historians, educators, and storytellers to create compelling visual narratives.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className={cn(
                "feature-card glass-panel rounded-lg p-6 transition-all duration-500 opacity-0",
                "hover:shadow-lg hover:bg-white/90",
                "data-[state=visible]:opacity-100 data-[state=visible]:translate-y-0",
                "translate-y-8"
              )}
              data-state="hidden"
              style={{ transitionDelay: `${feature.delay}ms` }}
            >
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-serif font-medium mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Intersection Observer setup for animation on scroll
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.setAttribute('data-state', 'visible');
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('.feature-card').forEach(card => {
      observer.observe(card);
    });
  });
}

export default FeatureSection;
