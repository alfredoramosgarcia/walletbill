// src/pages/Categorias.tsx
import { useEffect, useState } from "react";
import { supabase } from "../supabase/client";
import { useNavigate } from "react-router-dom";
import Alert from "../components/alerts/Alert";

interface Categoria {
	id: string;
	nombre: string;
	tipo: "gasto" | "ingreso";
	user_id: string;
}

export default function Categorias() {
	const navigate = useNavigate();

	const [categorias, setCategorias] = useState<Categoria[]>([]);
	const [nombre, setNombre] = useState("");
	const [tipo, setTipo] = useState<"gasto" | "ingreso">("gasto");
	const [editId, setEditId] = useState<string | null>(null);

	const [alert, setAlert] = useState("");
	const [alertType, setAlertType] = useState<"success" | "error">("success");

	const [, setError] = useState("");
	const [, setLoading] = useState(false);

	const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

	// ===========================
	// Cargar categorías
	// ===========================
	async function cargarCategorias() {
		const user = (await supabase.auth.getUser()).data.user;
		if (!user) return;

		const { data } = await supabase
			.from("categorias")
			.select("*")
			.eq("user_id", user.id)
			.order("nombre", { ascending: true });

		if (data) setCategorias(data);
	}

	useEffect(() => {
		cargarCategorias();
	}, []);

	// ===========================
	// Guardar / editar categoría
	// ===========================
	async function guardarCategoria() {
		if (!nombre.trim()) {
			setAlert("Debes introducir un nombre.");
			setAlertType("error");
			return;
		}

		setLoading(true);
		setError("");

		const user = (await supabase.auth.getUser()).data.user;
		if (!user) return;

		let resp;

		if (editId) {
			resp = await supabase
				.from("categorias")
				.update({ nombre, tipo })
				.eq("id", editId);
		} else {
			resp = await supabase.from("categorias").insert({
				nombre,
				tipo,
				user_id: user.id,
			});
		}

		setLoading(false);

		if (resp.error) {
			setAlert("Error guardando la categoría.");
			setAlertType("error");
			return;
		}

		setNombre("");
		setTipo("gasto");
		setEditId(null);

		setAlert(editId ? "Categoría actualizada." : "Categoría creada.");
		setAlertType("success");

		cargarCategorias();
	}

	// ===========================
	// Borrar categoría
	// ===========================
	async function borrarCategoria(id: string) {
		const resp = await supabase.from("categorias").delete().eq("id", id);

		if (resp.error) {
			setAlert("No se pudo eliminar.");
			setAlertType("error");
			return;
		}

		setAlert("Categoría eliminada.");
		setAlertType("success");

		setConfirmDelete(null);
		cargarCategorias();
	}

	// ===========================
	// Formateo visual
	// ===========================
	function formatLabel(str: string) {
		return str
			.replace(/([a-z])([A-Z])/g, "$1 $2")
			.split(" ")
			.map((s) => s.charAt(0).toUpperCase() + s.slice(1))
			.join(" ");
	}

	const gastos = categorias.filter((c) => c.tipo === "gasto");
	const ingresos = categorias.filter((c) => c.tipo === "ingreso");

	return (
		<div className="min-h-screen bg-[#D9ECEA] p-6 flex justify-center">

			{/* ALERTA SUPERIOR */}
			<Alert message={alert} type={alertType} onClose={() => setAlert("")} />

			<div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-3xl">

				{/* Título + Volver */}
				<div className="relative flex items-center justify-center mb-6">
					<h1 className="text-2xl font-bold text-[#006C7A]">Categorías</h1>

					<button
						onClick={() => navigate(-1)}
						className="absolute right-0 px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition text-black"
					>
						←
					</button>
				</div>

				{/* FORMULARIO */}
				<div className="bg-gray-50 p-4 rounded-xl mb-8">

					<label className="font-semibold text-black">Nombre</label>
					<input
						type="text"
						className="w-full p-3 border rounded-xl bg-white mt-1 mb-3 text-black"
						placeholder="Ej. Alquiler, Sueldo..."
						value={nombre}
						onChange={(e) => setNombre(e.target.value)}
					/>

					<label className="font-semibold text-black">Tipo</label>
					<select
						className="w-full p-3 border rounded-xl bg-white mt-1 mb-4 text-black"
						value={tipo}
						onChange={(e) => setTipo(e.target.value as "gasto" | "ingreso")}
					>
						<option value="gasto">Gasto</option>
						<option value="ingreso">Ingreso</option>
					</select>

					<button
						onClick={guardarCategoria}
						className="w-full bg-[#0097A7] text-white p-3 rounded-lg font-semibold hover:bg-[#007f90] transition"
					>
						{editId ? "Guardar cambios" : "Crear categoría"}
					</button>

					{editId && (
						<button
							onClick={() => {
								setEditId(null);
								setNombre("");
								setTipo("gasto");
							}}
							className="w-full mt-2 bg-gray-200 text-black p-3 rounded-lg font-semibold hover:bg-gray-300 transition"
						>
							Cancelar edición
						</button>
					)}
				</div>

				{/* LISTADOS */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-8">

					{/* GASTOS */}
					<div>
						<h2 className="text-lg font-bold text-[#006C7A] mb-3">Gastos</h2>

						{gastos.length === 0 && (
							<p className="text-gray-500 text-sm italic">No hay categorías.</p>
						)}

						<ul className="space-y-2">
							{gastos.map((cat) => (
								<li
									key={cat.id}
									className="flex justify-between items-center bg-gray-50 p-3 rounded-lg shadow-sm"
								>
									<span className="text-black">{formatLabel(cat.nombre)}</span>

									<div className="flex gap-2">
										<button
											onClick={() => {
												setEditId(cat.id);
												setNombre(cat.nombre);
												setTipo(cat.tipo);
											}}
											className="px-3 py-1 bg-yellow-300 rounded-lg hover:bg-yellow-400 text-sm text-black"
										>
											Editar
										</button>

										<button
											onClick={() => setConfirmDelete(cat.id)}
											className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm"
										>
											Borrar
										</button>
									</div>
								</li>
							))}
						</ul>
					</div>

					{/* INGRESOS */}
					<div>
						<h2 className="text-lg font-bold text-[#006C7A] mb-3">Ingresos</h2>

						{ingresos.length === 0 && (
							<p className="text-gray-500 text-sm italic">No hay categorías.</p>
						)}

						<ul className="space-y-2">
							{ingresos.map((cat) => (
								<li
									key={cat.id}
									className="flex justify-between items-center bg-gray-50 p-3 rounded-lg shadow-sm"
								>
									<span className="text-black">{formatLabel(cat.nombre)}</span>

									<div className="flex gap-2">
										<button
											onClick={() => {
												setEditId(cat.id);
												setNombre(cat.nombre);
												setTipo(cat.tipo);
											}}
											className="px-3 py-1 bg-yellow-300 rounded-lg hover:bg-yellow-400 text-sm text-black"
										>
											Editar
										</button>

										<button
											onClick={() => setConfirmDelete(cat.id)}
											className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm"
										>
											Borrar
										</button>
									</div>
								</li>
							))}
						</ul>
					</div>
				</div>
			</div>

			{/* MODAL BORRAR */}
			{confirmDelete && (
				<div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
					<div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-sm text-center">
						<h2 className="text-lg font-semibold mb-4 text-black">
							¿Eliminar categoría?
						</h2>

						<p className="text-gray-600 text-sm mb-6">
							Esta acción no se puede deshacer.
						</p>

						<div className="flex justify-center gap-4">
							<button
								onClick={() => setConfirmDelete(null)}
								className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 text-black"
							>
								Cancelar
							</button>

							<button
								onClick={() => borrarCategoria(confirmDelete)}
								className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
							>
								Eliminar
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
