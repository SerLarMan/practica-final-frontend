import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import api from "../lib/api";
import ResourceCard from "../components/ResourceCard";
import { useAuth } from "../auth/useAuth";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import BookingDialog from "../features/bookings/BookingDialog";
import AmenityPill from "../components/AmenityPill";

const STATUS_OPTIONS = [
  { value: "", label: "Todos" },
  { value: "bookable", label: "Reservable" },
  { value: "maintenance", label: "Mantenimiento" },
];

function LocationInfoPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [openDialog, setOpenDialog] = useState(false);
  const [currentRes, setCurrentRes] = useState(null);

  const { data: location } = useQuery({
    queryKey: ["location", id],
    queryFn: async () => (await api.get(`/locations/${id}`)).data,
  });

  const locParam = useMemo(() => {
    if (!location) return null;
    return location.slug || location._id || id;
  }, [location, id]);

  const { data: resources, isFetching } = useQuery({
    queryKey: ["resources-by-location", locParam],
    enabled: !!locParam,
    queryFn: async () =>
      (
        await api.get(
          `/resources?location=${encodeURIComponent(locParam)}&limit=100`
        )
      ).data.data,
  });

  /* Filters */
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("");
  const debouncedQuery = useDebounced(query, 200);

  const filtered = useMemo(() => {
    const list = resources || [];
    const byStatus = status ? list.filter((r) => r.status === status) : list;
    const q = debouncedQuery.trim().toLowerCase();
    return q
      ? byStatus.filter((r) => r.name.toLowerCase().includes(q))
      : byStatus;
  }, [resources, status, debouncedQuery]);

  /* Booking */
  const onReserve = useCallback((resource) => {
    setCurrentRes(resource);
    setOpenDialog(true);
  }, []);

  if (!location) return null;

  return (
    <div className="container-app py-8 space-y-6">
      <section className="space-y-4">
        {/* Title */}
        <div>
          <h2 className="text-2xl font-semibold">{location.name}</h2>
          <p className="text-gray-600">
            {location.address} · {location.city}
          </p>
        </div>

        {/* Amenities */}
        {Array.isArray(location.amenities) && location.amenities.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {location.amenities.map((a, i) => (
              <AmenityPill key={i} name={a} size="sm" />
            ))}
          </div>
        )}

        {/* Filter */}
        <div className="flex flex-wrap items-center gap-3">
          <input
            type="text"
            placeholder="Buscar por nombre…"
            className="border rounded px-3 py-2"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <select
            className="border rounded px-3 py-2"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            {STATUS_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          {isFetching && (
            <span className="text-sm text-gray-500">Cargando…</span>
          )}
        </div>
      </section>

      <section className="space-y-4"></section>

      {/* Resources */}
      <section className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered?.map((r) => (
          <ResourceCard
            key={r._id}
            resource={r}
            onReserve={onReserve}
            isLogged={!!user}
          />
        ))}
        {!filtered?.length && (
          <div className="text-sm text-gray-500">
            No hay resultados con esos filtros.
          </div>
        )}
      </section>

      {/* Dialog */}
      <BookingDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        resource={currentRes}
      />
    </div>
  );
}

/* Debounce hook to prevent renders */
function useDebounced(value, delay = 250) {
  const [v, setV] = useState(value);
  const t = useRef();

  useEffect(() => {
    clearTimeout(t.current);
    t.current = setTimeout(() => setV(value), delay);
    return () => clearTimeout(t.current);
  }, [value, delay]);

  return v;
}

export default LocationInfoPage;
