import { request, gql } from 'graphql-request';

export interface ListingMetadata {
  name: string;
  description: string;
  tagline: string;
  images: string[];
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
    tagline: 'todo',
    images: data.get.images.map((image: any) => image.uri),
    primaryImage: data.get.primaryImage.uri,
  };
}
