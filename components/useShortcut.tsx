import { useEffect, useState } from "react";
import { createContextRef } from "./ContextRef";
import omit from "lodash/omit";
import maxBy from "lodash/maxBy";

const { Provider, useContextRef } = createContextRef();
export const ShortcutProvider = Provider;

export function useIsShiftDown() {
  const [isDown, setIsDown] = useState(false);

  useEffect(() => {
    function keydown(ev: KeyboardEvent) {
      if (ev.shiftKey) {
        setIsDown(true);
      }
    }
    function keyup(ev: KeyboardEvent) {
      if (!ev.shiftKey) {
        setIsDown(false);
      }
    }

    document.addEventListener("keydown", keydown);
    document.addEventListener("keyup", keyup);
    return () => {
      document.removeEventListener("keydown", keydown);
      document.removeEventListener("keyup", keyup);
    };
  }, []);

  return isDown;
}

interface Instruction {
  fn: (ev: KeyboardEvent) => void;
  priority: number;
}

export default function useShortcut(
  key: {
    key: string;
    shift?: boolean;
    // ctrl on windows, command on mac
    mod?: boolean;

    // A higher number means this keyboard shortcut
    // means this shortcut will happen instead of other shortcuts
    //
    // NOTE: !!!! There can only be one shortcut of any given priority !!!!
    priority?: number;
  },
  innerFn: (ev: KeyboardEvent) => void,

  // If you're referencing state in the listener
  // it won't get updated unless you put it in this deps.
  deps: any[]
) {
  const [instructions, setInstructions] = useContextRef<{
    [key: string]: Instruction[];
  }>();

  function createListener(fn: (ev: KeyboardEvent) => void) {
    return function listener(ev: KeyboardEvent) {
      const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;
      const isModKeyPressedIfNeeded = isMac
        ? ev.metaKey === !!key.mod
        : ev.ctrlKey === !!key.mod;

      if (
        isModKeyPressedIfNeeded &&
        // We convert these to lowercase so that we interpret
        // "shift-J" and "j" as the same key for this check
        ev.key.toLowerCase() === key.key.toLowerCase() &&
        (key.shift === undefined || ev.shiftKey === !!key.shift)
      ) {
        fn(ev);
      }
    };
  }

  useEffect(() => {
    key.priority = key.priority || 0;

    // stringifying lets us use the whole object as a key, like in rust
    const str = JSON.stringify(omit(key, "priority"));

    // This is the first time we've seen this shortcut
    if (!instructions[str]) {
      instructions[str] = [
        {
          priority: key.priority,
          fn: createListener(innerFn),
        },
      ];
      setInstructions(instructions);
    } else {
      // Override an existing priority with a new function
      // (for example, when deps change)
      let existingI = instructions[str]
        .filter((n) => n)
        .findIndex((s) => s.priority === key.priority);
      if (existingI !== -1) {
        instructions[str][existingI] = {
          priority: key.priority,
          fn: createListener(innerFn),
        };
        setInstructions(instructions);
      } else {
        // Add a new priority in the list
        instructions[str].push({
          priority: key.priority,
          fn: createListener(innerFn),
        });
        setInstructions(instructions);
      }
    }

    const resetListener = () => {
      // Remove existing event listeners so we don't
      // get multiple executions
      for (let i of instructions[str].filter((n) => n)) {
        document.removeEventListener("keydown", i.fn);
      }

      let mostImportant = maxBy(
        instructions[str].filter((n) => n),
        (i) => i.priority
      );

      if (!mostImportant) return;

      // 🚨 This MUST be 'keydown' (not 'keypress')
      // because of an oddity of chrome that makes the
      // 'metaKey' control instead of command on macs
      // when the event is 'kepress'
      document.addEventListener("keydown", mostImportant.fn);
    };

    resetListener();
    return () => {
      const i = instructions[str]
        .filter((n) => n)
        .findIndex((s) => s.priority === key.priority);

      if (instructions[str][i]) {
        document.removeEventListener("keydown", instructions[str][i].fn);
      }

      instructions[str] = instructions[str].filter((_, d) => d !== i);
      setInstructions({ ...instructions });

      // This adds back the previous most important listener
      // if there is one
      resetListener();
    };
  }, deps);
}
