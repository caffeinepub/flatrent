import { ArrowRight, Home, Shield, Zap } from "lucide-react";
import { motion } from "motion/react";

const benefits = [
  {
    icon: Home,
    headline: "Rent with Confidence",
    sub: "Browse verified listings with real photos and direct owner contact. No middlemen, no hidden fees.",
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    icon: Zap,
    headline: "Quick & Easy Search",
    sub: "Filter by location, budget, and size to find the right flat in minutes. Moving made simple.",
    color: "text-green-600",
    bg: "bg-green-50",
  },
  {
    icon: Shield,
    headline: "Trusted by Thousands",
    sub: "Owners and tenants across India rely on FlatRent for safe, transparent property transactions.",
    color: "text-purple-600",
    bg: "bg-purple-50",
  },
];

export default function PositivePostersSection() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <span className="inline-block bg-blue-100 text-blue-700 font-semibold text-xs px-4 py-1.5 rounded-full mb-3 uppercase tracking-widest">
            Why Choose FlatRent
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            A Smarter Way to Rent
          </h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            We connect property owners and tenants directly — saving you time,
            money, and hassle.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {benefits.map((item, i) => (
            <motion.div
              key={item.headline}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              className="rounded-2xl bg-white shadow-sm border border-gray-100 p-8 flex flex-col gap-4 hover:shadow-md transition-shadow"
            >
              <div
                className={`w-12 h-12 rounded-xl ${item.bg} flex items-center justify-center`}
              >
                <item.icon className={`h-6 w-6 ${item.color}`} />
              </div>
              <h3 className="text-xl font-bold text-gray-900">
                {item.headline}
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                {item.sub}
              </p>
            </motion.div>
          ))}
        </div>

        {/* CTA Banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-12 rounded-2xl bg-gradient-to-r from-blue-700 to-blue-500 p-10 text-center text-white shadow-lg"
        >
          <h3 className="text-2xl md:text-3xl font-bold mb-3">
            Ready to Find Your Next Home?
          </h3>
          <p className="text-lg opacity-90 max-w-2xl mx-auto mb-6">
            Post your flat for free or browse thousands of listings across
            India. It takes less than 2 minutes.
          </p>
          <div className="flex flex-wrap justify-center gap-6 text-sm font-medium">
            {[
              "No Brokerage",
              "Verified Listings",
              "Direct Contact",
              "Free to Post",
              "All of India",
            ].map((item) => (
              <span
                key={item}
                className="flex items-center gap-1.5 bg-white/15 rounded-full px-4 py-1.5"
              >
                <ArrowRight className="h-3.5 w-3.5" />
                {item}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
