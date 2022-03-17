import { Command } from '../components/command';
import {
  ArrowRightIcon,
  CloudUploadIcon,
  HeartIcon,
  HomeIcon,
  QuestionMarkCircleIcon,
  SwitchHorizontalIcon,
  TerminalIcon,
} from '@heroicons/react/solid';
import { useNotifications } from '../components/Notifications';
import Link from 'next/link';
import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { useRouter } from 'next/router';
import { useListing } from './useListing';
import { useNetwork } from './WalletConnectionProvider';

function IconLayout(props: { label: string; children: any; href: string }) {
  return (
    <Link href={props.href}>
      <a className="flex flex-row items-center px-4 py-2 dark:hover:bg-gray-700 hover:bg-blue-50 border-b justify-center bg-white text-muted hover:text-gray-900 dark:hover-gray-50 dark:bg-gray-800 ">
        {props.children}
        <div className="text-xs  ml-1">{props.label}</div>
      </a>
    </Link>
  );
}

function ClusterCommands() {
  const router = useRouter();
  const flag = useNetwork();
  return (
    <>
      {flag !== 'testnet' && (
        <Command
          id="use-testnet"
          onExecute={() => {
            router.query.network = 'testnet';
            router.push(router);
          }}
          search={['testnet', 'switch', 'use testnet', 'cluster']}
          className="p-base justify-between flex w-full items-center"
          category="Clusters"
        >
          <div>Use Testnet</div>
          <SwitchHorizontalIcon className="text-muted h-4 w-4" />
        </Command>
      )}
      {flag !== 'mainnet-beta' && (
        <Command
          id="use-mainnet"
          onExecute={() => {
            router.query.network = 'mainnet-beta';
            router.push(router);
          }}
          search={['mainnet', 'switch', 'use mainnet', 'cluster']}
          className="p-base justify-between flex w-full items-center"
          category="Clusters"
        >
          <div>Use Mainnet</div>
          <SwitchHorizontalIcon className="text-muted h-4 w-4" />
        </Command>
      )}
    </>
  );
}

function ClusterBanner() {
  const flag = useNetwork();
  if (flag === 'mainnet-beta') return null;

  return (
    <div className="font-mono border-b clear-border-color border-blue-200 justify-between flex text-sm px-2 py-1 bg-blue-700 w-full text-white">
      <div className="inline">
        <span className="text-blue-200">You are on </span>
        <span className="font-bold">{flag}</span>
      </div>
    </div>
  );
}

function WalletPage() {
  const { visible, setVisible } = useWalletModal();

  return (
    <div className="flex flex-col w-full h-full">
      <div className="justify-center w-full flex flex-1 items-center">
        <div className="flex flex-col">
          <button
            onClick={() => setVisible(true)}
            className="transition-all relative hover:shadow-lg hover:shadow-blue-500/50 dark:bg-gray-800 hover:dark:bg-blue-900 hover:dark:border-blue-700 text-left p-4 border border-gray-700"
          >
            <h2 className="font-bold flex justify-between items-center backdrop-opacity-10">
              Login with a wallet
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4"
                />
              </svg>
            </h2>
          </button>
          <div className="pt-4 px-4 w-96 text-sm dark:text-gray-400 text-gray-600">
            Connect a Solana Wallet to continue. We'd recommend using{' '}
            <a
              className="underline"
              href="https://phantom.app/download"
              target={'_blank'}
            >
              Phantom for desktop{''}
            </a>{' '}
            or a{' '}
            <a
              className="underline"
              href="https://www.ledger.com/"
              target={'_blank'}
            >
              Ledger hardware wallet.
            </a>
          </div>
        </div>
      </div>
      <div className="px-2 text-muted py-1 dark:bg-black border-t flex items-center text-sm text-center justify-center">
        <QuestionMarkCircleIcon className="h-4 w-4 mr-2" />
        <div>
          Need help? Ask questions or get a walkthrough from the co-op on{' '}
          <a className="underline" href="https://discord.com/invite/Y2R3VBcRmA">
            Discord.
          </a>
        </div>
      </div>
    </div>
  );
}

