import { useWallet } from '@solana/wallet-adapter-react';
import type { NextPage } from 'next';
import { useState } from 'react';
import { useLocalStorage } from '../components/useLocalStorage';
import { Web3Storage, Filelike } from 'web3.storage';
import { Command } from '../components/command';
import { HeartIcon, TerminalIcon, UserGroupIcon } from '@heroicons/react/solid';
import Link from 'next/link';
import { useNotifications } from '../components/Notifications';
import { useStrangemoodMetadataStore } from '../components/store';

function IconLayout(props: { label: string; children: any; href: string }) {
  return (
    <Link href={props.href}>
      <a className="flex flex-col px-4 py-2 dark:hover:bg-gray-700 hover:bg-blue-200 items-center justify-center">
        {props.children}
        <div className="text-xs text-muted">{props.label}</div>
      </a>
    </Link>
  );
}

function Layout(props: { children: any }) {
  const notify = useNotifications();

  return (
    <div className="flex flex-col h-full">
      <div className="border-b border-gray-normal dark:bg-black bg-gray-50">
        <div className="px-4 py-1 mx-auto flex flex-flex items-center justify-between">
          <h1 className="text-center text-sm dark:text-gray-500 m-0 p-0">
            Strangemood
          </h1>

          <button
            className="p-1 hover:opacity-70"
            onClick={() => {
              notify('info', 'Press ctrl-k or cmd-k!');
            }}
          >
            <TerminalIcon className="h-4 w-4" />
          </button>
        </div>
      </div>
      <div className="h-full flex flex-row">
        <div className="py-4 dark:bg-black bg-gray-50  border-r h-full">
          <IconLayout label="people" href="#">
            <UserGroupIcon className="h-4 w-4" />
          </IconLayout>
        </div>
        {props.children}
      </div>
      <Command
        id="my-cmd"
        onExecute={() => {
          console.log('hi');
          notify('info', 'hello I am a notification');
        }}
        search={['example command']}
        className="p-base justify-between flex w-full items-center"
      >
        <div>hi</div>
        <HeartIcon className="text-blue-500 h-4 w-4" />
      </Command>

      <Command
        id="another-cmd"
        onExecute={() => {
          console.log('hi');
        }}
        search={['another command']}
        className="p-base"
      >
        Another Command
      </Command>

      <div className="dark:bg-black bg-gray-100 flex border-t px-2 py-1 text-sm justify-between">
        <a
          href="https://github.com/strangemoodfoundation/studio"
          className="underline text-muted"
        >
          Edit this website
        </a>
        <div className="text-muted">hi</div>
      </div>
    </div>
  );
}

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
  const [imageCIDs, updateImageCIDs] = useLocalStorage(
    'imageCIDs',
    new Array<string>()
  );
  const [videoCIDs, updateVideoCIDs] = useLocalStorage(
    'videoCIDs',
    new Array<string>()
  );

  async function onSubmit() {
    setIsLoading(true);

    // Post data to openmetadata endpoint
    setIsLoading(false);
  }

  async function saveToWeb3Storage(web3File: Filelike) {
    const web3Client = new Web3Storage({
      token: 'proxy_replaces',
      endpoint: new URL('https://web3proxy.fly.dev/api/web3/'),
    });
    return await web3Client.put([web3File], { wrapWithDirectory: false });
  }

  function moveImageCID(value: string, moveUp: boolean) {
    let imageCIDsCopy = [...imageCIDs];
    let index = imageCIDsCopy.indexOf(value);
    let insertIndex = moveUp ? index - 1 : index + 1;
    imageCIDsCopy = imageCIDsCopy.filter((item) => item !== value);
    imageCIDsCopy.splice(insertIndex, 0, value);
    updateImageCIDs(imageCIDsCopy);
  }

  const store = useStrangemoodMetadataStore();

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
                onChange={(e) => store.put('name', e.target.value)}
              />
            </FormElement>

            <FormElement label="description" className="">
              <textarea
                className="px-4 py-2 flex w-full bg-foreground border-0"
                placeholder="A short paragraph that appears on stores"
                autoFocus={true}
                onChange={(e) => store.put('description', e.target.value)}
              />
            </FormElement>

            <FormElement
              label="primary image"
              hint="A cover image or thumbnail that appears in stores, social media embeds, and so on."
            >
              <div className="p-4 bg-foreground">
                <input type={'file'} />
              </div>
            </FormElement>
          </div>
          <div className="p-4 flex justify-end rounded items-center">
            <div className="w-full flex items-center">
              <div className="rounded-full h-2 w-2 bg-black dark:bg-gray-500" />
              <div className="h-px w-full bg-black dark:bg-gray-500" />
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
