import { useMemo, useState } from "react";
import Modal from "../../components/Modal";
import { useAvailability } from "../resources/useAvailability";
import { useCreateBooking } from "./useCreateBooking";
import { useToasts } from "../../components/ToastProvider";
import { format } from "date-fns";

/* Date Conversion */
function toYMD(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function BookingDialog({ open, onClose, resource }) {
  const { success, error } = useToasts();
  const [date, setDate] = useState(() => toYMD(new Date()));
  const [slotMin, setSlotMin] = useState(60);
  const [selected, setSelected] = useState(null);

  /* 30 min blocks */
  const { data, isLoading } = useAvailability(resource?._id, {
    date,
    slot: 30,
    open: "09:00",
    close: "19:00",
  });
  const baseSlots = data?.slots || [];

  /* Build time blocks for the duration */
  const composedSlots = useMemo(() => {
    if (!baseSlots.length) return [];
    const need = Math.ceil(slotMin / 30);
    const out = [];
    for (let i = 0; i <= baseSlots.length - need; i++) {
      let ok = true;
      for (let k = 1; k < need; k++) {
        const a = baseSlots[i + k - 1].endAt;
        const b = baseSlots[i + k].startAt;
        if (a !== b) {
          ok = false;
          break;
        }
      }
      if (ok) {
        out.push({
          startAt: baseSlots[i].startAt,
          endAt: baseSlots[i + need - 1].endAt,
        });
      }
    }
    return out;
  }, [baseSlots, slotMin]);

  const createBooking = useCreateBooking();

  const onConfirm = async () => {
    if (!selected) return;
    try {
      await createBooking.mutateAsync({
        resource: resource._id,
        startAt: new Date(selected.startAt),
        endAt: new Date(selected.endAt),
      });
      success(
        "Reserva creada",
        `${resource.name} · ${format(
          new Date(selected.startAt),
          "dd/MM HH:mm"
        )} - ${format(new Date(selected.endAt), "HH:mm")}`
      );
      onClose?.();
    } catch (e) {
      const code = e?.response?.status;
      if (code === 409)
        error("No disponible en ese horario", "Intenta otro tramo");
      else error("No se pudo crear la reserva");
    }
  };

  return (
    <Modal open={open} onClose={onClose} title={`Reservar · ${resource?.name}`}>
      <div className="space-y-4">
        {/* Date and duration */}
        <div className="flex flex-wrap items-center gap-3">
          <div>
            <label className="block text-xs text-gray-600 mb-1">Fecha</label>
            <input
              type="date"
              className="border rounded px-3 py-2"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">Duración</label>
            <select
              className="border rounded px-3 py-2"
              value={slotMin}
              onChange={(e) => setSlotMin(Number(e.target.value))}
            >
              <option value={30}>30 minutos</option>
              <option value={60}>1 hora</option>
              <option value={90}>1 h 30</option>
              <option value={120}>2 horas</option>
            </select>
          </div>
        </div>

        {/* Time Blocks */}
        <div>
          <label className="block text-xs text-gray-600 mb-2">Hora</label>
          {isLoading ? (
            <div className="text-sm text-gray-500">
              Cargando disponibilidad…
            </div>
          ) : composedSlots.length ? (
            <div className="grid grid-cols-3 gap-2 max-h-64 overflow-auto pr-1">
              {composedSlots.map((s, idx) => {
                const isSelected =
                  selected?.startAt === s.startAt &&
                  selected?.endAt === s.endAt;
                const label = format(new Date(s.startAt), "HH:mm");
                return (
                  <button
                    key={idx}
                    onClick={() => setSelected(s)}
                    className={`px-2 py-2 rounded border text-sm ${
                      isSelected
                        ? "bg-[rgb(var(--brand))] text-white border-[rgb(var(--brand))]"
                        : "hover:bg-gray-50"
                    }`}
                    title={`${format(new Date(s.startAt), "HH:mm")} - ${format(
                      new Date(s.endAt),
                      "HH:mm"
                    )}`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="text-sm text-gray-500">
              No hay huecos libres ese día.
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2">
          <button className="btn-ghost" onClick={onClose}>
            Cancelar
          </button>
          <button
            className="btn-primary disabled:opacity-50"
            disabled={!selected || createBooking.isLoading}
            onClick={onConfirm}
          >
            {createBooking.isLoading ? "Reservando…" : "Confirmar reserva"}
          </button>
        </div>
      </div>
    </Modal>
  );
}

export default BookingDialog;
