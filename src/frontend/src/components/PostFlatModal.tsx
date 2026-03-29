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
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle2, ImagePlus, Loader2, X } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { usePostListing } from "../hooks/useQueries";
import { useStorageClient } from "../hooks/useStorageClient";

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

interface PhotoFile {
  file: File;
  preview: string;
}

export default function PostFlatModal({ open, onClose }: PostFlatModalProps) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState<Partial<typeof EMPTY_FORM>>({});
  const [success, setSuccess] = useState(false);
  const [photos, setPhotos] = useState<PhotoFile[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const storageClient = useStorageClient();

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

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    const remaining = 5 - photos.length;
    const toAdd = files.slice(0, remaining);
    const oversized = toAdd.filter((f) => f.size > 5 * 1024 * 1024);
    if (oversized.length > 0) {
      toast.error("Each photo must be under 5MB");
    }
    const valid = toAdd.filter((f) => f.size <= 5 * 1024 * 1024);
    const newPhotos: PhotoFile[] = valid.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setPhotos((prev) => [...prev, ...newPhotos]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removePhoto = (index: number) => {
    setPhotos((prev) => {
      URL.revokeObjectURL(prev[index].preview);
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    try {
      let imageHashes: string[] = [];

      if (photos.length > 0 && storageClient) {
        setIsUploading(true);
        setUploadProgress(0);
        const total = photos.length;
        let done = 0;
        const hashes = await Promise.all(
          photos.map(async (p) => {
            const bytes = new Uint8Array(await p.file.arrayBuffer());
            const { hash } = await storageClient.putFile(bytes, () => {});
            done++;
            setUploadProgress(Math.round((done / total) * 100));
            return hash;
          }),
        );
        imageHashes = hashes;
        setIsUploading(false);
      }

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
        imageHashes,
      });
      setSuccess(true);
      toast.success("Your flat has been listed successfully!");
    } catch (err) {
      setIsUploading(false);
      toast.error("Failed to post listing. Please try again.");
      console.error(err);
    }
  };

  const handleClose = () => {
    for (const p of photos) URL.revokeObjectURL(p.preview);
    setForm(EMPTY_FORM);
    setErrors({});
    setSuccess(false);
    setPhotos([]);
    setUploadProgress(0);
    setIsUploading(false);
    onClose();
  };

  const isSubmitting = isPending || isUploading;

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

            {/* Photo Upload Section */}
            <div className="border border-dashed border-border rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ImagePlus className="h-4 w-4 text-primary" />
                  <Label className="font-semibold cursor-default">
                    Add Photos
                  </Label>
                  <span className="text-xs text-muted-foreground">
                    (optional, up to 5)
                  </span>
                </div>
                {photos.length < 5 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    data-ocid="post_flat.upload_button"
                  >
                    <ImagePlus className="h-3.5 w-3.5 mr-1" />
                    Choose Photos
                  </Button>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                multiple
                className="hidden"
                onChange={handleFileSelect}
              />
              {photos.length === 0 ? (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full flex flex-col items-center justify-center gap-2 py-6 rounded-lg bg-muted/40 hover:bg-muted/70 transition-colors cursor-pointer border-0"
                  data-ocid="post_flat.dropzone"
                >
                  <ImagePlus className="h-8 w-8 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Click to add photos of your flat
                  </p>
                  <p className="text-xs text-muted-foreground">
                    JPG, PNG or WebP · max 5MB each
                  </p>
                </button>
              ) : (
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                  {photos.map((p, i) => (
                    <div
                      key={p.preview}
                      className="relative aspect-square rounded-lg overflow-hidden group"
                    >
                      <img
                        src={p.preview}
                        alt={`Flat view ${i + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removePhoto(i)}
                        className="absolute top-1 right-1 h-5 w-5 rounded-full bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        data-ocid={`post_flat.delete_button.${i + 1}`}
                      >
                        <X className="h-3 w-3 text-white" />
                      </button>
                    </div>
                  ))}
                  {photos.length < 5 && (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="aspect-square rounded-lg border-2 border-dashed border-border flex items-center justify-center hover:bg-muted/50 transition-colors cursor-pointer bg-transparent"
                      data-ocid="post_flat.upload_button"
                    >
                      <ImagePlus className="h-5 w-5 text-muted-foreground" />
                    </button>
                  )}
                </div>
              )}
              {isUploading && (
                <div className="space-y-1" data-ocid="post_flat.loading_state">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Uploading photos...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <Progress value={uploadProgress} className="h-1.5" />
                </div>
              )}
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
                disabled={isSubmitting}
                className="bg-primary text-primary-foreground min-w-[140px]"
                data-ocid="post_flat.submit_button"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {isUploading ? "Uploading..." : "Posting..."}
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
