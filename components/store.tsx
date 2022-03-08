import create, { SetState } from 'zustand';

export interface FileMetadata {
  contentType: string;
  uri: string;
}

export interface ImageMetadata {
  alt: string;
  height: number;
  width: number;
  type: string;
  src: FileMetadata;
}

export interface VideoMetadata {
  height: number;
  width: number;
  type: string;
  src: FileMetadata;
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

type SetStrangemoodState = SetState<StrangemoodMetadata>;

interface StrangemoodMetadataStore {
  set: SetStrangemoodState;
  metadata: StrangemoodMetadata;
}

export const useStrangemoodMetadataStore = create<StrangemoodMetadataStore>(
  (set) => ({
    metadata: {} as StrangemoodMetadata,
    set,
  })
);
