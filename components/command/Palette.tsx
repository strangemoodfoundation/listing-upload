import create, { SetState } from 'zustand';
import Modal from 'react-modal';
import cn from 'classnames';
import { CommandProps, useCommandStore } from './Command';
import { useFilter } from './useFilter';
import useShortcut from '../useShortcut';
import groupBy from 'lodash/groupBy';
import { ReactNode, useEffect, useRef } from 'react';
import { omit } from 'lodash';
import shallow from 'zustand/shallow';

Modal.setAppElement('#__next');

type PaletteStore = {
  set: SetState<PaletteStore>;
  query: string;
  shown: boolean;
  selection: number;
};

const usePaletteStore = create<PaletteStore>((set) => ({
  set: set,
  query: '',
  shown: false,
  selection: 0,
}));

export function useIsPaletteOpen() {
  return usePaletteStore((s) => s.shown);
}

function usePaletteShortcuts(commands: CommandProps[]) {
  const { shown, set, selection } = usePaletteStore();

  function ArrowDown(e: KeyboardEvent) {
    if (!shown) return;
    e.preventDefault();

    set((s) => {
      if (s.selection >= commands.length - 1) {
        return { selection: commands.length - 1 };
      }
      return {
        selection: s.selection + 1,
      };
    });
  }

  function ArrowUp(e: KeyboardEvent) {
    if (!shown) return;
    e.preventDefault();

    set((s) => {
      if (s.selection <= 0) {
        return { selection: 0 };
      }
      return {
        selection: s.selection - 1,
      };
    });
  }

  function Enter(e: KeyboardEvent) {
    if (!shown) return;
    e.preventDefault();

    const cmd = commands[selection];
    if (!cmd) return;

    if (cmd.onExecute) cmd.onExecute();

    set({
      shown: false,
      query: '',
      selection: 0,
    });
  }

  // Prevents a bug where a user can move the selection
  // to '3' or so, then types a query which shortens
  // the number of items to just 1, which moves the
  // selection "off screen"
  useEffect(() => {
    if (selection === 0) return;
    if (!commands[selection]) {
      set({ selection: 0 });
    }
  }, [selection, commands]);

  useShortcut({ key: 'ArrowDown', priority: 2 }, ArrowDown, [shown, commands]);
  useShortcut({ key: 'Tab', priority: 2 }, ArrowDown, [shown, commands]);
  useShortcut({ key: 'ArrowUp', priority: 2 }, ArrowUp, [shown, commands]);
  useShortcut({ key: 'Enter', priority: 2 }, Enter, [
    shown,
    commands,
    selection,
  ]);
}

function groupByCategory(commands: CommandProps[]) {
  return groupBy(
    // Allow for a default category
    commands.map((c) => ({ ...c, category: c.category || 'None' })),
    'category'
  );
}

function getScrollParent(node: any): any {
  if (node == null) {
    return null;
  }

  if (node.scrollHeight > node.clientHeight) {
    return node;
  } else {
    return getScrollParent(node.parentNode);
  }
}

function CommandBody({ selected, isLast, cmd, index, onClick }: any) {
  const ref = useRef<any>();

  useEffect(() => {
    if (selected) {
      const parent = getScrollParent(ref.current);
      if (!parent) return;
      parent.scroll({
        top: (ref.current?.offsetTop || 0) - parent.offsetHeight,
      });
    }
  });

  return (
    <div
      ref={ref}
      key={cmd.id}
      className={cn({
        flex: true,
        'border-gray-700 bg-white dark:bg-gray-900 ': !selected,
        'bg-blue-100 dark:bg-gray-800 text-blue border-blue-300': selected,
        'rounded-b': isLast,
      })}
      tabIndex={index}
      role="button"
      onClick={onClick}
    >
      <div className={'cmd ' + cmd.className || ''}>{cmd.children}</div>
    </div>
  );
}

