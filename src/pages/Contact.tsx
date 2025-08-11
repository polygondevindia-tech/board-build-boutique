import { FormEvent, useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const Contact = () => {
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    document.title = "Contact | ccanand";
  }, []);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      toast({
        title: "Message sent",
        description: "Thanks! We'll get back to you within 1 business day.",
      });
    }, 800);
  };

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <section className="container mx-auto px-4 py-10">
          <h1 className="text-3xl font-bold text-foreground mb-4">Contact Us</h1>
          <p className="text-muted-foreground mb-8">
            Have a question about products or a custom PCB? Send us a message.
          </p>
          <form onSubmit={onSubmit} className="grid gap-6 max-w-2xl">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" required placeholder="Your name" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" required placeholder="you@company.com" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="message">Message</Label>
              <Textarea id="message" required placeholder="How can we help?" rows={6} />
            </div>
            <div>
              <Button type="submit" disabled={submitting}>
                {submitting ? "Sending..." : "Send Message"}
              </Button>
            </div>
          </form>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
