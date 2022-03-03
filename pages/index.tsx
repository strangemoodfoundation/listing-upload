import { useWallet } from '@solana/wallet-adapter-react';
import type { NextPage } from 'next';
import { useState } from 'react';
import { useLocalStorage } from '../lib/useLocalStorage';

const Home: NextPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [resultDiv, setResultDiv] = useState((<div></div>));
  const [metadataEndpoint, setMetadataEndpoint] = useLocalStorage('endpoint', 'https://openmetagraph.vercel.app');
  const { publicKey, signMessage } = useWallet();

  // Store Key Params
  const [recryptionKeyString, setRecryptionKeyString] = useLocalStorage('recryptKey', '');
  const [mintAddress, setMintAddress] = useLocalStorage('mint', '');
  const [fileCID, setFileCID] = useLocalStorage('fileCID', '');
  const [fileExtension, setFileExtension] = useLocalStorage('extension', '');
  const [keyCID, setKeyCID] = useLocalStorage('keyCID', '');
  const [precryptPubkey, setPrecryptPubkey] = useLocalStorage('precryptPubkey', '');
  const [decryptKey, setDecryptKey] = useLocalStorage('decryptKey', '');
  const [uploadFile, setUploadFile] = useState(null);

  async function onSubmit() {
    // Double check fields are filled out
    if (!mintAddress || !uploadFile) return;
    setIsLoading(true);

    // Post data to openmetadata endpoint
    const formData = new FormData;
    formData.append('mint', mintAddress);
    formData.append('', uploadFile as Blob);
    console.log(formData);
    try {
      // Replace request with graphql to metadata endpoint
      const resp = await fetch(`${metadataEndpoint}/file/store`, {
        method: 'POST',
        body: formData
      });
      const json = await resp.json();
      console.log(json);
    } catch (error) {
      if (error instanceof Error) {
        console.log(error);
      }
    }
    setIsLoading(false);
  }

  return (
    <div>
      <div className='border-b'>
        <div className='px-4 py-4 mx-auto max-w-4xl flex flex-flex items-center justify-between'>
          <h1 className='font-bold text-center text-2xl m-0 p-0'>
            Strangemood
          </h1>
          <div className='flex flex-row items-center'>
            <p className='pr-2'>
              Metadata Gateway:
            </p>
            <select className='border-2 rounded p-1' value={metadataEndpoint} onChange={(e) => setMetadataEndpoint(e.target.value)}>
              <option value="https://openmetagraph.vercel.app">https://openmetagraph.vercel.app</option>
              <option value="http://localhost:8000">http://localhost:8000</option>
            </select>
          </div>
        </div>
      </div>
      <div className='m-auto h-full px-4 py-4 max-w-4xl items-center text-left'>
        <div className='my-auto text-xl font-bold'>Upload your listing</div>
        <div className='flex flex-col'>
          <p className='py-2'>This is text that gives you info about uploading your listing's data</p>
        </div>

        {/* INFO BOX */}
        <div className='my-5 border border-black p-2 rounded bg-green-200'>
          <p className='font-bold'>Using the CLI</p>
          <p>
            This is info text about how to use the strangemood cli and a link to download it.
          </p>
        </div>

        {/* FORM */}
        <div className='border-2 rounded p-2 flex flex-col gap-3'>
          <div className='border-b-2 text-xl text-center font-bold'>Upload</div>
          <label>
            Recryption Key: 
            <input
              type={'file'}
              onChange={async (e: any) => {
                const file = e.target.files[0];
                if (!file) {
                  setRecryptionKeyString('');
                  return
                }
                try {
                  var reader = new FileReader();
                  reader.addEventListener('load', function (e) {
                    if (!e.target) {
                      console.log("parse error")
                      return;
                    }
                    console.log(e.target.result);
                    setRecryptionKeyString(e.target.result as string);
                  });
                  reader.readAsBinaryString(file);
                } catch (error) {
                  console.log('Error parsing file: ', error);
                }
              }}
            >
            </input>
          </label>
          
          <label>
            Mint Address:
            <input
              className='border ml-2'
              type={'text'}
              onChange={(e) => setMintAddress(e.target.value)}
              value={mintAddress}
            />
          </label>
          
          <label>
            File CID:
            <input
              className='border ml-2'
              type={'text'}
              onChange={(e) => setFileCID(e.target.value)}
              value={fileCID}
            />
          </label>
          
          <label>
            File Extension:
            <input
              className='border ml-2'
              type={'text'}
              onChange={(e) => setFileExtension(e.target.value)}
              value={fileExtension}
            />
          </label>
          
          <button onClick={onSubmit} disabled={isLoading || !recryptionKeyString || !mintAddress || !fileCID || !fileExtension} className='border border-black rounded bg-gray-300 px-2 mx-auto disabled:opacity-20'>Submit</button>
        </div>

        <div className='mt-5'>
          <p className='underline'>Legend</p>
          <ul className='list-disc list-inside'>
            <li>Put info about fields here</li>
            <li>Field Name: Sentence or two describing the field.</li>
          </ul>
        </div>
        {resultDiv && <div>
          {resultDiv}
        </div>}
      </div>
    </div>
  );
};

export default Home;
