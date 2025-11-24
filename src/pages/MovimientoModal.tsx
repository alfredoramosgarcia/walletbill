import { useEffect, useState } from "react";
import { supabase } from "../supabase/client";

interface Categoria {
	id: string;
	nombre: string;
	tipo: string;
}

interface Props {
	open: boolean;
	onClose: () => void;
	movimiento: any | null;
	reload: () => void;
}

export default function MovimientoModal({
	open,
	onClose,
	movimiento,
	reload,
}: Props) {
	const [categorias, setCategorias] = useState<Categoria[]>([]);

	const [tipo, setTipo] = useState("gasto");
	const [categoria, setCategoria] = useState("");
	const [concepto, setConcepto] = useState("");
	const [cantidad, setCantidad] = useState("");
	const [mes, setMes] = useState<number>(new Date().getMonth() + 1);
	const [año, setAño] = useState<number>(new Date().getFullYear());

	// ---------------------------------------------------------
	// Cargar categorías
	// ---------------------------------------------------------
	async function cargarCategorias() {
		const { data: userData } = await supabase.auth.getUser();
		const user = userData?.user;

		const { data, error } = await supabase
			.from("categorias")
			.select("*")
			.or(`user_id.eq.${user?.id},user_id.is.null`)
			.order("nombre");

		if (!error && data) {
			setCategorias(data);
		}
	}

	useEffect(() => {
		cargarCategorias();
	}, []);

	// ---------------------------------------------------------
	// Rellenar si es edición
	// ---------------------------------------------------------
	useEffect(() => {
		if (movimiento) {
			setTipo(movimiento.tipo);
			setCategoria(movimiento.categoria);
			setConcepto(movimiento.concepto);
			setCantidad(movimiento.cantidad);
			setMes(Number(movimiento.mes));
			setAño(movimiento.año);
		}
	}, [movimiento]);

	// ---------------------------------------------------------
	// Guardar movimiento (nuevo o editado)
	// ---------------------------------------------------------
	async function guardar() {
		const { data: userData } = await supabase.auth.getUser();
		const user = userData?.user;

		if (!user) return alert("No user");

		if (movimiento) {
			await supabase
				.from("movimientos")
				.update({
					tipo,
					categoria,
					concepto,
					cantidad: Number(cantidad),
					mes: mes.toString(),
					año,
				})
				.eq("id", movimiento.id);
		} else {
			await supabase.from("movimientos").insert({
				user_id: user.id,
				tipo,
				categoria,
				concepto,
				cantidad: Number(cantidad),
				mes: mes.toString(),
				año,
			});
		}

		reload();
		onClose();
	}

	// ---------------------------------------------------------
	// Eliminar movimiento
	// ---------------------------------------------------------
	async function borrar() {
		if (!movimiento) return;
		await supabase.from("movimientos").delete().eq("id", movimiento.id);
		reload();
		onClose();
	}

	if (!open) return null;

	return (
		<div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
			<div className="bg-white p-6 rounded-xl w-11/12 max-w-md shadow-xl">
				<h1 className="text-xl font-bold text-[#006C7A] mb-4">
					{movimiento ? "Editar Movimiento" : "Añadir Movimiento"}
				</h1>

				{/* Tipo */}
				<select
					className="w-full p-3 border rounded mb-3"
					value={tipo}
					onChange={(e) => setTipo(e.target.value)}
				>
					<option value="gasto">Gasto</option>
					<option value="ingreso">Ingreso</option>
				</select>

				{/* Categoría dinámica */}
				<select
					className="w-full p-3 border rounded mb-3"
					value={categoria}
					onChange={(e) => setCategoria(e.target.value)}
				>
					{categorias
						.filter((c) => c.tipo === tipo)
						.map((c) => (
							<option key={c.id} value={c.nombre}>
								{c.nombre}
							</option>
						))}
				</select>

				<input
					className="w-full p-3 border rounded mb-3"
					placeholder="Concepto"
					value={concepto}
					onChange={(e) => setConcepto(e.target.value)}
				/>

				<input
					className="w-full p-3 border rounded mb-3"
					type="number"
					placeholder="Cantidad"
					value={cantidad}
					onChange={(e) => setCantidad(e.target.value)}
				/>

				<div className="flex gap-3 mb-4">
					<select
						className="p-3 border rounded w-1/2"
						value={mes}
						onChange={(e) => setMes(Number(e.target.value))}
					>
						{Array.from({ length: 12 }).map((_, i) => (
							<option key={i} value={i + 1}>
								{i + 1}
							</option>
						))}
					</select>

					<select
						className="p-3 border rounded w-1/2"
						value={año}
						onChange={(e) => setAño(Number(e.target.value))}
					>
						{Array.from({ length: 5 }).map((_, i) => (
							<option key={i} value={2023 + i}>
								{2023 + i}
							</option>
						))}
					</select>
				</div>

				{/* Botón guardar */}
				<button
					onClick={guardar}
					className="w-full bg-[#0097A7] text-white p-3 rounded mb-3"
				>
					Guardar
				</button>

				{/* Botón borrar si es edición */}
				{movimiento && (
					<button
						onClick={borrar}
						className="w-full bg-red-500 text-white p-3 rounded mb-3"
					>
						Eliminar
					</button>
				)}

				<button onClick={onClose} className="w-full bg-gray-300 p-3 rounded">
					Cerrar
				</button>
			</div>
		</div>
	);
}
