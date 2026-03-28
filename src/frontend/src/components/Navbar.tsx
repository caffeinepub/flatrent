import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

interface NavbarProps {
  onPostFlat: () => void;
  onBrowse: () => void;
  onAbout: () => void;
  onAdmin?: () => void;
}

export default function Navbar({
  onPostFlat,
  onBrowse,
  onAbout,
  onAdmin,
}: NavbarProps) {
  return (
    <header className="sticky top-0 z-50 w-full bg-navbar shadow-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-white/20">
            <Home className="h-5 w-5 text-white" />
          </div>
          <span className="font-display text-xl font-bold text-white tracking-wide">
            FlatRent
          </span>
        </div>

        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-6">
          <button
            type="button"
            onClick={onBrowse}
            className="text-white/80 hover:text-white text-sm font-medium transition-colors"
            data-ocid="nav.link"
          >
            Browse Flats
          </button>
          <a
            href="#why-choose"
            className="text-white/80 hover:text-white text-sm font-medium transition-colors"
          >
            Why FlatRent
          </a>
          <a
            href="#landlord-cta"
            className="text-white/80 hover:text-white text-sm font-medium transition-colors"
          >
            For Landlords
          </a>
          <button
            type="button"
            onClick={onAbout}
            className="text-white/80 hover:text-white text-sm font-medium transition-colors"
          >
            About Us
          </button>
          {onAdmin && (
            <button
              type="button"
              onClick={onAdmin}
              className="text-white/80 hover:text-white text-sm font-medium transition-colors"
              data-ocid="nav.admin_link"
            >
              Admin
            </button>
          )}
        </nav>

        {/* CTAs */}
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            className="border-white/40 bg-white/10 text-white hover:bg-white/20 hover:text-white"
            onClick={onBrowse}
            data-ocid="nav.secondary_button"
          >
            Browse Flats
          </Button>
          <Button
            size="sm"
            className="bg-white text-primary hover:bg-white/90 font-semibold"
            onClick={onPostFlat}
            data-ocid="nav.primary_button"
          >
            Post a Flat
          </Button>
        </div>
      </div>
    </header>
  );
}
