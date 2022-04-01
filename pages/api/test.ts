import { NextApiRequest, NextApiResponse } from 'next';
import * as IPFS from 'ipfs-http-client';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log(req.body, req.query);
  res.end();
}
