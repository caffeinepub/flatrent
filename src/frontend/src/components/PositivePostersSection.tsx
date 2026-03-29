import { motion } from "motion/react";

const posters = [
  {
    image: "/assets/generated/poster-rent-freedom.dim_800x600.jpg",
    headline: "RENT IS FREEDOM!",
    sub: "No maintenance stress. No huge loan. Just live, enjoy, and thrive!",
    accent: "from-yellow-400 to-orange-400",
  },
  {
    image: "/assets/generated/poster-dream-home.dim_800x600.jpg",
    headline: "YOUR DREAM HOME AWAITS!",
    sub: "The perfect flat is just one search away. Find your happy place today!",
    accent: "from-blue-400 to-green-400",
  },
  {
    image: "/assets/generated/poster-best-life.dim_800x600.jpg",
    headline: "RENTING = BEST LIFE!",
    sub: "Flexibility, convenience, and zero headaches. Renting is smart living!",
    accent: "from-purple-400 to-pink-400",
  },
];

export default function PositivePostersSection() {
  return (
    <section className="py-16 bg-gradient-to-br from-yellow-50 via-orange-50 to-pink-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <span className="inline-block bg-orange-100 text-orange-600 font-bold text-sm px-4 py-1 rounded-full mb-3 uppercase tracking-widest">
            🌟 Positive Vibes Only
          </span>
          <h2 className="text-4xl font-extrabold text-gray-800 mb-3">
            Why Renting is Awesome!
          </h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            Renting gives you freedom, flexibility, and the life you deserve.
            Here's why renters are winning! 🎉
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {posters.map((poster, i) => (
            <motion.div
              key={poster.headline}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              whileHover={{ scale: 1.03 }}
              className="rounded-2xl overflow-hidden shadow-lg bg-white"
            >
              <div className="relative">
                <img
                  src={poster.image}
                  alt={poster.headline}
                  className="w-full h-52 object-cover"
                />
                <div
                  className={`absolute inset-0 bg-gradient-to-t ${poster.accent} opacity-20`}
                />
              </div>
              <div className="p-5">
                <h3
                  className={`text-xl font-extrabold bg-gradient-to-r ${poster.accent} bg-clip-text text-transparent mb-2`}
                >
                  {poster.headline}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {poster.sub}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Big positive banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-12 rounded-3xl bg-gradient-to-r from-orange-400 via-pink-400 to-purple-500 p-10 text-center text-white shadow-2xl"
        >
          <div className="text-5xl mb-3">🏠✨</div>
          <h3 className="text-3xl md:text-4xl font-extrabold mb-3">
            RENT IS NOT A WASTE — IT'S A LIFESTYLE!
          </h3>
          <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto">
            You're not throwing money away. You're buying freedom, flexibility,
            zero maintenance stress, and the ability to live anywhere you want.
            That's priceless! 💪
          </p>
          <div className="flex flex-wrap justify-center gap-4 mt-6 text-sm font-bold">
            {[
              "✅ No Heavy Loans",
              "✅ Move Anytime",
              "✅ Zero Repair Bills",
              "✅ Upgrade Your Home Easily",
              "✅ Live Where You Love",
            ].map((item) => (
              <span key={item} className="bg-white/20 rounded-full px-4 py-1.5">
                {item}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
