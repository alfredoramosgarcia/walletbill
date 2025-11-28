import { useEffect, useState } from "react";
import { supabase } from "../supabase/client";
import { useAuth } from "./useAuth";

export function useCategorias() {
	const { user } = useAuth();
	const [categorias, setCategorias] = useState<any[]>([]);

	async function cargarCategorias() {
		if (!user) return;

		const { data, error } = await supabase
			.from("categorias")
			.select("*")
			.or(`user_id.is.null,user_id.eq.${user.id}`)
			.order("nombre", { ascending: true });

		if (!error && data) {
			setCategorias(data);
		}
	}

	useEffect(() => {
		cargarCategorias();
	}, [user]);

	return { categorias };
}
