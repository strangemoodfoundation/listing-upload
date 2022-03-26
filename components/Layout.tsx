import { Command } from '../components/command';
import {
  ArrowRightIcon,
  HeartIcon,
  LightningBoltIcon,
  LinkIcon,
  QuestionMarkCircleIcon,
  SwitchHorizontalIcon,
  TerminalIcon,
} from '@heroicons/react/solid';
import { useNotifications } from '../components/Notifications';
import Link from 'next/link';
import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { useRouter } from 'next/router';
import { useListing, useUpdateListing } from './useListing';
import { useNetwork } from './WalletConnectionProvider';
import copy from 'copy-to-clipboard';
import cn from 'classnames';
import { animated, useTransition } from 'react-spring';

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
          category="Environments"
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
          category="Environments"
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
    <div className="font-mono justify-between flex border-b clear-border-color border-gray-800 text-xs py-1 bg-black w-full text-white items-center ">
      <div className="inline flex items-center max-w-6xl mx-auto w-full px-4 ">
        <SwitchHorizontalIcon className="h-3 w-3 mr-2 text-muted" />
        <span className="text-gray-500">You are on </span>
        <span className="font-bold ml-2">{flag} </span>
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
      <div className="flex flex-row flex-1">
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

function Tab(props: { children: any; active?: boolean; href: string }) {
  return (
    <Link href={props.href}>
      <a
        className={cn({
          'text-sm px-2 pb-2 flex': true,
          'border-b-2 border-blue-500 clear-border-color': props.active,
        })}
      >
        {props.children}
      </a>
    </Link>
  );
}

function PublishLayover() {
  const router = useRouter();
  const { cid, isLoading, isDiff } = useUpdateListing(
    router.query.listingPubkey as any
  );

  const transitions = useTransition(isDiff, {
    from: { transform: 'translate3d(0,40px,0)', opacity: 0 },
    enter: { transform: 'translate3d(0,0px,0)', opacity: 1 },
    leave: { transform: 'translate3d(0,150px,0)', opacity: 0 },
    reverse: isDiff,
  });

  function onPublish() {}

  return transitions(
    (styles, item) =>
      item && (
        <div className="fixed z-50 bottom-12 px-4 right-0">
          <animated.div style={styles}>
            <div className="border px-4 text-sm py-2 bg-white bg-opacity-50 bg-blur shadow-lg rounded  border-black clear-border-color gap-2 flex flex-col">
              <div className="text-xs flex justify-between">
                <div className="text-xs">You have changes ready to deploy.</div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  className="border rounded-sm text-xs clear-border-color border-black bg-white hover:opacity-50 disabled:opacity-50 font-mono text-sm border-b-2 flex cursor-pointer"
                  disabled={true}
                >
                  <div className="px-2 py-1 ">Preview</div>
                </button>
                <button
                  className="border  rounded-sm text-xs clear-border-color border-green-900 bg-green-400 hover:opacity-50 disabled:opacity-50 font-mono text-sm border-b-2 flex cursor-pointer"
                  disabled={isLoading}
                  onClick={onPublish}
                >
                  <div className="px-2 py-1 flex items-center ">
                    Publish Changes
                    <LightningBoltIcon className="h-3 w-3 ml-2" />
                  </div>
                </button>
              </div>
            </div>
            <Command
              id="publish"
              onExecute={() => {
                onPublish();
              }}
              search={['publish', 'publish changes']}
              className="p-base justify-between flex w-full items-center"
              category="Editing"
            >
              <div>Publish Changes</div>
              <LightningBoltIcon className="h-4 w-4 mr-2" />
            </Command>
          </animated.div>
        </div>
      )
  );
}

export function ListingLayout(props: { children: any }) {
  const notify = useNotifications();
  const { publicKey, signMessage } = useWallet();
  const router = useRouter();

  const { listing } = useListing(router.query.listingPubkey as any);
  const { cid, isLoading, isDiff } = useUpdateListing(
    router.query.listingPubkey as any
  );

  if (!publicKey) {
    return <WalletPage />;
  }

  return (
    <div className="flex flex-col h-full bg-gray-900 ">
      <ClusterBanner />

      <PublishLayover />

      <div className="px-4 pt-4 text-white flex justify-between max-w-6xl mx-auto w-full">
        <div>
          <div className="font-bold flex h-6">
            {listing && listing.metadata && listing.metadata.name}
          </div>
          <div className="text-muted h-6">
            {' '}
            {listing && listing.metadata && listing.metadata.description}
          </div>
        </div>
      </div>

      <div className="bg-gray-900 pt-12 pb-4 text-white">
        <div className="border-b clear-border-color border-gray-700">
          <div className="px-2 flex gap-4 max-w-6xl mx-auto">
            <Tab
              active={router.route === '/listings/[listingPubkey]'}
              href={
                listing ? `/listings/${listing.publicKey.toString()}/` : '#'
              }
            >
              Overview
            </Tab>

            {router.route !== '/listings/[listingPubkey]' && (
              <Command
                id="tab-overview"
                onExecute={() => {
                  router.push(`/listings/${listing.publicKey.toString()}/`);
                }}
                search={['overview', 'go to overview']}
                className="p-base justify-between flex w-full items-center"
                category="Navigation"
              >
                <div className="flex items-center">
                  <ArrowRightIcon className="h-4 w-4 mr-2 text-muted" />
                  <div>Go to overview</div>
                </div>
              </Command>
            )}

            <Tab
              active={router.route === '/listings/[listingPubkey]/files'}
              href={
                listing
                  ? `/listings/${listing.publicKey.toString()}/files`
                  : '#'
              }
            >
              Game Files
            </Tab>

            {router.route !== '/listings/[listingPubkey]/files' && (
              <Command
                id="tab-files"
                onExecute={() => {
                  router.push(
                    `/listings/${listing.publicKey.toString()}/files`
                  );
                }}
                search={[
                  'files',
                  'upload',
                  'game files',
                  'build',
                  'go to game files',
                ]}
                className="p-base justify-between flex w-full items-center"
                category="Navigation"
              >
                <div className="flex items-center">
                  <ArrowRightIcon className="h-4 w-4 mr-2 text-muted" />
                  <div>Go to game files</div>
                </div>
              </Command>
            )}
          </div>
        </div>
      </div>
      <div className="flex flex-row h-full">{props.children}</div>
      <Command
        id="home"
        onExecute={() => {
          router.push('/');
        }}
        search={['all', 'go to all listings']}
        className="p-base justify-between flex w-full items-center"
        category="Navigation"
      >
        <div className="flex items-center">
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
        <HeartIcon className="text-muted h-4 w-4" />
      </Command>

      {listing && (
        <>
          <Command
            id="help"
            onExecute={() => {
              copy('https://checkout.strangemood.org/r/' + listing.publicKey);
              notify('info', 'Copied to clipboard!');
            }}
            search={[
              'checkout',
              'copy store link',
              'store',
              'url',
              'copy',
              'link',
              'checkout',
            ]}
            className="p-base justify-between flex w-full items-center"
            category="Explore"
          >
            <div>Copy store link</div>
            <LinkIcon className="text-muted h-4 w-4" />
          </Command>
        </>
      )}
      <ClusterCommands />

      <div className="dark:bg-black bg-white flex border-t px-2 py-1 text-xs justify-between">
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
