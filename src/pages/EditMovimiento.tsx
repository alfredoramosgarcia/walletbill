// src/pages/EditMovimiento.tsx
import { useEffect, useState } from "react";
import { supabase } from "../supabase/client";
import { useParams, useNavigate } from "react-router-dom";
import { useFecha } from "../context/FechaContext";

interface Categoria {
	id: string;
	nombre: string;
	tipo: "gasto" | "ingreso";
}

interface Movimiento {
	id: number;
	user_id: string;
	tipo: "gasto" | "ingreso";
	categoria: string;
	concepto: string;
	cantidad: number;
	mes: string;
	año: number;
}

export default function EditMovimiento() {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();
	const { setMes, setAño } = useFecha();

	const [mov, setMov] = useState<Movimiento | null>(null);
	const [categorias, setCategorias] = useState<Categoria[]>([]);
	const [favorito, setFavorito] = useState(false);
	const [favId, setFavId] = useState<string | null>(null);

	const meses = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];
	const años = Array.from({ length: 11 }, (_, i) => 2020 + i);

	function formatearLabel(nombre: string) {
		const conEspacios = nombre.replace(/([a-z])([A-Z])/g, "$1 $2");
		return conEspacios
			.split(" ")
			.map((w) => w.charAt(0).toUpperCase() + w.slice(1))
			.join(" ");
	}

	useEffect(() => {
		cargar();
	}, []);

	async function cargar() {
		const { data } = await supabase
			.from("movimientos")
			.select("*")
			.eq("id", id)
			.single();

		if (!data) return;

		setMov(data);

		await cargarCategorias(data.tipo, data.categoria);

		const { data: fav } = await supabase
			.from("favoritos")
			.select("*")
			.eq("user_id", data.user_id)
			.eq("concepto", data.concepto)
			.eq("categoria", data.categoria)
			.limit(1)
			.single();

		setFavorito(!!fav);
		setFavId(fav?.id ?? null);
	}

	async function cargarCategorias(tipoSel: "gasto" | "ingreso", categoriaActual?: string) {
		const { data } = await supabase
			.from("categorias")
			.select("*")
			.eq("tipo", tipoSel)
			.order("nombre", { ascending: true });

		if (!data) return;

		setCategorias(data);

		if (categoriaActual && data.some((c) => c.id === categoriaActual)) {
			setMov((m) => (m ? { ...m, categoria: categoriaActual } : m));
		}
	}

	async function guardar() {
		if (!mov) return;

		await supabase
			.from("movimientos")
			.update({
				categoria: mov.categoria,
				concepto: mov.concepto,
				tipo: mov.tipo,
				cantidad: Number(mov.cantidad),
				mes: mov.mes,
				año: mov.año,
			})
			.eq("id", mov.id);

		if (favorito) {
			await supabase.from("favoritos").upsert({
				id: favId ?? undefined,
				user_id: mov.user_id,
				tipo: mov.tipo,
				categoria: mov.categoria,
				concepto: mov.concepto,
				cantidad: Number(mov.cantidad),
			});
		} else if (favId) {
			await supabase.from("favoritos").delete().eq("id", favId);
		}

		setMes(Number(mov.mes));
		setAño(mov.año);
		navigate("/");
	}

	async function borrar() {
		await supabase.from("movimientos").delete().eq("id", id);
		navigate("/");
	}

	if (!mov)
		return (
			<div className="h-screen flex items-center justify-center">
				<div className="animate-spin h-16 w-16 rounded-full border-t-4 border-[#006C7A]"></div>
			</div>
		);

	return (
		<div className="min-h-screen flex items-center justify-center bg-[#D9ECEA] px-4">
			<div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-lg">

				{/* Título + volver */}
				<div className="relative flex items-center justify-center mb-6">
					<h1 className="text-2xl font-bold text-[#006C7A]">Editar Movimiento</h1>
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
						value={mov.tipo}
						onChange={(e) => {
							const nuevoTipo = e.target.value as "gasto" | "ingreso";
							setMov({ ...mov, tipo: nuevoTipo });
							cargarCategorias(nuevoTipo, mov.categoria);
						}}
					>
						<option value="gasto">Gasto</option>
						<option value="ingreso">Ingreso</option>
					</select>

					{/* Categoría */}
					<select
						className="w-full p-3 rounded-xl border bg-gray-50"
						value={mov.categoria}
						onChange={(e) => setMov({ ...mov, categoria: e.target.value })}
					>
						{categorias.map((c) => (
							<option key={c.id} value={c.id}>
								{formatearLabel(c.nombre)}
							</option>
						))}
					</select>

					{/* Concepto */}
					<input
						className="w-full p-3 rounded-xl border bg-gray-50"
						value={mov.concepto}
						onChange={(e) => setMov({ ...mov, concepto: e.target.value })}
					/>

					{/* Cantidad */}
					<input
						className="w-full p-3 rounded-xl border bg-gray-50"
						type="number"
						value={mov.cantidad}
						onChange={(e) => setMov({ ...mov, cantidad: Number(e.target.value) })}
					/>

					{/* Mes */}
					<select
						className="w-full p-3 rounded-xl border bg-gray-50"
						value={mov.mes}
						onChange={(e) => setMov({ ...mov, mes: e.target.value })}
					>
						{meses.map((m) => (
							<option key={m} value={m}>
								{m}
							</option>
						))}
					</select>

					{/* Año */}
					<select
						className="w-full p-3 rounded-xl border bg-gray-50"
						value={mov.año}
						onChange={(e) => setMov({ ...mov, año: Number(e.target.value) })}
					>
						{años.map((a) => (
							<option key={a} value={a}>
								{a}
							</option>
						))}
					</select>

					{/* Favorito */}
					<label className="flex items-center gap-2">
						<input
							type="checkbox"
							checked={favorito}
							onChange={(e) => setFavorito(e.target.checked)}
						/>
						<span className="font-semibold text-[#006C7A]">⭐ Guardar como favorito</span>
					</label>

					{/* Botones */}
					<button
						onClick={guardar}
						className="w-full bg-[#0097A7] p-3 text-white rounded-lg font-semibold hover:bg-[#008190] transition"
					>
						Guardar cambios
					</button>

					<button
						onClick={borrar}
						className="w-full bg-red-600 p-3 text-white rounded-lg font-semibold hover:bg-red-700 transition"
					>
						🗑️ Eliminar movimiento
					</button>
				</div>
			</div>
		</div>
	);
}
