import { useQuery } from "@tanstack/react-query";
import api from "../../lib/api";

/* Checks if a resource is available for booking */
export function useAvailability(
  resourceId,
  { date, slot = 30, open = "09:00", close = "19:00" }
) {
  return useQuery({
    queryKey: ["availability", resourceId, date, slot, open, close],
    enabled: !!resourceId && !!date,
    queryFn: async () =>
      (
        await api.get(`/resources/${resourceId}/availability`, {
          params: { date, slot, open, close },
        })
      ).data,
  });
}
