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
          "url('https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1600&q=80')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-[oklch(0.14_0.04_234/0.78)]" />

      <div className="relative z-10 container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <h1 className="font-display text-4xl md:text-6xl font-bold text-white mb-4 leading-tight">
            Find Your Perfect
            <br />
            <span className="text-blue-200">Flat for Rent</span>
          </h1>
          <p className="text-white/80 text-lg md:text-xl mb-10 max-w-xl mx-auto">
            Discover thousands of quality flats. Connect directly with
            landlords. No middlemen.
          </p>

          {/* Search bar */}
          <div className="bg-white rounded-xl shadow-2xl p-4 flex flex-col md:flex-row gap-3 max-w-2xl mx-auto">
            <div className="flex-1 flex items-center gap-2 border border-border rounded-lg px-3">
              <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
              <Input
                placeholder="Search by city or area..."
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="border-0 shadow-none focus-visible:ring-0 px-0"
                data-ocid="hero.search_input"
              />
            </div>
            <Select value={maxPrice} onValueChange={setMaxPrice}>
              <SelectTrigger className="w-full md:w-44" data-ocid="hero.select">
                <SelectValue placeholder="Max price/mo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5000">Up to ₹5,000</SelectItem>
                <SelectItem value="10000">Up to ₹10,000</SelectItem>
                <SelectItem value="15000">Up to ₹15,000</SelectItem>
                <SelectItem value="20000">Up to ₹20,000</SelectItem>
                <SelectItem value="30000">Up to ₹30,000</SelectItem>
                <SelectItem value="50000">Up to ₹50,000</SelectItem>
                <SelectItem value="any">Any price</SelectItem>
              </SelectContent>
            </Select>
            <Button
              onClick={handleSearch}
              className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2 px-6"
              data-ocid="hero.button"
            >
              <Search className="h-4 w-4" />
              Search
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
