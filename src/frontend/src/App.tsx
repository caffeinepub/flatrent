import { Skeleton } from "@/components/ui/skeleton";
import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Search, SlidersHorizontal } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

import AboutPage from "./components/AboutPage";
import AdminPage from "./components/AdminPage";
import Footer from "./components/Footer";
import HeroSection from "./components/HeroSection";
import LandlordCTA from "./components/LandlordCTA";
import ListingCard from "./components/ListingCard";
import ListingModal from "./components/ListingModal";
import Navbar from "./components/Navbar";
import PositivePostersSection from "./components/PositivePostersSection";
import PostFlatModal from "./components/PostFlatModal";
import WhyChooseSection from "./components/WhyChooseSection";

import type { FlatListing } from "./backend.d";
import { useGetListings, usePostListing } from "./hooks/useQueries";

const queryClient = new QueryClient();

const SAMPLE_LISTINGS = [
  {
    title: "Spacious 2BHK near Bandra Station",
    location: "Bandra West, Mumbai",
    rentPrice: BigInt(22000),
    bedrooms: BigInt(2),
    bathrooms: BigInt(2),
    description:
      "Well-maintained 2BHK flat with modern kitchen, 24/7 water supply, covered parking, and great connectivity to Western railway line. Walking distance to Carter Road.",
    contactName: "Rajesh Sharma",
    contactPhone: "+91 98765 43210",
    contactEmail: "rajesh.sharma@email.com",
    imageHashes: [],
  },
  {
    title: "Cozy 1BHK Studio in Koramangala",
    location: "Koramangala, Bangalore",
    rentPrice: BigInt(14000),
    bedrooms: BigInt(1),
    bathrooms: BigInt(1),
    description:
      "Furnished studio apartment ideal for working professionals. High-speed WiFi, power backup, security guard, and steps away from restaurants and cafes in 5th block.",
    contactName: "Priya Nair",
    contactPhone: "+91 99887 76655",
    contactEmail: "priya.nair@email.com",
    imageHashes: [],
  },
  {
    title: "Modern 3BHK with Sea View",
    location: "Worli, Mumbai",
    rentPrice: BigInt(55000),
    bedrooms: BigInt(3),
    bathrooms: BigInt(3),
    description:
      "Premium 3BHK apartment on 18th floor with breathtaking sea views. Fully furnished, modular kitchen, gymnasium, swimming pool, and 24-hour concierge service.",
    contactName: "Arjun Mehta",
    contactPhone: "+91 77665 54433",
    contactEmail: "arjun.mehta@email.com",
    imageHashes: [],
  },
  {
    title: "Affordable 1BHK in Whitefield",
    location: "Whitefield, Bangalore",
    rentPrice: BigInt(9500),
    bedrooms: BigInt(1),
    bathrooms: BigInt(1),
    description:
      "Clean and affordable 1BHK in a gated society near ITPL. Semi-furnished with wardrobes, split AC, and easy access to tech parks. Ideal for software professionals.",
    contactName: "Sneha Patel",
    contactPhone: "+91 88776 65544",
    contactEmail: "sneha.patel@email.com",
    imageHashes: [],
  },
];

const SKELETON_KEYS = ["sk-1", "sk-2", "sk-3", "sk-4"];

