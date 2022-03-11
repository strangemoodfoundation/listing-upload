import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { Layout } from '../../components/Layout';
import { grabStrangemood } from '../../components/strangemood';
import { getListingMetadata, ListingMetadata } from '../../lib/graphql';
import { useEffect, useState } from 'react';
import { Listing } from '@strangemood/strangemood';
import { useRouter } from 'next/router';
import { FormElement } from '../../components/FormElement';

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

  const [keyCID, setKeyCID] = useState('');
  const [fileCID, setFileCID] = useState('');

  function onPublish() {
    return;
  }

  if (!listing) return null;

  return (
    <div className="flex h-full w-full flex-1 flex-col max-w-6xl mx-auto  border-l border-r">
      <div className="flex bg-gray-50 dark:bg-black p-4 flex flex-col border-b">
        <h2 className="font-bold text-lg">{listing.metadata.name}</h2>
        <p>{listing.metadata.description}</p>
      </div>

      <article className="flex h-full  pt-8 flex-col w-full dark:bg-gray-900 ">
        <div className="px-4">
          <h2 className="text-lg font-bold mb-1">Upload your game files</h2>

          <p className="w-full pb-8">
            To upload a game for purchase, use the Strangemood CLI. Strangemood
            will encrypt your files, and upload them to{' '}
            <a className="underline" href="https://ipfs.io/">
              IPFS
            </a>
            , so that they can only be decrypted by a purchaser.
          </p>
          <div className="mb-2">
            Install the tools with npm. If you don't have npm,{' '}
            <a
              className="underline"
              target={'_blank'}
              href="https://nodejs.org/en/download/"
            >
              click here to install node
            </a>
            .
          </div>
          <pre className="bg-gray-100 text-sm dark:bg-black shadow-inner border px-4 py-2 mb-8">
            {`
npm install -g precrypt;
npm install -g @strangemood/cli;
        `.trim()}
          </pre>
          <div className="mb-2">
            Upload a file, and it will print out two IPFS "CID"s.
          </div>
          <pre className="bg-gray-100 text-sm dark:bg-black shadow-inner border px-4 py-2 mb-8">
            {`
strangemood listing file upload -e ${listing.publicKey} game.zip
        `.trim()}
          </pre>
        </div>

        <div className="">
          <div className="px-4 pb-4">
            Input your precrypt key CID and file CID below.
          </div>
          <FormElement label="Precrypt Key CID" className="border-b">
            <input
              className="px-4 py-2 flex w-full bg-foreground "
              placeholder="ex: 'QmRcvWdwSQXdVdwLpsepqb8BAvfR9SJLDtk1LnrwjNnGva'"
              autoFocus={true}
              // value={store.metadata.name}
              // onChange={(e) => store.put('name', e.target.value)}
            />
          </FormElement>
          <FormElement label="File CID" className="border-b">
            <input
              className="px-4 py-2 flex w-full bg-foreground "
              placeholder="ex: 'QmTcvndwRQNdPdeNassptsb2Avbz2SnLUtk2LnwaaPbTaz'"
              autoFocus={true}
              // value={store.metadata.name}
              // onChange={(e) => store.put('name', e.target.value)}
            />
          </FormElement>

          <div className="pr-4 py-4 pb-12 flex justify-end rounded items-center">
            <div className="w-full flex items-center">
              <div className="h-px flex-1 bg-black dark:bg-gray-500" />
              <div className="h-px w-full bg-black dark:bg-gray-500 w-4" />
              <button
                className="btn secondary p-base disabled:opacity-20"
                // disabled={
                //   // !store.metadata ||
                //   // !store.metadata.name ||
                //   // uploadingImage ||
                //   // isPublishing
                // }
                onClick={() => {
                  // onPublish().catch(console.error);
                }}
              >
                Publish
              </button>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}

export default function Page() {
  const router = useRouter();
  const connection = useConnection();
  const wallet = useWallet();

  return <Layout>{connection && wallet && <ListingView />}</Layout>;
}
