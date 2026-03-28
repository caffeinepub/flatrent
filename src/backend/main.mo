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
  // Initialize the access control system
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // User Profile Management
  public type UserProfile = {
    name : Text;
  };

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

  // Flat Listing Types and Functions
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
  };

  module FlatListing {
    public func compare(listing1 : FlatListing, listing2 : FlatListing) : Order.Order {
      Nat.compare(listing1.id, listing2.id);
    };

    public func compareByPostedAt(listing1 : FlatListing, listing2 : FlatListing) : Order.Order {
      Int.compare(listing2.postedAt, listing1.postedAt);
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
  };

  let flatListings = Map.empty<Nat, FlatListing>();
  var nextId = 1;

  // Anyone can post a new flat listing (no auth required)
  public shared ({ caller }) func postListing(input : FlatListingInput) : async Nat {
    let id = nextId;
    nextId += 1;
    let listing : FlatListing = {
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
    };
    flatListings.add(id, listing);
    id;
  };

  // Public access - get a single listing by id
  public query func getListing(id : Nat) : async FlatListing {
    switch (flatListings.get(id)) {
      case (null) { Runtime.trap("Listing not found") };
      case (?listing) { listing };
    };
  };

  // Public access - get all available listings
  public query func getAvailableListings() : async [FlatListing] {
    flatListings.values().toArray().filter(
      func(listing) { listing.isAvailable }
    ).sort(FlatListing.compareByPostedAt);
  };

  // Admin access - get ALL listings including unavailable
  public query ({ caller }) func getAllListings() : async [FlatListing] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all listings");
    };
    flatListings.values().toArray().sort(FlatListing.compareByPostedAt);
  };

  type MarkUnavailableInput = {
    listingId : Nat;
    contactEmail : Text;
  };

  // Landlord can mark their listing as unavailable (verified by contact email)
  public shared ({ caller }) func markListingUnavailable(input : MarkUnavailableInput) : async () {
    switch (flatListings.get(input.listingId)) {
      case (null) { Runtime.trap("Listing not found") };
      case (?listing) {
        if (listing.contactEmail != input.contactEmail) {
          Runtime.trap("Contact email does not match");
        };
        let updatedListing = {
          listing with
          isAvailable = false;
        };
        flatListings.add(input.listingId, updatedListing);
      };
    };
  };

  // Admin can delete a listing
  public shared ({ caller }) func deleteListing(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete listings");
    };
    switch (flatListings.get(id)) {
      case (null) { Runtime.trap("Listing not found") };
      case (?_) {
        flatListings.remove(id);
      };
    };
  };

  // Admin can update/edit a listing
  public shared ({ caller }) func updateListing(id : Nat, input : FlatListingInput) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update listings");
    };
    switch (flatListings.get(id)) {
      case (null) { Runtime.trap("Listing not found") };
      case (?listing) {
        let updatedListing : FlatListing = {
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
        };
        flatListings.add(id, updatedListing);
      };
    };
  };

  // Admin can toggle availability of a listing
  public shared ({ caller }) func toggleListingAvailability(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can toggle listing availability");
    };
    switch (flatListings.get(id)) {
      case (null) { Runtime.trap("Listing not found") };
      case (?listing) {
        let updatedListing = {
          listing with
          isAvailable = not listing.isAvailable;
        };
        flatListings.add(id, updatedListing);
      };
    };
  };
};
