import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  CheckCircle,
  Edit2,
  Home,
  Loader2,
  LogIn,
  LogOut,
  Shield,
  Trash2,
  XCircle,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import type { FlatListing } from "../backend.d";
import { UserRole } from "../backend.d";
import { useActor } from "../hooks/useActor";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

type EditForm = {
  title: string;
  location: string;
  rentPrice: string;
  bedrooms: string;
  bathrooms: string;
  description: string;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
};

function listingToForm(listing: FlatListing): EditForm {
  return {
    title: listing.title,
    location: listing.location,
    rentPrice: String(listing.rentPrice),
    bedrooms: String(listing.bedrooms),
    bathrooms: String(listing.bathrooms),
    description: listing.description,
    contactName: listing.contactName,
    contactPhone: listing.contactPhone,
    contactEmail: listing.contactEmail,
  };
}

export default function AdminPage({ onBack }: { onBack: () => void }) {
  const { login, clear, identity, isInitializing, isLoggingIn, isLoginError } =
    useInternetIdentity();
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const [loginAttempted, setLoginAttempted] = useState(false);
  const [setupError, setSetupError] = useState<string | null>(null);
  const [editListing, setEditListing] = useState<FlatListing | null>(null);
  const [editForm, setEditForm] = useState<EditForm | null>(null);

  const isLoggedIn = !!identity;
  const principal = identity?.getPrincipal().toString() ?? null;

  const handleLogin = async () => {
    setLoginAttempted(true);
    setSetupError(null);
    await login();
  };

  const openEdit = (listing: FlatListing) => {
    setEditListing(listing);
    setEditForm(listingToForm(listing));
  };

  const closeEdit = () => {
    setEditListing(null);
    setEditForm(null);
  };

  // Check admin status + auto-assign if needed
  const { data: isAdmin, isLoading: isCheckingAdmin } = useQuery({
    queryKey: ["isAdmin", principal],
    queryFn: async () => {
      if (!actor || !identity) return false;
      try {
        const admin = await actor.isCallerAdmin();
        if (admin) return true;
        try {
          await actor.assignCallerUserRole(
            identity.getPrincipal(),
            UserRole.admin,
          );
          return true;
        } catch {
          const role = await actor.getCallerUserRole();
          if (role === UserRole.admin) return true;
          setSetupError(
            "Could not set up admin access. Please contact support.",
          );
          return false;
        }
      } catch {
        setSetupError("Failed to verify admin status. Please try again.");
        return false;
      }
    },
    enabled: !!actor && isLoggedIn,
    retry: false,
  });

  // Fetch all listings (including unavailable) for admin
  const { data: listings = [], isLoading: listingsLoading } = useQuery({
    queryKey: ["admin-listings"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllListings();
    },
    enabled: !!actor && isAdmin === true,
  });

  const availableCount = listings.filter((l) => l.isAvailable).length;
  const unavailableCount = listings.length - availableCount;

  // Delete mutation
  const { mutate: deleteListing, isPending: isDeleting } = useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Actor not ready");
      await actor.deleteListing(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-listings"] });
      queryClient.invalidateQueries({ queryKey: ["listings"] });
      toast.success("Listing deleted");
    },
    onError: () => toast.error("Failed to delete listing"),
  });

  // Toggle availability mutation
  const { mutate: toggleAvailability, isPending: isToggling } = useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Actor not ready");
      await actor.toggleListingAvailability(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-listings"] });
      queryClient.invalidateQueries({ queryKey: ["listings"] });
      toast.success("Availability updated");
    },
    onError: () => toast.error("Failed to update availability"),
  });

  // Update listing mutation
  const { mutate: updateListing, isPending: isUpdating } = useMutation({
    mutationFn: async ({ id, form }: { id: bigint; form: EditForm }) => {
      if (!actor) throw new Error("Actor not ready");
      await actor.updateListing(id, {
        title: form.title,
        location: form.location,
        rentPrice: BigInt(form.rentPrice || "0"),
        bedrooms: BigInt(form.bedrooms || "0"),
        bathrooms: BigInt(form.bathrooms || "0"),
        description: form.description,
        contactName: form.contactName,
        contactPhone: form.contactPhone,
        contactEmail: form.contactEmail,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-listings"] });
      queryClient.invalidateQueries({ queryKey: ["listings"] });
      toast.success("Listing updated successfully");
      closeEdit();
    },
    onError: () => toast.error("Failed to update listing"),
  });

  const handleEditSubmit = () => {
    if (!editListing || !editForm) return;
    updateListing({ id: editListing.id, form: editForm });
  };

  return (
    <main className="flex-1 bg-background min-h-screen">
      {/* Admin Header */}
      <div className="bg-navbar text-white py-4 px-6">
        <div className="container mx-auto flex items-center justify-between">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-2 opacity-70 hover:opacity-100 transition-opacity"
            data-ocid="admin.back_button"
          >
            <Home className="h-4 w-4" />
            <span className="text-sm">Back to FlatRent</span>
          </button>
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            <span className="font-display font-bold text-lg">Admin Panel</span>
          </div>
          {isLoggedIn ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={clear}
              className="text-white hover:bg-white/10"
              data-ocid="admin.logout_button"
            >
              <LogOut className="h-4 w-4 mr-1" />
              Logout
            </Button>
          ) : (
            <div className="w-24" />
          )}
        </div>
      </div>

      <div className="container mx-auto px-4 py-10 max-w-6xl">
        {/* Not logged in */}
        {!isLoggedIn && !isInitializing && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col items-center justify-center min-h-[50vh] gap-6"
            data-ocid="admin.login_section"
          >
            <Card className="w-full max-w-sm text-center shadow-lg">
              <CardHeader className="pb-4">
                <div className="flex justify-center mb-3">
                  <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center">
                    <Shield className="h-7 w-7 text-primary" />
                  </div>
                </div>
                <CardTitle className="font-display text-2xl">
                  Admin Access
                </CardTitle>
                <CardDescription className="text-sm">
                  Sign in with Internet Identity to manage listings and access
                  the admin dashboard.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  className="w-full"
                  onClick={handleLogin}
                  disabled={isLoggingIn}
                  data-ocid="admin.login_button"
                >
                  {isLoggingIn ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <LogIn className="h-4 w-4 mr-2" />
                  )}
                  {isLoggingIn
                    ? "Signing in..."
                    : "Sign in with Internet Identity"}
                </Button>
                {loginAttempted && isLoginError && (
                  <p
                    className="text-destructive text-xs mt-3"
                    data-ocid="admin.login.error_state"
                  >
                    Login failed. Please try again.
                  </p>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {isInitializing && (
          <div
            className="flex items-center justify-center min-h-[50vh]"
            data-ocid="admin.loading_state"
          >
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}

        {isLoggedIn && isCheckingAdmin && (
          <div
            className="flex flex-col items-center justify-center min-h-[50vh] gap-3"
            data-ocid="admin.checking_state"
          >
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground text-sm">
              Setting up admin access...
            </p>
          </div>
        )}

        {setupError && !isCheckingAdmin && (
          <div
            className="flex flex-col items-center justify-center min-h-[50vh]"
            data-ocid="admin.error_state"
          >
            <p className="text-destructive text-center max-w-sm">
              {setupError}
            </p>
            <Button variant="outline" className="mt-4" onClick={clear}>
              Try Again
            </Button>
          </div>
        )}

        {/* Admin dashboard */}
        {isLoggedIn && isAdmin === true && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-6"
          >
            {/* Identity card */}
            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-4">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-primary/15 flex items-center justify-center">
                    <Shield className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      Admin Session Active
                    </p>
                    <p className="text-xs text-muted-foreground font-mono break-all">
                      {principal}
                    </p>
                  </div>
                </div>
                <Badge
                  variant="default"
                  className="bg-primary text-primary-foreground self-start sm:self-auto"
                >
                  Administrator
                </Badge>
              </CardContent>
            </Card>

            {/* Stats cards */}
            {!listingsLoading && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="pt-5 pb-5">
                    <p className="text-muted-foreground text-xs uppercase tracking-wide mb-1">
                      Total Listings
                    </p>
                    <p className="text-3xl font-bold text-foreground">
                      {listings.length}
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-5 pb-5">
                    <p className="text-muted-foreground text-xs uppercase tracking-wide mb-1">
                      Available
                    </p>
                    <p className="text-3xl font-bold text-green-600">
                      {availableCount}
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-5 pb-5">
                    <p className="text-muted-foreground text-xs uppercase tracking-wide mb-1">
                      Unavailable
                    </p>
                    <p className="text-3xl font-bold text-muted-foreground">
                      {unavailableCount}
                    </p>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Listings table */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="font-display text-xl">
                      All Listings
                    </CardTitle>
                    <CardDescription>
                      Manage all property listings on FlatRent
                    </CardDescription>
                  </div>
                  <Badge variant="secondary">{listings.length} total</Badge>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {listingsLoading ? (
                  <div
                    className="flex items-center justify-center py-12"
                    data-ocid="admin.listings.loading_state"
                  >
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  </div>
                ) : listings.length === 0 ? (
                  <div
                    className="text-center py-12 text-muted-foreground"
                    data-ocid="admin.listings.empty_state"
                  >
                    No listings found.
                  </div>
                ) : (
                  <div
                    className="overflow-x-auto"
                    data-ocid="admin.listings.table"
                  >
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Title</TableHead>
                          <TableHead>Location</TableHead>
                          <TableHead>Price / mo</TableHead>
                          <TableHead>Beds</TableHead>
                          <TableHead>Contact</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {listings.map((listing, i) => (
                          <TableRow
                            key={String(listing.id)}
                            data-ocid={`admin.listings.row.${i + 1}`}
                          >
                            <TableCell className="font-medium max-w-[150px] truncate">
                              {listing.title}
                            </TableCell>
                            <TableCell className="text-muted-foreground text-sm">
                              {listing.location}
                            </TableCell>
                            <TableCell className="text-sm font-semibold text-primary">
                              ₹{Number(listing.rentPrice).toLocaleString()}
                            </TableCell>
                            <TableCell className="text-sm">
                              {String(listing.bedrooms)} BHK
                            </TableCell>
                            <TableCell className="text-xs text-muted-foreground">
                              <div>{listing.contactName}</div>
                              <div>{listing.contactPhone}</div>
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  listing.isAvailable ? "default" : "secondary"
                                }
                                className={
                                  listing.isAvailable
                                    ? "bg-green-100 text-green-700 hover:bg-green-100"
                                    : ""
                                }
                              >
                                {listing.isAvailable
                                  ? "Available"
                                  : "Unavailable"}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-1">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  disabled={isToggling}
                                  onClick={() => toggleAvailability(listing.id)}
                                  title={
                                    listing.isAvailable
                                      ? "Mark Unavailable"
                                      : "Mark Available"
                                  }
                                  data-ocid={`admin.listings.toggle_button.${i + 1}`}
                                >
                                  {listing.isAvailable ? (
                                    <XCircle className="h-3.5 w-3.5 text-orange-500" />
                                  ) : (
                                    <CheckCircle className="h-3.5 w-3.5 text-green-600" />
                                  )}
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => openEdit(listing)}
                                  data-ocid={`admin.listings.edit_button.${i + 1}`}
                                >
                                  <Edit2 className="h-3.5 w-3.5" />
                                </Button>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  disabled={isDeleting}
                                  onClick={() => deleteListing(listing.id)}
                                  data-ocid={`admin.listings.delete_button.${i + 1}`}
                                >
                                  {isDeleting ? (
                                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                  ) : (
                                    <Trash2 className="h-3.5 w-3.5" />
                                  )}
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>

      {/* Edit Listing Dialog */}
      <Dialog
        open={!!editListing}
        onOpenChange={(open) => !open && closeEdit()}
      >
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Listing</DialogTitle>
          </DialogHeader>
          {editForm && (
            <div className="space-y-4 py-2">
              <div className="grid grid-cols-1 gap-3">
                <div>
                  <Label htmlFor="edit-title">Title</Label>
                  <Input
                    id="edit-title"
                    value={editForm.title}
                    onChange={(e) =>
                      setEditForm({ ...editForm, title: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="edit-location">Location</Label>
                  <Input
                    id="edit-location"
                    value={editForm.location}
                    onChange={(e) =>
                      setEditForm({ ...editForm, location: e.target.value })
                    }
                  />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <Label htmlFor="edit-price">Price (₹/mo)</Label>
                    <Input
                      id="edit-price"
                      type="number"
                      value={editForm.rentPrice}
                      onChange={(e) =>
                        setEditForm({ ...editForm, rentPrice: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-beds">Bedrooms</Label>
                    <Input
                      id="edit-beds"
                      type="number"
                      value={editForm.bedrooms}
                      onChange={(e) =>
                        setEditForm({ ...editForm, bedrooms: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-baths">Bathrooms</Label>
                    <Input
                      id="edit-baths"
                      type="number"
                      value={editForm.bathrooms}
                      onChange={(e) =>
                        setEditForm({ ...editForm, bathrooms: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="edit-desc">Description</Label>
                  <Textarea
                    id="edit-desc"
                    rows={3}
                    value={editForm.description}
                    onChange={(e) =>
                      setEditForm({ ...editForm, description: e.target.value })
                    }
                  />
                </div>
                <div className="border-t pt-3">
                  <p className="text-sm font-medium mb-2 text-muted-foreground">
                    Contact Info
                  </p>
                  <div className="space-y-2">
                    <div>
                      <Label htmlFor="edit-cname">Contact Name</Label>
                      <Input
                        id="edit-cname"
                        value={editForm.contactName}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            contactName: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit-cphone">Phone</Label>
                      <Input
                        id="edit-cphone"
                        value={editForm.contactPhone}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            contactPhone: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit-cemail">Email</Label>
                      <Input
                        id="edit-cemail"
                        value={editForm.contactEmail}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            contactEmail: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 justify-end pt-2">
                <Button
                  variant="outline"
                  onClick={closeEdit}
                  disabled={isUpdating}
                >
                  Cancel
                </Button>
                <Button onClick={handleEditSubmit} disabled={isUpdating}>
                  {isUpdating ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : null}
                  Save Changes
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </main>
  );
}
