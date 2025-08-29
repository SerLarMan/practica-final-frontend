import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../lib/api";

/* Cancels a booking */
export function useCancelBooking() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }) =>
      api.patch(`/bookings/${id}/cancel`, { reason }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["my-bookings"] });
      qc.invalidateQueries({ queryKey: ["admin-bookings"] });
    },
  });
}
