import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import {
  Bath,
  Bed,
  Calendar,
  IndianRupee,
  Mail,
  MapPin,
  Phone,
  User,
} from "lucide-react";
import type { FlatListing } from "../backend.d";
import { getListingImage } from "./ListingCard";

interface ListingModalProps {
  listing: FlatListing | null;
  open: boolean;
  onClose: () => void;
  scrollToContact?: boolean;
}

export default function ListingModal({
  listing,
  open,
  onClose,
}: ListingModalProps) {
  if (!listing) return null;

  const imgUrl = getListingImage(listing.id);
  const postedDate = new Date(
    Number(listing.postedAt) / 1_000_000,
  ).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent
        className="max-w-2xl p-0 overflow-hidden"
        data-ocid="listing.dialog"
      >
        {/* Hero image */}
        <div className="relative h-56 overflow-hidden">
          <img
            src={imgUrl}
            alt={listing.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          <Badge className="absolute top-4 left-4 bg-primary text-primary-foreground">
            Available
          </Badge>
        </div>

        <div className="p-6 space-y-5">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl font-bold text-foreground leading-tight">
              {listing.title}
            </DialogTitle>
            <div className="flex items-center gap-1 text-muted-foreground text-sm">
              <MapPin className="h-4 w-4 shrink-0" />
              {listing.location}
            </div>
          </DialogHeader>

          {/* Price & stats */}
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-1 text-primary font-bold text-2xl">
              <IndianRupee className="h-5 w-5" />
              {Number(listing.rentPrice).toLocaleString("en-IN")}
              <span className="text-muted-foreground text-sm font-normal">
                /month
              </span>
            </div>
            <div className="flex items-center gap-4 text-muted-foreground text-sm">
              <div className="flex items-center gap-1">
                <Bed className="h-4 w-4" />
                {Number(listing.bedrooms)} Bedrooms
              </div>
              <div className="flex items-center gap-1">
                <Bath className="h-4 w-4" />
                {Number(listing.bathrooms)} Bathrooms
              </div>
            </div>
          </div>

          {/* Description */}
          {listing.description && (
            <div>
              <h4 className="font-semibold text-foreground mb-1">
                Description
              </h4>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {listing.description}
              </p>
            </div>
          )}

          <Separator />

          {/* Contact info */}
          <div id="contact-info">
            <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <User className="h-4 w-4 text-primary" />
              Contact Landlord
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex items-center gap-3 bg-muted/50 rounded-lg p-3">
                <User className="h-4 w-4 text-primary shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">Name</p>
                  <p className="font-medium text-sm">{listing.contactName}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-muted/50 rounded-lg p-3">
                <Phone className="h-4 w-4 text-primary shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">Phone</p>
                  <a
                    href={`tel:${listing.contactPhone}`}
                    className="font-medium text-sm text-primary hover:underline"
                  >
                    {listing.contactPhone}
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-muted/50 rounded-lg p-3 sm:col-span-2">
                <Mail className="h-4 w-4 text-primary shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">Email</p>
                  <a
                    href={`mailto:${listing.contactEmail}`}
                    className="font-medium text-sm text-primary hover:underline"
                  >
                    {listing.contactEmail}
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Calendar className="h-3.5 w-3.5" />
            Listed on {postedDate}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
