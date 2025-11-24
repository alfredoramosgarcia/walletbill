import { useEffect, useState } from "react";
import { supabase } from "../supabase/client";
import type { Perfil } from "../types/Perfil";
import { useAuth } from "./useAuth";

export function usePerfil() {
	const { user } = useAuth();
	const [perfil, setPerfil] = useState<Perfil | null>(null);
	const [loadingPerfil, setLoadingPerfil] = useState(true);

	async function cargarPerfil() {
		if (!user) return;

		setLoadingPerfil(true);

		// 1. Buscar por user_id
		let { data: perfilUser } = await supabase
			.from("profiles")
			.select("*")
			.eq("user_id", user.id)
			.single();

		if (perfilUser) {
			setPerfil(perfilUser);
			setLoadingPerfil(false);
			return;
		}

		// 2. Compatibilidad con versión antigua (id)
		let { data: perfilId } = await supabase
			.from("profiles")
			.select("*")
			.eq("id", user.id)
			.single();

		if (perfilId) setPerfil(perfilId);

		setLoadingPerfil(false);
	}

	useEffect(() => {
		cargarPerfil();
	}, [user]);

	return { perfil, loadingPerfil, cargarPerfil };
}
