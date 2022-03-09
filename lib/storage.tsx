import { Web3Storage, Filelike } from 'web3.storage';

export async function saveFile(web3File: Filelike) {
  const web3Client = new Web3Storage({
    token: 'proxy_replaces',
    endpoint: new URL('https://web3proxy.fly.dev/api/web3/'),
  });
  return await web3Client.put([web3File], { wrapWithDirectory: false });
}

export async function saveJson(obj: any) {
  const web3Client = new Web3Storage({
    token: 'proxy_replaces',
    endpoint: new URL('https://web3proxy.fly.dev/api/web3/'),
  });
  const file = new File([JSON.stringify(obj)], 'metadata.json', {
    type: 'application/json',
  });
  return await web3Client.put([file], { wrapWithDirectory: false });
}
