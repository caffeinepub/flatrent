# FlatRent

## Current State
Admin panel exists with login (Internet Identity), auto-admin-assign, and delete listing. Backend has postListing, deleteListing, getAvailableListings, markListingUnavailable functions.

## Requested Changes (Diff)

### Add
- Backend: `updateListing(id, input)` function for admins to edit listing fields
- Backend: `getAllListings()` for admins to see all listings including unavailable ones
- Admin dashboard stats card (total listings, available count, unavailable count)
- Edit listing button/modal in admin table: edit title, location, price, bedrooms, bathrooms, description, contact info
- Toggle available/unavailable button per listing in admin table
- Contact info column in admin table (phone/email)

### Modify
- AdminPage: add stats cards, edit modal, toggle availability button alongside delete
- Admin table: show contact info, add edit + toggle availability actions

### Remove
- Nothing removed

## Implementation Plan
1. Add `updateListing` and `getAllListings` to main.mo backend
2. Regenerate backend.d.ts bindings
3. Update AdminPage.tsx: stats cards, edit modal dialog, toggle available button
