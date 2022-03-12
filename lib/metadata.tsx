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
  src: FileMetadata;
}

export interface VideoNodeMetadata {
  height: number;
  width: number;
  src: FileMetadata;
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

export interface PrecryptNodeMetadata {
  file: FileMetadata;
  key: FileMetadata;
  proxy: string;
  rule: string[];
}

export interface PlatformNodeMetadata {
  precrypts: PrecryptNodeMetadata[];
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
