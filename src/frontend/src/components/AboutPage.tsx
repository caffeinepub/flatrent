import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { motion } from "motion/react";

const sellingTips = [
  {
    img: "/assets/generated/selling-tip-1.dim_800x600.jpg",
    title: "Show the Property in Best Light",
    tip: "Always clean and declutter the flat before showing it. Open curtains for natural light and make sure every room looks spacious and welcoming. First impressions matter most.",
  },
  {
    img: "/assets/generated/selling-tip-2.dim_800x600.jpg",
    title: "Price it Right from the Start",
    tip: "Research nearby properties and set a competitive price. Overpriced flats stay on the market too long. A fair price attracts serious buyers and renters quickly.",
  },
  {
    img: "/assets/generated/selling-tip-3.dim_800x600.jpg",
    title: "Build Trust with Transparency",
    tip: "Be honest about the property details, maintenance costs, and any issues. Buyers and renters who trust you are more likely to close the deal and recommend you to others.",
  },
];

export default function AboutPage({ onClose }: { onClose: () => void }) {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Banner */}
      <div className="bg-primary text-white py-16 px-4 text-center">
        <motion.h1
          className="font-display text-4xl md:text-5xl font-bold mb-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          About FlatRent
        </motion.h1>
        <motion.p
          className="text-white/80 text-lg max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          Your trusted partner for finding and listing flats for rent and sale.
          We connect property owners with the right customers every day.
        </motion.p>
        <button
          type="button"
          onClick={onClose}
          className="mt-6 text-white/70 hover:text-white underline text-sm"
        >
          ← Back to Listings
        </button>
      </div>

      <div className="container mx-auto px-4 py-16 max-w-5xl">
        {/* Who We Are */}
        <section className="mb-16 text-center">
          <h2 className="font-display text-3xl font-bold text-foreground mb-4">
            Who We Are
          </h2>
          <p className="text-muted-foreground text-lg max-w-3xl mx-auto leading-relaxed">
            FlatRent is a dedicated platform built for property owners and
            renters. We make it simple to post your flat, reach serious
            customers, and close deals faster. Whether you are renting or
            selling, we are here to support you every step of the way.
          </p>
        </section>

        {/* Selling Tips */}
        <section className="mb-16">
          <h2 className="font-display text-3xl font-bold text-foreground mb-2 text-center">
            Tips to Attract More Customers
          </h2>
          <p className="text-muted-foreground text-center mb-10">
            Follow these proven tips to get your listing noticed and close deals
            faster.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {sellingTips.map((tip, i) => (
              <motion.div
                key={tip.title}
                className="bg-card rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.5 }}
              >
                <img
                  src={tip.img}
                  alt={tip.title}
                  className="w-full h-52 object-cover"
                />
                <div className="p-5">
                  <h3 className="font-display text-lg font-bold text-foreground mb-2">
                    {tip.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {tip.tip}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Contact Section */}
        <section className="bg-card rounded-2xl p-10 shadow-md">
          <h2 className="font-display text-3xl font-bold text-foreground mb-1 text-center">
            Get in Touch
          </h2>
          <p className="text-primary font-semibold text-center text-lg mb-1">
            Aman Sharma
          </p>
          <p className="text-muted-foreground text-center mb-8">
            Have a property to list or need help? Reach out to us directly.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex flex-col items-center text-center gap-3 p-4 rounded-xl bg-primary/5 hover:bg-primary/10 transition-colors">
              <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
                <Phone className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">Phone</p>
                <p className="text-sm text-muted-foreground">+91 79088 55937</p>
              </div>
            </div>

            <div className="flex flex-col items-center text-center gap-3 p-4 rounded-xl bg-primary/5 hover:bg-primary/10 transition-colors">
              <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
                <MessageCircle className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">
                  WhatsApp
                </p>
                <a
                  href="https://wa.me/919289341577"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary underline"
                >
                  +91 92893 41577
                </a>
              </div>
            </div>

            <div className="flex flex-col items-center text-center gap-3 p-4 rounded-xl bg-primary/5 hover:bg-primary/10 transition-colors">
              <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
                <Mail className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">Email</p>
                <a
                  href="mailto:amanaxsh@gmail.com"
                  className="text-sm text-primary underline break-all"
                >
                  amanaxsh@gmail.com
                </a>
              </div>
            </div>

            <div className="flex flex-col items-center text-center gap-3 p-4 rounded-xl bg-primary/5 hover:bg-primary/10 transition-colors">
              <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
                <MapPin className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">
                  Location
                </p>
                <p className="text-sm text-muted-foreground">
                  Noida Extension, Sector 4
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
