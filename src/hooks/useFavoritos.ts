import { supabase } from "../supabase/client";
import { useEffect, useState } from "react";
import type { Favorito } from "../types/Favorito";
import { useAuth } from "./useAuth";

export function useFavoritos() {
	const { user } = useAuth();
	const [favoritos, setFavoritos] = useState<Favorito[]>([]);
	const [loadingFavs, setLoadingFavs] = useState(true);

	async function cargarFavoritos() {
		if (!user) return;

		setLoadingFavs(true);

		const { data } = await supabase
			.from("favoritos")
			.select("*")
			.eq("user_id", user.id)
			.order("concepto", { ascending: true });

		setFavoritos(data ?? []);
		setLoadingFavs(false);
	}

	useEffect(() => {
		cargarFavoritos();
	}, [user]);

	return { favoritos, loadingFavs, cargarFavoritos };
}
