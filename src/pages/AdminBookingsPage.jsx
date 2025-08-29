import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../lib/api";
import { bookingStatusToES, typeToES } from "../lib/ui";
import { format } from "date-fns";
import { useCallback, useMemo, useState } from "react";
import Modal from "../components/Modal";
import { useToasts } from "../components/ToastProvider";
import { faBan, faCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function useAdminBookings(status = "pending") {
  return useQuery({
    queryKey: ["admin-bookings", status],
    queryFn: async () =>
      (await api.get("/bookings", { params: { status, limit: 100 } })).data,
  });
}

function AdminBookingsPage() {
  const { success, error } = useToasts();
  const qc = useQueryClient();
  const { data } = useAdminBookings("pending");
  const list = useMemo(() => data?.data || [], [data]);

  const approve = useMutation({
    mutationFn: (id) => api.patch(`/bookings/${id}/approve`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-bookings"] });
      success("Reserva aprobada");
    },
    onError: () => error("No se pudo aprobar"),
  });

  const deny = useMutation({
    mutationFn: ({ id, reason }) =>
      api.patch(`/bookings/${id}/deny`, { reason }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-bookings"] });
      success("Reserva denegada");
    },
    onError: () => error("No se pudo denegar"),
  });

  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState(null);
  const [reason, setReason] = useState("");

  const openDeny = useCallback((b) => {
    setCurrent(b);
    setReason("");
    setOpen(true);
  }, []);
  const onConfirmDeny = useCallback(() => {
    if (!reason.trim()) return;
    deny.mutate({ id: current._id, reason });
    setOpen(false);
  }, [deny, current, reason]);

  return (
    <section className="container-app space-y-6 py-8">
      <h2 className="text-2xl font-semibold">Reservas pendientes</h2>

      <div className="space-y-3">
        {list.map((b) => (
          <article
            key={b._id}
            className="card flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2"
          >
            <div>
              <h3 className="font-medium">
                {b.resource?.name} · {b.user?.name || b.user?.email}
              </h3>
              <div className="text-sm text-gray-600">
                {format(new Date(b.startAt), "dd/MM/yyyy HH:mm")} —{" "}
                {format(new Date(b.endAt), "HH:mm")}
                {" · "}
                {typeToES(b.resource?.type)} · {bookingStatusToES(b.status)}
              </div>
            </div>
            <div className="flex gap-2">
              <button
                className="btn border-green-500 text-green-600 hover:bg-green-50"
                onClick={() => approve.mutate(b._id)}
                disabled={approve.isLoading}
              >
                <FontAwesomeIcon icon={faCheck} />
                <span> Aprobar</span>
              </button>
              <button
                className="btn border-red-500 text-red-600 hover:bg-red-50"
                onClick={() => openDeny(b)}
              >
                <FontAwesomeIcon icon={faBan} />
                <span> Denegar</span>
              </button>
            </div>
          </article>
        ))}
        {!list.length && (
          <div className="text-sm text-gray-500">
            No hay reservas pendientes.
          </div>
        )}
      </div>

      {/* Deny modal */}
      <Modal open={open} onClose={() => setOpen(false)} title="Denegar reserva">
        <p className="text-sm text-gray-600">
          Indica el motivo de la denegación:
        </p>
        <textarea
          className="w-full border rounded px-3 py-2 mt-2"
          rows={4}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />
        <div className="flex justify-end gap-2 mt-4">
          <button className="btn-ghost" onClick={() => setOpen(false)}>
            Cancelar
          </button>
          <button
            className="btn-primary"
            disabled={!reason.trim() || deny.isLoading}
            onClick={onConfirmDeny}
          >
            {deny.isLoading ? "Enviando…" : "Denegar"}
          </button>
        </div>
      </Modal>
    </section>
  );
}

export default AdminBookingsPage;