function PaletteBody() {
  const store = usePaletteStore();
  const allCommands = useCommandStore((s) => s.commands);
  const filtered = useFilter(store.query, Object.values(allCommands));

  const categories = groupByCategory(filtered);

  // Ensure that the "None" category is at the top
  const none = { None: categories['None'] || [] };
  const rest = omit(categories, ['None']);
  const entries = Object.entries(none).concat(Object.entries(rest));

  // Because we're reordering the None category to the top,
  // Use this ordering in the shortcuts, to ensure that
  // pressing "enter" actually triggers the right command!
  usePaletteShortcuts(entries.map(([cat, cmd]) => cmd).flat());

  let components: ReactNode[] = [];
  let totalIndex = 0;
  for (let [category, cmds] of entries) {
    // Add a category header
    if (category !== 'None') {
      components.push(
        <div
          className="px-6 py-1 bg-gray-50   border-b border-t border-black muted "
          key={'_cat_' + category}
        >
          {category}
        </div>
      );
    }

    // Add all the rest of the commands in this category
    components.push(
      ...cmds.map((cmd, localIndex) => {
        const i = localIndex + totalIndex;

        return (
          <CommandBody
            key={cmd.id}
            cmd={cmd}
            index={i}
            selected={i === store.selection}
            isLast={i === filtered.length - 1}
            onClick={() => {
              if (!cmd.onExecute)
                throw new Error(`onExecute is undefined for ${cmd.id}`);
              cmd.onExecute();
              store.set({
                shown: false,
                query: '',
                selection: 0,
              });
            }}
          />
        );
      })
    );

    // Keep track of the index for selection
    totalIndex += cmds.length;
  }

  return (
    <>
      <input
        className={cn({
          'bg-white dark:bg-black dark:border-b p-4 rounded-t w-full outline-none placeholder-gray-300':
            true,
          'border-black dark:border-gray-600': filtered.length !== 0,
        })}
        autoFocus
        placeholder="Type a command here..."
        onChange={(e) => {
          e.stopPropagation();
          store.set({ query: e.target.value });
        }}
        onKeyDown={(e) => {
          // Prevents a bug where a user is trying to move up and down
          // in the command list, but instead moves the text cursor
          // in the input box
          if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
            e.preventDefault();
          }
          if (e.key === 'Escape') {
            store.set({ shown: false });
          }

          // Make an exception for command-k
          const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
          const isModKeyPressedIfNeeded = isMac ? e.metaKey : e.ctrlKey;
          if (e.key === 'k' && isModKeyPressedIfNeeded) {
            return;
          }

          if (e.key.length === 1) {
            // If the key is alphanumeric, then don't let it trigger
            // other shortcuts
            e.stopPropagation();
          }
        }}
        value={store.query}
      />

      <div
        className="overflow-y-auto flex flex-col scrollbar-none"
        style={{
          maxHeight: '50vh',
        }}
      >
        {components}
      </div>
    </>
  );
}

function useCommandK() {
  const commands = useCommandStore((s) => s.commands);
  const store = usePaletteStore((s) => s);

  function CommandK(e: any) {
    e.preventDefault();

    store.set((s) => {
      // If there's no commmands on this page, don't
      // show the command palette
      if (Object.keys(commands).length === 0) {
        return {
          shown: false,
        };
      }
      return {
        ...s,
        shown: !s.shown,
        query: '',
        selection: 0,
      };
    });
  }

  useShortcut(
    {
      key: 'k',
      mod: true,
      priority: 2,
    },
    CommandK,
    [commands]
  );
}

export default function Palette() {
  const [shown, set] = usePaletteStore((s) => [s.shown, s.set], shallow);
  useCommandK();

  return (
    <Modal
      isOpen={shown}
      className={cn({
        'modal rounded max-w-lg bg-gray-50 dark:bg-gray-900 z-50 border border-black flex-col':
          true,
      })}
      overlayClassName="modal-overlay z-50"
      onRequestClose={() => set({ shown: false })}
    >
      <PaletteBody />
    </Modal>
  );
}
