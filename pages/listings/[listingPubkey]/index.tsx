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
import { useNetwork } from '../../../components/WalletConnectionProvider';
import { useListing } from '../../../components/useListing';
import { useNotifications } from '../../../components/Notifications';

function ListingView() {
  const router = useRouter();
  const { listing, refetch } = useListing(router.query.listingPubkey as string);
  const wallet = useWallet();
  const { connection } = useConnection();
  const networkFlag = useNetwork();
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

  if (!listing || !listing.publicKey)
    return <div className="flex h-full w-full pattern"></div>;

  if (listing.metadata.platforms.length !== 0) {
    return (
      <div className="flex h-full w-full flex-1 flex-col  max-auto pattern">
        <div className="bg-white max-w-6xl mx-auto border  w-full">
          <div className="flex dark:bg-black p-4 flex flex-col">
            <h2 className="font-bold text-lg">{listing.metadata.name}</h2>
            <p>{listing.metadata.description}</p>
          </div>
          <div>
            <div className="flex flex-col">
              {listing.metadata.platforms.map((platform) => (
                <div
                  className="p-4 flex flex-col border-t"
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
      </div>
    );
  }

  return (
    <div className="pattern w-full h-full">
      <div className="max-w-6xl mx-auto w-full">
        <div className="flex h-full flex-col w-full mx-auto lg:border-l ">
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
  const router = useRouter();
  const connection = useConnection();
  const wallet = useWallet();

  return (
    <ListingLayout>{connection && wallet && <ListingView />}</ListingLayout>
  );
}
