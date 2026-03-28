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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Home, Loader2, LogIn, LogOut, Shield, Trash2 } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { UserRole } from "../backend.d";
import { useActor } from "../hooks/useActor";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

export default function AdminPage({ onBack }: { onBack: () => void }) {
  const {
    login,
    clear,
    loginStatus,
    identity,
    isInitializing,
    isLoggingIn,
    isLoginError,
  } = useInternetIdentity();
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const [setupDone, setSetupDone] = useState(false);

  const isLoggedIn = loginStatus === "success" && !!identity;
  const principal = identity?.getPrincipal().toString() ?? null;

  // Check admin status + auto-assign if needed
  const {
    data: isAdmin,
    isLoading: isCheckingAdmin,
    error: adminError,
  } = useQuery({
    queryKey: ["isAdmin", principal],
    queryFn: async () => {
      if (!actor || !identity) return false;
      const admin = await actor.isCallerAdmin();
      if (!admin && !setupDone) {
        // Self-assign admin role on first visit
        await actor.assignCallerUserRole(
          identity.getPrincipal(),
          UserRole.admin,
        );
        setSetupDone(true);
        return true;
      }
      return admin;
    },
    enabled: !!actor && isLoggedIn,
    retry: false,
  });

  // Fetch all listings
  const { data: listings = [], isLoading: listingsLoading } = useQuery({
    queryKey: ["admin-listings"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAvailableListings();
    },
    enabled: !!actor && isAdmin === true,
  });

  // Delete mutation
  const { mutate: deleteListing, isPending: isDeleting } = useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Actor not ready");
      await actor.deleteListing(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-listings"] });
      queryClient.invalidateQueries({ queryKey: ["listings"] });
      toast.success("Listing deleted successfully");
    },
    onError: () => {
      toast.error("Failed to delete listing");
    },
  });

  return (
    <main className="flex-1 bg-background min-h-screen">
      {/* Admin Header */}
      <div className="bg-navbar text-white py-4 px-6">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onBack}
              className="flex items-center gap-2 opacity-70 hover:opacity-100 transition-opacity"
              data-ocid="admin.back_button"
            >
              <Home className="h-4 w-4" />
              <span className="text-sm">Back to FlatRent</span>
            </button>
          </div>
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            <span className="font-display font-bold text-lg">Admin Panel</span>
          </div>
          {isLoggedIn && (
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
          )}
          {!isLoggedIn && <div className="w-24" />}
        </div>
      </div>

      <div className="container mx-auto px-4 py-10 max-w-5xl">
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
                  onClick={login}
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
                {isLoginError && (
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

        {/* Logged in — checking admin */}
        {isLoggedIn && (isCheckingAdmin || isAdmin === undefined) && (
          <div
            className="flex flex-col items-center justify-center min-h-[50vh] gap-3"
            data-ocid="admin.checking_state"
          >
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground text-sm">
              {setupDone
                ? "Setting up admin access..."
                : "Verifying credentials..."}
            </p>
          </div>
        )}

        {adminError && (
          <div
            className="flex flex-col items-center justify-center min-h-[50vh]"
            data-ocid="admin.error_state"
          >
            <p className="text-destructive">
              Failed to verify admin status. Please try again.
            </p>
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
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {listings.map((listing, i) => (
                          <TableRow
                            key={String(listing.id)}
                            data-ocid={`admin.listings.row.${i + 1}`}
                          >
                            <TableCell className="font-medium max-w-[180px] truncate">
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
                                <span className="ml-1 hidden sm:inline">
                                  Delete
                                </span>
                              </Button>
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
    </main>
  );
}
