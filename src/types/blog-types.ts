export interface BlogRootSettings {
  title: string;
  descriptions: string;
  coverImage?: File | null;
  category: string;
  tags: string[];
}

export type SectionBlockType = "info" | "warning" | "error" | "tips";

export interface SectionBlock {
  type: SectionBlockType;
  content?: string;
  image?: File | null;
  imageTitle?: string;
  imageWarning?: string;
}

export interface BlogSection {
  markdown: string;
  blocks: SectionBlock[];
}
