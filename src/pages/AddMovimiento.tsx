// src/pages/AddMovimiento.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase/client";

export default function AddMovimiento() {
	const navigate = useNavigate();

	const [tipo, setTipo] = useState("gasto");
	const [categoria, setCategoria] = useState(""); // UUID
	const [categorias, setCategorias] = useState<any[]>([]);

	const [concepto, setConcepto] = useState("");
	const [cantidad, setCantidad] = useState("");
	const [favorito, setFavorito] = useState(false);

	const mes = new Date().getMonth() + 1;
	const año = new Date().getFullYear();

	function formatearLabel(nombre: string) {
		const conEspacios = nombre.replace(/([a-z])([A-Z])/g, "$1 $2");
		return conEspacios
			.split(" ")
			.map((w) => w.charAt(0).toUpperCase() + w.slice(1))
			.join(" ");
	}

	// Cargar categorías según tipo
	async function cargarCategorias(tipoSel: string) {
		const { data } = await supabase
			.from("categorias")
			.select("*")
			.eq("tipo", tipoSel)
			.order("nombre", { ascending: true });

		if (data) setCategorias(data);
	}

	useEffect(() => {
		cargarCategorias(tipo);
	}, [tipo]);

	// Guardar movimiento
	async function guardar() {
		if (!categoria || !concepto.trim() || !cantidad) return;

		const user = (await supabase.auth.getUser()).data.user;
		if (!user) return;

		await supabase.from("movimientos").insert({
			user_id: user.id,
			tipo,
			categoria, // UUID
			concepto,
			cantidad: Number(cantidad),
			mes: mes.toString(),
			año
		});

		navigate("/");
	}


	return (
		<div className="p-6">

			<h1 className="text-xl font-bold mb-4">Añadir movimiento</h1>

			{/* Tipo */}
			<select
				value={tipo}
				onChange={(e) => setTipo(e.target.value)}
				className="border p-2 w-full rounded mb-4"
			>
				<option value="gasto">Gasto</option>
				<option value="ingreso">Ingreso</option>
			</select>

			{/* Categoría */}
			<select
				value={categoria}
				onChange={(e) => setCategoria(e.target.value)}
				className="border p-2 w-full rounded mb-4"
			>
				<option value="">Seleccionar categoría</option>
				{categorias.map((c) => (
					<option key={c.id} value={c.id}>
						{formatearLabel(c.nombre)}
					</option>
				))}
			</select>

			{/* Concepto */}
			<input
				type="text"
				placeholder="Concepto"
				value={concepto}
				onChange={(e) => setConcepto(e.target.value)}
				className="border p-2 w-full rounded mb-4"
			/>

			{/* Cantidad */}
			<input
				type="number"
				placeholder="Cantidad"
				value={cantidad}
				onChange={(e) => setCantidad(e.target.value)}
				className="border p-2 w-full rounded mb-4"
			/>

			{/* Favorito */}
			<label className="flex items-center gap-2 mb-6">
				<input
					type="checkbox"
					checked={favorito}
					onChange={(e) => setFavorito(e.target.checked)}
				/>
				Marcar como favorito
			</label>

			<button
				onClick={guardar}
				className="bg-[#0097A7] text-white p-3 rounded w-full font-semibold"
			>
				Guardar
			</button>

		</div>
	);
}
