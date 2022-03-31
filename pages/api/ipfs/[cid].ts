import { NextApiRequest, NextApiResponse } from 'next';
import * as IPFS from 'ipfs-http-client';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const cid = req.query.cid;
  if (Array.isArray(cid)) {
    throw new Error('CID cannot be a query string parameter.');
  }

  const client = IPFS.create('http://174.138.118.56:8080' as any);

  for await (const file of client.get(cid)) {
    console.log(file);
    res.write(file);
  }

  res.end();
}
