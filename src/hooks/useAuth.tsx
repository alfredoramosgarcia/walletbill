// src/hooks/useAuth.tsx

import {
	createContext,
	useContext,
	useEffect,
	useState,
	type ReactNode,
} from "react";

import type { User } from "@supabase/supabase-js";

import { supabase } from "../supabase/client";
import type { Perfil } from "../types/Perfil";

/* ========================================================================== */
/* TIPOS                                                                      */
/* ========================================================================== */

interface AuthContextType {
	user: User | null;
	perfil: Perfil | null;
	loading: boolean;
	logout: () => Promise<void>;
}

/* ========================================================================== */
/* CONTEXTO                                                                   */
/* ========================================================================== */

const AuthContext = createContext<AuthContextType>({
	user: null,
	perfil: null,
	loading: true,
	logout: async () => { },
});

/* ========================================================================== */
/* PROVIDER                                                                   */
/* ========================================================================== */

export function AuthProvider({
	children,
}: {
	children: ReactNode;
}) {
	const [user, setUser] = useState<User | null>(null);
	const [perfil, setPerfil] = useState<Perfil | null>(null);
	const [loading, setLoading] = useState(true);

	/* ====================================================================== */
	/* CARGAR PERFIL                                                          */
	/* ====================================================================== */

	async function cargarPerfil(userId: string) {
		try {
			const { data, error } = await supabase
				.from("profiles")
				.select("*")
				.eq("id", userId)
				.maybeSingle();

			if (error) {
				console.error(
					"Error cargando perfil:",
					error
				);

				setPerfil(null);
				return;
			}

			setPerfil(data ?? null);
		} catch (error) {
			console.error(
				"Error inesperado cargando perfil:",
				error
			);

			setPerfil(null);
		}
	}

	/* ====================================================================== */
	/* CERRAR SESIÓN                                                          */
	/* ====================================================================== */

	async function logout() {
		try {
			const { error } =
				await supabase.auth.signOut();

			if (error) {
				/*
				 * Si Supabase dice que no existe sesión,
				 * igualmente limpiamos el estado local.
				 *
				 * Para WalletBill eso significa que el usuario
				 * debe considerarse desconectado.
				 */
				console.warn(
					"Supabase no pudo cerrar la sesión:",
					error.message
				);
			}
		} catch (error) {
			console.warn(
				"Error inesperado cerrando sesión:",
				error
			);
		} finally {
			/*
			 * MUY IMPORTANTE:
			 * limpiamos siempre el estado de React.
			 */
			setUser(null);
			setPerfil(null);
			setLoading(false);
		}
	}

	/* ====================================================================== */
	/* AUTENTICACIÓN                                                          */
	/* ====================================================================== */

	useEffect(() => {
		let mounted = true;

		/* ------------------------------------------------------------------ */
		/* 1. CARGAR SESIÓN INICIAL                                           */
		/* ------------------------------------------------------------------ */

		async function cargarSesionInicial() {
			try {
				const {
					data: { session },
					error,
				} = await supabase.auth.getSession();

				if (!mounted) return;

				if (error) {
					console.error(
						"Error obteniendo sesión:",
						error
					);

					setUser(null);
					setPerfil(null);
					setLoading(false);

					return;
				}

				const currentUser =
					session?.user ?? null;

				setUser(currentUser);

				if (currentUser) {
					/*
					 * No necesitamos bloquear toda la app
					 * mientras se carga el perfil.
					 */
					void cargarPerfil(
						currentUser.id
					);
				} else {
					setPerfil(null);
				}
			} catch (error) {
				console.error(
					"Error cargando sesión inicial:",
					error
				);

				if (!mounted) return;

				setUser(null);
				setPerfil(null);
			} finally {
				if (mounted) {
					setLoading(false);
				}
			}
		}

		void cargarSesionInicial();

		/* ------------------------------------------------------------------ */
		/* 2. ESCUCHAR CAMBIOS DE AUTENTICACIÓN                               */
		/* ------------------------------------------------------------------ */

		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange(
			(event, session) => {
				if (!mounted) return;

				/*
				 * Puedes dejar este log mientras
				 * comprobamos el problema.
				 */
				console.log(
					"AUTH EVENT:",
					event
				);

				const currentUser =
					session?.user ?? null;

				/*
				 * Actualizamos inmediatamente
				 * el usuario autenticado.
				 */
				setUser(currentUser);
				setLoading(false);

				if (currentUser) {
					/*
					 * Cargamos el perfil sin bloquear
					 * el evento de autenticación.
					 */
					void cargarPerfil(
						currentUser.id
					);
				} else {
					/*
					 * SIGNED_OUT u otra situación
					 * sin sesión.
					 */
					setPerfil(null);
				}
			}
		);

		/* ------------------------------------------------------------------ */
		/* 3. CLEANUP                                                         */
		/* ------------------------------------------------------------------ */

		return () => {
			mounted = false;

			subscription.unsubscribe();
		};
	}, []);

	/* ====================================================================== */
	/* PROVIDER                                                               */
	/* ====================================================================== */

	return (
		<AuthContext.Provider
			value={{
				user,
				perfil,
				loading,
				logout,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
}

/* ========================================================================== */
/* HOOK                                                                       */
/* ========================================================================== */

export function useAuth() {
	return useContext(AuthContext);
}