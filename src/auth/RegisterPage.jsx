import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import api from "../lib/api";
import { useAuth } from "./useAuth";
import { useNavigate, Link } from "react-router-dom";
import { useState, useCallback, useMemo } from "react";
import { useToasts } from "../components/ToastProvider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

const schema = z
  .object({
    name: z.string().trim().min(2, "Mínimo 2 caracteres"),
    email: z.string().email("Email inválido"),
    password: z.string().min(6, "Mínimo 6 caracteres"),
    confirm: z.string().min(6, "Mínimo 6 caracteres"),
  })
  .refine((d) => d.password === d.confirm, {
    path: ["confirm"],
    message: "Las contraseñas no coinciden",
  });

function RegisterPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { success, error } = useToasts();

  const defaultValues = useMemo(
    () => ({
      name: "",
      email: "",
      password: "",
      confirm: "",
    }),
    []
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const [showPwd, setShowPwd] = useState(false);
  const [showPwd2, setShowPwd2] = useState(false);
  const togglePwd = useCallback(() => setShowPwd((v) => !v), []);
  const togglePwd2 = useCallback(() => setShowPwd2((v) => !v), []);

  const onSubmit = async (data) => {
    try {
      const payload = {
        name: data.name.trim(),
        email: data.email.trim(),
        password: data.password,
      };
      const res = await api.post("/users/register", payload);
      let token = res?.data?.token;
      let user = res?.data?.user;

      if (!token || !user) {
        const lr = await api.post("/users/login", {
          email: payload.email,
          password: payload.password,
        });
        token = lr.data.token;
        user = lr.data.user;
      }

      login(token, user);
      success("Cuenta creada", `Bienvenido, ${user?.name || user?.email}`);
      navigate("/locations");
    } catch (e) {
      const code = e?.response?.status;
      const msg = e?.response?.data?.error;
      if (code === 409) error("Ese email ya está registrado");
      else error(msg || "No se pudo crear la cuenta");
    }
  };

  return (
    <section className="max-w-md mx-auto mt-8">
      <h2 className="text-2xl font-semibold mb-2">Crear cuenta</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="card space-y-4">
        <div>
          <label className="block text-sm mb-1">Nombre</label>
          <input
            className="w-full border rounded px-3 py-2"
            {...register("name")}
          />
          {errors.name && (
            <p className="text-red-600 text-sm">{errors.name.message}</p>
          )}
        </div>

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

        <div>
          <label className="block text-sm mb-1">Repite la contraseña</label>
          <div className="relative">
            <input
              type={showPwd2 ? "text" : "password"}
              className="w-full border rounded px-3 py-2 pr-10"
              {...register("confirm")}
            />
            <button
              type="button"
              onClick={togglePwd2}
              aria-label={
                showPwd2 ? "Ocultar contraseña" : "Mostrar contraseña"
              }
              className="absolute inset-y-0 right-0 px-3 text-gray-600 hover:text-gray-900"
            >
              <FontAwesomeIcon icon={showPwd2 ? faEyeSlash : faEye} />
            </button>
          </div>
          {errors.confirm && (
            <p className="text-red-600 text-sm">{errors.confirm.message}</p>
          )}
        </div>

        <button disabled={isSubmitting} className="btn-primary w-full">
          {isSubmitting ? "Creando cuenta…" : "Registrarse"}
        </button>
      </form>

      <p className="text-sm text-gray-600 mt-3">
        ¿Ya tienes cuenta?{" "}
        <Link to="/login" className="underline">
          Inicia sesión
        </Link>
      </p>
    </section>
  );
}

export default RegisterPage;
