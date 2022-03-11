import { request, gql } from 'graphql-request';

export interface ListingMetadata {
  name: string;
  description: string;
  primaryImage: string;
}

export async function getListingMetadata(
  uri: string
): Promise<ListingMetadata> {
  const query = gql`
    query ($key: String) {
      get(key: $key) {
        name
        description
        primaryImage {
          src {
            uri
            contentType
          }
        }
      }
    }
  `;

  const data = await request(
    `https://www.openmetagraph.com/api/graphql?schema=QmRcvWdCSQXdVdwLpsepqb8BAvfR9SJLDtk1LnrwjNnGvd`,
    query,
    {
      key: uri.replace('ipfs://', ''),
    }
  );

  return {
    name: data.get.name,
    description: data.get.description,
    primaryImage: data.get.primaryImage.uri || '',
  };
}
