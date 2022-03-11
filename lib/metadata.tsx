import {
  OpenMetaGraph,
  OpenMetaGraphElement,
  OpenMetaGraphFileElement,
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
  PLATFORM: 'QmQxk73K9kqZYoHtmeTMMAhVthKM37v8iEjFQBy7BpJKQp',
  IMAGE: 'QmULNXS47mirHDh3fr2nMvaGsBbBVgy6aweNVvwJMFxQGN',
  FILE: 'QmNZbtpfw4E1w1wcgE1Mrr6Cd4qSk3JWm3AePriAFsNF2z',
};

export interface FileMetadata {
  contentType: string;
  uri: string;
}

export interface ImageNodeMetadata {
  alt: string;
  height: number;
  width: number;
  type: string;
  src: string;
}

export interface VideoNodeMetadata {
  height: number;
  width: number;
  type: string;
  src: string;
}

export interface SocialLinkNodeMetadata {
  type: string;
  url: string;
}

export interface CreatorNodeMetadata {
  bio: string;
  links: SocialLinkNodeMetadata[];
  name: string;
  primaryImage: ImageNodeMetadata;
}

export interface PlatformNodeMetadata {
  contents: FileNodeMetadata[];
  type: string;
}

export interface FileNodeMetadata {
  name: string;
  src: string;
  type: string;
}

export interface StrangemoodMetadata {
  name: string;
  description: string;
  primaryImage: ImageNodeMetadata;
  createdAt: number;
  updatedAt: number;
  creators: CreatorNodeMetadata[];
  images: ImageNodeMetadata[];
  links: SocialLinkNodeMetadata[];
  tags: string[];
  videos: VideoNodeMetadata[];
  platforms: PlatformNodeMetadata[];
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
      value: value || 0,
    };
  }
  function str(key: string, value: string): OpenMetaGraphStringElement {
    return {
      object: 'string',
      key,
      value: value || '',
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
    value: ImageNodeMetadata
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

  async function fileNode(
    key: string,
    value: FileNodeMetadata
  ): Promise<OpenMetaGraphNodeElement> {
    const doc = omg(
      [str('name', value.name), str('src', value.src), str('type', value.type)],
      [SCHEMAS.FILE]
    );

    return {
      object: 'node',
      key: key,
      uri: await upload(doc),
    };
  }

  async function platformNode(
    key: string,
    value: PlatformNodeMetadata
  ): Promise<OpenMetaGraphNodeElement> {
    if (!value) throw new Error('platformMetadata is not found');

    const contents = (await Promise.all(
      value.contents.map(async (c) => {
        const doc = omg(
          [str('name', c.name), str('src', c.src), str('type', c.type)],
          [SCHEMAS.FILE]
        );

        const uri = await upload(doc);
        return {
          object: 'node',
          key: 'contents',
          uri,
        };
      })
    )) as OpenMetaGraphNodeElement[];

    const doc = omg([str('type', value.type), ...contents], [SCHEMAS.PLATFORM]);

    const uri = await upload(doc);
    return {
      object: 'node',
      key,
      uri,
    };
  }

  const platforms = await Promise.all(
    metadata.platforms.map(async (p) => {
      return platformNode('platforms', p);
    })
  );

  return omg(
    [
      str('name', metadata.name),
      str('description', metadata.description),
      num('createdAt', metadata.createdAt || new Date().getTime()),
      num('updatedAt', metadata.updatedAt || new Date().getTime()),
      await imageNode('primaryImage', metadata.primaryImage),
      ...platforms,
    ],
    ['QmRcvWdCSQXdVdwLpsepqb8BAvfR9SJLDtk1LnrwjNnGvd']
  );
}
