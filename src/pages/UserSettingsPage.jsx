import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "../auth/useAuth";
import api from "../lib/api";
import { useCallback, useMemo, useRef, useState } from "react";
import { useToasts } from "../components/ToastProvider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera } from "@fortawesome/free-solid-svg-icons";

const schema = z.object({
  name: z.string().trim().min(2, "Mínimo 2 caracteres"),
  email: z.string().email("Email inválido"),
});

function UserSettingsPage() {
  const { user, token, login } = useAuth();
  const { success, error } = useToasts();
  const fileRef = useRef(null);
  const [file, setFile] = useState(null);

  const defaults = useMemo(
    () => ({
      name: user?.name || "",
      email: user?.email || "",
      password: "",
      confirm: "",
    }),
    [user]
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: defaults,
  });

  /* Image preview */
  const preview = useMemo(() => {
    if (file) return URL.createObjectURL(file);
    return user?.image || user?.avatar || user?.photo || null;
  }, [file, user]);

  const onFileChange = useCallback((e) => {
    const f = e.target.files?.[0];
    if (f) setFile(f);
  }, []);

  const onSubmit = async (data) => {
    try {
      const fd = new FormData();
      fd.append("name", data.name.trim());
      fd.append("email", data.email.trim());
      if (file) fd.append("image", file);

      const res = await api.patch(`/users/${user._id}`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const updated = res.data;
      
      /* Refresh user */
      login(token, updated);

      success("Perfil actualizado");
      setFile(null);
      reset({
        name: updated.name || "",
        email: updated.email || "",
        password: "",
        confirm: "",
      });
    } catch (e) {
      const code = e?.response?.status;
      const msg = e?.response?.data?.error;
      if (code === 409) error("Ese email ya está en uso");
      else error(msg || "No se pudo actualizar el perfil");
    }
  };

  return (
    <section className="container-app max-w-2xl py-6">
      <h2 className="text-2xl font-semibold mb-4">Configuración</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="card space-y-12">
        <div className="flex items-start gap-4">
          <div className="relative shrink-0">

            {/* Image display */}
            <div className="w-24 h-24 rounded-full overflow-hidden ring-1 ring-gray-200 bg-gray-100">
              {preview ? (
                <img
                  src={preview}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-500 text-sm">
                  Sin foto
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="absolute -bottom-10 left-1/2 -translate-x-1/2 btn-ghost text-xs"
            >
              <FontAwesomeIcon icon={faCamera} /> Cambiar
            </button>

            {/* Image hidden input */}
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              onChange={onFileChange}
              className="hidden"
            />
          </div>

          <div className="flex-1 grid sm:grid-cols-2 gap-4">
            {/* Name */}
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

            {/* Email */}
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
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full btn-primary"
        >
          {isSubmitting ? "Guardando…" : "Guardar cambios"}
        </button>
      </form>
    </section>
  );
}

export default UserSettingsPage;