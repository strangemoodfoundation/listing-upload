import { request, gql } from 'graphql-request';
import { StrangemoodMetadata } from './metadata';

const LISTING_METADATA_SCHEMA =
  'bafkreibnw7e5kitzhkeufzka7c3fd3rkeaj43hj2j4fztcimyklxjt4wi4';

export async function getListingMetadata(
  uri: string
): Promise<StrangemoodMetadata> {
  const query = gql`
    query ($key: String) {
      get(key: $key) {
        name
        description
        primaryImage {
          height
          width
          alt
          src {
            contentType
            uri
          }
        }
        tags
        creators {
          bio
          name
          links {
            url
            type
          }
        }
        createdAt
        updatedAt
        links {
          type
        }
        images {
          height
          width
          alt
          src {
            uri
            contentType
          }
        }
        videos {
          width
          height
          src {
            uri
            contentType
          }
        }
        platforms {
          type
          precrypts {
            key {
              uri
              contentType
            }
            file {
              uri
              contentType
            }
            rule
            arguments
            proxy
          }
        }
      }
    }
  `;

  const data = await request(
    `https://www.openmetagraph.com/api/graphql?schema=${LISTING_METADATA_SCHEMA}`,
    query,
    {
      key: uri.replace('ipfs://', ''),
    }
  );

  return data.get;
}

export async function postListingMetadata(doc: StrangemoodMetadata) {
  const query = gql`
    mutation PostDocument($doc: CreateDocumentInput) {
      createDocument(doc: $doc) {
        key
      }
    }
  `;

  const data = (await request(
    `https://www.openmetagraph.com/api/graphql?schema=${LISTING_METADATA_SCHEMA}`,
    query,
    {
      doc: doc,
    }
  )) as {
    createDocument: {
      key: string;
    };
  };

  return data.createDocument;
}
