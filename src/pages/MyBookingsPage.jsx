import { useQuery } from "@tanstack/react-query";
import api from "../lib/api";
import { format } from "date-fns";
import { bookingStatusToES, typeToES } from "../lib/ui";
import { useMemo, useState } from "react";
import { useCancelBooking } from "../features/bookings/useCancelBooking";
import Modal from "../components/Modal";
import { useToasts } from "../components/ToastProvider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleCheck,
  faClock,
  faBan,
  faCalendarDays,
} from "@fortawesome/free-solid-svg-icons";

const STATUS = {
  confirmed: "confirmed",
  pending: "pending",
  cancelled: "cancelled",
};

const KPI_CARDS = [
  { key: STATUS.confirmed, label: "Aceptadas", icon: faCircleCheck },
  { key: STATUS.pending, label: "Pendientes", icon: faClock },
  { key: STATUS.cancelled, label: "Canceladas", icon: faBan },
];

function bookingBadgeClasses(status) {
  if (status === STATUS.confirmed)
    return "badge bg-green-50 text-green-700 border-green-200";
  if (status === STATUS.cancelled)
    return "badge bg-red-50 text-red-700 border-red-200";
  return "badge bg-slate-50 text-slate-700 border-slate-200";
}

function MyBookingsPage() {
  const { data } = useQuery({
    queryKey: ["my-bookings"],
    queryFn: async () => (await api.get("/bookings/me?limit=100")).data,
  });
  const all = useMemo(() => data?.data || [], [data]);

  /* Status counter */
  const counts = useMemo(
    () =>
      all.reduce(
        (acc, b) => {
          acc[b.status] = (acc[b.status] || 0) + 1;
          return acc;
        },
        { [STATUS.confirmed]: 0, [STATUS.pending]: 0, [STATUS.cancelled]: 0 }
      ),
    [all]
  );

  /* Status (pending default) */
  const [active, setActive] = useState(STATUS.pending);

  const filtered = useMemo(
    () => all.filter((b) => b.status === active),
    [all, active]
  );

  /* Cancelation */
  const cancel = useCancelBooking();
  const { success, error } = useToasts();
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState(null);
  const [reason, setReason] = useState("");

  const openCancel = (b) => {
    setCurrent(b);
    setReason("");
    setOpen(true);
  };

  const onConfirmCancel = async () => {
    try {
      await cancel.mutateAsync({ id: current._id, reason });
      success("Reserva cancelada");
      setOpen(false);
    } catch {
      error("No se pudo cancelar");
    }
  };

  return (
    <div className="container-app py-8 space-y-6">
      <section>
        <h2 className="mb-6 text-2xl font-semibold">Mis reservas</h2>

        {/* KPI cards */}
        <article className="grid md:grid-cols-3 gap-4">
          {KPI_CARDS.map((k) => {
            const isActive = active === k.key;
            return (
              <button
                key={k.key}
                onClick={() => setActive(k.key)}
                className={`card text-center hover:shadow-md transition-shadow ${
                  isActive ? "ring-1 ring-[rgb(var(--brand))]" : ""
                }`}
              >
                <div className="flex items-center justify-center">
                  <FontAwesomeIcon
                    icon={k.icon}
                    size="2x"
                    className="text-gray-900"
                  />
                </div>
                <h3 className="mt-3 font-medium">{k.label}</h3>
                <p className="text-2xl font-semibold mt-1">
                  {counts[k.key] ?? 0}
                </p>
              </button>
            );
          })}
        </article>
      </section>

      {/* Bookings by status */}
      <section className="space-y-3">
        <h2 className="hidden"></h2>
        {filtered.map((b) => {
          const badgeCls = bookingBadgeClasses(b.status);
          return (
            <article key={b._id} className="card relative">
              {/* Status */}
              <div className="absolute top-3 right-3">
                <span className={badgeCls}>{bookingStatusToES(b.status)}</span>
              </div>

              {/* Content */}
              <h3 className="font-medium pr-24">{b.resource?.name}</h3>
              <div className="text-sm text-gray-600">
                {typeToES(b.resource?.type)}
              </div>

              <div className="text-sm text-gray-700 mt-1 flex items-center gap-2">
                <FontAwesomeIcon icon={faCalendarDays} />
                <span>
                  {format(new Date(b.startAt), "dd/MM/yyyy HH:mm")} —{" "}
                  {format(new Date(b.endAt), "HH:mm")}
                </span>
              </div>

              {b.status === STATUS.cancelled && b.cancelledReason && (
                <div className="text-xs text-gray-500 mt-2">
                  Motivo: {b.cancelledReason}
                </div>
              )}

              {(b.status === STATUS.pending ||
                b.status === STATUS.confirmed) && (
                <div className="mt-3">
                  <button
                    className="btn border-red-500 text-red-600 hover:bg-red-50"
                    onClick={() => openCancel(b)}
                  >
                    <FontAwesomeIcon icon={faBan} />
                    <span>Cancelar</span>
                  </button>
                </div>
              )}
            </article>
          );
        })}

        {!filtered.length && (
          <div className="text-sm text-gray-500">
            No hay reservas en “{KPI_CARDS.find((k) => k.key === active)?.label}
            ”.
          </div>
        )}
      </section>

      {/* Cancel modal */}
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Cancelar reserva"
      >
        <p className="text-sm text-gray-600">¿Quieres indicar un motivo?</p>
        <textarea
          className="w-full border rounded px-3 py-2 mt-2"
          rows={3}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />
        <div className="flex justify-end gap-2 mt-4">
          <button className="btn-ghost" onClick={() => setOpen(false)}>
            Volver
          </button>
          <button
            className="btn border-red-500 text-red-600 hover:bg-red-50"
            onClick={onConfirmCancel}
            disabled={cancel.isLoading}
          >
            {cancel.isLoading ? (
              "Cancelando…"
            ) : (
              <>
                <FontAwesomeIcon icon={faBan} />
                <span>Cancelar</span>
              </>
            )}
          </button>
        </div>
      </Modal>
    </div>
  );
}

export default MyBookingsPage;
