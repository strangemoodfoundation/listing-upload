import { MainLayout } from '../components/Layout';
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
import { Command } from '../components/command';
import { useRouter } from 'next/router';

function useListings() {
  const wallet = useWallet();
  const { connection } = useConnection();
  const [loading, setLoading] = useState(true);

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
      setLoading(false);
    });
  }, []);

  return { listings, loading };
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

  const router = useRouter();

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
    <button
      className={
        'px-2 py-4 border-b flex flex-col hover:opacity-70 h-18 flex flex-col justify-center transition-all'
      }
      disabled={!metadata}
      onClick={() => {
        router.push(`/listings/${listing.publicKey.toBase58()}`);
      }}
    >
      {metadata && <div className="font-bold">{metadata.name}</div>}
      <div className="text-xs text-muted">{listing.publicKey.toBase58()}</div>
    </button>
  );
}

function ListingList() {
  const { listings, loading } = useListings();
  const router = useRouter();

  const isNew = !loading && listings.length === 0;

  return (
    <div className="flex flex-col w-full flex-1">
      <div className="px-2 py-2 w-full bg-gray-50 dark:bg-black border-b flex items-center justify-between">
        {isNew && (
          <div className="w-full flex items-center font-mono text-xs inline">
            <div className="font-mono inline">oh</div>
            <div className="h-px w-12 bg-black"></div>
            <div className="font-mono inline">hello</div>
            <div className="h-px w-full bg-black"></div>

            <div className="inline px-1">you</div>
            <div className="h-px w-12 bg-black"></div>
            <div className="inline px-1">should</div>
            <div className="h-px w-12 bg-black"></div>
            <div className="inline px-1">click</div>
            <div className="h-px w-12 bg-black"></div>
            <div className="inline px-1">on</div>
            <div className="h-px w-12 bg-black"></div>
            <div className="inline px-1">this:</div>
            <div className="h-px w-12 bg-black"></div>
          </div>
        )}

        {!isNew && (
          <div className="w-full flex items-center font-mono text-xs">
            listings
          </div>
        )}

        <div>
          <Link href="/new">
            <button
              className={cn({
                'border-b-2 border border-black clear-border-color bg-white dark:bg-gray-700 dark:border-gray-500 rounded px-2 py-0.5 text-sm flex items-center hover:bg-blue-50 hover:border-blue-700 hover:text-blue-600 active:border-b-1':
                  true,
                'animate-pulse': isNew,
              })}
            >
              New
              <PlusCircleIcon className="h-4 ml-1" />
            </button>
          </Link>
        </div>
      </div>
      <div className="flex flex-1 flex-col pb-12 ">
        {!isNew &&
          listings.map((l) => (
            <ListingView listing={l} key={'l' + l.publicKey.toBase58()} />
          ))}
        {isNew && (
          <article className="pt-4 h-full flex flex-col px-4 max-w-3xl mx-auto justify-center">
            <h1 className="font-bold text-xl pt-4 mb-2">
              Welcome to a new type of game store.
            </h1>
            <p className="pb-8">
              When you publish a game here, it gets listed on a network of other
              stores that implement the Strangemood protocol.
            </p>

            <div className="flex">
              <Link href="/new">
                <button className="border flex border-b-2 px-4 py-2 border-black clear-border-color rounded-sm">
                  Create a new game
                </button>
              </Link>
            </div>
          </article>
        )}
      </div>
      <Command
        id="new-listing"
        onExecute={() => {
          router.push('/new');
        }}
        search={['new game', 'new listing', 'listing', 'game', 'new', 'create']}
        className="p-base justify-between flex w-full items-center"
      >
        <div>New Game</div>
        <PlusCircleIcon className="h-4 w-4 text-muted" />
      </Command>
    </div>
  );
}

export default function IndexPage() {
  return (
    <MainLayout>
      <div className=" h-full mx-auto w-full flex flex-1">
        <ListingList />
      </div>
    </MainLayout>
  );
}
