import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../lib/api";

/* Creates a new booking */
export function useCreateBooking() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (p) =>
      api.post("/bookings", {
        resource: p.resource,
        startAt: p.startAt.toISOString(),
        endAt: p.endAt.toISOString(),
        notes: p.notes || "",
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["my-bookings"] });
    },
  });
}
