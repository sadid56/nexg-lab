import { Status } from "@/theme/status-badge";

export interface BlogRootSettings {
  title: string;
  descriptions: string;
  coverImage?: File;
  category: string;
  tags: string[];
  status?: Status;
  slug: string;
  id?: string;
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
