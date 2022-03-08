import { createContext, ReactNode, useContext, useRef } from "react";

interface RefContext {
  current?: any;
  set: (value: any) => any;
}

/**
 * This is like Zustand for refs. It's a ref that's shared
 * between component trees.
 *
 * It's useful for storing a mutable value that you'd like lots
 * of different components to know about, but don't want to
 * store it in state.
 *
 */
export function createContextRef() {
  const refContext = createContext<RefContext>({
    current: {},
    set: () => {},
  });

  function Provider<T>(props: { children: ReactNode; initial?: any }) {
    const ref = useRef<T>(props.initial);

    function set(value: T) {
      ref.current = value;
      return value;
    }

    return (
      <refContext.Provider
        value={{
          current: ref.current || props.initial,
          set,
        }}
      >
        {props.children}
      </refContext.Provider>
    );
  }

  function useContextRef<T>(): [T, (value: T) => T] {
    const ctx = useContext(refContext);

    return [ctx.current, ctx.set];
  }

  return {
    Provider,
    useContextRef,
  };
}
