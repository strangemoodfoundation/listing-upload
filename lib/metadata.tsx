import {
  OpenMetaGraph,
  OpenMetaGraphElement,
  OpenMetaGraphFileElement,
  OpenMetaGraphNodeElement,
  OpenMetaGraphNumberElement,
  OpenMetaGraphStringElement,
} from 'openmetagraph';

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
  rule: string;
  arguments: string[];
}

export interface ChannelNodeMetadata {
  precrypts: PrecryptNodeMetadata[];
  name: string;
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
  channels: ChannelNodeMetadata[];
}

export const BLANK_METADATA = {
  name: '',
  description: '',
  createdAt: new Date().getTime() / 1000,
  updatedAt: new Date().getTime() / 1000,
  creators: [],
  images: [],
  links: [],
  tags: [],
  videos: [],
  channels: [],
  primaryImage: {
    src: {
      uri: '',
      contentType: '',
    },
    alt: '',
    height: 0,
    width: 0,
  },
};
