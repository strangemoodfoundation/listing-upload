import create, { SetState } from 'zustand';
import { persist } from 'zustand/middleware';
import lodashSet from 'lodash/set';
import { StrangemoodMetadata } from '../lib/metadata';

type SetStrangemoodState = SetState<StrangemoodMetadataStore>;
type PutStrangemoodState<K extends keyof StrangemoodMetadata> = (
  key: K,
  value: StrangemoodMetadata[K]
) => void;

interface StrangemoodMetadataStore {
  set: SetStrangemoodState;

  // Set an individual key.
  put: PutStrangemoodState<keyof StrangemoodMetadata>;
  metadata: StrangemoodMetadata;
}

export const useStrangemoodMetadataStore = create<StrangemoodMetadataStore>(
  (set) => ({
    metadata: {} as StrangemoodMetadata,
    set: set,
    put: (key, value) =>
      set((state) => ({
        ...state,
        metadata: { ...state.metadata, [key]: value },
      })),
  })
);
