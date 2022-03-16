import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey, Transaction } from '@solana/web3.js';
import { ListingLayout, MainLayout } from '../../../components/Layout';
import { grabStrangemood } from '../../../components/strangemood';
import { getListingMetadata, postListingMetadata } from '../../../lib/graphql';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { FormElement } from '../../../components/FormElement';
import { StrangemoodMetadata } from '../../../lib/metadata';
import { setListingUri } from '@strangemood/strangemood';
import { useNetworkFlag } from '../../../components/WalletConnectionProvider';
import { useListing } from '../../../components/useListing';
import { useNotifications } from '../../../components/Notifications';

function ListingView() {
  const router = useRouter();
  const { listing, refetch } = useListing(router.query.listingPubkey as string);
  const wallet = useWallet();
  const { connection } = useConnection();
  const networkFlag = useNetworkFlag();
  const [keyCID, setKeyCID] = useState('');
  const [fileCID, setFileCID] = useState('');
  const notify = useNotifications();

  async function onPublish() {
    if (!listing) throw new Error('Unexpectedly no listing');
    const metadata = { ...listing?.metadata };

    // Get argument from url flag
    let networkArguments = {
      'mainnet-beta': ['mainnet'],
      testnet: ['testnet'],
    };
    const ruleArguments = networkArguments[networkFlag];

    metadata.platforms = [
      {
        precrypts: [
          {
            key: {
              uri: 'ipfs://' + keyCID,
              contentType: 'application/octet-stream',
            },
            file: {
              uri: 'ipfs://' + keyCID,
              contentType: 'application/octet-stream',
            },
            proxy: 'https://api.precrypt.org',
            rule: 'owns.spl_token',
            arguments: ruleArguments,
          },
        ],
        type: '*',
      },
    ];

    const { key } = await postListingMetadata(metadata as any);

    const program = await grabStrangemood(connection, wallet);

    const { instructions } = await setListingUri({
      program,
      listing: new PublicKey(listing?.publicKey),
      uri: 'ipfs://' + key,
      signer: program.provider.wallet.publicKey,
    });
    let tx = new Transaction();
    tx.add(...instructions);
    await program.provider.send(tx);

    setTimeout(async () => {
      await refetch();
      notify('success', 'Saved.');
    }, 100);
  }

  if (!listing || !listing.publicKey) return null;

  if (listing.metadata.platforms.length !== 0) {
    return (
      <div className="flex h-full w-full flex-1 flex-col mx-auto ">
        <div className="flex bg-gray-50 dark:bg-black p-4 flex flex-col border-b">
          <h2 className="font-bold text-lg">{listing.metadata.name}</h2>
          <p>{listing.metadata.description}</p>
        </div>
        <div>
          <div className="flex flex-col">
            {listing.metadata.platforms.map((platform) => (
              <div
                className="p-4 border-b flex flex-col"
                key={'platform' + platform.type}
              >
                <div>{platform.type}</div>
                <div>
                  {platform.precrypts.map((precrypt) => (
                    <div key={'precrypt' + precrypt.key + precrypt.file}>
                      <div className="mb-2 ">
                        <div className="text-sm text-muted">key</div>
                        <div className="font-mono">{precrypt.key.uri}</div>
                      </div>
                      <div className="mb-2 ">
                        <div className="text-sm text-muted">file</div>
                        <div className="font-mono">{precrypt.file.uri}</div>
                      </div>

                      <div className="mb-2">
                        <div className="text-sm text-muted">proxy</div>
                        <div className="font-mono">{precrypt.proxy}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col w-full mx-auto lg:border-l ">
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
          <pre className="flex max-w-2xl bg-gray-100 overflow-x-auto text-sm dark:bg-black shadow-inner border px-4 py-2 mb-8">
            {`
npm install -g precrypt;
npm install -g @strangemood/cli;
        `.trim()}
          </pre>
          <div className="mb-2">
            Upload a file, and it will print out two IPFS "CID"s.
          </div>
          <pre className="flex max-w-2xl bg-gray-100 overflow-x-auto text-sm dark:bg-black shadow-inner border px-4 py-2 mb-8">
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
              value={keyCID}
              onChange={(e) => setKeyCID(e.target.value)}
            />
          </FormElement>
          <FormElement label="File CID" className="border-b">
            <input
              className="px-4 py-2 flex w-full bg-foreground "
              placeholder="ex: 'QmTcvndwRQNdPdeNassptsb2Avbz2SnLUtk2LnwaaPbTaz'"
              value={fileCID}
              onChange={(e) => setFileCID(e.target.value)}
            />
          </FormElement>

          <div className="pr-4 py-4 pb-12 flex justify-end rounded items-center">
            <div className="w-full flex items-center">
              <div className="h-px flex-1 bg-black dark:bg-gray-500" />
              <button
                className="btn secondary p-base disabled:opacity-20"
                onClick={() => {
                  onPublish().catch(console.error);
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

  return (
    <ListingLayout>{connection && wallet && <ListingView />}</ListingLayout>
  );
}
