import { useWallet } from '@solana/wallet-adapter-react';
import type { NextPage } from 'next';
import { useState } from 'react';
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
  const [categories, setCategories] = useLocalStorage('categories', new Array());
  const [createdAt, setCreatedAt] = useLocalStorage('createdAt', 0);
  const [tagline, setTagline] = useLocalStorage('tagline', '');
  
  // Media
  const [primaryImageCID, updatePrimaryImageCID] = useLocalStorage('primaryImageCID', '');
  const [imageCIDs, updateImageCIDs] = useLocalStorage('imageCIDs', new Array());
  const [videoCIDs, updateVideoCIDs] = useLocalStorage('videoCIDs', new Array());
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

  async function saveToWeb3Storage(web3_file: Filelike) {
    const web3Client = new Web3Storage({ token: "asdfasdf", endpoint: new URL('https://web3proxy.fly.dev/api/web3/') });
    return await web3Client.put([web3_file], { wrapWithDirectory: false })
  }

  return (
    <>
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

        {/* METADATA FORM */}
        <form className="w-full max-w-sm">
        <div className='border-2 rounded p-2 flex flex-col gap-3'>
        <div className='border-b-2 text-xl text-center font-bold'>Metadata</div>

        <MetaDataForm/>
        </div>

        {/* MEDIA FORM */}
        <div className='border-2 rounded p-2 flex flex-col gap-3'>
          <div className='border-b-2 text-xl text-center font-bold'>Media</div>
          <div className="mb-3 w-96">
          <label className="fblock text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4">Primary Image</label>
            <input
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
            />
            { primaryImageCID && <img className='w-1/2' src={`https://ipfs.io/ipfs/${primaryImageCID}`}></img>}
            </div>

            <div className="mb-3 w-96">
            <label className="fblock text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4">Images</label>
            <input
              type="file"
              onChange={async (e: any) => {
                const file = e.target.files[0];
                if (!file) { return }
                try {
                  const cid = await saveToWeb3Storage(file);
                  imageCIDs.push(cid.toString());
                  console.log(imageCIDs);
                  updateImageCIDs(imageCIDs);
                } catch (error) {
                  console.log('Error uploading file: ', error);
                }
              }}
            />
            { imageCIDs.toString() }
            </div>

            <div className="mb-3 w-96">
            <label className="fblock text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4">Videos</label>
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
            { videoCIDs }
          </div>
        </div>

        <div className='border-2 rounded p-2 flex flex-col gap-3'>
          <div className='border-b-2 text-xl text-center font-bold'>Releases</div>

        </div>
        <div className="md:flex md:items-center">
        <div className="md:w-1/3"></div>
          <div className="md:w-2/3">
            <button className="shadow bg-blue-500 hover:bg-blue-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded" type="button">
              Submit
            </button>
          </div>
        </div>
        </form>

        <div className='mt-5'>
          <p className='underline'>Legend</p>
          <ul className='list-disc list-inside'>
            <li>Put info about fields here</li>
            <li>Field Name: Sentence or two describing the field.</li>
          </ul>
        </div>
      </div>
    </div>
    </>

  );
};

export default Home;
