import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bath, Bed, Eye, IndianRupee, MapPin, Phone } from "lucide-react";
import type { FlatListing } from "../backend.d";

const FLAT_IMAGES = [
  "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&q=80",
  "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=600&q=80",
  "https://images.unsplash.com/photo-1560448204-603b3fc33ddc?w=600&q=80",
  "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&q=80",
  "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=600&q=80",
  "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&q=80",
];

export function getListingImage(id: bigint): string {
  return FLAT_IMAGES[Number(id) % FLAT_IMAGES.length];
}

interface ListingCardProps {
  listing: FlatListing;
  index: number;
  onViewDetails: (listing: FlatListing) => void;
  onContact: (listing: FlatListing) => void;
}

export default function ListingCard({
  listing,
  index,
  onViewDetails,
  onContact,
}: ListingCardProps) {
  const imgUrl = getListingImage(listing.id);

  return (
    <div
      className="bg-card rounded-xl overflow-hidden shadow-card border border-border hover:shadow-lg transition-shadow duration-300 flex flex-col"
      data-ocid={`listing.item.${index + 1}`}
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={imgUrl}
          alt={listing.title}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground text-xs">
          Available
        </Badge>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1 gap-3">
        <div>
          <h3 className="font-display font-bold text-foreground text-base leading-tight line-clamp-2">
            {listing.title}
          </h3>
          <div className="flex items-center gap-1 mt-1 text-muted-foreground text-sm">
            <MapPin className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">{listing.location}</span>
          </div>
        </div>

        {/* Price */}
        <div className="flex items-center gap-1 text-primary font-bold text-lg">
          <IndianRupee className="h-4 w-4" />
          <span>{Number(listing.rentPrice).toLocaleString("en-IN")}</span>
          <span className="text-muted-foreground text-sm font-normal">/mo</span>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 text-muted-foreground text-sm">
          <div className="flex items-center gap-1">
            <Bed className="h-4 w-4" />
            <span>{Number(listing.bedrooms)} Beds</span>
          </div>
          <div className="flex items-center gap-1">
            <Bath className="h-4 w-4" />
            <span>{Number(listing.bathrooms)} Baths</span>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-auto flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 gap-1 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
            onClick={() => onViewDetails(listing)}
            data-ocid={`listing.edit_button.${index + 1}`}
          >
            <Eye className="h-3.5 w-3.5" />
            View Details
          </Button>
          <Button
            size="sm"
            className="flex-1 gap-1 bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={() => onContact(listing)}
            data-ocid={`listing.secondary_button.${index + 1}`}
          >
            <Phone className="h-3.5 w-3.5" />
            Contact
          </Button>
        </div>
      </div>
    </div>
  );
}
