import {
	createContext,
	useContext,
	useEffect,
	useState,
	type ReactNode,
} from "react";

import { supabase } from "../supabase/client";

import type { User } from "@supabase/supabase-js";
import type { Perfil } from "../types/Perfil";

interface AuthContextType {
	user: User | null;
	perfil: Perfil | null;
	loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
	user: null,
	perfil: null,
	loading: true,
});

export function AuthProvider({
	children,
}: {
	children: ReactNode;
}) {
	const [user, setUser] = useState<User | null>(null);
	const [perfil, setPerfil] = useState<Perfil | null>(null);
	const [loading, setLoading] = useState(true);

	/* ========================================================== */
	/* CARGAR PERFIL                                              */
	/* ========================================================== */

	async function cargarPerfil(userId: string) {
		const { data, error } = await supabase
			.from("profiles")
			.select("*")
			.eq("id", userId)
			.maybeSingle();

		if (error) {
			console.error("Error cargando perfil:", error);
			setPerfil(null);
			return;
		}

		setPerfil(data ?? null);
	}

	/* ========================================================== */
	/* AUTH                                                       */
	/* ========================================================== */

	useEffect(() => {
		let mounted = true;

		// ------------------------------------------
		// 1. Cargar sesión inicial
		// ------------------------------------------

		async function cargarSesionInicial() {
			const {
				data: { session },
			} = await supabase.auth.getSession();

			if (!mounted) return;

			const currentUser = session?.user ?? null;

			setUser(currentUser);

			if (currentUser) {
				await cargarPerfil(currentUser.id);
			} else {
				setPerfil(null);
			}

			if (mounted) {
				setLoading(false);
			}
		}

		cargarSesionInicial();

		// ------------------------------------------
		// 2. ESCUCHAR LOGIN / LOGOUT
		// ------------------------------------------

		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange(
			(_event, session) => {
				if (!mounted) return;

				const currentUser =
					session?.user ?? null;

				// Actualizamos inmediatamente el usuario.
				setUser(currentUser);
				setLoading(false);

				if (currentUser) {
					// No bloqueamos el cambio de auth esperando
					// la consulta del perfil.
					void cargarPerfil(currentUser.id);
				} else {
					setPerfil(null);
				}
			}
		);

		// ------------------------------------------
		// 3. LIMPIEZA
		// ------------------------------------------

		return () => {
			mounted = false;
			subscription.unsubscribe();
		};
	}, []);

	return (
		<AuthContext.Provider
			value={{
				user,
				perfil,
				loading,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuth() {
	return useContext(AuthContext);
}