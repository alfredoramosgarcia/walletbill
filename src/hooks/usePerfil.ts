import { useEffect, useState } from "react";
import { supabase } from "../supabase/client";
import type { Perfil } from "../types/Perfil";
import { useAuth } from "./useAuth";

export function usePerfil() {
	const { user } = useAuth();
	const [perfil, setPerfil] = useState<Perfil | null>(null);
	const [loadingPerfil, setLoadingPerfil] = useState(true);

	async function cargarPerfil() {
		if (!user) {
			setPerfil(null);
			setLoadingPerfil(false);
			return;
		}

		setLoadingPerfil(true);

		// 1. Buscar perfil por user_id
		const { data: perfilUser } = await supabase
			.from("profiles")
			.select("*")
			.eq("user_id", user.id)
			.maybeSingle(); // <-- FIX

		if (perfilUser) {
			setPerfil(perfilUser);
			setLoadingPerfil(false);
			return;
		}

		// 2. Compatibilidad antigua: buscar por id
		const { data: perfilId } = await supabase
			.from("profiles")
			.select("*")
			.eq("id", user.id)
			.maybeSingle(); // <-- FIX

		if (perfilId) {
			setPerfil(perfilId);
			setLoadingPerfil(false);
			return;
		}

		// Si no existe perfil, devolvemos null
		setPerfil(null);
		setLoadingPerfil(false);
	}

	useEffect(() => {
		cargarPerfil();
	}, [user]);

	return { perfil, loadingPerfil, cargarPerfil };
}
