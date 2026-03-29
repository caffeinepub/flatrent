import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { FlatListing, FlatListingInput } from "../backend.d";
import { useActor } from "./useActor";

export function useGetListings() {
  const { actor, isFetching } = useActor();
  return useQuery<FlatListing[]>({
    queryKey: ["listings"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAvailableListings() as unknown as Promise<FlatListing[]>;
    },
    enabled: !!actor && !isFetching,
  });
}

export function usePostListing() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: FlatListingInput) => {
      if (!actor) throw new Error("Actor not ready");
      return (
        actor.postListing as (input: FlatListingInput) => Promise<bigint>
      )(input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["listings"] });
    },
  });
}

export function useMarkUnavailable() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      listingId,
      contactEmail,
    }: {
      listingId: bigint;
      contactEmail: string;
    }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.markListingUnavailable({ listingId, contactEmail });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["listings"] });
    },
  });
}
