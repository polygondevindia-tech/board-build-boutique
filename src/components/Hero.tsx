import { Button } from "@/components/ui/button";
import { ArrowRight, Zap, Shield, Award } from "lucide-react";
import heroImage from "@/assets/hero-pcb.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-[600px] bg-gradient-to-br from-background to-tech-gray-light flex items-center">
      <div className="container mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-6xl font-bold text-foreground leading-tight">
                Professional 
                <span className="bg-gradient-to-r from-primary to-tech-blue bg-clip-text text-transparent"> PCBs</span>
                <br />Made Perfect
              </h1>
              <p className="text-xl text-muted-foreground max-w-lg">
                Custom circuit boards designed and manufactured to your exact specifications. 
                From prototypes to production runs, we deliver quality that powers innovation.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="hero" size="lg" className="group">
                Shop PCBs
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button variant="outline" size="lg">
                Custom Quote
              </Button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-6 pt-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <p className="text-sm font-medium">Fast Delivery</p>
                <p className="text-xs text-muted-foreground">2-5 days</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <p className="text-sm font-medium">Quality Tested</p>
                <p className="text-xs text-muted-foreground">100% Verified</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <Award className="h-6 w-6 text-primary" />
                </div>
                <p className="text-sm font-medium">Professional</p>
                <p className="text-xs text-muted-foreground">ISO Certified</p>
              </div>
            </div>
          </div>

          {/* Image */}
          <div className="relative">
            <div className="relative z-10">
              <img 
                src={heroImage} 
                alt="Professional PCB circuits" 
                className="w-full h-auto rounded-2xl shadow-2xl"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-tech-blue/20 rounded-2xl blur-3xl transform translate-x-4 translate-y-4"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;