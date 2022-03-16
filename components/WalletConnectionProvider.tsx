import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import {
  ConnectionProvider,
  useLocalStorage,
  WalletProvider,
} from '@solana/wallet-adapter-react';
import {
  getLedgerWallet,
  getPhantomWallet,
  getSlopeWallet,
  getSolflareWallet,
  getSolletExtensionWallet,
  getSolletWallet,
  getTorusWallet,
} from '@solana/wallet-adapter-wallets';
import { clusterApiUrl } from '@solana/web3.js';
import { useRouter } from 'next/router';
import { FC, ReactNode, useEffect, useMemo } from 'react';
import { useFlag } from '../components/useFlag';

let networks = {
  'mainnet-beta': WalletAdapterNetwork.Mainnet,
  testnet: WalletAdapterNetwork.Testnet,
};

// First checks for the URL in the query params, then checks for the local storage
// value. If neither is found, returns mainnet-beta, and sets that to local storage
export function useNetwork(): 'testnet' | 'mainnet-beta' {
  const router = useRouter();

  const flag = router.query['network'] as string | undefined;
  const [localNetwork, setLocalNetwork] = useLocalStorage('network', flag);

  useEffect(() => {
    console.log('setting local network to', flag);
    if (flag) setLocalNetwork(flag);
  }, [flag]);

  if (!(localNetwork === 'mainnet-beta' || localNetwork === 'testnet')) {
    console.error('Invalid network', localNetwork);
    return 'mainnet-beta';
  }

  return (localNetwork as any) || 'mainnet-beta';
}

export const WalletConnectionProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const flag = useNetwork();
  const network = networks[flag];

  // You can also provide a custom RPC endpoint
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  // @solana/wallet-adapter-wallets includes all the adapters but supports tree shaking --
  // Only the wallets you configure here will be compiled into your application
  const wallets = useMemo(
    () => [
      getPhantomWallet(),
      getSlopeWallet(),
      getSolflareWallet(),
      //   getTorusWallet({
      //     options: { clientId: 'Get a client ID @ https://developer.tor.us' },
      //   }),
      getLedgerWallet(),
      getSolletWallet({ network }),
      getSolletExtensionWallet({ network }),
    ],
    [network]
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        {children}
      </WalletProvider>
    </ConnectionProvider>
  );
};
