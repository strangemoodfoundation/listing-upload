import { UploadIcon } from '@heroicons/react/solid';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { useRouter } from 'next/router';
import { ListingLayout } from '../../../components/Layout';
import { useDropzone } from 'react-dropzone';
import * as IPFS from 'ipfs-http-client';
import { useState } from 'react';
import { IFPS_API_ENDPOINT } from '../../../lib/constants';

function Media() {
  const [cids, setCIDS] = useState<string[]>([]);

  async function onDrop(files: File[]) {
    const client = IPFS.create(IFPS_API_ENDPOINT as any);
    for (let file of files) {
      const cid = await client.add(await file.arrayBuffer());
      console.log(cid);
      setCIDS([...cids, cid.cid.toString()]);
      console.log('cids');
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
              {cids.map((cid) => (
                <div className="flex items-center" key={cid}>
                  hi
                  <img src={`https://cloudflare-ipfs.com/ipfs/${cid}`} />
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
