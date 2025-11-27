import { useEffect, useState } from "react";
import { supabase } from "../supabase/client";
import { useAuth } from "./useAuth";

export function useMovimientos(mes: number, año: number, refreshKey: number) {
	const [movs, setMovs] = useState<any[]>([]);
	const [loadingMovs, setLoadingMovs] = useState(true);

	const { user } = useAuth();

	async function cargarMovs() {
		if (!user) return;

		setLoadingMovs(true);

		const mesStr = mes.toString();

		const { data } = await supabase
			.from("movimientos")
			.select("*")
			.eq("user_id", user.id)   // 🔥🔥 AQUI EL FIX 🔥🔥
			.eq("mes", mesStr)
			.eq("año", año)
			.order("id", { ascending: false });

		setMovs(data ?? []);
		setLoadingMovs(false);
	}

	useEffect(() => {
		cargarMovs();
	}, [mes, año, refreshKey, user]);

	return { movs, loadingMovs };
}
