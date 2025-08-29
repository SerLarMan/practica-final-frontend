import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";

const ToastCtx = createContext(null);

export function useToasts() {
  return useContext(ToastCtx);
}

function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const idRef = useRef(0);

  const remove = useCallback((id) => {
    setToasts((ts) => ts.filter((t) => t.id !== id));
  }, []);

  const push = useCallback(
    (payload) => {
      const id = ++idRef.current;
      const t = {
        id,
        type: payload.type || "info",
        message: payload.message || "",
        desc: payload.desc || "",
      };
      setToasts((ts) => [...ts, t]);
      setTimeout(() => remove(id), payload.duration ?? 3500);
    },
    [remove]
  );

  const api = useMemo(
    () => ({
      success: (message, desc) => push({ type: "success", message, desc }),
      error: (message, desc) => push({ type: "error", message, desc }),
      info: (message, desc) => push({ type: "info", message, desc }),
    }),
    [push]
  );

  return (
    <ToastCtx.Provider value={api}>
      {children}
      <div className="fixed top-4 right-4 z-[60] flex flex-col gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`rounded-lg border shadow-lg p-3 w-80 bg-white
             ${
               t.type === "success"
                 ? "border-green-200"
                 : t.type === "error"
                 ? "border-red-200"
                 : "border-gray-200"
             }`}
          >
            <div className="font-medium">
              {t.type === "success"
                ? "Éxito"
                : t.type === "error"
                ? "Error"
                : "Aviso"}
            </div>
            <div className="text-sm mt-0.5">{t.message}</div>
            {t.desc && (
              <div className="text-xs text-gray-500 mt-0.5">{t.desc}</div>
            )}
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}

export default ToastProvider;
