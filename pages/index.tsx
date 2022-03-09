import { useWallet } from '@solana/wallet-adapter-react';
import type { NextPage } from 'next';
import { useState } from 'react';
import { useLocalStorage } from '../components/useLocalStorage';
import { Web3Storage, Filelike } from 'web3.storage';
import { useStrangemoodMetadataStore } from '../components/store';
import { Layout } from '../components/Layout';
import { imageConfigDefault } from 'next/dist/server/image-config';

function FormElement(props: {
  children: any;
  label: string;
  required?: boolean;
  className?: string;
  hint?: string;
}) {
  return (
    <label className={'flex flex-col border-b ' + props.className}>
      <div className="text-sm flex bg-gray-50 dark:bg-gray-800 justify-between font-mono ">
        <div className="pl-4 py-1">{props.label}</div>

        {props.required && (
          <div className="bg-gray-100 dark:bg-gray-700 border-b items-center border-l px-4 py-0.5 text-xs inline-flex">
            required
          </div>
        )}
      </div>

      {props.hint && (
        <div className="bg-gray-50 dark:bg-gray-800 text-muted text-sm px-4 pb-2">
          {props.hint}
        </div>
      )}
      <div className="">{props.children}</div>
    </label>
  );
}

async function asImage(file: Blob | MediaSource): Promise<HTMLImageElement> {
  const img = new Image();
  img.src = URL.createObjectURL(file);
  return new Promise((resolve, reject) => {
    img.onload = () => {
      resolve(img);
    };
    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };
  });
}

