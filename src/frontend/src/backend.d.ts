import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface FlatListing {
    id: bigint;
    title: string;
    postedAt: bigint;
    contactName: string;
    rentPrice: bigint;
    bedrooms: bigint;
    isAvailable: boolean;
    description: string;
    contactEmail: string;
    bathrooms: bigint;
    location: string;
    contactPhone: string;
}
export interface FlatListingInput {
    title: string;
    contactName: string;
    rentPrice: bigint;
    bedrooms: bigint;
    description: string;
    contactEmail: string;
    bathrooms: bigint;
    location: string;
    contactPhone: string;
}
export interface UserProfile {
    name: string;
}
export interface MarkUnavailableInput {
    listingId: bigint;
    contactEmail: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    deleteListing(id: bigint): Promise<void>;
    getAvailableListings(): Promise<Array<FlatListing>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getListing(id: bigint): Promise<FlatListing>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    markListingUnavailable(input: MarkUnavailableInput): Promise<void>;
    postListing(input: FlatListingInput): Promise<bigint>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
}
