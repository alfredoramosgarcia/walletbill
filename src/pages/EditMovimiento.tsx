// src/pages/EditMovimiento.tsx

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
	ArrowDownRight,
	ArrowUpRight,
	Bookmark,
	CalendarDays,
	Check,
	Euro,
	ReceiptText,
	Tag,
	Trash2,
} from "lucide-react";

import { supabase } from "../supabase/client";
import { useFecha } from "../context/FechaContext";
import Alert from "../components/alerts/Alert";

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

const MESES = [
	{ value: "1", label: "Enero" },
	{ value: "2", label: "Febrero" },
	{ value: "3", label: "Marzo" },
	{ value: "4", label: "Abril" },
	{ value: "5", label: "Mayo" },
	{ value: "6", label: "Junio" },
	{ value: "7", label: "Julio" },
	{ value: "8", label: "Agosto" },
	{ value: "9", label: "Septiembre" },
	{ value: "10", label: "Octubre" },
	{ value: "11", label: "Noviembre" },
	{ value: "12", label: "Diciembre" },
];

const AÑOS = Array.from({ length: 16 }, (_, i) => 2020 + i);

export default function EditMovimiento() {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();
	const { setMes, setAño } = useFecha();

	const [mov, setMov] = useState<Movimiento | null>(null);
	const [categorias, setCategorias] = useState<Categoria[]>([]);

	const [favorito, setFavorito] = useState(false);
	const [favId, setFavId] = useState<string | null>(null);

	const [guardando, setGuardando] = useState(false);
	const [borrando, setBorrando] = useState(false);
	const [confirmarBorrado, setConfirmarBorrado] = useState(false);

	const [alertMsg, setAlertMsg] = useState("");
	const [alertType, setAlertType] =
		useState<"success" | "error">("success");

	function formatearLabel(nombre: string) {
		const conEspacios = nombre.replace(/([a-z])([A-Z])/g, "$1 $2");

		return conEspacios
			.split(" ")
			.map(
				(palabra) =>
					palabra.charAt(0).toUpperCase() +
					palabra.slice(1)
			)
			.join(" ");
	}

	useEffect(() => {
		if (id) {
			cargar();
		}
	}, [id]);

	async function cargar() {
		const { data, error } = await supabase
			.from("movimientos")
			.select("*")
			.eq("id", id)
			.single();

		if (error || !data) {
			setAlertType("error");
			setAlertMsg("No se pudo cargar el movimiento.");
			return;
		}

		setMov(data);

		await cargarCategorias(data.tipo);

		const { data: fav } = await supabase
			.from("favoritos")
			.select("*")
			.eq("user_id", data.user_id)
			.eq("concepto", data.concepto)
			.eq("categoria", data.categoria)
			.limit(1)
			.maybeSingle();

		setFavorito(!!fav);
		setFavId(fav?.id ?? null);
	}

	async function cargarCategorias(
		tipoSeleccionado: "gasto" | "ingreso"
	) {
		const { data, error } = await supabase
			.from("categorias")
			.select("*")
			.eq("tipo", tipoSeleccionado)
			.order("nombre", { ascending: true });

		if (error) {
			setAlertType("error");
			setAlertMsg("No se pudieron cargar las categorías.");
			return [];
		}

		setCategorias(data ?? []);

		return data ?? [];
	}

	async function cambiarTipo(
		nuevoTipo: "gasto" | "ingreso"
	) {
		if (!mov || mov.tipo === nuevoTipo) return;

		const nuevasCategorias = await cargarCategorias(nuevoTipo);

		setMov({
			...mov,
			tipo: nuevoTipo,
			categoria: nuevasCategorias[0]?.id ?? "",
		});
	}

	async function guardar() {
		if (!mov || guardando) return;

		if (!mov.categoria) {
			setAlertType("error");
			setAlertMsg("Selecciona una categoría.");
			return;
		}

		if (!mov.concepto.trim()) {
			setAlertType("error");
			setAlertMsg("Introduce un concepto.");
			return;
		}

		if (
			!Number.isFinite(Number(mov.cantidad)) ||
			Number(mov.cantidad) <= 0
		) {
			setAlertType("error");
			setAlertMsg("Introduce una cantidad válida.");
			return;
		}

		setGuardando(true);

		try {
			const { error } = await supabase
				.from("movimientos")
				.update({
					categoria: mov.categoria,
					concepto: mov.concepto.trim(),
					tipo: mov.tipo,
					cantidad: Number(mov.cantidad),
					mes: mov.mes,
					año: mov.año,
				})
				.eq("id", mov.id);

			if (error) {
				setAlertType("error");
				setAlertMsg("No se pudieron guardar los cambios.");
				return;
			}

			if (favorito) {
				const { error: favoritoError } = await supabase
					.from("favoritos")
					.upsert({
						id: favId ?? undefined,
						user_id: mov.user_id,
						tipo: mov.tipo,
						categoria: mov.categoria,
						concepto: mov.concepto.trim(),
						cantidad: Number(mov.cantidad),
					});

				if (favoritoError) {
					setAlertType("error");
					setAlertMsg(
						"El movimiento se actualizó, pero no se pudo actualizar el favorito."
					);
					return;
				}
			} else if (favId) {
				const { error: favoritoError } = await supabase
					.from("favoritos")
					.delete()
					.eq("id", favId);

				if (favoritoError) {
					setAlertType("error");
					setAlertMsg(
						"El movimiento se actualizó, pero no se pudo eliminar el favorito."
					);
					return;
				}
			}

			setMes(Number(mov.mes));
			setAño(mov.año);

			setAlertType("success");
			setAlertMsg("Movimiento actualizado correctamente.");

			setTimeout(() => navigate("/"), 600);
		} finally {
			setGuardando(false);
		}
	}

	async function borrar() {
		if (!mov || borrando) return;

		setBorrando(true);

		try {
			const { error } = await supabase
				.from("movimientos")
				.delete()
				.eq("id", mov.id);

			if (error) {
				setAlertType("error");
				setAlertMsg("No se pudo eliminar el movimiento.");
				return;
			}

			navigate("/");
		} finally {
			setBorrando(false);
		}
	}

	/* ========================================================== */
	/* LOADING                                                    */
	/* ========================================================== */

	if (!mov) {
		return (
			<main className="flex min-h-[60vh] items-center justify-center bg-transparent">
				<div className="text-center">
					<div
						className="
							mx-auto h-10 w-10
							animate-spin rounded-full
							border-4 border-slate-200
						"
						style={{
							borderTopColor: "#008F8C",
						}}
					/>

					<p className="mt-4 text-sm font-medium text-slate-500">
						Cargando movimiento...
					</p>
				</div>
			</main>
		);
	}

	return (
		<main className="min-h-screen bg-transparent">

			<Alert
				message={alertMsg}
				type={alertType}
				onClose={() => setAlertMsg("")}
			/>

			<div className="mx-auto w-full max-w-3xl px-4 py-6 sm:px-6 lg:py-8">

				{/* ================================================== */}
				{/* CABECERA                                           */}
				{/* ================================================== */}

				<div className="mb-6 flex items-start justify-between gap-4">

					<div>
						<p
							className="mb-1 text-sm font-semibold"
							style={{ color: "#008F8C" }}
						>
							Editar registro
						</p>

						<h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
							Editar movimiento
						</h1>

						<p className="mt-1 text-sm text-slate-500">
							Modifica los datos del movimiento seleccionado.
						</p>
					</div>

					{/* Usamos carácter porque los SVG de flecha
					    te estaban dando problemas */}
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

				<div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

					{/* TIPO */}
					<div className="border-b border-slate-100 p-5 sm:p-6">

						<label className="mb-3 block text-sm font-semibold text-slate-700">
							Tipo de movimiento
						</label>

						<div className="grid grid-cols-2 gap-3">

							<button
								type="button"
								onClick={() => cambiarTipo("gasto")}
								className={`
									flex items-center gap-3
									rounded-2xl border p-4
									text-left transition
									${mov.tipo === "gasto"
										? "border-rose-200 bg-rose-50"
										: "border-slate-200 bg-white hover:bg-slate-50"
									}
								`}
							>
								<div
									className={`
										flex h-10 w-10
										items-center justify-center rounded-xl
										${mov.tipo === "gasto"
											? "bg-rose-100 text-rose-500"
											: "bg-slate-100 text-slate-400"
										}
									`}
								>
									<ArrowDownRight size={19} />
								</div>

								<div>
									<p
										className={`text-sm font-bold ${mov.tipo === "gasto"
												? "text-rose-600"
												: "text-slate-700"
											}`}
									>
										Gasto
									</p>

									<p className="mt-0.5 text-xs text-slate-400">
										Salida de dinero
									</p>
								</div>
							</button>

							<button
								type="button"
								onClick={() => cambiarTipo("ingreso")}
								className={`
									flex items-center gap-3
									rounded-2xl border p-4
									text-left transition
									${mov.tipo === "ingreso"
										? "border-emerald-200 bg-emerald-50"
										: "border-slate-200 bg-white hover:bg-slate-50"
									}
								`}
							>
								<div
									className={`
										flex h-10 w-10
										items-center justify-center rounded-xl
										${mov.tipo === "ingreso"
											? "bg-emerald-100 text-emerald-600"
											: "bg-slate-100 text-slate-400"
										}
									`}
								>
									<ArrowUpRight size={19} />
								</div>

								<div>
									<p
										className={`text-sm font-bold ${mov.tipo === "ingreso"
												? "text-emerald-600"
												: "text-slate-700"
											}`}
									>
										Ingreso
									</p>

									<p className="mt-0.5 text-xs text-slate-400">
										Entrada de dinero
									</p>
								</div>
							</button>

						</div>
					</div>

					{/* ================================================== */}
					{/* CAMPOS                                             */}
					{/* ================================================== */}

					<div className="space-y-5 p-5 sm:p-6">

						{/* CATEGORÍA */}
						<div>
							<label className="mb-2 block text-sm font-semibold text-slate-700">
								Categoría
							</label>

							<div className="relative">
								<Tag
									size={17}
									className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
								/>

								<select
									value={mov.categoria}
									onChange={(e) =>
										setMov({
											...mov,
											categoria: e.target.value,
										})
									}
									className="
										w-full appearance-none
										rounded-xl border border-slate-200
										bg-slate-50
										py-3 pl-11 pr-10
										text-sm font-medium text-slate-700
										outline-none transition
										focus:border-[#008F8C]
										focus:bg-white
										focus:ring-2
										focus:ring-[#008F8C]/10
									"
								>
									{categorias.map((categoria) => (
										<option
											key={categoria.id}
											value={categoria.id}
										>
											{formatearLabel(categoria.nombre)}
										</option>
									))}
								</select>
							</div>
						</div>

						{/* CONCEPTO */}
						<div>
							<label className="mb-2 block text-sm font-semibold text-slate-700">
								Concepto
							</label>

							<div className="relative">
								<ReceiptText
									size={17}
									className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
								/>

								<input
									type="text"
									value={mov.concepto}
									onChange={(e) =>
										setMov({
											...mov,
											concepto: e.target.value,
										})
									}
									className="
										w-full rounded-xl
										border border-slate-200
										bg-slate-50
										py-3 pl-11 pr-4
										text-sm font-medium text-slate-700
										outline-none transition
										focus:border-[#008F8C]
										focus:bg-white
										focus:ring-2
										focus:ring-[#008F8C]/10
									"
								/>
							</div>
						</div>

						{/* CANTIDAD */}
						<div>
							<label className="mb-2 block text-sm font-semibold text-slate-700">
								Cantidad
							</label>

							<div className="relative">
								<Euro
									size={17}
									className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
								/>

								<input
									type="number"
									inputMode="decimal"
									min="0"
									step="0.01"
									value={mov.cantidad}
									onChange={(e) =>
										setMov({
											...mov,
											cantidad: Number(e.target.value),
										})
									}
									className="
										w-full rounded-xl
										border border-slate-200
										bg-slate-50
										py-3 pl-11 pr-14
										text-lg font-bold text-slate-800
										outline-none transition
										focus:border-[#008F8C]
										focus:bg-white
										focus:ring-2
										focus:ring-[#008F8C]/10
									"
								/>

								<span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-400">
									EUR
								</span>
							</div>
						</div>

						{/* MES + AÑO */}
						<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

							<div>
								<label className="mb-2 block text-sm font-semibold text-slate-700">
									Mes
								</label>

								<div className="relative">
									<CalendarDays
										size={17}
										className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
									/>

									<select
										value={mov.mes}
										onChange={(e) =>
											setMov({
												...mov,
												mes: e.target.value,
											})
										}
										className="
											w-full appearance-none
											rounded-xl border border-slate-200
											bg-slate-50
											py-3 pl-11 pr-4
											text-sm font-medium text-slate-700
											outline-none transition
											focus:border-[#008F8C]
											focus:bg-white
											focus:ring-2
											focus:ring-[#008F8C]/10
										"
									>
										{MESES.map((mes) => (
											<option
												key={mes.value}
												value={mes.value}
											>
												{mes.label}
											</option>
										))}
									</select>
								</div>
							</div>

							<div>
								<label className="mb-2 block text-sm font-semibold text-slate-700">
									Año
								</label>

								<select
									value={mov.año}
									onChange={(e) =>
										setMov({
											...mov,
											año: Number(e.target.value),
										})
									}
									className="
										w-full rounded-xl
										border border-slate-200
										bg-slate-50
										px-4 py-3
										text-sm font-medium text-slate-700
										outline-none transition
										focus:border-[#008F8C]
										focus:bg-white
										focus:ring-2
										focus:ring-[#008F8C]/10
									"
								>
									{AÑOS.map((año) => (
										<option key={año} value={año}>
											{año}
										</option>
									))}
								</select>
							</div>

						</div>

						{/* FAVORITO */}
						<button
							type="button"
							onClick={() => setFavorito(!favorito)}
							className={`
								flex w-full items-center
								justify-between gap-4
								rounded-2xl border p-4
								text-left transition
								${favorito
									? "border-amber-200 bg-amber-50"
									: "border-slate-200 bg-white hover:bg-slate-50"
								}
							`}
						>
							<div className="flex items-center gap-3">

								<div
									className={`
										flex h-10 w-10
										items-center justify-center rounded-xl
										${favorito
											? "bg-amber-100 text-amber-500"
											: "bg-slate-100 text-slate-400"
										}
									`}
								>
									<Bookmark
										size={18}
										fill={
											favorito
												? "currentColor"
												: "none"
										}
									/>
								</div>

								<div>
									<p className="text-sm font-semibold text-slate-700">
										Guardar como favorito
									</p>

									<p className="mt-0.5 text-xs text-slate-400">
										Mantén este movimiento disponible para reutilizarlo.
									</p>
								</div>

							</div>

							<div
								className={`
									flex h-6 w-6 shrink-0
									items-center justify-center
									rounded-full transition
									${favorito
										? "bg-amber-500 text-white"
										: "border-2 border-slate-200"
									}
								`}
							>
								{favorito && <Check size={14} />}
							</div>
						</button>

					</div>

					{/* ================================================== */}
					{/* GUARDAR                                            */}
					{/* ================================================== */}

					<div className="flex flex-col-reverse gap-3 border-t border-slate-100 bg-slate-50/50 p-5 sm:flex-row sm:justify-end sm:p-6">

						<button
							type="button"
							onClick={() => navigate(-1)}
							className="
								rounded-xl border border-slate-200
								bg-white px-5 py-3
								text-sm font-semibold text-slate-600
								transition hover:bg-slate-50
							"
						>
							Cancelar
						</button>

						<button
							type="button"
							onClick={guardar}
							disabled={guardando}
							className="
								inline-flex items-center justify-center gap-2
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
							) : (
								<>
									<Check size={17} />
									Guardar cambios
								</>
							)}
						</button>

					</div>
				</div>

				{/* ================================================== */}
				{/* ZONA PELIGROSA                                     */}
				{/* ================================================== */}

				<div className="mt-5 rounded-3xl border border-rose-200 bg-white p-5 shadow-sm sm:p-6">

					<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

						<div>
							<p className="font-semibold text-slate-800">
								Eliminar movimiento
							</p>

							<p className="mt-1 text-sm text-slate-500">
								Esta acción eliminará definitivamente el movimiento.
							</p>
						</div>

						<button
							type="button"
							onClick={() => setConfirmarBorrado(true)}
							className="
								inline-flex items-center justify-center gap-2
								rounded-xl border border-rose-200
								bg-rose-50 px-4 py-2.5
								text-sm font-semibold text-rose-600
								transition hover:bg-rose-100
							"
						>
							<Trash2 size={16} />
							Eliminar
						</button>

					</div>
				</div>

			</div>

			{/* ====================================================== */}
			{/* MODAL ELIMINAR                                         */}
			{/* ====================================================== */}

			{confirmarBorrado && (
				<div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/30 px-4 backdrop-blur-sm">

					<div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl">

						<div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-500">
							<Trash2 size={21} />
						</div>

						<h2 className="text-xl font-bold text-slate-900">
							¿Eliminar movimiento?
						</h2>

						<p className="mt-2 text-sm leading-6 text-slate-500">
							Se eliminará{" "}
							<span className="font-semibold text-slate-700">
								{mov.concepto}
							</span>{" "}
							de forma permanente.
						</p>

						<div className="mt-6 flex justify-end gap-3">

							<button
								type="button"
								onClick={() =>
									setConfirmarBorrado(false)
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
								onClick={borrar}
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