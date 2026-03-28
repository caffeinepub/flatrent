import { Button } from "@/components/ui/button";
import { Home, Menu, X } from "lucide-react";
import { useState } from "react";

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
  const [mobileOpen, setMobileOpen] = useState(false);

  const closeMobile = () => setMobileOpen(false);

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

        {/* Desktop Nav links */}
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

        {/* CTAs + Hamburger */}
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-3">
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

          {/* Hamburger button — mobile only */}
          <button
            type="button"
            className="md:hidden flex items-center justify-center rounded-md p-2 text-white hover:bg-white/10 transition-colors"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label="Toggle menu"
            data-ocid="nav.toggle"
          >
            {mobileOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div className="md:hidden bg-navbar border-t border-white/10 px-4 pb-4">
          <nav className="flex flex-col gap-1 pt-2">
            <button
              type="button"
              onClick={() => {
                onBrowse();
                closeMobile();
              }}
              className="w-full text-left px-3 py-2 rounded-md text-white/80 hover:text-white hover:bg-white/10 text-sm font-medium transition-colors"
              data-ocid="mobile_nav.browse_link"
            >
              Browse Flats
            </button>
            <button
              type="button"
              onClick={() => {
                window.location.hash = "why-choose";
                closeMobile();
              }}
              className="w-full text-left px-3 py-2 rounded-md text-white/80 hover:text-white hover:bg-white/10 text-sm font-medium transition-colors"
            >
              Why FlatRent
            </button>
            <button
              type="button"
              onClick={() => {
                window.location.hash = "landlord-cta";
                closeMobile();
              }}
              className="w-full text-left px-3 py-2 rounded-md text-white/80 hover:text-white hover:bg-white/10 text-sm font-medium transition-colors"
            >
              For Landlords
            </button>
            <button
              type="button"
              onClick={() => {
                onAbout();
                closeMobile();
              }}
              className="w-full text-left px-3 py-2 rounded-md text-white/80 hover:text-white hover:bg-white/10 text-sm font-medium transition-colors"
              data-ocid="mobile_nav.about_link"
            >
              About Us
            </button>
            {onAdmin && (
              <button
                type="button"
                onClick={() => {
                  onAdmin();
                  closeMobile();
                }}
                className="w-full text-left px-3 py-2 rounded-md text-white/80 hover:text-white hover:bg-white/10 text-sm font-medium transition-colors"
                data-ocid="mobile_nav.admin_link"
              >
                Admin
              </button>
            )}
            <div className="pt-2 flex flex-col gap-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full border-white/40 bg-white/10 text-white hover:bg-white/20 hover:text-white"
                onClick={() => {
                  onBrowse();
                  closeMobile();
                }}
              >
                Browse Flats
              </Button>
              <Button
                size="sm"
                className="w-full bg-white text-primary hover:bg-white/90 font-semibold"
                onClick={() => {
                  onPostFlat();
                  closeMobile();
                }}
              >
                Post a Flat
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
