import Nat "mo:core/Nat";
import Text "mo:core/Text";
import Order "mo:core/Order";
import Array "mo:core/Array";
import Runtime "mo:core/Runtime";
import Map "mo:core/Map";
import Time "mo:core/Time";
import Int "mo:core/Int";
import Principal "mo:core/Principal";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // ---------------------------------------------------------------------------
  // User Profile
  // ---------------------------------------------------------------------------
  public type UserProfile = { name : Text };
  let userProfiles = Map.empty<Principal, UserProfile>();

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // ---------------------------------------------------------------------------
  // Migration: V1 type (no imageHashes) — used only to deserialise old stable
  // data that was stored under the name `flatListings` before this upgrade.
  // ---------------------------------------------------------------------------
  type FlatListingV1 = {
    id : Nat;
    title : Text;
    location : Text;
    rentPrice : Nat;
    bedrooms : Nat;
    bathrooms : Nat;
    description : Text;
    contactName : Text;
    contactPhone : Text;
    contactEmail : Text;
    postedAt : Int;
    isAvailable : Bool;
  };

  // This variable keeps the same name as the old stable variable so the
  // Motoko runtime restores the persisted data into it on upgrade.
  let flatListings = Map.empty<Nat, FlatListingV1>();

  // ---------------------------------------------------------------------------
  // Current listing type (V2) — adds imageHashes
  // ---------------------------------------------------------------------------
  type FlatListing = {
    id : Nat;
    title : Text;
    location : Text;
    rentPrice : Nat;
    bedrooms : Nat;
    bathrooms : Nat;
    description : Text;
    contactName : Text;
    contactPhone : Text;
    contactEmail : Text;
    postedAt : Int;
    isAvailable : Bool;
    imageHashes : [Text];
  };

  module FlatListing {
    public func compareByPostedAt(a : FlatListing, b : FlatListing) : Order.Order {
      Int.compare(b.postedAt, a.postedAt);
    };
  };

  type FlatListingInput = {
    title : Text;
    location : Text;
    rentPrice : Nat;
    bedrooms : Nat;
    bathrooms : Nat;
    description : Text;
    contactName : Text;
    contactPhone : Text;
    contactEmail : Text;
    imageHashes : [Text];
  };

  // New stable map for V2 listings
  let flatListingsV2 = Map.empty<Nat, FlatListing>();

  var nextId = 1;

  // ---------------------------------------------------------------------------
  // Migration: on first upgrade copy V1 -> V2, adding imageHashes = []
  // ---------------------------------------------------------------------------
  system func postupgrade() {
    if (flatListingsV2.size() == 0 and flatListings.size() > 0) {
      for ((id, old) in flatListings.entries()) {
        flatListingsV2.add(id, {
          id = old.id;
          title = old.title;
          location = old.location;
          rentPrice = old.rentPrice;
          bedrooms = old.bedrooms;
          bathrooms = old.bathrooms;
          description = old.description;
          contactName = old.contactName;
          contactPhone = old.contactPhone;
          contactEmail = old.contactEmail;
          postedAt = old.postedAt;
          isAvailable = old.isAvailable;
          imageHashes = [];
        });
      };
    };
  };

  // ---------------------------------------------------------------------------
  // Listing operations (all use flatListingsV2)
  // ---------------------------------------------------------------------------

  public shared ({ caller }) func postListing(input : FlatListingInput) : async Nat {
    let id = nextId;
    nextId += 1;
    flatListingsV2.add(id, {
      id;
      title = input.title;
      location = input.location;
      rentPrice = input.rentPrice;
      bedrooms = input.bedrooms;
      bathrooms = input.bathrooms;
      description = input.description;
      contactName = input.contactName;
      contactPhone = input.contactPhone;
      contactEmail = input.contactEmail;
      postedAt = Time.now();
      isAvailable = true;
      imageHashes = input.imageHashes;
    });
    id;
  };

  public query func getListing(id : Nat) : async FlatListing {
    switch (flatListingsV2.get(id)) {
      case (null) { Runtime.trap("Listing not found") };
      case (?listing) { listing };
    };
  };

  public query func getAvailableListings() : async [FlatListing] {
    flatListingsV2.values().toArray()
      .filter(func(l) { l.isAvailable })
      .sort(FlatListing.compareByPostedAt);
  };

  public query func getAllListings() : async [FlatListing] {
    flatListingsV2.values().toArray().sort(FlatListing.compareByPostedAt);
  };

  type MarkUnavailableInput = { listingId : Nat; contactEmail : Text };

  public shared ({ caller }) func markListingUnavailable(input : MarkUnavailableInput) : async () {
    switch (flatListingsV2.get(input.listingId)) {
      case (null) { Runtime.trap("Listing not found") };
      case (?listing) {
        if (listing.contactEmail != input.contactEmail) {
          Runtime.trap("Contact email does not match");
        };
        flatListingsV2.add(input.listingId, { listing with isAvailable = false });
      };
    };
  };

  public shared ({ caller }) func deleteListing(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete listings");
    };
    switch (flatListingsV2.get(id)) {
      case (null) { Runtime.trap("Listing not found") };
      case (?_) { flatListingsV2.remove(id) };
    };
  };

  public shared ({ caller }) func updateListing(id : Nat, input : FlatListingInput) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update listings");
    };
    switch (flatListingsV2.get(id)) {
      case (null) { Runtime.trap("Listing not found") };
      case (?listing) {
        flatListingsV2.add(id, {
          listing with
          title = input.title;
          location = input.location;
          rentPrice = input.rentPrice;
          bedrooms = input.bedrooms;
          bathrooms = input.bathrooms;
          description = input.description;
          contactName = input.contactName;
          contactPhone = input.contactPhone;
          contactEmail = input.contactEmail;
          imageHashes = input.imageHashes;
        });
      };
    };
  };

  public shared ({ caller }) func toggleListingAvailability(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can toggle listing availability");
    };
    switch (flatListingsV2.get(id)) {
      case (null) { Runtime.trap("Listing not found") };
      case (?listing) {
        flatListingsV2.add(id, { listing with isAvailable = not listing.isAvailable });
      };
    };
  };
};
