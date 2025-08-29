import { statusToBadge, typeToES } from "../lib/ui";
import { AmenityIcon, getAmenityMeta } from "../lib/amenities";
import { useMemo } from "react";
import React from "react";

function ResourceCardBase({ resource, onReserve, isLogged }) {
  const res = resource ?? {};

  /* Fallbacks */
  const status = res.status ?? "hidden";
  const type = res.type ?? "";
  const name = res.name ?? "Recurso";
  const capacity = typeof res.capacity === "number" ? res.capacity : "—";

  const badge = useMemo(() => statusToBadge("resource", status), [status]);
  const typeES = useMemo(() => typeToES(type), [type]);

  const amenities = Array.isArray(res.amenities) ? res.amenities : [];
  const top = amenities.slice(0, 4);
  const extra = amenities.length - top.length;

  return (
    <div className="card flex flex-col justify-between hover:shadow-md transition-shadow">
      <div className="aspect-[16/9] bg-gray-100" />
      <div className="p-4">
        <div className="flex items-center justify-between">
          <h3 className="font-medium">{name}</h3>
          <span className={`badge ${badge.cls}`}>{badge.label}</span>
        </div>

        <p className="text-sm text-gray-600">
          Capacidad {capacity} · {typeES}
        </p>

        {/* Amenities */}
        {amenities.length > 0 && (
          <div className="mt-2 flex items-center gap-2 flex-wrap">
            {top.map((a, i) => {
              const meta = getAmenityMeta(a);
              return (
                <span
                  key={i}
                  className="inline-flex items-center gap-1 text-xs text-gray-700"
                >
                  <AmenityIcon name={a} />
                  <span className="hidden sm:inline">{meta.label}</span>
                </span>
              );
            })}
            {extra > 0 && (
              <span className="text-xs text-gray-500">+{extra} más</span>
            )}
          </div>
        )}
      </div>

      <div className="p-4 mt-3">
        {isLogged ? (
          status === "bookable" && (
            <button className="btn-primary" onClick={() => onReserve?.(res)}>
              Reservar
            </button>
          )
        ) : (
          <span className="text-xs text-gray-500">
            Inicia sesión para reservar
          </span>
        )}
      </div>
    </div>
  );
}

const ResourceCard = React.memo(ResourceCardBase);
export default ResourceCard;
