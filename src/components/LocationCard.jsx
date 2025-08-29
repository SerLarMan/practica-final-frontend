import { Link } from "react-router-dom";
import { useMemo } from "react";
import { statusToBadge } from "../lib/ui";
import React from "react";
import { AmenityIcon, getAmenityMeta } from "../lib/amenities";

function LocationCardBase({ loc }) {
  const badge = useMemo(
    () => statusToBadge("location", loc.status),
    [loc.status]
  );

  return (
    <div className="card overflow-hidden hover:shadow-md transition-shadow">
      <div className="aspect-[16/9] bg-gray-100" />
      <div className="p-4">
        <div className="flex items-center justify-between">
          <h3 className="font-medium">{loc.name}</h3>
          <span className={`badge ${badge.cls}`}>{badge.label}</span>
        </div>
        <p className="text-sm text-gray-600">{loc.city}</p>

        {Array.isArray(loc.amenities) && loc.amenities.length > 0 && (
          <div className="mt-2 flex items-center gap-2 flex-wrap">
            {loc.amenities.slice(0, 3).map((a, i) => {
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
            {loc.amenities.length > 3 && (
              <span className="text-xs text-gray-500">
                +{loc.amenities.length - 3} más
              </span>
            )}
          </div>
        )}
      </div>

      {loc.status === "active" && (
        <div className="p-4">
          <Link
            to={`/locations/${loc._id}`}
            className="btn-outline mt-3 inline-flex"
          >
            Ver detalles
          </Link>
        </div>
      )}
    </div>
  );
}

const LocationCard = React.memo(LocationCardBase);
export default LocationCard;
