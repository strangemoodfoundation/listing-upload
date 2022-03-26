import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { useRouter } from 'next/router';
import { ListingLayout } from '../../../components/Layout';

function Media() {
  return (
    <div className="pattern w-full h-full">
      <div className="max-w-6xl mx-auto w-full my-4 ">
        <div className="px-4 border py-4 bg-white ">hi</div>
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
