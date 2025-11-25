import { useEffect, useState } from "react";
import { supabase } from "../supabase/client";

export function useMovimientos(mes: number, año: number, refreshKey: number) {
	const [movs, setMovs] = useState<any[]>([]);
	const [loadingMovs, setLoadingMovs] = useState(true);

	async function cargarMovs() {
		setLoadingMovs(true);

		const mesStr = mes.toString();

		const { data } = await supabase
			.from("movimientos")
			.select("*")
			.eq("mes", mesStr)
			.eq("año", año)
			.order("id", { ascending: false });

		setMovs(data ?? []);
		setLoadingMovs(false);
	}

	useEffect(() => {
		cargarMovs();
	}, [mes, año, refreshKey]);

	return { movs, loadingMovs };
}
