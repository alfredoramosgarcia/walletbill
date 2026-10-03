// src/pages/AddMovimiento.tsx

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
	ArrowDownRight,
	ArrowUpRight,
	Bookmark,
	Check,
	Euro,
	ReceiptText,
	Tag,
} from "lucide-react";

import { supabase } from "../supabase/client";
import { useFecha } from "../context/FechaContext";
import Alert from "../components/alerts/Alert";

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
	const [guardando, setGuardando] = useState(false);

	const [alertMsg, setAlertMsg] = useState("");
	const [alertType, setAlertType] =
		useState<"success" | "error">("success");

	const meses = [
		"Enero",
		"Febrero",
		"Marzo",
		"Abril",
		"Mayo",
		"Junio",
		"Julio",
		"Agosto",
		"Septiembre",
		"Octubre",
		"Noviembre",
		"Diciembre",
	];

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
		setCategoria("");
		cargarCategorias(tipo);
	}, [tipo]);

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
			return;
		}

		if (data) {
			setCategorias(data);
		}
	}

	async function guardar() {
		if (guardando) return;

		const errores: string[] = [];

		if (!categoria) errores.push("la categoría");
		if (!concepto.trim()) errores.push("el concepto");
		if (!cantidad) errores.push("la cantidad");

		const cantidadNumero = Number(cantidad);

		if (cantidad && (!Number.isFinite(cantidadNumero) || cantidadNumero <= 0)) {
			errores.push("una cantidad válida");
		}

		if (errores.length > 0) {
			setAlertMsg(
				"Debes completar correctamente: " +
				errores.join(", ")
			);
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
				setAlertMsg("No se ha podido identificar al usuario.");
				return;
			}

			const insertData = {
				user_id: user.id,
				tipo,
				categoria,
				concepto: concepto.trim(),
				cantidad: cantidadNumero,
				mes: mes.toString(),
				año,
			};

			const { data: inserted, error } = await supabase
				.from("movimientos")
				.insert(insertData)
				.select()
				.single();

			if (error) {
				setAlertMsg("No se pudo guardar el movimiento.");
				setAlertType("error");
				return;
			}

			if (favorito && inserted) {
				const { error: favoritoError } = await supabase
					.from("favoritos")
					.insert({
						user_id: user.id,
						tipo,
						categoria,
						concepto: concepto.trim(),
						cantidad: cantidadNumero,
					});

				if (favoritoError) {
					setAlertType("error");
					setAlertMsg(
						"El movimiento se guardó, pero no se pudo añadir a favoritos."
					);
					return;
				}
			}

			setAlertType("success");
			setAlertMsg("Movimiento guardado correctamente.");

			setTimeout(() => navigate("/dashboard"), 700);
		} finally {
			setGuardando(false);
		}
	}

	return (
		<main className="min-h-screen bg-transparent">
			<Alert
				message={alertMsg}
				type={alertType}
				onClose={() => setAlertMsg("")}
			/>

			<div className="mx-auto w-full max-w-3xl px-4 py-6 sm:px-6 lg:py-8">

				{/* CABECERA */}
				<div className="mb-6 flex items-start justify-between gap-4">

					<div>
						<p
							className="mb-1 text-sm font-semibold"
							style={{ color: "#008F8C" }}
						>
							Nuevo registro
						</p>

						<h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
							Añadir movimiento
						</h1>

						<p className="mt-1 text-sm text-slate-500">
							{meses[mes - 1]} de {año}
						</p>
					</div>
					<button
						type="button"
						onClick={() => navigate(-1)}
						className="
		flex h-10 w-10 shrink-0
		items-center justify-center
		rounded-xl border border-slate-200
		bg-white
		shadow-sm transition
		hover:border-[#008F8C]
		hover:bg-[#E8F6F3]
	"
						style={{
							color: "#006C7A",
						}}
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

				{/* FORMULARIO */}
				<div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

					{/* TIPO */}
					<div className="border-b border-slate-100 p-5 sm:p-6">

						<label className="mb-3 block text-sm font-semibold text-slate-700">
							Tipo de movimiento
						</label>

						<div className="grid grid-cols-2 gap-3">

							<button
								type="button"
								onClick={() => setTipo("gasto")}
								className={`
									flex items-center gap-3
									rounded-2xl border p-4
									text-left transition
									${tipo === "gasto"
										? "border-rose-200 bg-rose-50"
										: "border-slate-200 bg-white hover:bg-slate-50"
									}
								`}
							>
								<div
									className={`
										flex h-10 w-10
										items-center justify-center
										rounded-xl
										${tipo === "gasto"
											? "bg-rose-100 text-rose-500"
											: "bg-slate-100 text-slate-400"
										}
									`}
								>
									<ArrowDownRight size={19} />
								</div>

								<div>
									<p
										className={`text-sm font-bold ${tipo === "gasto"
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
								onClick={() => setTipo("ingreso")}
								className={`
									flex items-center gap-3
									rounded-2xl border p-4
									text-left transition
									${tipo === "ingreso"
										? "border-emerald-200 bg-emerald-50"
										: "border-slate-200 bg-white hover:bg-slate-50"
									}
								`}
							>
								<div
									className={`
										flex h-10 w-10
										items-center justify-center
										rounded-xl
										${tipo === "ingreso"
											? "bg-emerald-100 text-emerald-600"
											: "bg-slate-100 text-slate-400"
										}
									`}
								>
									<ArrowUpRight size={19} />
								</div>

								<div>
									<p
										className={`text-sm font-bold ${tipo === "ingreso"
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

					{/* CAMPOS */}
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
									value={categoria}
									onChange={(e) =>
										setCategoria(e.target.value)
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
									<option value="">
										Seleccionar categoría
									</option>

									{categorias.map((categoriaItem) => (
										<option
											key={categoriaItem.id}
											value={categoriaItem.id}
										>
											{formatearLabel(
												categoriaItem.nombre
											)}
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
									value={concepto}
									onChange={(e) =>
										setConcepto(e.target.value)
									}
									placeholder="Ej. Compra supermercado"
									className="
										w-full rounded-xl
										border border-slate-200
										bg-slate-50
										py-3 pl-11 pr-4
										text-sm font-medium text-slate-700
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
									type="text"
									inputMode="decimal"
									value={cantidad}
									onChange={(e) => {
										let valor = e.target.value;

										// Aceptamos tanto coma como punto
										valor = valor.replace(",", ".");

										// Solo números y un punto decimal
										valor = valor.replace(/[^0-9.]/g, "");

										const partes = valor.split(".");

										// Evitar más de un punto decimal
										if (partes.length > 2) {
											return;
										}

										// Máximo 2 decimales
										if (
											partes[1] !== undefined &&
											partes[1].length > 2
										) {
											return;
										}

										setCantidad(valor);
									}}
									placeholder="0,00"
									className="
		w-full rounded-xl
		border border-slate-200
		bg-slate-50
		py-3 pl-11 pr-14
		text-lg font-bold text-slate-800
		outline-none transition
		placeholder:text-slate-300
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
										items-center justify-center
										rounded-xl
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
										Podrás reutilizar este movimiento rápidamente.
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

					{/* FOOTER */}
					<div className="flex flex-col-reverse gap-3 border-t border-slate-100 bg-slate-50/50 p-5 sm:flex-row sm:justify-end sm:p-6">

						<button
							type="button"
							onClick={() => navigate(-1)}
							className="
								rounded-xl border border-slate-200
								bg-white px-5 py-3
								text-sm font-semibold text-slate-600
								transition
								hover:bg-slate-50
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
									Guardar movimiento
								</>
							)}
						</button>

					</div>

				</div>
			</div>
		</main>
	);
}