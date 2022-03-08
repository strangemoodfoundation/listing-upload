import { useWallet } from '@solana/wallet-adapter-react';
import type { NextPage } from 'next';
import { useEffect, useState } from 'react';
import { useLocalStorage } from '../lib/useLocalStorage';
import { MetaDataForm } from '../components/FormComponent';

import { Web3Storage, File, Filelike } from 'web3.storage';

const Home: NextPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { publicKey, signMessage } = useWallet();
  // Listing Params

  // Metadata Params
  const [metadataEndpoint, setMetadataEndpoint] = useLocalStorage('endpoint', 'https://openmetagraph.vercel.app');
  const [name, setName] = useLocalStorage('name', '');
  const [description, setDescription] = useLocalStorage('description', '');
  const [categories, setCategories] = useLocalStorage('categories', new Array<string>());
  const [createdAt, setCreatedAt] = useLocalStorage('createdAt', 0);
  const [tagline, setTagline] = useLocalStorage('tagline', '');

  // Media
  const [primaryImageCID, updatePrimaryImageCID] = useLocalStorage('primaryImageCID', '');
  const [imageCIDs, updateImageCIDs] = useLocalStorage('imageCIDs', new Array<string>());
  const [videoCIDs, updateVideoCIDs] = useLocalStorage('videoCIDs', new Array<string>());
  // TODO: Creators
  // TODO: Platforms


  async function onSubmit() {
    // Double check fields are filled out
    // if (!mintAddress || !uploadFile) return;
    setIsLoading(true);

    // Post data to openmetadata endpoint
    // const formData = new FormData;
    // formData.append('mint', mintAddress);
    // formData.append('', uploadFile as Blob);
    // console.log(formData);
    try {
      // Replace request with graphql to metadata endpoint
      // const resp = await fetch(`${metadataEndpoint}/file/store`, {
      //   method: 'POST',
      //   body: formData
      // });
      // const json = await resp.json();
      // console.log(json);
    } catch (error) {
      // if (error instanceof Error) {
      //   console.log(error);
      // }
    }
    setIsLoading(false);
  }

  async function saveToWeb3Storage(web3File: Filelike) {
    const web3Client = new Web3Storage({ token: "asdfasdf", endpoint: new URL('https://web3proxy.fly.dev/api/web3/') });
    return await web3Client.put([web3File], { wrapWithDirectory: false })
  }

  function moveImageCID(value: string, moveUp: boolean) {
    let imageCIDsCopy = [...imageCIDs];
    let index = imageCIDsCopy.indexOf(value);
    let insertIndex = moveUp ? index - 1 : index + 1;
    imageCIDsCopy = imageCIDsCopy.filter(item => item !== value);
    imageCIDsCopy.splice(insertIndex, 0, value);
    updateImageCIDs(imageCIDsCopy);
  }

  return (
    <>
      <div>
        <div className='border-b'>
          <div className='px-4 py-4 mx-auto max-w-2xl flex flex-flex items-center justify-between'>
            <h1 className='font-bold text-center text-2xl m-0 p-0'>
              Strangemood
            </h1>
          </div>
        </div>
        <div className='m-auto h-full px-4 py-4 max-w-2xl items-center text-left'>
          <div className='my-auto text-xl font-bold'>Upload your listing</div>
          <div className='flex flex-col'>
            <p className='py-2'>This is text that gives you info about uploading your listing's data</p>
          </div>

          {/* METADATA */}
          <div className='border-2 rounded p-2 flex flex-col gap-3'>
            <div className='border-b-2 text-xl font-bold'>Metadata</div>

            <MetaDataForm />

            {/* MEDIA  */}
            <div className='border-b-2 text-xl font-bold'>Media</div>
            <div>
              <label className='mb-1'>Cover Image</label>
              {!primaryImageCID && <input
                type="file"
                onChange={async (e: any) => {
                  const file = e.target.files[0];
                  if (!file) {
                    updatePrimaryImageCID(``);
                    return
                  }
                  try {
                    const cid = await saveToWeb3Storage(file);
                    updatePrimaryImageCID(cid.toString());
                  } catch (error) {
                    console.log('Error uploading file: ', error);
                  }
                }}
              />}
            </div>
            {primaryImageCID &&
              <div className='flex flex-col w-1/2'>
                <img className='border-x-2 border-t-2 rounded-t' src={`https://ipfs.io/ipfs/${primaryImageCID}`}></img>
                <button onClick={() => { updatePrimaryImageCID('') }} className='bg-red-500 text-white px-2 py-1 h-min rounded-b border-x-2 border-b-2'>Remove</button>
              </div>
            }

            <div>
              <label className='mb-1'>Images</label>
              <input
                type="file"
                onChange={async (e: any) => {
                  const file = e.target.files[0];
                  if (!file) { return }
                  try {
                    const cid = await saveToWeb3Storage(file);
                    updateImageCIDs(imageCIDs => [...imageCIDs, cid]);
                  } catch (error) {
                    console.log('Error uploading file: ', error);
                  }
                }}
              />
            </div>
            <div className='flex flex-row w-full w-full flex-wrap'>
              {imageCIDs.map((cid, index) => (
                <div key={cid} className='flex flex-col items-center rounded w-1/3 overflow-hidden p-1'>
                  <img className='w-full border-t-2 border-x-2 rounded-tr rounded-tl' src={`https://ipfs.io/ipfs/${cid}`}></img>
                  <div className='flex flex-row w-full'>
                    <button type='button' disabled={index == 0} onClick={() => { moveImageCID(cid, true) }} className='bg-blue-500 text-white px-2 py-1 h-min rounded-bl border-l-2 border-b-2 disabled:bg-gray-400 disabled:text-gray-300'>←</button>
                    <button type='button' onClick={() => { updateImageCIDs(imageCIDs => imageCIDs.filter(item => item !== cid)) }} className='bg-red-500 text-white px-2 py-1 h-min border-b-2 grow'>Remove</button>
                    <button type='button' disabled={index == (imageCIDs.length - 1)} onClick={() => { moveImageCID(cid, false) }} className='bg-blue-500 text-white px-2 py-1 h-min rounded-br border-r-2 border-b-2 disabled:bg-gray-400 disabled:text-gray-300'>→</button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mb-3 w-96">
              <label className='mb-1'>Videos</label>
              <input
                type="file"
                onChange={async (e: any) => {
                  const file = e.target.files[0];
                  if (!file) { return }
                  try {
                    const cid = await saveToWeb3Storage(file);
                    updatePrimaryImageCID(cid.toString());
                  } catch (error) {
                    console.log('Error uploading file: ', error);
                  }
                }}
              />
              {videoCIDs}
            </div>
            <div className='border-b-2 text-xl text-center font-bold'>Creator</div>
            TODO
            <div className='border-b-2 text-xl text-center font-bold'>Releases</div>
            {/* INFO BOX */}
            <div className='border border-black p-2 rounded bg-green-200'>
              <p className='font-bold'>Using the CLI</p>
              <p>
                This info box says use the CLI to encrypt files before uploading.
              </p>
            </div>
            TODO
            <button className="shadow bg-blue-500 hover:bg-blue-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded" type="button">
              Submit
            </button>
          </div>
        </div>
      </div>
    </>

  );
};

export default Home;
