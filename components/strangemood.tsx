import {
  useConnection,
  useWallet,
  WalletContextState,
} from '@solana/wallet-adapter-react';
import { Transaction, ConfirmOptions, Connection } from '@solana/web3.js';
import { Provider } from '@project-serum/anchor';
import { useEffect, useState } from 'react';
import { Strangemood, MAINNET } from '@strangemood/strangemood';
import * as anchor from '@project-serum/anchor';

// Sets up an anchor wallet
export function useAnchorWallet(): any {
  const { publicKey, signTransaction, signAllTransactions, connected } =
    useWallet();

  if (!connected) {
    return false;
  }

  return {
    signTransaction: async (tx: Transaction): Promise<Transaction> => {
      if (!signTransaction) throw new Error('Wallet is not connected');
      return signTransaction(tx);
    },
    signAllTransactions: (txs: Transaction[]): Promise<Transaction[]> => {
      if (!signAllTransactions) throw new Error('Wallet is not connected');
      return signAllTransactions(txs);
    },
    publicKey,
  };
}

export async function grabStrangemood(
  connection: Connection,
  wallet: WalletContextState
) {
  const { publicKey, signTransaction, signAllTransactions, connected } = wallet;

  if (!connected) {
    throw new Error('Not connected');
  }

  const anchorWallet = {
    signTransaction: async (tx: Transaction): Promise<Transaction> => {
      if (!signTransaction) throw new Error('Wallet is not connected');
      return signTransaction(tx);
    },
    signAllTransactions: (txs: Transaction[]): Promise<Transaction[]> => {
      if (!signAllTransactions) throw new Error('Wallet is not connected');
      return signAllTransactions(txs);
    },
    publicKey,
  };

  const provider = new Provider(connection, anchorWallet as any, {});

  const idl = await anchor.Program.fetchIdl<Strangemood>(
    MAINNET.strangemood_program_id,
    provider
  );
  if (!idl) {
    throw new Error('No IDL found for Strangemood');
  }

  return new anchor.Program(idl, MAINNET.strangemood_program_id, provider);
}
