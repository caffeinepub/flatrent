import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Bath,
  Bed,
  Calendar,
  ChevronLeft,
  ChevronRight,
  IndianRupee,
  Mail,
  MapPin,
  Phone,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";
import type { FlatListing } from "../backend.d";
import { useStorageClient } from "../hooks/useStorageClient";
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
  const storageClient = useStorageClient();
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [imagesLoading, setImagesLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (!listing) return;
    if (listing.imageHashes.length > 0 && storageClient) {
      setImagesLoading(true);
      Promise.all(listing.imageHashes.map((h) => storageClient.getDirectURL(h)))
        .then((urls) => {
          setImageUrls(urls);
          setActiveIndex(0);
          setImagesLoading(false);
        })
        .catch(() => {
          setImageUrls([]);
          setImagesLoading(false);
        });
    } else {
      setImageUrls([]);
      setImagesLoading(false);
    }
  }, [listing, storageClient]);

  if (!listing) return null;

  const fallbackImg = getListingImage(listing.id);
  const hasRealImages = imageUrls.length > 0;
  const displayImg = hasRealImages ? imageUrls[activeIndex] : fallbackImg;

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
        {/* Hero image / gallery */}
        <div className="relative h-56 overflow-hidden bg-muted">
          {imagesLoading ? (
            <Skeleton className="w-full h-full rounded-none" />
          ) : (
            <img
              src={displayImg}
              alt={listing.title}
              className="w-full h-full object-cover"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          <Badge className="absolute top-4 left-4 bg-primary text-primary-foreground">
            Available
          </Badge>

          {/* Gallery navigation */}
          {hasRealImages && imageUrls.length > 1 && (
            <>
              <button
                type="button"
                onClick={() =>
                  setActiveIndex((i) =>
                    i === 0 ? imageUrls.length - 1 : i - 1,
                  )
                }
                className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-black/70 transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() =>
                  setActiveIndex((i) => (i + 1) % imageUrls.length)
                }
                className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-black/70 transition-colors"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                {imageUrls.map((url, i) => (
                  <button
                    key={url}
                    type="button"
                    onClick={() => setActiveIndex(i)}
                    className={`h-1.5 rounded-full transition-all ${
                      i === activeIndex
                        ? "w-4 bg-white"
                        : "w-1.5 bg-white/50 hover:bg-white/80"
                    }`}
                  />
                ))}
              </div>
            </>
          )}

          {/* Thumbnail strip */}
          {hasRealImages && imageUrls.length > 1 && (
            <div className="absolute bottom-0 left-0 right-0 flex gap-1 px-3 pb-3 justify-center" />
          )}
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
