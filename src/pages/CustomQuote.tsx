import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Upload, Zap, Shield, Award } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const CustomQuote = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    boardType: "",
    quantity: "",
    layers: "",
    dimensions: "",
    specifications: "",
    timeline: "",
    budget: "",
    additionalServices: [] as string[]
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleServiceToggle = (service: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      additionalServices: checked
        ? [...prev.additionalServices, service]
        : prev.additionalServices.filter(s => s !== service)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Quote request submitted:", formData);
    // Handle form submission logic here
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-background to-tech-gray-light py-16">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4">
            <Link to="/" className="inline-flex items-center text-primary hover:text-primary/80 transition-colors mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
            <h1 className="text-4xl lg:text-5xl font-bold text-foreground">
              Get a Custom 
              <span className="bg-gradient-to-r from-primary to-tech-blue bg-clip-text text-transparent"> Quote</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Tell us about your PCB requirements and we'll provide a detailed quote within 24 hours
            </p>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Project Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Contact Information */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-foreground">Contact Information</h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="name">Full Name *</Label>
                          <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => handleInputChange("name", e.target.value)}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="email">Email Address *</Label>
                          <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => handleInputChange("email", e.target.value)}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="company">Company</Label>
                          <Input
                            id="company"
                            value={formData.company}
                            onChange={(e) => handleInputChange("company", e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="phone">Phone Number</Label>
                          <Input
                            id="phone"
                            value={formData.phone}
                            onChange={(e) => handleInputChange("phone", e.target.value)}
                          />
                        </div>
                      </div>
                    </div>

                    {/* PCB Specifications */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-foreground">PCB Specifications</h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="boardType">Board Type *</Label>
                          <Select onValueChange={(value) => handleInputChange("boardType", value)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select board type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="single-sided">Single-sided</SelectItem>
                              <SelectItem value="double-sided">Double-sided</SelectItem>
                              <SelectItem value="multilayer">Multilayer</SelectItem>
                              <SelectItem value="flex">Flexible PCB</SelectItem>
                              <SelectItem value="rigid-flex">Rigid-Flex</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="layers">Number of Layers</Label>
                          <Select onValueChange={(value) => handleInputChange("layers", value)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select layers" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1">1 Layer</SelectItem>
                              <SelectItem value="2">2 Layers</SelectItem>
                              <SelectItem value="4">4 Layers</SelectItem>
                              <SelectItem value="6">6 Layers</SelectItem>
                              <SelectItem value="8">8 Layers</SelectItem>
                              <SelectItem value="10+">10+ Layers</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="quantity">Quantity *</Label>
                          <Input
                            id="quantity"
                            type="number"
                            placeholder="e.g., 100"
                            value={formData.quantity}
                            onChange={(e) => handleInputChange("quantity", e.target.value)}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="dimensions">Board Dimensions</Label>
                          <Input
                            id="dimensions"
                            placeholder="e.g., 50mm x 30mm"
                            value={formData.dimensions}
                            onChange={(e) => handleInputChange("dimensions", e.target.value)}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Project Requirements */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-foreground">Project Requirements</h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="timeline">Required Timeline</Label>
                          <Select onValueChange={(value) => handleInputChange("timeline", value)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select timeline" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="rush">Rush (1-3 days)</SelectItem>
                              <SelectItem value="standard">Standard (5-7 days)</SelectItem>
                              <SelectItem value="economy">Economy (10-14 days)</SelectItem>
                              <SelectItem value="flexible">Flexible</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="budget">Budget Range</Label>
                          <Select onValueChange={(value) => handleInputChange("budget", value)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select budget range" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="under-500">Under $500</SelectItem>
                              <SelectItem value="500-1000">$500 - $1,000</SelectItem>
                              <SelectItem value="1000-5000">$1,000 - $5,000</SelectItem>
                              <SelectItem value="5000-10000">$5,000 - $10,000</SelectItem>
                              <SelectItem value="over-10000">Over $10,000</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>

                    {/* Additional Services */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-foreground">Additional Services</h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        {[
                          "Assembly Service",
                          "Component Sourcing",
                          "Design Review",
                          "Testing & QA",
                          "Conformal Coating",
                          "Custom Packaging"
                        ].map((service) => (
                          <div key={service} className="flex items-center space-x-2">
                            <Checkbox
                              id={service}
                              onCheckedChange={(checked) => handleServiceToggle(service, checked as boolean)}
                            />
                            <Label htmlFor={service}>{service}</Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Specifications */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-foreground">Detailed Specifications</h3>
                      <div>
                        <Label htmlFor="specifications">
                          Technical Requirements & Special Instructions
                        </Label>
                        <Textarea
                          id="specifications"
                          rows={6}
                          placeholder="Please provide detailed specifications, material requirements, impedance control needs, surface finish preferences, or any other special requirements..."
                          value={formData.specifications}
                          onChange={(e) => handleInputChange("specifications", e.target.value)}
                        />
                      </div>
                    </div>

                    {/* File Upload */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-foreground">Design Files</h3>
                      <div className="border-2 border-dashed border-muted-foreground/30 rounded-lg p-8 text-center">
                        <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground mb-2">
                          Drop your Gerber files, schematics, or design files here
                        </p>
                        <p className="text-sm text-muted-foreground mb-4">
                          Supported formats: ZIP, RAR, PDF, DXF, Gerber files
                        </p>
                        <Button variant="outline" type="button">
                          Choose Files
                        </Button>
                      </div>
                    </div>

                    <Button type="submit" size="lg" className="w-full">
                      Submit Quote Request
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Why Choose Us */}
              <Card>
                <CardHeader>
                  <CardTitle>Why Choose Us?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Zap className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium">Fast Turnaround</h4>
                      <p className="text-sm text-muted-foreground">Rush orders available with 24-48 hour delivery</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Shield className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium">Quality Guaranteed</h4>
                      <p className="text-sm text-muted-foreground">100% tested with full quality certification</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Award className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium">Expert Support</h4>
                      <p className="text-sm text-muted-foreground">Dedicated engineering support throughout</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Contact Info */}
              <Card>
                <CardHeader>
                  <CardTitle>Need Help?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Our engineering team is here to help with your custom PCB requirements.
                  </p>
                  <div className="space-y-2">
                    <p className="text-sm">
                      <strong>Phone:</strong> +1 (555) 123-4567
                    </p>
                    <p className="text-sm">
                      <strong>Email:</strong> quotes@pcbpro.com
                    </p>
                    <p className="text-sm">
                      <strong>Hours:</strong> Mon-Fri 8AM-6PM PST
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default CustomQuote;