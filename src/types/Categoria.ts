export interface Categoria {
	id: string;
	nombre: string;
	tipo: "gasto" | "ingreso";
	user_id: string | null; // null = global
	created_at: string;
}
