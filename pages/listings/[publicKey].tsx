import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { Layout } from '../../components/Layout';
import { grabStrangemood } from '../../components/strangemood';
import { getListingMetadata, ListingMetadata } from '../../lib/graphql';
import { useEffect, useState } from 'react';
import { Listing } from '@strangemood/strangemood';
import { useRouter } from 'next/router';

interface ListingData {
  account: Listing;
  metadata: ListingMetadata;
  publicKey: string;
}

function useListing(publicKey: string) {
  const { connection } = useConnection();
  const wallet = useWallet();
  const [state, setState] = useState<ListingData>();

  async function fetchListing(publicKey: string) {
    console.log('fetchListing', publicKey);
    const program = await grabStrangemood(connection, wallet);
    console.log('program', program);
    const listing = await program.account.listing.fetch(
      new PublicKey(publicKey)
    );

    console.log('listing', listing);
    const metadata = await getListingMetadata(listing.uri);
    console.log('metadata', metadata);

    return {
      account: listing,
      metadata: metadata,
      publicKey: publicKey,
    } as ListingData;
  }

  useEffect(() => {
    fetchListing(publicKey)
      .then((listing) => {
        setState(listing);
      })
      .catch(console.error);
  }, [publicKey]);

  return state;
}

function ListingView() {
  const router = useRouter();
  const listing = useListing(router.query.publicKey as string);

  return (
    <div className="flex h-full w-full flex-1">
      <div>{listing?.publicKey || 'not loaded'}</div>
    </div>
  );
}

export default function Page() {
  const router = useRouter();
  const connection = useConnection();
  const wallet = useWallet();

  return <Layout>{connection && wallet && <ListingView />}</Layout>;
}
