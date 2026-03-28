import { Facebook, Home, Instagram, Linkedin, Twitter } from "lucide-react";

const SOCIAL = [
  { Icon: Facebook, label: "Facebook" },
  { Icon: Twitter, label: "Twitter" },
  { Icon: Instagram, label: "Instagram" },
  { Icon: Linkedin, label: "LinkedIn" },
];

interface FooterProps {
  onAdminClick?: () => void;
  onAboutClick?: () => void;
}

export default function Footer({ onAdminClick, onAboutClick }: FooterProps) {
  const year = new Date().getFullYear();
  const utm = encodeURIComponent(window.location.hostname);

  return (
    <footer className="bg-footer text-white pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/80">
                <Home className="h-5 w-5 text-white" />
              </div>
              <span className="font-display text-xl font-bold tracking-wide">
                FlatRent
              </span>
            </div>
            <p className="text-white/60 text-sm leading-relaxed">
              India's simplest platform to find and list flats for rent.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold text-white mb-3 text-sm uppercase tracking-wider">
              For Tenants
            </h4>
            <ul className="space-y-2 text-sm text-white/60">
              <li>
                <a
                  href="#listings"
                  className="hover:text-white transition-colors"
                >
                  Browse Flats
                </a>
              </li>
              <li>
                <a
                  href="#why-choose"
                  className="hover:text-white transition-colors"
                >
                  Why FlatRent
                </a>
              </li>
              <li>
                <span className="cursor-default">Search Tips</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-3 text-sm uppercase tracking-wider">
              For Landlords
            </h4>
            <ul className="space-y-2 text-sm text-white/60">
              <li>
                <a
                  href="#landlord-cta"
                  className="hover:text-white transition-colors"
                >
                  Post a Flat
                </a>
              </li>
              <li>
                <span className="cursor-default">Listing Tips</span>
              </li>
              <li>
                <span className="cursor-default">Pricing</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-3 text-sm uppercase tracking-wider">
              Company
            </h4>
            <ul className="space-y-2 text-sm text-white/60">
              <li>
                {onAboutClick ? (
                  <button
                    type="button"
                    onClick={onAboutClick}
                    className="hover:text-white transition-colors text-left"
                  >
                    About Us
                  </button>
                ) : (
                  <span className="cursor-default">About Us</span>
                )}
              </li>
              <li>
                <span className="cursor-default">Privacy Policy</span>
              </li>
              <li>
                <span className="cursor-default">Terms of Service</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/50 text-sm">
            © {year}. Built with ❤️ using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${utm}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/70 hover:text-white underline transition-colors"
            >
              caffeine.ai
            </a>
          </p>

          <div className="flex items-center gap-4">
            {/* Social icons */}
            {SOCIAL.map(({ Icon, label }) => (
              <span
                key={label}
                aria-label={label}
                className="text-white/50 hover:text-white transition-colors cursor-pointer"
              >
                <Icon className="h-4 w-4" />
              </span>
            ))}

            {/* Admin link */}
            {onAdminClick && (
              <button
                type="button"
                onClick={onAdminClick}
                className="text-white/60 hover:text-white transition-colors text-xs ml-2"
                data-ocid="admin.link"
              >
                Admin
              </button>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
