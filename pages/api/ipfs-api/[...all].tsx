import httpProxyMiddleware from 'next-http-proxy-middleware';

// TODO: Rip out infura for a DAO-run deployment instead that let's us control
// peering
export default (req: any, res: any) =>
  httpProxyMiddleware(req, res, {
    target: 'https://ipfs.infura.io:5001',
    headers: {
      authorization: `Bearer ${Buffer.from(
        `${process.env.INFURA_PROJECT_ID}:${process.env.INFURA_SECRET}`
      ).toString('base64')}`,
    },
    // In addition, you can use the `pathRewrite` option provided by `next-http-proxy`
    pathRewrite: [
      {
        patternStr: '^\\/api\\/ipfs-api',
        replaceStr: '/api/v0',
      },
    ],
  });

export const config = {
  api: {
    bodyParser: false,
    externalResolver: true,
  },
};
