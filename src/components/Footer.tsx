
import React from 'react';
import { CalendarClock, Github, Twitter, Facebook, Instagram, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Footer = () => {
  return (
    <footer className="bg-secondary pt-16 pb-8 border-t border-border">
      <div className="container px-6 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-16">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <CalendarClock className="w-6 h-6" />
              <span className="text-xl font-serif font-medium tracking-tight">Chronograph</span>
            </div>
            <p className="text-muted-foreground mb-6">
              Transform history into interactive narratives with our powerful timeline generation platform.
            </p>
            <div className="flex space-x-4">
              <SocialLink icon={<Twitter className="w-5 h-5" />} href="#" label="Twitter" />
              <SocialLink icon={<Facebook className="w-5 h-5" />} href="#" label="Facebook" />
              <SocialLink icon={<Instagram className="w-5 h-5" />} href="#" label="Instagram" />
              <SocialLink icon={<Github className="w-5 h-5" />} href="#" label="GitHub" />
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium uppercase tracking-wider mb-4">Product</h3>
            <ul className="space-y-3">
              {['Features', 'Templates', 'Examples', 'Pricing', 'Updates'].map(item => (
                <li key={item}>
                  <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-medium uppercase tracking-wider mb-4">Resources</h3>
            <ul className="space-y-3">
              {['Documentation', 'Help Center', 'API Reference', 'Community', 'Tutorials'].map(item => (
                <li key={item}>
                  <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-medium uppercase tracking-wider mb-4">Stay Updated</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Subscribe to our newsletter for the latest updates, features, and historical templates.
            </p>
            <div className="flex">
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 px-4 py-2 rounded-l-md border border-border focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <Button className="rounded-l-none">
                <Mail className="w-4 h-4 mr-2" />
                <span>Subscribe</span>
              </Button>
            </div>
          </div>
        </div>
        
        <div className="border-t border-border pt-8 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Chronograph. All rights reserved.</p>
          <div className="flex justify-center space-x-6 mt-4">
            <a href="#" className="hover:text-foreground transition-colors">Terms</a>
            <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
            <a href="#" className="hover:text-foreground transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

interface SocialLinkProps {
  icon: React.ReactNode;
  href: string;
  label: string;
}

const SocialLink = ({ icon, href, label }: SocialLinkProps) => (
  <a 
    href={href}
    aria-label={label}
    className="w-9 h-9 flex items-center justify-center rounded-full bg-background hover:bg-primary/10 transition-colors"
  >
    {icon}
  </a>
);

export default Footer;
