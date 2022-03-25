import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { ListingLayout } from '../../../components/Layout';
import { useRouter } from 'next/router';
import { useListing } from '../../../components/useListing';

function ListingView() {
  const router = useRouter();
  const { listing, refetch } = useListing(router.query.listingPubkey as string);

  if (!listing || !listing.publicKey)
    return <div className="flex h-full w-full pattern"></div>;

  return (
    <div className="pattern w-full h-full">
      <div className="max-w-6xl mx-auto w-full my-4">
        <div className="flex h-full flex-col w-full mx-auto border-l border-r border-t ">
          <div className="flex bg-gray-50 dark:bg-black p-4 flex flex-col border-b">
            <h2 className="font-bold text-lg">{listing.metadata.name}</h2>
            <p>{listing.metadata.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Page() {
  const connection = useConnection();
  const wallet = useWallet();

  return (
    <ListingLayout>{connection && wallet && <ListingView />}</ListingLayout>
  );
}
