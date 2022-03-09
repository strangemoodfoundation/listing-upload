import { Command } from '../components/command';
import { HeartIcon, TerminalIcon, UserGroupIcon } from '@heroicons/react/solid';
import { useNotifications } from '../components/Notifications';
import Link from 'next/link';

function IconLayout(props: { label: string; children: any; href: string }) {
  return (
    <Link href={props.href}>
      <a className="flex flex-col px-4 py-2 dark:hover:bg-gray-700 hover:bg-blue-200 items-center justify-center">
        {props.children}
        <div className="text-xs text-muted">{props.label}</div>
      </a>
    </Link>
  );
}

export function Layout(props: { children: any }) {
  const notify = useNotifications();

  return (
    <div className="flex flex-col h-full">
      <div className="border-b border-gray-normal dark:bg-black bg-gray-50">
        <div className="px-4 py-1 mx-auto flex flex-flex items-center justify-between">
          <h1 className="text-center text-sm dark:text-gray-500 m-0 p-0">
            Strangemood
          </h1>

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
      <div className="h-full flex flex-row">
        <div className="py-4 dark:bg-black bg-gray-50  border-r h-full">
          <IconLayout label="people" href="#">
            <UserGroupIcon className="h-4 w-4" />
          </IconLayout>
        </div>
        {props.children}
      </div>
      <Command
        id="my-cmd"
        onExecute={() => {
          console.log('hi');
          notify('info', 'hello I am a notification');
        }}
        search={['example command']}
        className="p-base justify-between flex w-full items-center"
      >
        <div>hi</div>
        <HeartIcon className="text-blue-500 h-4 w-4" />
      </Command>

      <Command
        id="another-cmd"
        onExecute={() => {
          console.log('hi');
        }}
        search={['another command']}
        className="p-base"
      >
        Another Command
      </Command>

      <div className="dark:bg-black bg-gray-100 flex border-t px-2 py-1 text-sm justify-between">
        <a
          href="https://github.com/strangemoodfoundation/studio"
          className="underline text-muted"
        >
          Edit this website
        </a>
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