export function MainLayout(props: { children: any }) {
  const notify = useNotifications();
  const { publicKey, signMessage } = useWallet();
  const router = useRouter();

  if (!publicKey) {
    return <WalletPage />;
  }

  return (
    <div className="flex flex-col h-full">
      <ClusterBanner />
      <div className="border-b border-gray-normal dark:bg-gray-900 bg-gray-900 text-white">
        <div className="px-2 py-1 mx-auto flex flex-flex items-center justify-between">
          {publicKey && (
            <div className="text-xs font-mono flex">
              <img
                src="/sun.svg"
                className="h-4 w-4 mr-2 dark:bg-gray-500 bg-white"
              />
            </div>
          )}

          <button
            className="p-1 hover:opacity-70"
            onClick={() => {
              notify('info', 'Press ctrl-k or cmd-k!');
            }}
          >
            <TerminalIcon className="h-4 w-4" />
          </button>
        </div>
      </div>
      <div className="flex flex-row h-full">
        {/* <div className=" dark:bg-black bg-gray-100 border-r h-full">
          <IconLayout label="listings" href="/">
            <ViewListIcon className="h-4 w-4 " />
          </IconLayout>
        </div> */}
        {props.children}
      </div>
      <Command
        id="all-listings"
        onExecute={() => {
          router.push('/');
        }}
        search={['all', 'home', 'go home', 'go to all listings', 'listings']}
        className="p-base justify-between flex w-full items-center"
        category="Navigation"
      >
        <div className="flex flex-row items-center">
          <ArrowRightIcon className="h-4 w-4 mr-2 text-muted" />
          <div>Go to all listings</div>
        </div>
      </Command>
      <Command
        id="help"
        onExecute={() => {
          router.push('https://discord.gg/Y2R3VBcRmA');
        }}
        search={['discord', 'support', 'help', 'faq', 'docs']}
        className="p-base justify-between flex w-full items-center"
        category="Support"
      >
        <div>Discord</div>
      </Command>
      <Command
        id="go-to-co-op"
        onExecute={() => {
          router.push('https://realms.today/dao/MOOD');
        }}
        search={[
          'co-op',
          'coop',
          'go to foundation government',
          'governance',
          'realm',
          'realms',
          'dao',
          'government',
          'vote',
          'foundation',
        ]}
        className="p-base justify-between flex w-full items-center"
        category="Navigation"
      >
        <div className="flex flex-row items-center">
          <ArrowRightIcon className="h-4 w-4 mr-2 text-muted" />
          <div>Go to foundation government</div>
        </div>
      </Command>
      <Command
        id="go-to-docs"
        onExecute={() => {
          router.push('https://docs.strangemood.org/');
        }}
        search={['docs', 'help', 'go to docs', 'documentation']}
        className="p-base justify-between flex w-full items-center"
        category="Navigation"
      >
        <div className="flex flex-row items-center">
          <ArrowRightIcon className="h-4 w-4 mr-2 text-muted" />
          <div>Go to documentation</div>
        </div>
      </Command>
      <ClusterCommands />

      <div className="dark:bg-black bg-gray-100 flex border-t px-2 py-1 text-xs justify-between">
        <a
          href="https://github.com/strangemoodfoundation/studio"
          className="underline text-muted"
        >
          Edit this website
        </a>
        <div className="text-muted">{publicKey.toBase58()}</div>
        <a
          href="https://discord.com/invite/Y2R3VBcRmA"
          className="underline text-muted"
        >
          Discord
        </a>
      </div>
    </div>
  );
}

export function ListingLayout(props: { children: any }) {
  const notify = useNotifications();
  const { publicKey, signMessage } = useWallet();
  const router = useRouter();

  const { listing } = useListing(router.query.listingPubkey as any);

  if (!publicKey) {
    return <WalletPage />;
  }

  return (
    <div className="flex flex-col h-full">
      <ClusterBanner />
      <div className="border-b border-gray-normal dark:bg-gray-900 bg-gray-900 text-white">
        <div className="px-2 py-1 mx-auto flex flex-flex items-center justify-between">
          {publicKey && (
            <div className="text-xs font-mono flex">
              <img
                src="/sun.svg"
                className="h-4 w-4 mr-2 dark:bg-gray-500 bg-white"
              />
              <div>{listing && listing.publicKey}</div>
            </div>
          )}

          <button
            className="p-1 hover:opacity-70"
            onClick={() => {
              notify('info', 'Press ctrl-k or cmd-k!');
            }}
          >
            <TerminalIcon className="h-4 w-4" />
          </button>
        </div>
      </div>
      <div className="flex flex-row h-full">
        <div className=" dark:bg-black bg-gray-100 border-r h-full">
          <IconLayout label="Files" href="/">
            <CloudUploadIcon className="h-4 w-4 " />
          </IconLayout>
        </div>
        {props.children}
      </div>
      <Command
        id="home"
        onExecute={() => {
          router.push('/');
        }}
        search={['all', 'home', 'go home', 'go to home']}
        className="p-base justify-between flex w-full items-center"
        category="Navigation"
      >
        <div>Go home</div>
        <HomeIcon className="text-muted h-4 w-4" />
      </Command>
      <Command
        id="help"
        onExecute={() => {
          router.push('https://discord.gg/Y2R3VBcRmA');
        }}
        search={['discord', 'support', 'help', 'faq', 'docs']}
        className="p-base justify-between flex w-full items-center"
        category="Support"
      >
        <div>Discord</div>
        <HeartIcon className="text-muted h-4 w-4" />
      </Command>
      <ClusterCommands />

      <div className="dark:bg-black bg-gray-100 flex border-t px-2 py-1 text-xs justify-between">
        <a
          href="https://github.com/strangemoodfoundation/studio"
          className="underline text-muted"
        >
          Edit this website
        </a>
        <div className="text-muted">{publicKey.toBase58()}</div>
        <a
          href="https://discord.com/invite/Y2R3VBcRmA"
          className="underline text-muted"
        >
          Discord
        </a>
      </div>
    </div>
  );
}
