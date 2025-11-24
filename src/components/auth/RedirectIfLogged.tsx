import { type ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export default function RedirectIfLogged({ children }: { children: ReactNode }) {
	const { user, loading } = useAuth();

	if (loading) return <div>Cargando...</div>;

	if (user) return <Navigate to="/" replace />;

	return <>{children}</>;
}
