// src/pages/Categorias.tsx

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
	ArrowDownRight,
	ArrowUpRight,
	Check,
	Pencil,
	Plus,
	Tag,
	Trash2,
} from "lucide-react";

import { supabase } from "../supabase/client";
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
	const [alertType, setAlertType] =
		useState<"success" | "error">("success");

	const [guardando, setGuardando] = useState(false);
	const [borrando, setBorrando] = useState(false);

	const [confirmDelete, setConfirmDelete] =
		useState<Categoria | null>(null);

	useEffect(() => {
		cargarCategorias();
	}, []);

	/* ========================================================== */
	/* CARGAR                                                     */
	/* ========================================================== */

	async function cargarCategorias() {
		const {
			data: { user },
		} = await supabase.auth.getUser();

		if (!user) return;

		const { data, error } = await supabase
			.from("categorias")
			.select("*")
			.eq("user_id", user.id)
			.order("nombre", { ascending: true });

		if (error) {
			setAlertType("error");
			setAlert("No se pudieron cargar las categorías.");
			return;
		}

		setCategorias(data ?? []);
	}

	/* ========================================================== */
	/* GUARDAR                                                    */
	/* ========================================================== */

	async function guardarCategoria() {
		if (guardando) return;

		const nombreLimpio = nombre.trim();

		if (!nombreLimpio) {
			setAlert("Debes introducir un nombre.");
			setAlertType("error");
			return;
		}

		setGuardando(true);

		try {
			const {
				data: { user },
			} = await supabase.auth.getUser();

			if (!user) {
				setAlertType("error");
				setAlert("No se ha podido identificar al usuario.");
				return;
			}

			let error;

			if (editId) {
				const respuesta = await supabase
					.from("categorias")
					.update({
						nombre: nombreLimpio,
						tipo,
					})
					.eq("id", editId)
					.eq("user_id", user.id);

				error = respuesta.error;
			} else {
				const respuesta = await supabase
					.from("categorias")
					.insert({
						nombre: nombreLimpio,
						tipo,
						user_id: user.id,
					});

				error = respuesta.error;
			}

			if (error) {
				setAlert("Error guardando la categoría.");
				setAlertType("error");
				return;
			}

			const estabaEditando = !!editId;

			cancelarEdicion();

			setAlert(
				estabaEditando
					? "Categoría actualizada."
					: "Categoría creada."
			);

			setAlertType("success");

			await cargarCategorias();
		} finally {
			setGuardando(false);
		}
	}

	/* ========================================================== */
	/* EDITAR                                                     */
	/* ========================================================== */

	function editarCategoria(categoria: Categoria) {
		setEditId(categoria.id);
		setNombre(categoria.nombre);
		setTipo(categoria.tipo);

		window.scrollTo({
			top: 0,
			behavior: "smooth",
		});
	}

	function cancelarEdicion() {
		setEditId(null);
		setNombre("");
		setTipo("gasto");
	}

	/* ========================================================== */
	/* BORRAR                                                     */
	/* ========================================================== */

	async function borrarCategoria() {
		if (!confirmDelete || borrando) return;

		setBorrando(true);

		try {
			const { error } = await supabase
				.from("categorias")
				.delete()
				.eq("id", confirmDelete.id);

			if (error) {
				setAlert("No se pudo eliminar la categoría.");
				setAlertType("error");
				return;
			}

			if (editId === confirmDelete.id) {
				cancelarEdicion();
			}

			setAlert("Categoría eliminada.");
			setAlertType("success");

			setConfirmDelete(null);

			await cargarCategorias();
		} finally {
			setBorrando(false);
		}
	}

	/* ========================================================== */
	/* HELPERS                                                    */
	/* ========================================================== */

	function formatLabel(str: string) {
		return str
			.replace(/([a-z])([A-Z])/g, "$1 $2")
			.split(" ")
			.map(
				(s) =>
					s.charAt(0).toUpperCase() +
					s.slice(1)
			)
			.join(" ");
	}

	const gastos = categorias.filter(
		(categoria) => categoria.tipo === "gasto"
	);

	const ingresos = categorias.filter(
		(categoria) => categoria.tipo === "ingreso"
	);

	/* ========================================================== */
	/* RENDER                                                     */
	/* ========================================================== */

	return (
		<main className="min-h-screen bg-transparent">

			<Alert
				message={alert}
				type={alertType}
				onClose={() => setAlert("")}
			/>

			<div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">

				{/* ================================================== */}
				{/* CABECERA                                           */}
				{/* ================================================== */}

				<div className="mb-6 flex items-start justify-between gap-4">

					<div>
						<p
							className="mb-1 text-sm font-semibold"
							style={{ color: "#008F8C" }}
						>
							Organización
						</p>

						<h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
							Categorías
						</h1>

						<p className="mt-1 text-sm text-slate-500">
							Organiza tus gastos e ingresos a tu manera.
						</p>
					</div>

					{/* Flecha como carácter para evitar
					    el problema de SVG invisible */}
					<button
						type="button"
						onClick={() => navigate(-1)}
						className="
							flex h-10 w-10 shrink-0
							items-center justify-center
							rounded-xl border border-slate-200
							bg-white shadow-sm transition
							hover:border-[#008F8C]
							hover:bg-[#E8F6F3]
						"
						style={{ color: "#006C7A" }}
						aria-label="Volver"
						title="Volver"
					>
						<span
							className="text-xl font-bold leading-none"
							style={{ color: "#006C7A" }}
						>
							←
						</span>
					</button>

				</div>

				{/* ================================================== */}
				{/* FORMULARIO                                         */}
				{/* ================================================== */}

				<div className="mb-6 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

					<div className="border-b border-slate-100 px-5 py-4 sm:px-6">

						<div className="flex items-center gap-3">

							<div
								className="flex h-10 w-10 items-center justify-center rounded-xl"
								style={{
									backgroundColor: "#E8F6F3",
									color: "#006C7A",
								}}
							>
								{editId ? (
									<Pencil size={18} />
								) : (
									<Plus size={19} />
								)}
							</div>

							<div>
								<h2 className="font-bold text-slate-800">
									{editId
										? "Editar categoría"
										: "Nueva categoría"}
								</h2>

								<p className="text-xs text-slate-400">
									{editId
										? "Modifica el nombre o el tipo."
										: "Crea una nueva categoría para tus movimientos."}
								</p>
							</div>

						</div>
					</div>

					<div className="p-5 sm:p-6">

						<div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_320px]">

							{/* NOMBRE */}
							<div>
								<label className="mb-2 block text-sm font-semibold text-slate-700">
									Nombre
								</label>

								<div className="relative">
									<Tag
										size={17}
										className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
									/>

									<input
										type="text"
										value={nombre}
										onChange={(e) =>
											setNombre(e.target.value)
										}
										onKeyDown={(e) => {
											if (e.key === "Enter") {
												guardarCategoria();
											}
										}}
										placeholder="Ej. Alquiler, Sueldo..."
										className="
											w-full rounded-xl
											border border-slate-200
											bg-slate-50
											py-3 pl-11 pr-4
											text-sm font-medium
											text-slate-700
											outline-none transition
											placeholder:text-slate-400
											focus:border-[#008F8C]
											focus:bg-white
											focus:ring-2
											focus:ring-[#008F8C]/10
										"
									/>
								</div>
							</div>

							{/* TIPO */}
							<div>
								<label className="mb-2 block text-sm font-semibold text-slate-700">
									Tipo
								</label>

								<div className="grid grid-cols-2 gap-2">

									<button
										type="button"
										onClick={() => setTipo("gasto")}
										className={`
											flex items-center justify-center gap-2
											rounded-xl border px-3 py-3
											text-sm font-semibold transition
											${tipo === "gasto"
												? "border-rose-200 bg-rose-50 text-rose-600"
												: "border-slate-200 bg-white text-slate-500 hover:bg-slate-50"
											}
										`}
									>
										<ArrowDownRight size={16} />
										Gasto
									</button>

									<button
										type="button"
										onClick={() => setTipo("ingreso")}
										className={`
											flex items-center justify-center gap-2
											rounded-xl border px-3 py-3
											text-sm font-semibold transition
											${tipo === "ingreso"
												? "border-emerald-200 bg-emerald-50 text-emerald-600"
												: "border-slate-200 bg-white text-slate-500 hover:bg-slate-50"
											}
										`}
									>
										<ArrowUpRight size={16} />
										Ingreso
									</button>

								</div>
							</div>

						</div>

						{/* ACCIONES */}
						<div className="mt-5 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

							{editId && (
								<button
									type="button"
									onClick={cancelarEdicion}
									className="
										rounded-xl border border-slate-200
										bg-white px-5 py-3
										text-sm font-semibold
										text-slate-600 transition
										hover:bg-slate-50
									"
								>
									Cancelar edición
								</button>
							)}

							<button
								type="button"
								onClick={guardarCategoria}
								disabled={guardando}
								className="
									inline-flex items-center
									justify-center gap-2
									rounded-xl px-6 py-3
									text-sm font-bold text-white
									shadow-sm transition
									hover:opacity-90
									disabled:cursor-not-allowed
									disabled:opacity-60
								"
								style={{
									background:
										"linear-gradient(135deg, #006C7A 0%, #008F8C 100%)",
								}}
							>
								{guardando ? (
									<>
										<span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
										Guardando...
									</>
								) : editId ? (
									<>
										<Check size={17} />
										Guardar cambios
									</>
								) : (
									<>
										<Plus size={17} />
										Crear categoría
									</>
								)}
							</button>

						</div>
					</div>
				</div>

				{/* ================================================== */}
				{/* LISTADOS                                           */}
				{/* ================================================== */}

				<div className="grid grid-cols-1 gap-5 lg:grid-cols-2">

					<CategoryList
						title="Gastos"
						description={`${gastos.length} ${gastos.length === 1
							? "categoría"
							: "categorías"
							}`}
						tipo="gasto"
						categorias={gastos}
						formatLabel={formatLabel}
						onEdit={editarCategoria}
						onDelete={setConfirmDelete}
					/>

					<CategoryList
						title="Ingresos"
						description={`${ingresos.length} ${ingresos.length === 1
							? "categoría"
							: "categorías"
							}`}
						tipo="ingreso"
						categorias={ingresos}
						formatLabel={formatLabel}
						onEdit={editarCategoria}
						onDelete={setConfirmDelete}
					/>

				</div>
			</div>

			{/* ====================================================== */}
			{/* MODAL BORRAR                                           */}
			{/* ====================================================== */}

			{confirmDelete && (
				<div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/30 px-4 backdrop-blur-sm">

					<div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl">

						<div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-500">
							<Trash2 size={21} />
						</div>

						<h2 className="text-xl font-bold text-slate-900">
							¿Eliminar categoría?
						</h2>

						<p className="mt-2 text-sm leading-6 text-slate-500">
							Vas a eliminar{" "}
							<span className="font-semibold text-slate-700">
								{formatLabel(confirmDelete.nombre)}
							</span>
							. Esta acción no se puede deshacer.
						</p>

						<div className="mt-6 flex justify-end gap-3">

							<button
								type="button"
								onClick={() =>
									setConfirmDelete(null)
								}
								disabled={borrando}
								className="
									rounded-xl border border-slate-200
									bg-white px-4 py-2.5
									text-sm font-semibold text-slate-600
									transition hover:bg-slate-50
								"
							>
								Cancelar
							</button>

							<button
								type="button"
								onClick={borrarCategoria}
								disabled={borrando}
								className="
									inline-flex items-center gap-2
									rounded-xl bg-rose-600
									px-4 py-2.5
									text-sm font-semibold text-white
									transition hover:bg-rose-700
									disabled:opacity-60
								"
							>
								{borrando ? (
									<>
										<span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
										Eliminando...
									</>
								) : (
									<>
										<Trash2 size={16} />
										Sí, eliminar
									</>
								)}
							</button>

						</div>
					</div>
				</div>
			)}

		</main>
	);
}

/* ========================================================================== */
/* LISTA DE CATEGORÍAS                                                        */
/* ========================================================================== */

interface CategoryListProps {
	title: string;
	description: string;
	tipo: "gasto" | "ingreso";
	categorias: Categoria[];
	formatLabel: (nombre: string) => string;
	onEdit: (categoria: Categoria) => void;
	onDelete: (categoria: Categoria) => void;
}

function CategoryList({
	title,
	description,
	tipo,
	categorias,
	formatLabel,
	onEdit,
	onDelete,
}: CategoryListProps) {
	const gasto = tipo === "gasto";

	return (
		<section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

			<div className="flex items-center justify-between border-b border-slate-100 px-5 py-5">

				<div className="flex items-center gap-3">

					<div
						className={`
							flex h-10 w-10
							items-center justify-center rounded-xl
							${gasto
								? "bg-rose-50 text-rose-500"
								: "bg-emerald-50 text-emerald-600"
							}
						`}
					>
						{gasto ? (
							<ArrowDownRight size={18} />
						) : (
							<ArrowUpRight size={18} />
						)}
					</div>

					<div>
						<h2 className="font-bold text-slate-800">
							{title}
						</h2>

						<p className="text-xs text-slate-400">
							{description}
						</p>
					</div>

				</div>
			</div>

			{categorias.length === 0 ? (
				<div className="px-5 py-12 text-center">

					<div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
						<Tag size={20} />
					</div>

					<p className="mt-3 text-sm font-semibold text-slate-600">
						Sin categorías
					</p>

					<p className="mt-1 text-xs text-slate-400">
						Crea una categoría desde el formulario superior.
					</p>

				</div>
			) : (
				<div className="divide-y divide-slate-100">

					{categorias.map((categoria) => (
						<div
							key={categoria.id}
							className="
								group flex items-center
								justify-between gap-4
								px-5 py-4 transition
								hover:bg-slate-50/70
							"
						>
							<div className="flex min-w-0 items-center gap-3">

								<div
									className={`
										h-2.5 w-2.5 shrink-0 rounded-full
										${gasto
											? "bg-rose-400"
											: "bg-emerald-400"
										}
									`}
								/>

								<p className="truncate text-sm font-semibold text-slate-700">
									{formatLabel(categoria.nombre)}
								</p>

							</div>

							<div className="flex shrink-0 items-center gap-2">

								{/* EDITAR */}
								<button
									type="button"
									onClick={() => onEdit(categoria)}
									className="
			flex h-10 w-10
			items-center justify-center
			rounded-xl
			border border-amber-200
			bg-amber-50
			transition
			hover:bg-amber-100
		"
									title="Editar"
									aria-label={`Editar ${categoria.nombre}`}
								>
									<span
										className="text-lg font-bold leading-none"
										style={{ color: "#D97706" }}
									>
										✎
									</span>
								</button>

								{/* ELIMINAR */}
								<button
									type="button"
									onClick={() => onDelete(categoria)}
									className="
			flex h-10 w-10
			items-center justify-center
			rounded-xl
			border border-rose-200
			bg-rose-50
			transition
			hover:bg-rose-100
		"
									title="Eliminar"
									aria-label={`Eliminar ${categoria.nombre}`}
								>
									<span
										className="text-lg font-bold leading-none"
										style={{ color: "#E11D48" }}
									>
										×
									</span>
								</button>

							</div>


						</div>
					))}

				</div>
			)
			}

		</section >
	);
}