import { cn } from "@/lib/utils";

export enum Status {
  pending = "pending",
  active = "active",
  unactive = "unactive",
}

export const statusOptions = [
  { value: Status.pending, label: "Pending" },
  { value: Status.active, label: "Active" },
  { value: Status.unactive, label: "Inactive" },
];

export const statusBadgeStyles: Record<Status, string> = {
  pending: cn("bg-yellow-50 text-yellow-700 border-yellow-200", "dark:bg-yellow-500/10 dark:text-yellow-400 dark:border-yellow-500/20"),
  active: cn("bg-green-50 text-green-700 border-green-200", "dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/20"),
  unactive: cn("bg-red-50 text-red-700 border-red-200", "dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20"),
};

export const statusLabel: Record<Status, string> = {
  pending: "Pending",
  active: "Active",
  unactive: "Inactive",
};
