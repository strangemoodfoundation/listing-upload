import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { grabStrangemood } from './strangemood';
import { getListingMetadata } from '../lib/graphql';
import { useEffect, useState } from 'react';
import { Listing } from '@strangemood/strangemood';
import { StrangemoodMetadata } from '../lib/metadata';
import create, { SetState } from 'zustand';

interface ListingsStore {
  put: (key: string, value: ListingData) => void;
  listings: { [key: string]: ListingData };
}

const useListingStore = create<ListingsStore>((set) => ({
  put: (key, value) => {
    set((s) => {
      s.listings = { ...s.listings, [key]: value };
      return { ...s };
    });
  },
  listings: {},
}));

interface ListingData {
  account: Listing;
  metadata: StrangemoodMetadata;
  publicKey: string;
}

export function useListing(publicKey: string) {
  const { connection } = useConnection();
  const wallet = useWallet();
  const store = useListingStore();

  async function fetchListing() {
    const program = await grabStrangemood(connection, wallet);
    const listing = await program.account.listing.fetch(
      new PublicKey(publicKey)
    );

    const metadata = await getListingMetadata(listing.uri);

    return {
      account: listing,
      metadata: metadata,
      publicKey: publicKey,
    } as ListingData;
  }

  useEffect(() => {
    fetchListing()
      .then((listing) => {
        store.put(publicKey, listing);
      })
      .catch(console.error);
  }, [publicKey]);

  return { listing: store.listings[publicKey], refetch: fetchListing };
}
