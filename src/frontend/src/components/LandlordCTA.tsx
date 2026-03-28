import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { motion } from "motion/react";

interface LandlordCTAProps {
  onPostFlat: () => void;
}

const features = [
  "Free to list",
  "Direct tenant contact",
  "Verified inquiries",
  "24/7 listing visibility",
];

export default function LandlordCTA({ onPostFlat }: LandlordCTAProps) {
  return (
    <section
      id="landlord-cta"
      className="py-16 bg-secondary/60 border-y border-border"
    >
      <motion.div
        className="container mx-auto px-4 text-center"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">
          Post Your Flat for Rent
        </h2>
        <p className="text-muted-foreground mb-8 max-w-md mx-auto">
          Reach thousands of potential tenants in your area. It's quick, easy,
          and completely free.
        </p>

        {/* Feature row */}
        <div className="flex flex-wrap justify-center gap-6 mb-8">
          {features.map((f) => (
            <div
              key={f}
              className="flex items-center gap-2 text-sm text-foreground"
            >
              <CheckCircle className="h-4 w-4 text-primary shrink-0" />
              <span>{f}</span>
            </div>
          ))}
        </div>

        <p className="font-display text-xl font-bold text-foreground mb-6">
          Join 5,000+ landlords already listing on FlatRent
        </p>

        <Button
          size="lg"
          className="bg-primary text-primary-foreground hover:bg-primary/90 px-10 text-base"
          onClick={onPostFlat}
          data-ocid="landlord_cta.primary_button"
        >
          Post a Flat — It's Free
        </Button>
      </motion.div>
    </section>
  );
}
