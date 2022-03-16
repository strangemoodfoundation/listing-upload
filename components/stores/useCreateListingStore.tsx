import create, { SetState } from 'zustand';
import { persist } from 'zustand/middleware';
import lodashSet from 'lodash/set';
import { StrangemoodMetadata } from '../../lib/metadata';

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

export const useCreateListingStore = create<StrangemoodMetadataStore>(
  (set) => ({
    metadata: {
      name: '',
      description: '',
      primaryImage: {
        src: {
          contentType: '',
          uri: '',
        },
        height: 100,
        width: 200,
        alt: '',
      },
      createdAt: 0,
      updatedAt: 0,
      images: [],
      links: [],
      tags: [],
      videos: [],
      platforms: [],
      creators: [],
    },
    set: set,
    put: (key, value) =>
      set((state) => ({
        ...state,
        metadata: { ...state.metadata, [key]: value },
      })),
  })
);
