import { Clock, Headphones, Shield, Users } from "lucide-react";
import { motion } from "motion/react";

const features = [
  {
    icon: Shield,
    title: "Verified Listings",
    desc: "All listings are reviewed to ensure accuracy and legitimacy before going live.",
  },
  {
    icon: Clock,
    title: "Instant Updates",
    desc: "Get real-time notifications when new flats matching your criteria are posted.",
  },
  {
    icon: Users,
    title: "Direct Contact",
    desc: "Talk directly with landlords — no middlemen, no commissions, no hidden fees.",
  },
  {
    icon: Headphones,
    title: "Dedicated Support",
    desc: "Our team is available around the clock to help you find or list your flat.",
  },
];

export default function WhyChooseSection() {
  return (
    <section id="why-choose" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">
            Why Choose FlatRent?
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            We've built the simplest way to connect tenants with landlords
            across India.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              className="bg-card border border-border rounded-xl p-6 text-center shadow-card hover:shadow-lg transition-shadow"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <f.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-display font-bold text-foreground mb-2">
                {f.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {f.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
