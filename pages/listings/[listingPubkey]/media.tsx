import { UploadIcon } from '@heroicons/react/solid';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { useRouter } from 'next/router';
import { ListingLayout } from '../../../components/Layout';
import { useDropzone } from 'react-dropzone';
import * as IPFS from 'ipfs-http-client';
import { IFPS_API_ENDPOINT } from '../../../lib/constants';
import { useUpdateListing } from '../../../components/useListing';

function Media() {
  const router = useRouter();

  const { listing, draft, change } = useUpdateListing(
    router.query.listingPubkey as string
  );

  async function onDrop(files: File[]) {
    const client = IPFS.create(IFPS_API_ENDPOINT as any);
    for (let file of files) {
      const cid = await client.add(await file.arrayBuffer());

      // TODO prevent duplicate uploads

      change((state) => ({
        images: [
          ...(state.images || []),
          {
            src: {
              // Extra TODO: Eventually we should switch off of infura
              // TODO: it might be better to use an IPFS:// instead
              // though that might be slow.
              uri: `https://strangemood.infura-ipfs.io/ipfs/${cid.cid.toString()}`,
              contentType: 'image/png',
            },
            width: 0,
            height: 0,
            alt: 'alt',
          },
        ],
      }));
    }
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
  });

  return (
    <div className="pattern w-full h-full">
      <div className="max-w-6xl mx-auto w-full ">
        <div className="px-4 border py-4 bg-white">
          <div className="">
            <div className="justify-between flex items-center">
              <div className="font-bold mb-2">Upload Screenshots</div>
              <div className="text-sm font-mono">{`.png, .jpeg, or .gif`}</div>
            </div>
            <div
              className="px-4 bg-gray-100 border shadow-inner py-12 items-center flex justify-center hover:bg-gray-50 transition-all"
              {...getRootProps()}
            >
              <input {...getInputProps()} accept="image/*" />

              {!isDragActive ? (
                <div className="text-muted h-12 font-mono items-center flex">
                  <UploadIcon className="h-4 w-4 mr-2" /> Drag your screenshots
                  here. <UploadIcon className="h-4 w-4 ml-2" />
                </div>
              ) : (
                <div className="text-muted font-mono h-12 flex items-center">
                  Drop it!
                </div>
              )}
            </div>
          </div>

          <div className="mt-4">
            <div className="font-bold">Screenshots</div>
            <div className="flex flex-col">
              {(draft.images || []).map((image) => (
                <div
                  className="flex items-center"
                  key={'draft-' + image.src.uri}
                >
                  <img src={image.src.uri} />
                </div>
              ))}
            </div>
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

  return <ListingLayout>{connection && wallet && <Media />}</ListingLayout>;
}
