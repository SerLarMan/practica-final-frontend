import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faWifi,
  faMugSaucer,
  faPrint,
  faTv,
  faChalkboard,
  faSquareParking,
  faUmbrellaBeach,
  faBoxArchive,
  faVolumeXmark,
  faQuestionCircle,
  faPlug,
} from "@fortawesome/free-solid-svg-icons";

/* Normalize amenity names without accents and special characters */
function normalizeAmenityKey(s = "") {
  return s
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\s+/g, "_");
}

const AMENITY_MAP = {
  wifi: { label: "Wi-Fi", icon: faWifi },
  cafe: { label: "Café", icon: faMugSaucer },
  impresora: { label: "Impresora", icon: faPrint },
  pizarra: { label: "Pizarra", icon: faChalkboard },
  parking: { label: "Parking", icon: faSquareParking },
  hdmi: { label: "HDMI", icon: faPlug },
  terraza: { label: "Terraza", icon: faUmbrellaBeach },
  taquillas: { label: "Taquillas", icon: faBoxArchive },
  tv: { label: "Tv", icon: faTv },
  insonorizada: { label: "Insonorizado", icon: faVolumeXmark },
};

/* Get metadata for a specific amenity */
function getAmenityMeta(raw) {
  const key = normalizeAmenityKey(raw);
  const meta = AMENITY_MAP[key];
  if (meta) return meta;
  const label = raw?.charAt(0)?.toUpperCase() + raw?.slice(1) || "Amenity";
  return { label, icon: faQuestionCircle };
}

function AmenityIcon({ name, className = "" }) {
  const { icon, label } = getAmenityMeta(name);
  return <FontAwesomeIcon icon={icon} className={className} title={label} />;
}

export { normalizeAmenityKey, getAmenityMeta, AmenityIcon };
