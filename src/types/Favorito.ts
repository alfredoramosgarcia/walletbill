export interface Favorito {
	id: string;
	user_id: string;
	tipo: "gasto" | "ingreso";
	categoria: string; // UUID
	concepto: string;
	cantidad: number;
	created_at: string;
}
