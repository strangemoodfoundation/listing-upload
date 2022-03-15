import { Layout } from '../components/Layout';
import { grabStrangemood } from '../components/strangemood';
import { useEffect, useState } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { Listing } from '@strangemood/strangemood';
import { PublicKey } from '@solana/web3.js';
import { getListingMetadata } from '../lib/graphql';
import { StrangemoodMetadata } from '../lib/metadata';
import Link from 'next/link';
import cn from 'classnames';
import { PlusCircleIcon } from '@heroicons/react/solid';

function useListings() {
  const wallet = useWallet();
  const { connection } = useConnection();

  const [listings, setListings] = useState<
    { account: Listing; publicKey: PublicKey }[]
  >([]);

  useEffect(() => {
    async function fetchListings() {
      if (!wallet || !wallet.publicKey || !connection) return [];
      const program = await grabStrangemood(connection, wallet);

      const listings = await program.account.listing.all([
        {
          memcmp: {
            offset: 8 + 1 + 1 + 1 + 32, // after tag + bool, bool, bool, pubkey
            bytes: wallet.publicKey.toBase58(),
          },
        },
      ]);

      return listings;
    }

    fetchListings().then((listings) => {
      setListings(listings);
    });
  }, []);

  return listings;
}

function ListingView({
  listing,
}: {
  listing: { account: Listing; publicKey: PublicKey };
}) {
  const [metadata, setMetadata] = useState<StrangemoodMetadata>();
  const [err, setError] = useState();

  useEffect(() => {
    async function load() {
      const metadata = await getListingMetadata(listing.account.uri);
      setMetadata(metadata);
    }
    load().catch((err) => {
      setError(err);
    });
  }, [listing.account.uri]);

  if (err) {
    return (
      <div className="px-2 h-24 flex flex-col justify-center py-2 border-b">
        <div className="px-2  py-2 bg-red-50 dark:bg-gray-800 dark:border dark:border-red-500 rounded flex items-center ">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 mr-2 text-red-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <div>
            This listing can't be loaded. It might be created with an old
            version of Strangemood.
            <div className="text-sm text-muted">
              {listing.publicKey.toBase58()}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Link href={`/listings/${listing.publicKey.toBase58()}`}>
      <a
        className={cn({
          'px-2 py-4 border-b flex flex-col hover:bg-blue-50 h-18 flex flex-col justify-center transition-all':
            true,
          'opacity-100': !!metadata,
          'opacity-0': !metadata,
        })}
      >
        {metadata && <div className="font-bold">{metadata.name}</div>}
        <div className="text-xs text-muted">{listing.publicKey.toBase58()}</div>
      </a>
    </Link>
  );
}

function ListingList() {
  const listings = useListings();

  return (
    <div className="flex flex-col w-full">
      <div className="px-2 py-2 w-full bg-gray-50 dark:bg-black border-b flex items-center justify-between">
        <div>Listings</div>
        <div>
          <Link href="/listings/new">
            <button className="border-b-2 border border-black clear-border-color bg-white rounded px-2 py-0.5 text-sm flex items-center hover:bg-blue-50 hover:border-blue-700 hover:text-blue-600 active:border-b-1">
              New
              <PlusCircleIcon className="h-4 ml-1" />
            </button>
          </Link>
        </div>
      </div>
      <div className="flex flex-col pb-12 h-full">
        {listings.map((l) => (
          <ListingView listing={l} key={'l' + l.publicKey.toBase58()} />
        ))}
      </div>
    </div>
  );
}

export default function IndexPage() {
  return (
    <Layout>
      <div className="  mx-auto w-full flex">
        <ListingList />
      </div>
    </Layout>
  );
}
