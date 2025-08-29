import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import api from "../lib/api";
import { useAuth } from "./useAuth";
import { Link, useNavigate } from "react-router-dom";
import { useState, useCallback } from "react";
import { useToasts } from "../components/ToastProvider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

const schema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Mínimo 6 caracteres"),
});

function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema) });
  const { login } = useAuth();
  const navigate = useNavigate();
  const [errorText, setErrorText] = useState("");
  const { success, error } = useToasts();

  const [showPwd, setShowPwd] = useState(false);
  const togglePwd = useCallback(() => setShowPwd((v) => !v), []);

  const onSubmit = async (data) => {
    try {
      setErrorText("");
      const res = await api.post("/users/login", data);
      login(res.data.token, res.data.user);
      success(
        "Has iniciado sesión",
        `Bienvenido, ${res.data.user.name || res.data.user.email}`
      );
      navigate("/locations");
    } catch (e) {
      const msg = e?.response?.data?.error || "Error al iniciar sesión";
      setErrorText(msg);
      error(msg);
    }
  };

  return (
    <section className="max-w-sm mx-auto mt-8">
      <h2 className="text-2xl font-semibold mb-2">Iniciar sesión</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="card space-y-4">
        <div>
          <label className="block text-sm mb-1">Email</label>
          <input
            className="w-full border rounded px-3 py-2"
            {...register("email")}
          />
          {errors.email && (
            <p className="text-red-600 text-sm">{errors.email.message}</p>
          )}
        </div>
        <div>
          <label className="block text-sm mb-1">Contraseña</label>
          <div className="relative">
            <input
              type={showPwd ? "text" : "password"}
              className="w-full border rounded px-3 py-2 pr-10"
              {...register("password")}
            />
            <button
              type="button"
              onClick={togglePwd}
              aria-label={showPwd ? "Ocultar contraseña" : "Mostrar contraseña"}
              className="absolute inset-y-0 right-0 px-3 text-gray-600 hover:text-gray-900"
            >
              <FontAwesomeIcon icon={showPwd ? faEyeSlash : faEye} />
            </button>
          </div>
          {errors.password && (
            <p className="text-red-600 text-sm">{errors.password.message}</p>
          )}
        </div>
        {errorText && <p className="text-red-600 text-sm">{errorText}</p>}
        <button
          disabled={isSubmitting}
          className="w-full py-2 rounded bg-[rgb(var(--brand))] text-white"
        >
          {isSubmitting ? "Entrando…" : "Entrar"}
        </button>
      </form>

      <p className="text-sm text-gray-600 mt-3">
        ¿No tienes cuenta?{" "}
        <Link to="/register" className="underline">
          Regístrate
        </Link>
      </p>
    </section>
  );
}

export default LoginPage;
