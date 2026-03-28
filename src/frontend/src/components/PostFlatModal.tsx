import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle2, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { usePostListing } from "../hooks/useQueries";

interface PostFlatModalProps {
  open: boolean;
  onClose: () => void;
}

const EMPTY_FORM = {
  title: "",
  location: "",
  rentPrice: "",
  bedrooms: "",
  bathrooms: "",
  description: "",
  contactName: "",
  contactPhone: "",
  contactEmail: "",
};

export default function PostFlatModal({ open, onClose }: PostFlatModalProps) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState<Partial<typeof EMPTY_FORM>>({});
  const [success, setSuccess] = useState(false);

  const { mutateAsync, isPending } = usePostListing();

  const update = (field: keyof typeof EMPTY_FORM, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validate = () => {
    const e: Partial<typeof EMPTY_FORM> = {};
    if (!form.title.trim()) e.title = "Title is required";
    if (!form.location.trim()) e.location = "Location is required";
    if (
      !form.rentPrice ||
      Number.isNaN(Number(form.rentPrice)) ||
      Number(form.rentPrice) <= 0
    )
      e.rentPrice = "Valid rent price is required";
    if (
      !form.bedrooms ||
      Number.isNaN(Number(form.bedrooms)) ||
      Number(form.bedrooms) < 1
    )
      e.bedrooms = "At least 1 bedroom";
    if (
      !form.bathrooms ||
      Number.isNaN(Number(form.bathrooms)) ||
      Number(form.bathrooms) < 1
    )
      e.bathrooms = "At least 1 bathroom";
    if (!form.contactName.trim()) e.contactName = "Contact name is required";
    if (!form.contactPhone.trim()) e.contactPhone = "Phone is required";
    if (!form.contactEmail.trim() || !form.contactEmail.includes("@"))
      e.contactEmail = "Valid email is required";
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    try {
      await mutateAsync({
        title: form.title.trim(),
        location: form.location.trim(),
        rentPrice: BigInt(Math.round(Number(form.rentPrice))),
        bedrooms: BigInt(Math.round(Number(form.bedrooms))),
        bathrooms: BigInt(Math.round(Number(form.bathrooms))),
        description: form.description.trim(),
        contactName: form.contactName.trim(),
        contactPhone: form.contactPhone.trim(),
        contactEmail: form.contactEmail.trim(),
      });
      setSuccess(true);
      toast.success("Your flat has been listed successfully!");
    } catch (err) {
      toast.error("Failed to post listing. Please try again.");
      console.error(err);
    }
  };

  const handleClose = () => {
    setForm(EMPTY_FORM);
    setErrors({});
    setSuccess(false);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
      <DialogContent
        className="max-w-2xl max-h-[90vh] overflow-y-auto"
        data-ocid="post_flat.dialog"
      >
        <DialogHeader>
          <DialogTitle className="font-display text-2xl font-bold">
            Post Your Flat for Rent
          </DialogTitle>
          <DialogDescription>
            Fill in the details below. Tenants will be able to see and contact
            you directly.
          </DialogDescription>
        </DialogHeader>

        {success ? (
          <div
            className="flex flex-col items-center py-12 gap-4"
            data-ocid="post_flat.success_state"
          >
            <CheckCircle2 className="h-16 w-16 text-green-500" />
            <h3 className="font-display text-xl font-bold text-foreground">
              Listing Posted!
            </h3>
            <p className="text-muted-foreground text-center">
              Your flat is now live. Interested tenants can see and contact you.
            </p>
            <Button
              onClick={handleClose}
              className="bg-primary text-primary-foreground"
            >
              Done
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5 mt-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2 space-y-1.5">
                <Label htmlFor="title">Listing Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g. Spacious 2BHK near Metro Station"
                  value={form.title}
                  onChange={(e) => update("title", e.target.value)}
                  data-ocid="post_flat.input"
                />
                {errors.title && (
                  <p
                    className="text-destructive text-xs"
                    data-ocid="post_flat.error_state"
                  >
                    {errors.title}
                  </p>
                )}
              </div>

              <div className="md:col-span-2 space-y-1.5">
                <Label htmlFor="location">Location *</Label>
                <Input
                  id="location"
                  placeholder="e.g. Andheri West, Mumbai"
                  value={form.location}
                  onChange={(e) => update("location", e.target.value)}
                  data-ocid="post_flat.input"
                />
                {errors.location && (
                  <p className="text-destructive text-xs">{errors.location}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="rentPrice">Monthly Rent (₹) *</Label>
                <Input
                  id="rentPrice"
                  type="number"
                  placeholder="e.g. 15000"
                  value={form.rentPrice}
                  onChange={(e) => update("rentPrice", e.target.value)}
                  data-ocid="post_flat.input"
                />
                {errors.rentPrice && (
                  <p className="text-destructive text-xs">{errors.rentPrice}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="bedrooms">Bedrooms *</Label>
                <Input
                  id="bedrooms"
                  type="number"
                  min="1"
                  placeholder="e.g. 2"
                  value={form.bedrooms}
                  onChange={(e) => update("bedrooms", e.target.value)}
                  data-ocid="post_flat.input"
                />
                {errors.bedrooms && (
                  <p className="text-destructive text-xs">{errors.bedrooms}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="bathrooms">Bathrooms *</Label>
                <Input
                  id="bathrooms"
                  type="number"
                  min="1"
                  placeholder="e.g. 2"
                  value={form.bathrooms}
                  onChange={(e) => update("bathrooms", e.target.value)}
                  data-ocid="post_flat.input"
                />
                {errors.bathrooms && (
                  <p className="text-destructive text-xs">{errors.bathrooms}</p>
                )}
              </div>

              <div className="md:col-span-2 space-y-1.5">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your flat — amenities, nearby facilities, special features..."
                  value={form.description}
                  onChange={(e) => update("description", e.target.value)}
                  rows={3}
                  data-ocid="post_flat.textarea"
                />
              </div>
            </div>

            <div className="border-t border-border pt-4">
              <h4 className="font-semibold text-foreground mb-3">
                Contact Information
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="contactName">Your Name *</Label>
                  <Input
                    id="contactName"
                    placeholder="Full name"
                    value={form.contactName}
                    onChange={(e) => update("contactName", e.target.value)}
                    data-ocid="post_flat.input"
                  />
                  {errors.contactName && (
                    <p className="text-destructive text-xs">
                      {errors.contactName}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="contactPhone">Phone Number *</Label>
                  <Input
                    id="contactPhone"
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={form.contactPhone}
                    onChange={(e) => update("contactPhone", e.target.value)}
                    data-ocid="post_flat.input"
                  />
                  {errors.contactPhone && (
                    <p className="text-destructive text-xs">
                      {errors.contactPhone}
                    </p>
                  )}
                </div>

                <div className="md:col-span-2 space-y-1.5">
                  <Label htmlFor="contactEmail">Email Address *</Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    placeholder="you@example.com"
                    value={form.contactEmail}
                    onChange={(e) => update("contactEmail", e.target.value)}
                    data-ocid="post_flat.input"
                  />
                  {errors.contactEmail && (
                    <p className="text-destructive text-xs">
                      {errors.contactEmail}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex gap-3 justify-end pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                data-ocid="post_flat.cancel_button"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isPending}
                className="bg-primary text-primary-foreground min-w-[140px]"
                data-ocid="post_flat.submit_button"
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Posting...
                  </>
                ) : (
                  "Post My Flat"
                )}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
