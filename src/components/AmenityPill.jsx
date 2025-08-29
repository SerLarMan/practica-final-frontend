import { AmenityIcon, getAmenityMeta } from "../lib/amenities";

function AmenityPill({ name, size = "md" }) {
  const { label } = getAmenityMeta(name);
  const sizing = size === "sm" ? "text-xs px-2 py-0.5" : "text-xs px-2.5 py-1";
  return (
    <span className={`badge ${sizing} gap-1`}>
      <AmenityIcon name={name} className="opacity-80" />
      <span>{label}</span>
    </span>
  );
}

export default AmenityPill;
