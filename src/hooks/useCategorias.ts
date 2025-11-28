// src/hooks/useCategorias.ts
import { useEffect, useState } from "react";
import { supabase } from "../supabase/client";
import { useAuth } from "./useAuth";

export function useCategorias() {
	const { user } = useAuth();
	const [categorias, setCategorias] = useState<any[]>([]);
	const [loadingCategorias, setLoadingCategorias] = useState(true);

	async function cargarCategorias() {
		if (!user) return;

		setLoadingCategorias(true);

		// Selecciona SOLO las columnas correctas
		const { data, error } = await supabase
			.from("categorias")
			.select("id, nombre, tipo")
			.order("nombre", { ascending: true });

		if (error) {
			console.error("Error cargando categorías:", error);
			setCategorias([]);
		} else {
			setCategorias(data || []);
		}

		setLoadingCategorias(false);
	}

	useEffect(() => {
		cargarCategorias();
	}, [user]);

	return { categorias, loadingCategorias };
}
