import { supabase } from "../supabase/client";

export async function limpiarMes(mes: number, año: number, userId: string) {
	const { error } = await supabase
		.from("movimientos")
		.delete()
		.eq("user_id", userId)
		.eq("mes", mes.toString())
		.eq("año", año);

	return { error };
}
