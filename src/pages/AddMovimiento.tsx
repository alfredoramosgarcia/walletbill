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

	async function cargarCategorias(tipoSel: "gasto" | "ingreso") {
		const { data } = await supabase
			.from("categorias")
			.select("*")
			.eq("tipo", tipoSel)
			.order("nombre", { ascending: true });

		if (data) setCategorias(data);
	}

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
		<div className="min-h-screen flex items-center justify-center bg-[#D9ECEA] px-4">
			<div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-lg">

				{/* Título centrado + volver */}
				<div className="relative flex items-center justify-center mb-6">
					<h1 className="text-2xl font-bold text-[#006C7A]">Añadir Movimiento</h1>

					<button
						onClick={() => navigate(-1)}
						className="absolute right-0 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg text-sm font-semibold hover:bg-gray-300 transition"
					>
						←
					</button>
				</div>

				<div className="space-y-6">

					{/* Tipo */}
					<select
						className="w-full p-3 rounded-xl border bg-gray-50"
						value={tipo}
						onChange={(e) => setTipo(e.target.value as "gasto" | "ingreso")}
					>
						<option value="gasto">Gasto</option>
						<option value="ingreso">Ingreso</option>
					</select>

					{/* Categoría */}
					<select
						className="w-full p-3 rounded-xl border bg-gray-50"
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
						className="w-full p-3 rounded-xl border bg-gray-50"
						placeholder="Concepto"
						value={concepto}
						onChange={(e) => setConcepto(e.target.value)}
					/>

					{/* Cantidad */}
					<input
						className="w-full p-3 rounded-xl border bg-gray-50"
						type="number"
						placeholder="Cantidad"
						value={cantidad}
						onChange={(e) => setCantidad(e.target.value)}
					/>

					{/* Favorito */}
					<label className="flex items-center gap-2">
						<input
							type="checkbox"
							checked={favorito}
							onChange={(e) => setFavorito(e.target.checked)}
						/>
						<span className="font-semibold text-[#006C7A]">
							⭐ Guardar como favorito
						</span>
					</label>

					<button
						onClick={guardar}
						className="w-full bg-[#0097A7] text-white p-3 rounded-lg font-semibold hover:bg-[#008190] transition"
					>
						Guardar movimiento
					</button>
				</div>
			</div>
		</div>
	);
}
