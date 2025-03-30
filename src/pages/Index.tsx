
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";
import { ChevronDown, Menu, X } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Navigation from "@/components/Navigation";
import FeatureCard from "@/components/FeatureCard";
import Hero from "@/components/Hero";

const Index = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Navigation */}
      <div className="hidden md:block">
        <Navigation />
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b p-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-medium">Minimalist</h2>
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <nav className="flex flex-col gap-4 mt-8">
                <a href="#" className="text-xl hover:text-primary transition-colors duration-200" onClick={() => setIsOpen(false)}>Home</a>
                <a href="#features" className="text-xl hover:text-primary transition-colors duration-200" onClick={() => setIsOpen(false)}>Features</a>
                <a href="#about" className="text-xl hover:text-primary transition-colors duration-200" onClick={() => setIsOpen(false)}>About</a>
                <a href="#contact" className="text-xl hover:text-primary transition-colors duration-200" onClick={() => setIsOpen(false)}>Contact</a>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <main>
        {/* Hero Section */}
        <Hero />

        {/* Features Section */}
        <section id="features" className="container py-24 px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Features</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Clean design, intuitive interface, and powerful capabilities make 
              this the perfect starting point for your next project.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard 
              title="Responsive Design" 
              description="Looks beautiful on any device, from desktop to mobile"
              icon="layout"
            />
            <FeatureCard 
              title="Modern UI Components" 
              description="Built with ShadCN UI for a consistent, modern look and feel"
              icon="palette"
            />
            <FeatureCard 
              title="Animations" 
              description="Subtle animations enhance the user experience"
              icon="sparkles"
            />
            <FeatureCard 
              title="Customizable" 
              description="Easy to customize to match your brand and needs"
              icon="settings"
            />
            <FeatureCard 
              title="Performance" 
              description="Built for speed and optimized for the best experience"
              icon="zap"
            />
            <FeatureCard 
              title="Developer Friendly" 
              description="Clean, well-organized code that's easy to maintain"
              icon="code"
            />
          </div>
        </section>

        {/* About Section with scroll animation */}
        <section id="about" className="bg-muted py-24 px-4 md:px-6">
          <div className="container">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">About</h2>
              
              <Card className="mb-8">
                <CardContent className="p-6">
                  <p className="text-lg mb-4">
                    This minimalist design system focuses on clean typography, thoughtful spacing, 
                    and a carefully curated color palette to create a cohesive and elegant user experience.
                  </p>
                  <p className="text-lg">
                    We believe that simplicity is the ultimate sophistication, and that less is more 
                    when it comes to creating interfaces that are both beautiful and functional.
                  </p>
                </CardContent>
              </Card>

              <div className="text-center mt-12">
                <a href="#contact">
                  <Button variant="outline" size="lg" className="group">
                    Learn More
                    <ChevronDown className="ml-2 h-4 w-4 transition-transform group-hover:translate-y-1" />
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="container py-24 px-4 md:px-6">
          <div className="max-w-md mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Get In Touch</h2>
            <p className="text-muted-foreground mb-8">
              Have questions or want to learn more? We'd love to hear from you.
            </p>
            <Button size="lg" className="w-full sm:w-auto">Contact Us</Button>
          </div>
        </section>
      </main>

      <footer className="border-t py-12 px-4 md:px-6">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-muted-foreground mb-4 md:mb-0">&copy; 2024 Minimalist. All rights reserved.</p>
            <div className="flex space-x-6">
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                Terms
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                Privacy
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
