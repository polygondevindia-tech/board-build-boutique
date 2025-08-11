import { useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const About = () => {
  useEffect(() => {
    document.title = "About | ccanand";
  }, []);

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <section className="container mx-auto px-4 py-10">
          <h1 className="text-3xl font-bold text-foreground mb-4">About ccanand</h1>
          <p className="text-muted-foreground mb-6">
            We specialize in premium printed circuit boards with fast turnaround and rigorous quality control.
          </p>
          <div className="grid gap-6 md:grid-cols-2">
            <article className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-xl font-semibold text-foreground mb-2">Our Mission</h2>
              <p className="text-muted-foreground">
                Deliver reliable PCBs and a seamless customer experience for makers, startups, and enterprises.
              </p>
            </article>
            <article className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-xl font-semibold text-foreground mb-2">Quality & Expertise</h2>
              <p className="text-muted-foreground">
                From prototyping to production, we follow best-in-class processes and testing to ensure performance.
              </p>
            </article>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default About;
