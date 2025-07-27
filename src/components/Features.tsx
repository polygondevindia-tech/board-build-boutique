import { Card, CardContent } from "@/components/ui/card";
import { Cpu, Layers, Zap, Users, Award, Headphones } from "lucide-react";

const features = [
  {
    icon: Cpu,
    title: "Custom Design",
    description: "Tailored PCB solutions designed to your exact specifications and requirements."
  },
  {
    icon: Layers,
    title: "Multi-Layer PCBs",
    description: "From simple 2-layer to complex 16+ layer boards for advanced applications."
  },
  {
    icon: Zap,
    title: "Fast Turnaround",
    description: "Quick prototyping and production with industry-leading delivery times."
  },
  {
    icon: Users,
    title: "Expert Support",
    description: "Professional engineering support throughout your entire project lifecycle."
  },
  {
    icon: Award,
    title: "Quality Certified",
    description: "ISO 9001 certified manufacturing with rigorous quality control processes."
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    description: "Round-the-clock customer support for all your PCB needs and questions."
  }
];

const Features = () => {
  return (
    <section className="py-20 bg-tech-gray-light/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Why Choose PCB Boutique?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We combine cutting-edge technology with exceptional service to deliver the perfect PCB solution for your project
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="border-none shadow-sm hover:shadow-md transition-all duration-300 group">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;