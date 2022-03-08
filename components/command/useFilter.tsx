import { useRef } from "react";
import Fuse from "fuse.js";
import { CommandProps } from "./Command";

export function useFilter(query: string, cmds: CommandProps[]): CommandProps[] {
  const fuseRef = useRef(
    new Fuse(cmds, {
      keys: ["search"],
      distance: 5,
      threshold: 0.1,
    })
  );

  if (query === "") {
    return cmds;
  }

  return fuseRef.current.search(query.trim()).map((s) => s.item);
}
