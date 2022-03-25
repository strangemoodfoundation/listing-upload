import create, { GetState, Mutate, SetState, StoreApi } from 'zustand';
import { persist } from 'zustand/middleware';
import lodashSet from 'lodash/set';
import { StrangemoodMetadata } from '../../lib/metadata';
import * as splToken from '@solana/spl-token';

// Configurable changes to the listing that aren't included
// in the listing metadata.
export interface onChainAccountData {
  price: number;
  bounty: number;
  currencyPublicKey: string;
}

const DEFAULT_PRICE = 0.0001;
const DEFAULT_BOUNTY = 0.1;
const DEFAULT_CURRENCY = splToken.NATIVE_MINT.toBase58();

interface ModifiableData extends Partial<StrangemoodMetadata> {
  // Changes made to on-chain data that's not included in the metadata
  onChainAccountData: onChainAccountData;
}

interface MetadataChanges {
  change: (
    modification: (initial: ModifiableData) => Partial<ModifiableData>
  ) => void;
  modifications: ModifiableData;
}

export const useListingModifications = create<MetadataChanges>((set, get) => ({
  change: (modification) => {
    set((state) => ({
      modifications: {
        ...state.modifications,
        ...modification(state.modifications),
      },
    }));
  },
  modifications: {
    onChainAccountData: {
      price: DEFAULT_PRICE,
      bounty: DEFAULT_BOUNTY,
      currencyPublicKey: DEFAULT_CURRENCY,
    },
  },
}));
