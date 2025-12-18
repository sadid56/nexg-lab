import { Status } from "@/theme/status-badge";

export interface Category {
  id: string;
  title: string;
  slug: string;
  createdAt: string | Date;
  status: Status;
}