function AppContent() {
  const { data: listings = [], isLoading } = useGetListings();
  const { mutateAsync: postListing } = usePostListing();
  const seeded = useRef(false);

  const [page, setPage] = useState<"home" | "about" | "admin">("home");
  const [postModalOpen, setPostModalOpen] = useState(false);
  const [selectedListing, setSelectedListing] = useState<FlatListing | null>(
    null,
  );
  const [listingModalOpen, setListingModalOpen] = useState(false);
  const [scrollToContact, setScrollToContact] = useState(false);
  const [searchLocation, setSearchLocation] = useState("");
  const [searchMaxPrice, setSearchMaxPrice] = useState("");

  useEffect(() => {
    if (seeded.current || isLoading) return;
    if (listings.length === 0) {
      seeded.current = true;
      Promise.all(SAMPLE_LISTINGS.map((l) => postListing(l))).catch(
        console.error,
      );
    } else {
      seeded.current = true;
    }
  }, [listings.length, isLoading, postListing]);

  const filteredListings = listings.filter((l) => {
    const matchLoc =
      !searchLocation ||
      l.location.toLowerCase().includes(searchLocation.toLowerCase()) ||
      l.title.toLowerCase().includes(searchLocation.toLowerCase());
    const matchPrice =
      !searchMaxPrice ||
      searchMaxPrice === "any" ||
      Number(l.rentPrice) <= Number(searchMaxPrice);
    return matchLoc && matchPrice;
  });

  const handleViewDetails = (listing: FlatListing) => {
    setSelectedListing(listing);
    setScrollToContact(false);
    setListingModalOpen(true);
  };

  const handleContact = (listing: FlatListing) => {
    setSelectedListing(listing);
    setScrollToContact(true);
    setListingModalOpen(true);
  };

  const handleBrowse = () => {
    setPage("home");
    setTimeout(() => {
      const el = document.getElementById("listings");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }, 50);
  };

  const handleSearch = (loc: string, price: string) => {
    setSearchLocation(loc);
    setSearchMaxPrice(price);
  };

  const clearFilters = () => {
    setSearchLocation("");
    setSearchMaxPrice("");
  };

  const hasFilters =
    searchLocation || (searchMaxPrice && searchMaxPrice !== "any");

  if (page === "admin") {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <AdminPage onBack={() => setPage("home")} />
        <Footer
          onAdminClick={() => setPage("admin")}
          onAboutClick={() => setPage("about")}
        />
        <Toaster />
      </div>
    );
  }

  if (page === "about") {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar
          onPostFlat={() => setPostModalOpen(true)}
          onBrowse={handleBrowse}
          onAbout={() => setPage("about")}
          onAdmin={() => setPage("admin")}
        />
        <AboutPage onClose={() => setPage("home")} />
        <Footer
          onAdminClick={() => setPage("admin")}
          onAboutClick={() => setPage("about")}
        />
        <PostFlatModal
          open={postModalOpen}
          onClose={() => setPostModalOpen(false)}
        />
        <Toaster />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar
        onPostFlat={() => setPostModalOpen(true)}
        onBrowse={handleBrowse}
        onAbout={() => setPage("about")}
        onAdmin={() => setPage("admin")}
      />

      <main className="flex-1">
        <HeroSection onSearch={handleSearch} />

        <section id="listings" className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
              <div>
                <h2 className="font-display text-3xl font-bold text-foreground">
                  Recently Added Flats
                </h2>
                {hasFilters && (
                  <div className="flex items-center gap-2 mt-1">
                    <SlidersHorizontal className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      Filtered results · {filteredListings.length} found
                    </span>
                    <button
                      type="button"
                      onClick={clearFilters}
                      className="text-xs text-primary underline"
                    >
                      Clear
                    </button>
                  </div>
                )}
              </div>
              <p className="text-muted-foreground text-sm">
                {filteredListings.length} listings available
              </p>
            </div>

            {isLoading ? (
              <div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
                data-ocid="listing.loading_state"
              >
                {SKELETON_KEYS.map((k) => (
                  <div key={k} className="space-y-3">
                    <Skeleton className="h-48 w-full rounded-xl" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-8 w-full" />
                  </div>
                ))}
              </div>
            ) : filteredListings.length === 0 ? (
              <div
                className="text-center py-20"
                data-ocid="listing.empty_state"
              >
                <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-display text-xl font-bold text-foreground mb-2">
                  No flats found
                </h3>
                <p className="text-muted-foreground">
                  Try adjusting your search filters or{" "}
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="text-primary underline"
                  >
                    clear all filters
                  </button>
                  .
                </p>
              </div>
            ) : (
              <AnimatePresence>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {filteredListings.map((listing, i) => (
                    <motion.div
                      key={String(listing.id)}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: i * 0.07 }}
                    >
                      <ListingCard
                        listing={listing as FlatListing}
                        index={i}
                        onViewDetails={handleViewDetails}
                        onContact={handleContact}
                      />
                    </motion.div>
                  ))}
                </div>
              </AnimatePresence>
            )}
          </div>
        </section>

        <PositivePostersSection />
        <LandlordCTA onPostFlat={() => setPostModalOpen(true)} />
        <WhyChooseSection />
      </main>

      <Footer
        onAdminClick={() => setPage("admin")}
        onAboutClick={() => setPage("about")}
      />

      <ListingModal
        listing={selectedListing}
        open={listingModalOpen}
        onClose={() => setListingModalOpen(false)}
        scrollToContact={scrollToContact}
      />

      <PostFlatModal
        open={postModalOpen}
        onClose={() => setPostModalOpen(false)}
      />

      <Toaster />
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  );
}
