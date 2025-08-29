import { useQuery } from "@tanstack/react-query";
import api from "../lib/api";
import LocationCard from "../components/LocationCard";
import { useMemo } from "react";

function LocationsPage() {
  const { data } = useQuery({
    queryKey: ["locations"],
    queryFn: async () => (await api.get("/locations?limit=100")).data.data,
  });

  const list = useMemo(() => data || [], [data]);

  return (
    <section className="container-app py-8 space-y-6">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold">Nuestras sedes</h2>
        <p className="text-gray-600">
          Descubre dónde puedes reservar tu próximo espacio.
        </p>
      </div>

      <article className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {list.map((l) => (
          <LocationCard key={l._id} loc={l} />
        ))}
      </article>
    </section>
  );
}

export default LocationsPage;
