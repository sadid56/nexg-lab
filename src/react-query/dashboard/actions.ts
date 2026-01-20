import { useQuery } from "@tanstack/react-query";
import { DashboardEndpoints } from "./api";
import { dashboardKeys } from "./keys";

export function useDashboardStats() {
  return useQuery({
    queryKey: dashboardKeys.stats(),
    queryFn: DashboardEndpoints.getDashboardStats,
  });
}
