import {
  OpenMetaGraph,
  OpenMetaGraphElement,
  OpenMetaGraphNodeElement,
  OpenMetaGraphNumberElement,
  OpenMetaGraphStringElement,
} from 'openmetagraph';

export const SCHEMAS = {
  STRANGEMOOD: 'QmRcvWdCSQXdVdwLpsepqb8BAvfR9SJLDtk1LnrwjNnGvd',
  BASE: 'QmW8f7bdgVLBMDQ8vKY8oX4FqDpZr1WkfP1YQrG6XkkbUj',
  TIMESTAMPS: 'QmYuekxuXRN8JmothpSGrjsDKtokSpdsKmjBJy9UommeL7',
  LISTING: 'QmTQQoP6d2vz5S1JvJdpzj1g9P4yY55nqYsueBnBQM8oR6',
  WITH_PLATFORMS: 'QmcWAxKACUKhkmrQxMg2jZHb8pCBYvBMEPdemvqCyt8gQd',
  IMAGE: 'QmULNXS47mirHDh3fr2nMvaGsBbBVgy6aweNVvwJMFxQGN',
};

export interface FileMetadata {
  contentType: string;
  uri: string;
}

export interface ImageMetadata {
  alt: string;
  height: number;
  width: number;
  type: string;
  src: string;
}

export interface VideoMetadata {
  height: number;
  width: number;
  type: string;
  src: string;
}

export interface SocialLinkMetadata {
  type: string;
  url: string;
}

export interface CreatorMetadata {
  bio: string;
  links: SocialLinkMetadata[];
  name: string;
  primaryImage: ImageMetadata;
}

export interface PlatformMetadata {
  contents: FileMetadata[];
  type: string;
}

export interface StrangemoodMetadata {
  name: string;
  description: string;
  primaryImage: ImageMetadata;
  createdAt: number;
  updatedAt: number;
  creators: CreatorMetadata[];
  images: ImageMetadata[];
  links: SocialLinkMetadata[];
  tags: string[];
  videos: VideoMetadata[];
  platforms: PlatformMetadata[];
}

// TODO: we should autogenerate a mutation for OMG documents
// in the graphql
export async function metadataToOpenMetaGraph(
  metadata: StrangemoodMetadata,
  upload: (data: OpenMetaGraph) => Promise<string>
): Promise<OpenMetaGraph> {
  function num(key: string, value: number): OpenMetaGraphNumberElement {
    return {
      object: 'number',
      key,
      value,
    };
  }
  function str(key: string, value: string): OpenMetaGraphStringElement {
    return {
      object: 'string',
      key,
      value,
    };
  }
  function omg(
    elements: OpenMetaGraphElement[],
    schemas: string[]
  ): OpenMetaGraph {
    return {
      object: 'omg',
      version: '0.1.0',
      elements,
      schemas,
    };
  }

  async function imageNode(
    key: string,
    value: ImageMetadata
  ): Promise<OpenMetaGraphNodeElement> {
    if (!value) throw new Error('imageNode is not found');
    const doc = omg(
      [
        str('contentType', value.type),
        str('src', value.src),
        str('alt', value.alt),
        num('height', value.height),
        num('width', value.width),
      ],
      [SCHEMAS.IMAGE]
    );

    const uri = await upload(doc);
    return {
      object: 'node',
      key,
      uri,
    };
  }

  return omg(
    [
      str('name', metadata.name),
      str('description', metadata.description),
      num('createdAt', metadata.createdAt),
      num('updatedAt', metadata.updatedAt),
      await imageNode('primaryImage', metadata.primaryImage),
    ],
    ['QmRcvWdCSQXdVdwLpsepqb8BAvfR9SJLDtk1LnrwjNnGvd']
  );
}
