import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { ListingLayout } from '../../../components/Layout';
import { useRouter } from 'next/router';
import { useListing, useUpdateListing } from '../../../components/useListing';
import { FormElement } from '../../../components/FormElement';
import { useListingModifications } from '../../../components/stores/useCreateListingStore';

function ListingView() {
  const router = useRouter();
  const { listing, draft, change } = useUpdateListing(
    router.query.listingPubkey as string
  );

  if (!listing || !listing.publicKey)
    return <div className="flex h-full w-full pattern"></div>;

  return (
    <div className="pattern w-full h-full">
      <div className="max-w-6xl mx-auto w-full my-4">
        <div className="flex h-full flex-col w-full mx-auto border-l border-r border-t border-b">
          <FormElement label="title" required className="">
            <input
              className="px-4 py-2 flex w-full bg-foreground "
              placeholder="ex: 'Form Field Simulator 2'"
              autoFocus={true}
              value={draft.name}
              onChange={(e) => change(() => ({ name: e.target.value }))}
            />
          </FormElement>
          <FormElement label="description" className="">
            <textarea
              className="px-4 py-2 flex w-full bg-foreground border-0"
              placeholder="A short paragraph that appears on stores"
              autoFocus={true}
              value={draft.description}
              onChange={(e) => change(() => ({ description: e.target.value }))}
            />
          </FormElement>
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
