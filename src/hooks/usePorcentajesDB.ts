import { useEffect, useState } from "react";
import { supabase } from "../supabase/client";

export function usePorcentajesDB(
	user_id: string | null,
	categorias: { id: string; nombre: string }[],
	mes: number,
	año: number
) {
	const [porcentajes, setPorcentajes] = useState<Record<string, number>>({});
	const [loading, setLoading] = useState(true);

	async function cargar() {
		if (!user_id || categorias.length === 0) {
			setLoading(false);
			return;
		}

		setLoading(true);

		const { data, error } = await supabase
			.from("categoria_porcentajes")
			.select("*")
			.eq("user_id", user_id)
			.eq("mes", mes)
			.eq("año", año);

		// 🔥 Evitar loading infinito
		if (error || !data) {
			setPorcentajes({});
			setLoading(false);
			return;
		}

		const map: Record<string, number> = {};
		data.forEach((row) => {
			map[row.categoria_id] = row.porcentaje;
		});

		setPorcentajes(map);
		setLoading(false);
	}

	function updatePercent(catId: string, value: number) {
		setPorcentajes((prev) => ({
			...prev,
			[catId]: value,
		}));
	}

	async function guardar() {
		const rows = Object.entries(porcentajes).map(([catId, value]) => ({
			user_id,
			categoria_id: catId,
			mes,
			año,
			porcentaje: value,
		}));

		if (rows.length === 0) return;

		await supabase.from("categoria_porcentajes").upsert(rows);
	}

	useEffect(() => {
		cargar();
	}, [user_id, mes, año]);

	return {
		porcentajes,
		updatePercent,
		guardar,
		loading,
	};
}
