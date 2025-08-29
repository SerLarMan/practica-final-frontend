import { Link } from "react-router-dom";
import { useMemo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDisplay,
  faSliders,
  faLocationDot,
} from "@fortawesome/free-solid-svg-icons";

const heroImg =
  "https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?q=80&w=1600&auto=format&fit=crop";

function HomePage() {
  const features = useMemo(
    () => [
      {
        icon: (
          <FontAwesomeIcon
            icon={faDisplay}
            size="2x"
            className="text-gray-900"
            aria-hidden="true"
          />
        ),
        title: "Salas equipadas",
        desc: "Pantallas, videoconferencia y pizarras listas para usar.",
      },
      {
        icon: (
          <FontAwesomeIcon
            icon={faSliders}
            size="2x"
            className="text-gray-900"
            aria-hidden="true"
          />
        ),
        title: "Flexibilidad",
        desc: "Reserva por horas o días, según tus necesidades.",
      },
      {
        icon: (
          <FontAwesomeIcon
            icon={faLocationDot}
            size="2x"
            className="text-gray-900"
            aria-hidden="true"
          />
        ),
        title: "Ubicaciones clave",
        desc: "Sedes céntricas y bien comunicadas.",
      },
    ],
    []
  );

  return (
    <div className="space-y-16">
      <section className="relative w-full">
        <div className="relative">
          <img
            src={heroImg}
            alt="hero image"
            className="w-full h-[56vh] sm:h-[64vh] object-cover"
          />
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute inset-0">
            <div className="container-app h-full flex flex-col justify-center">
              <h2 className="text-4xl sm:text-5xl font-semibold text-white max-w-2xl leading-tight">
                Espacios de coworking de confianza
              </h2>
              <p className="text-white/90 mt-3 max-w-xl">
                Reserva salas y puestos con total transparencia.
              </p>
              <div className="mt-6">
                <Link to="/locations" className="btn-primary">
                  Conoce nuestras sedes
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container-app">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-3xl font-semibold">¿Quiénes somos?</h2>
          <p className="text-gray-600 mt-2">
            Somos un equipo dedicado a crear espacios de trabajo fiables,
            cómodos y flexibles. Creemos en una experiencia clara y sin
            sorpresas, para que puedas centrarte en lo importante.
          </p>
        </div>
      </section>

      <section className="container-app">
        <h2 className="text-3xl font-semibold mb-6 text-center">
          ¿Qué ofrecemos?
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <article key={i} className="card text-center">
              <div className="flex items-center justify-center">{f.icon}</div>
              <h3 className="mt-3 font-medium">{f.title}</h3>
              <p className="text-sm text-gray-600 mt-1">{f.desc}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

export default HomePage;
