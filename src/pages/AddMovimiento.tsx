// src/pages/AddMovimiento.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase/client";
import { useFecha } from "../context/FechaContext";

interface Categoria {
	id: string;
	nombre: string;
	tipo: "gasto" | "ingreso";
}

export default function AddMovimiento() {
	const navigate = useNavigate();
	const { mes, año } = useFecha();

	const [tipo, setTipo] = useState<"gasto" | "ingreso">("gasto");
	const [categoria, setCategoria] = useState("");
	const [categorias, setCategorias] = useState<Categoria[]>([]);
	const [concepto, setConcepto] = useState("");
	const [cantidad, setCantidad] = useState("");
	const [favorito, setFavorito] = useState(false);

	function formatearLabel(nombre: string) {
		const conEspacios = nombre.replace(/([a-z])([A-Z])/g, "$1 $2");
		return conEspacios
			.split(" ")
			.map((w) => w.charAt(0).toUpperCase() + w.slice(1))
			.join(" ");
	}

	useEffect(() => {
		cargarCategorias(tipo);
	}, [tipo]);

	// Cargar categorías
	async function cargarCategorias(tipoSel: "gasto" | "ingreso") {
		const { data } = await supabase
			.from("categorias")
			.select("*")
			.eq("tipo", tipoSel)
			.order("nombre", { ascending: true });

		if (data) setCategorias(data);
	}

	// Guardar movimiento
	async function guardar() {
		if (!categoria || !concepto.trim() || !cantidad) return;

		const user = (await supabase.auth.getUser()).data.user;
		if (!user) return;

		const insertData = {
			user_id: user.id,
			tipo,
			categoria,
			concepto,
			cantidad: Number(cantidad),
			mes: mes.toString(),
			año,
		};

		const { data: inserted, error } = await supabase
			.from("movimientos")
			.insert(insertData)
			.select()
			.single();

		if (error) return;

		// Si se marcó favorito, lo guardamos
		if (favorito && inserted) {
			await supabase.from("favoritos").insert({
				user_id: user.id,
				tipo,
				categoria,
				concepto,
				cantidad: Number(cantidad),
			});
		}

		navigate("/");
	}

	return (
		<div className="h-screen p-6 bg-[#E0F2F1]">

			{/* Encabezado */}
			<div className="flex justify-between items-center mb-4">
				<h1 className="text-xl font-bold text-[#006C7A]">Añadir Movimiento</h1>

				<button
					onClick={() => navigate(-1)}
					className="px-4 py-2 bg-gray-300 rounded font-semibold"
				>
					← Volver
				</button>
			</div>

			{/* Tipo */}
			<select
				className="w-full p-3 border rounded mb-3"
				value={tipo}
				onChange={(e) => setTipo(e.target.value as "gasto" | "ingreso")}
			>
				<option value="gasto">Gasto</option>
				<option value="ingreso">Ingreso</option>
			</select>

			{/* Categoría */}
			<select
				className="w-full p-3 border rounded mb-3"
				value={categoria}
				onChange={(e) => setCategoria(e.target.value)}
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
				className="w-full p-3 border rounded mb-3"
				placeholder="Concepto"
				value={concepto}
				onChange={(e) => setConcepto(e.target.value)}
			/>

			{/* Cantidad */}
			<input
				className="w-full p-3 border rounded mb-3"
				type="number"
				placeholder="Cantidad"
				value={cantidad}
				onChange={(e) => setCantidad(e.target.value)}
			/>

			{/* Favorito */}
			<label className="flex items-center gap-2 mb-4">
				<input
					type="checkbox"
					checked={favorito}
					onChange={(e) => setFavorito(e.target.checked)}
				/>
				<span className="font-semibold text-[#006C7A]">
					⭐ Guardar como favorito
				</span>
			</label>

			{/* Botón guardar */}
			<button
				onClick={guardar}
				className="w-full bg-[#0097A7] p-3 text-white rounded font-semibold"
			>
				Guardar movimiento
			</button>
		</div>
	);
}
