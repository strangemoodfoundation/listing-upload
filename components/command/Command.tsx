import { ReactNode, useEffect } from "react";
import create, { SetState } from "zustand";

type CommandStore = {
  commands: {
    [id: string]: CommandProps;
  };
  set: SetState<CommandStore>;
};

export const useCommandStore = create<CommandStore>((set) => ({
  commands: {},
  set: set,
}));

export interface CommandProps {
  id: string;

  // Terms that someone can search for
  search: Array<string>;

  onExecute?: () => void;

  children: ReactNode;
  className?: string;

  category?: string;
}

export function Command(props: CommandProps) {
  if (!props.id) {
    throw new Error("<Command /> components MUST have an 'id' prop.");
  }

  const set = useCommandStore((s) => s.set);

  useEffect(() => {
    set((state) => {
      state.commands[props.id] = props;
      return {
        commands: { ...state.commands },
      };
    });

    // When the component unmounts, delete
    // it from the palette
    return () => {
      set((state) => {
        delete state.commands[props.id];
        return {
          commands: { ...state.commands },
        };
      });
    };
  });

  return null;
}
