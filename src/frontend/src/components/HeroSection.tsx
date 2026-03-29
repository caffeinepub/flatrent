import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MapPin, Search } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

interface HeroSectionProps {
  onSearch: (location: string, maxPrice: string) => void;
}

export default function HeroSection({ onSearch }: HeroSectionProps) {
  const [location, setLocation] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const handleSearch = () => {
    onSearch(location, maxPrice);
    const el = document.getElementById("listings");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      className="relative min-h-[580px] flex items-center justify-center"
      style={{
        backgroundImage:
          "url('/assets/generated/hero-funny-bg.dim_1600x900.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-[oklch(0.14_0.04_234/0.72)]" />

      <div className="relative z-10 container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <div className="inline-block bg-yellow-400 text-yellow-900 text-sm font-bold px-4 py-1 rounded-full mb-4 shadow-lg rotate-[-1deg]">
            🚨 WARNING: May cause landlord-induced trauma. Scroll at own risk.
          </div>
          <h1 className="font-display text-4xl md:text-6xl font-bold text-white mb-4 leading-tight">
            Escape Your Parents' House
            <br />
            <span className="text-yellow-300">
              Before They Charge You Rent Too 😭
            </span>
          </h1>
          <p className="text-white/85 text-lg md:text-xl mb-2 max-w-2xl mx-auto">
            Find a flat before your landlord raises the price AGAIN. 10,000+
            listings. 0 of them affordable. But hey, we tried. 💸
          </p>
          <p className="text-white/60 text-sm mb-8 max-w-lg mx-auto italic">
            ⚠️ Disclaimer: FlatRent is not responsible for broken dreams, empty
            wallets, or the suspicious smell in Unit 4B. Good luck out there,
            champ.
          </p>

          {/* Search bar */}
          <div className="bg-white rounded-xl shadow-2xl p-4 flex flex-col md:flex-row gap-3 max-w-2xl mx-auto">
            <div className="flex-1 flex items-center gap-2 border border-border rounded-lg px-3">
              <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
              <Input
                placeholder="Enter city, area, or 'anywhere but here'"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="border-0 shadow-none focus-visible:ring-0 px-0"
                data-ocid="hero.search_input"
              />
            </div>
            <Select value={maxPrice} onValueChange={setMaxPrice}>
              <SelectTrigger className="w-full md:w-52" data-ocid="hero.select">
                <SelectValue placeholder="My life savings = ?" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5000">₹5,000 (lol good luck)</SelectItem>
                <SelectItem value="10000">₹10,000 (brave soul)</SelectItem>
                <SelectItem value="15000">₹15,000 (getting serious)</SelectItem>
                <SelectItem value="20000">₹20,000 (fancy pants 👖)</SelectItem>
                <SelectItem value="30000">₹30,000 (big spender)</SelectItem>
                <SelectItem value="50000">
                  ₹50,000 (daddy issues? 💰)
                </SelectItem>
                <SelectItem value="any">
                  No limit (landlord's dream 🤑)
                </SelectItem>
              </SelectContent>
            </Select>
            <Button
              onClick={handleSearch}
              className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2 px-6"
              data-ocid="hero.button"
            >
              <Search className="h-4 w-4" />
              Save Me! 🙏
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
