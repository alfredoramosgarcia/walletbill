import { useEffect, useState } from "react";
import { supabase } from "../supabase/client";
import type { Categoria } from "../types/Categoria";

export function useCategorias() {
	const [categorias, setCategorias] = useState<Categoria[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		cargarCategorias();
	}, []);

	async function cargarCategorias() {
		setLoading(true);

		const user = (await supabase.auth.getUser()).data.user;

		const { data } = await supabase
			.from("categorias")
			.select("*")
			.or(`user_id.eq.${user?.id},user_id.is.null`)
			.order("tipo", { ascending: true })
			.order("nombre", { ascending: true });

		setCategorias(data ?? []);
		setLoading(false);
	}

	return { categorias, loading, cargarCategorias };
}
