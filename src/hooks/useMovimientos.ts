import { useEffect, useState } from "react";
import { supabase } from "../supabase/client";
import type { Movimiento } from "../types/Movimiento";
import { useAuth } from "./useAuth";

export function useMovimientos(mes: number, año: number) {
	const { user } = useAuth();
	const [movs, setMovs] = useState<Movimiento[]>([]);
	const [loadingMovs, setLoadingMovs] = useState(true);

	async function cargarMovimientos() {
		if (!user) return;

		setLoadingMovs(true);

		const { data } = await supabase
			.from("movimientos")
			.select("*")
			.eq("user_id", user.id)
			.eq("mes", mes.toString())
			.eq("año", año)
			.order("id", { ascending: false });

		setMovs(data ?? []);
		setLoadingMovs(false);
	}

	useEffect(() => {
		cargarMovimientos();
	}, [mes, año, user]);

	return { movs, loadingMovs, cargarMovimientos };
}