const Home: NextPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { publicKey, signMessage } = useWallet();
  // Listing Params

  // Metadata Params
  const [metadataEndpoint, setMetadataEndpoint] = useLocalStorage(
    'endpoint',
    'https://openmetagraph.vercel.app'
  );
  const [name, setName] = useLocalStorage('name', '');
  const [description, setDescription] = useLocalStorage('description', '');
  const [categories, setCategories] = useLocalStorage(
    'categories',
    new Array<string>()
  );
  const [createdAt, setCreatedAt] = useLocalStorage('createdAt', 0);
  const [tagline, setTagline] = useLocalStorage('tagline', '');

  // Media
  const [primaryImageCID, updatePrimaryImageCID] = useLocalStorage(
    'primaryImageCID',
    ''
  );

  async function saveToWeb3Storage(web3File: Filelike) {
    const web3Client = new Web3Storage({
      token: 'proxy_replaces',
      endpoint: new URL('https://web3proxy.fly.dev/api/web3/'),
    });
    return await web3Client.put([web3File], { wrapWithDirectory: false });
  }

  const store = useStrangemoodMetadataStore();

  async function onSelectImage(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files) return;
    const file = e.target.files[0];
    if (!file || !file.name) return;

    const cid = await saveToWeb3Storage(file);
    const img = await asImage(file);

    store.set((data) => {
      data.primaryImage = {
        ...(data.primaryImage || {}),
        src: {
          uri: 'https://ipfs.io/ipfs/' + cid,
          contentType: file.type,
        },
        width: img.width,
        height: img.height,
        type: file.type,
      };
    });
  }

  return (
    <Layout>
      <div className="dark:bg-black bg-gray-50 flex flex-col h-full  w-full">
        <div className="flex flex-col flex-1 max-w-4xl pt-12  mx-auto w-full">
          <h1 className="mb-1 font-bold text-lg dark:text-gray-200 pt-2 px-4">
            Create a new game for sale
          </h1>
          <p className="px-4 mb-4 text-muted">
            Last saved {new Date().toLocaleTimeString()}
          </p>
          <div className="w-full flex  lg:border-l lg:border-r border-t flex-col w-full  bg-background">
            <FormElement label="title" required className="">
              <input
                className="px-4 py-2 flex w-full bg-foreground"
                placeholder="ex: 'Form Field Simulator 2'"
                autoFocus={true}
                value={store.metadata.name}
                onChange={(e) => store.put('name', e.target.value)}
              />
            </FormElement>

            <FormElement label="description" className="">
              <textarea
                className="px-4 py-2 flex w-full bg-foreground border-0"
                placeholder="A short paragraph that appears on stores"
                autoFocus={true}
                value={store.metadata.description}
                onChange={(e) => store.put('description', e.target.value)}
              />
            </FormElement>

            <FormElement
              label="primary image"
              hint="A cover image or thumbnail that appears in stores, social media embeds, and so on."
            >
              <div className="p-4 bg-foreground">
                <input
                  type={'file'}
                  accept={'image/png, image/gif, image/jpeg'}
                  onChange={onSelectImage}
                />
              </div>
            </FormElement>

            <FormElement
              label="primary image alt text"
              hint="The screen-reader accessible text for the primary image."
            >
              <input
                className="px-4 py-2 flex w-full bg-foreground"
                placeholder={`ex: "${store.metadata.name || 'title'}"`}
                autoFocus={true}
                value={store.metadata.primaryImage?.alt}
                onChange={(e) =>
                  store.set((data) => {
                    let primaryImage = {
                      ...(data.primaryImage || {}),
                      alt: e.target.value,
                    };
                    return {
                      ...data,
                      primaryImage,
                    };
                  })
                }
              />
            </FormElement>
          </div>
          <div className="p-4 flex justify-end rounded items-center">
            <div className="w-full flex items-center">
              <div className="rounded-full h-2 w-2 bg-black dark:bg-gray-500" />

              <div className="h-px flex-1 bg-black dark:bg-gray-500" />
              <div className="font-mono text-sm flex">
                $0.30 network fee to publish
              </div>
              <div className="h-px w-full bg-black dark:bg-gray-500 w-5" />
              <button className="btn secondary p-base">Publish</button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );

  // return (
  //   <Layout>
  //     <div className="m-auto h-full px-4 py-4 max-w-2xl items-center text-left">
  //       <div className="my-auto text-xl font-bold">Upload your listing</div>
  //       <div className="flex flex-col">
  //         <p className="py-2">
  //           This is text that gives you info about uploading your listing's data
  //         </p>
  //       </div>

  //       {/* METADATA */}
  //       <div className="rounded flex flex-col gap-3">
  //         <div>
  //           <label className="mb-1">Name</label>
  //           <input
  //             value={name}
  //             onChange={(e) => setName(e.target.value)}
  //             type="text"
  //           />
  //         </div>
  //         <div>
  //           <label className="mb-1">Tagline</label>
  //           <input
  //             value={tagline}
  //             onChange={(e) => setTagline(e.target.value)}
  //             placeholder=""
  //             type="text"
  //           />
  //         </div>
  //         <div>
  //           <label className="mb-1">Description</label>
  //           <textarea
  //             value={description}
  //             onChange={(e) => setDescription(e.target.value)}
  //             rows={5}
  //           />
  //         </div>
  //         <div>
  //           <label className="mb-1">Categories</label>
  //           <input
  //             value={categories}
  //             onChange={(e) => setCategories([e.target.value])}
  //             type="text"
  //           />
  //         </div>
  //         <div>
  //           <label className="mb-1">Created At</label>
  //           <input
  //             value={new Date(createdAt).toISOString().slice(0, 10)}
  //             onChange={(e) => setCreatedAt(e.target.valueAsNumber)}
  //             className="border-2 ml-2"
  //             type="date"
  //           />
  //         </div>
  //         {/* MEDIA  */}
  //         <div className="border-b-2 text-xl font-bold">Media</div>
  //         <div>
  //           <label className="mb-1">Cover Image</label>
  //           {!primaryImageCID && (
  //             <input
  //               type="file"
  //               onChange={async (e: any) => {
  //                 const file = e.target.files[0];
  //                 if (!file) {
  //                   updatePrimaryImageCID(``);
  //                   return;
  //                 }
  //                 try {
  //                   const cid = await saveToWeb3Storage(file);
  //                   updatePrimaryImageCID(cid.toString());
  //                 } catch (error) {
  //                   console.log('Error uploading file: ', error);
  //                 }
  //               }}
  //             />
  //           )}
  //         </div>
  //         {primaryImageCID && (
  //           <div className="flex flex-col w-1/2">
  //             <img
  //               className="border-x-2 border-t-2 rounded-t"
  //               src={`https://ipfs.io/ipfs/${primaryImageCID}`}
  //             ></img>
  //             <button
  //               onClick={() => {
  //                 updatePrimaryImageCID('');
  //               }}
  //               className="bg-red-500 text-white px-2 py-1 h-min rounded-b border-x-2 border-b-2"
  //             >
  //               Remove
  //             </button>
  //           </div>
  //         )}
  //         <div>
  //           <label className="mb-1">Images</label>
  //           <input
  //             type="file"
  //             onChange={async (e: any) => {
  //               const file = e.target.files[0];
  //               if (!file) {
  //                 return;
  //               }
  //               try {
  //                 const cid = await saveToWeb3Storage(file);
  //                 updateImageCIDs((imageCIDs) => [...imageCIDs, cid]);
  //               } catch (error) {
  //                 console.log('Error uploading file: ', error);
  //               }
  //             }}
  //           />
  //         </div>
  //         <div className="flex flex-row w-full w-full flex-wrap">
  //           {imageCIDs.map((cid, index) => (
  //             <div
  //               key={cid}
  //               className="flex flex-col items-center rounded w-1/3 overflow-hidden p-1"
  //             >
  //               <img
  //                 className="w-full border-t-2 border-x-2 rounded-tr rounded-tl"
  //                 src={`https://ipfs.io/ipfs/${cid}`}
  //               ></img>
  //               <div className="flex flex-row w-full">
  //                 <button
  //                   type="button"
  //                   disabled={index == 0}
  //                   onClick={() => {
  //                     moveImageCID(cid, true);
  //                   }}
  //                   className="bg-blue-500 text-white px-2 py-1 h-min rounded-bl border-l-2 border-b-2 disabled:bg-gray-400 disabled:text-gray-300"
  //                 >
  //                   ←
  //                 </button>
  //                 <button
  //                   type="button"
  //                   onClick={() => {
  //                     updateImageCIDs((imageCIDs) =>
  //                       imageCIDs.filter((item) => item !== cid)
  //                     );
  //                   }}
  //                   className="bg-red-500 text-white px-2 py-1 h-min border-b-2 grow"
  //                 >
  //                   Remove
  //                 </button>
  //                 <button
  //                   type="button"
  //                   disabled={index == imageCIDs.length - 1}
  //                   onClick={() => {
  //                     moveImageCID(cid, false);
  //                   }}
  //                   className="bg-blue-500 text-white px-2 py-1 h-min rounded-br border-r-2 border-b-2 disabled:bg-gray-400 disabled:text-gray-300"
  //                 >
  //                   →
  //                 </button>
  //               </div>
  //             </div>
  //           ))}
  //         </div>
  //         <div className="mb-3 w-96">
  //           <label className="mb-1">Videos</label>
  //           <input
  //             type="file"
  //             onChange={async (e: any) => {
  //               const file = e.target.files[0];
  //               if (!file) {
  //                 return;
  //               }
  //               try {
  //                 const cid = await saveToWeb3Storage(file);
  //                 updatePrimaryImageCID(cid.toString());
  //               } catch (error) {
  //                 console.log('Error uploading file: ', error);
  //               }
  //             }}
  //           />
  //           {videoCIDs}
  //         </div>
  //         <div className="border-b-2 text-xl text-center font-bold">
  //           Creator
  //         </div>
  //         TODO
  //         <div className="border-b-2 text-xl text-center font-bold">
  //           Releases
  //         </div>
  //         {/* INFO BOX */}
  //         <div className="border border-black p-2 rounded bg-green-200">
  //           <p className="font-bold">Using the CLI</p>
  //           <p>
  //             This info box says use the CLI to encrypt files before uploading.
  //           </p>
  //         </div>
  //         TODO
  //         <button
  //           className="shadow bg-blue-500 hover:bg-blue-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded"
  //           type="button"
  //         >
  //           Submit
  //         </button>
  //       </div>
  //     </div>
  //   </Layout>
  // );
};

export default Home;
