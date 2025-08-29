/* Maps status from locations and resources to badge styles */
export function statusToBadge(kind, status) {
  const map = {
    location: {
      active: {
        label: "Activo",
        cls: "bg-green-50 text-green-700 border-green-200",
      },
      inactive: {
        label: "Inactivo",
        cls: "bg-slate-50 text-slate-700 border-slate-200",
      },
    },
    resource: {
      bookable: {
        label: "Reservable",
        cls: "bg-green-50 text-green-700 border-green-200",
      },
      maintenance: {
        label: "Mantenimiento",
        cls: "bg-amber-50 text-amber-700 border-amber-200",
      },
      hidden: {
        label: "Oculto",
        cls: "bg-slate-50 text-slate-700 border-slate-200",
      },
    },
  };
  return (
    map[kind][status] || {
      label: status,
      cls: "bg-slate-50 text-slate-700 border-slate-200",
    }
  );
}

/* Maps resource types to their Spanish translations */
export function typeToES(type) {
  const m = {
    meeting_room: "Sala de reuniones",
    hot_desk: "Puesto flexible",
    phone_booth: "Cabina",
    private_office: "Oficina privada",
  };
  return m[type] || capitalize(type.replace("_", " "));
}

/* Maps booking status to their Spanish translations */
export function bookingStatusToES(status) {
  const m = {
    pending: "Pendiente",
    confirmed: "Confirmada",
    cancelled: "Cancelada",
    checked_in: "En curso",
    completed: "Completada",
    no_show: "Ausencia",
  };
  return m[status] || capitalize(status);
}

function capitalize(s = "") {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
