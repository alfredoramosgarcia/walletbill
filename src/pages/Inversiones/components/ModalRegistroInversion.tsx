import {
	useEffect,
	useState,
	type FormEvent,
} from "react";

import { supabase } from "../../../supabase/client";
import { useAuth } from "../../../hooks/useAuth";

import type { Inversion } from "../Inversiones";

/* ========================================================== */
/* TIPOS                                                      */
/* ========================================================== */

type TipoOperacion =
	| "valoracion"
	| "aportacion"
	| "retirada";

type Props = {
	open: boolean;
	inversion: Inversion;
	onClose: () => void;
	onCreated: () => void | Promise<void>;
	onError: (message: string) => void;
};

type FormRegistro = {
	tipo: TipoOperacion;
	fecha: string;
	valor: string;
	importe: string;
	notas: string;
};

/* ========================================================== */
/* HELPERS                                                    */
/* ========================================================== */

function fechaHoy() {
	const hoy = new Date();

	const year = hoy.getFullYear();

	const month = String(
		hoy.getMonth() + 1
	).padStart(2, "0");

	const day = String(
		hoy.getDate()
	).padStart(2, "0");

	return `${year}-${month}-${day}`;
}

function numero(value: string) {
	const parsed = Number(
		value.replace(",", ".")
	);

	return Number.isFinite(parsed)
		? parsed
		: 0;
}

function dinero(
	value: number,
	moneda: string
) {
	return new Intl.NumberFormat(
		"es-ES",
		{
			style: "currency",
			currency: moneda,
			maximumFractionDigits: 2,
		}
	).format(value);
}

function formularioInicial(): FormRegistro {
	return {
		tipo: "valoracion",
		fecha: fechaHoy(),
		valor: "",
		importe: "",
		notas: "",
	};
}

/* ========================================================== */
/* COMPONENTE                                                 */
/* ========================================================== */

export default function ModalRegistroInversion({
	open,
	inversion,
	onClose,
	onCreated,
	onError,
}: Props) {
	const { user } = useAuth();

	const [form, setForm] =
		useState<FormRegistro>(
			formularioInicial
		);

	const [guardando, setGuardando] =
		useState(false);

	const [cargandoUltimo, setCargandoUltimo] =
		useState(false);

	const [errorLocal, setErrorLocal] =
		useState("");

	const [
		ultimoValor,
		setUltimoValor,
	] = useState<number | null>(null);

	/* ====================================================== */
	/* CARGAR ÚLTIMO VALOR                                    */
	/* ====================================================== */

	useEffect(() => {
		if (!open || !user) {
			return;
		}

		void cargarUltimoValor();
	}, [open, user, inversion.id]);

	async function cargarUltimoValor() {
		if (!user) return;

		setCargandoUltimo(true);

		const { data, error } =
			await supabase
				.from(
					"inversion_movimientos"
				)
				.select("valor")
				.eq(
					"inversion_id",
					inversion.id
				)
				.eq(
					"user_id",
					user.id
				)
				.order("fecha", {
					ascending: false,
				})
				.order("created_at", {
					ascending: false,
				})
				.limit(1)
				.maybeSingle();

		if (error) {
			console.error(
				"Error cargando último valor:",
				error
			);

			setUltimoValor(null);
			setCargandoUltimo(false);
			return;
		}

		const valor =
			data?.valor !== undefined &&
				data?.valor !== null
				? Number(data.valor)
				: null;

		setUltimoValor(valor);

		/*
		 * Al abrir el modal dejamos preparado
		 * el último valor conocido.
		 */
		setForm((actual) => ({
			...actual,
			fecha: fechaHoy(),
			valor:
				valor !== null
					? String(valor)
					: "",
			importe: "",
			notas: "",
		}));

		setCargandoUltimo(false);
	}

	/* ====================================================== */
	/* CAMBIAR OPERACIÓN                                      */
	/* ====================================================== */

	function cambiarTipo(
		tipo: TipoOperacion
	) {
		setErrorLocal("");

		setForm((actual) => ({
			...actual,
			tipo,
			importe: "",
			valor:
				ultimoValor !== null
					? String(
						ultimoValor
					)
					: actual.valor,
		}));
	}

	/* ====================================================== */
	/* CERRAR                                                 */
	/* ====================================================== */

	function cerrar() {
		if (guardando) return;

		setErrorLocal("");

		setForm(
			formularioInicial()
		);

		onClose();
	}

	/* ====================================================== */
	/* GUARDAR                                                */
	/* ====================================================== */

	async function guardar(
		e: FormEvent<HTMLFormElement>
	) {
		e.preventDefault();

		if (!user || guardando) {
			return;
		}

		setErrorLocal("");
		onError("");

		if (!form.fecha) {
			setErrorLocal(
				"Selecciona una fecha."
			);

			return;
		}

		if (form.valor.trim() === "") {
			setErrorLocal(
				form.tipo === "valoracion"
					? "Introduce el valor actual de la inversión."
					: "Introduce el valor total de la inversión después de la operación."
			);

			return;
		}

		const valor =
			numero(form.valor);

		const importe =
			numero(form.importe);

		if (valor < 0) {
			setErrorLocal(
				"El valor de la inversión no puede ser negativo."
			);

			return;
		}

		if (
			form.tipo !==
			"valoracion" &&
			form.importe.trim() === ""
		) {
			setErrorLocal(
				form.tipo ===
					"aportacion"
					? "Introduce el importe de la aportación."
					: "Introduce el importe de la retirada."
			);

			return;
		}

		if (
			form.tipo !==
			"valoracion" &&
			importe <= 0
		) {
			setErrorLocal(
				"El importe debe ser mayor que cero."
			);

			return;
		}

		const aportacion =
			form.tipo === "aportacion"
				? importe
				: 0;

		const retirada =
			form.tipo === "retirada"
				? importe
				: 0;

		setGuardando(true);

		try {
			const { error } =
				await supabase
					.from(
						"inversion_movimientos"
					)
					.insert({
						inversion_id:
							inversion.id,

						user_id:
							user.id,

						fecha:
							form.fecha,

						valor,

						aportacion,

						retirada,

						notas:
							form.notas
								.trim() ||
							null,
					});

			if (error) {
				throw error;
			}

			setForm(
				formularioInicial()
			);

			setErrorLocal("");

			onClose();

			await onCreated();
		} catch (error) {
			console.error(
				"Error guardando registro:",
				error
			);

			setErrorLocal(
				"No se ha podido guardar el registro."
			);
		} finally {
			setGuardando(false);
		}
	}

	/* ====================================================== */
	/* NO MOSTRAR                                             */
	/* ====================================================== */

	if (!open) {
		return null;
	}

	/* ====================================================== */
	/* TEXTOS SEGÚN OPERACIÓN                                 */
	/* ====================================================== */

	const configuracion =
		form.tipo === "valoracion"
			? {
				titulo:
					"Actualizar valor",
				descripcion:
					"Registra cuánto vale actualmente esta inversión.",
				labelValor:
					`Valor actual (${inversion.moneda})`,
				ayudaValor:
					"Introduce el valor total actual del activo.",
			}
			: form.tipo ===
				"aportacion"
				? {
					titulo:
						"Aportar dinero",
					descripcion:
						"Registra una nueva aportación de capital.",
					labelValor:
						`Valor después de aportar (${inversion.moneda})`,
					ayudaValor:
						"Indica cuánto vale en total la inversión después de realizar la aportación.",
				}
				: {
					titulo:
						"Retirar dinero",
					descripcion:
						"Registra una retirada de capital.",
					labelValor:
						`Valor después de retirar (${inversion.moneda})`,
					ayudaValor:
						"Indica cuánto queda invertido después de realizar la retirada.",
				};

	/* ====================================================== */
	/* RENDER                                                 */
	/* ====================================================== */

	return (
		<div
			className="
				fixed inset-0 z-[100]
				flex items-center justify-center
				bg-slate-900/40
				px-4 py-6
				backdrop-blur-sm
			"
			onMouseDown={(e) => {
				if (
					e.target ===
					e.currentTarget
				) {
					cerrar();
				}
			}}
		>
			<div
				className="
					max-h-[92vh]
					w-full max-w-xl
					overflow-y-auto
					rounded-[28px]
					border border-white/70
					bg-white
					shadow-2xl
				"
			>
				{/* ========================================== */}
				{/* CABECERA                                   */}
				{/* ========================================== */}

				<div className="sticky top-0 z-10 flex items-start justify-between border-b border-slate-100 bg-[#F2F9F7] px-6 py-5">

					<div>
						<p className="text-xs font-bold uppercase tracking-wider text-[#008F8C]">
							{
								inversion.nombre
							}

							{inversion.simbolo
								? ` · ${inversion.simbolo}`
								: ""}
						</p>

						<h2 className="mt-1 text-xl font-extrabold text-slate-900">
							Nuevo registro
						</h2>

						<p className="mt-1 text-sm text-slate-500">
							Actualiza tu inversión
							o registra movimientos
							de capital.
						</p>
					</div>

					<button
						type="button"
						onClick={cerrar}
						disabled={guardando}
						className="
							flex h-9 w-9
							items-center
							justify-center
							rounded-xl
							border border-slate-200
							bg-white
							text-xl font-bold
							text-slate-400
							transition
							hover:text-slate-700
							disabled:opacity-50
						"
						aria-label="Cerrar"
					>
						×
					</button>

				</div>

				<form
					onSubmit={guardar}
					className="p-6"
				>
					{/* ERROR */}

					{errorLocal && (
						<div className="mb-5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-600">
							{errorLocal}
						</div>
					)}

					{/* ====================================== */}
					{/* VALOR ACTUAL ANTERIOR                  */}
					{/* ====================================== */}

					<div className="mb-5 rounded-2xl border border-[#008F8C]/15 bg-[#F2F9F7] px-4 py-3">

						<p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
							Último valor registrado
						</p>

						<p className="mt-1 text-lg font-extrabold text-slate-800">
							{cargandoUltimo
								? "Cargando..."
								: ultimoValor !==
									null
									? dinero(
										ultimoValor,
										inversion.moneda
									)
									: "Sin valoración"}
						</p>

					</div>

					{/* ====================================== */}
					{/* TIPO DE OPERACIÓN                      */}
					{/* ====================================== */}

					<label className="mb-2 block text-sm font-bold text-slate-700">
						¿Qué quieres registrar?
					</label>

					<div className="grid gap-3 sm:grid-cols-3">

						<OperacionButton
							active={
								form.tipo ===
								"valoracion"
							}
							icon="↗"
							title="Actualizar"
							subtitle="Valor"
							onClick={() =>
								cambiarTipo(
									"valoracion"
								)
							}
						/>

						<OperacionButton
							active={
								form.tipo ===
								"aportacion"
							}
							icon="+"
							title="Aportar"
							subtitle="Dinero"
							onClick={() =>
								cambiarTipo(
									"aportacion"
								)
							}
						/>

						<OperacionButton
							active={
								form.tipo ===
								"retirada"
							}
							icon="−"
							title="Retirar"
							subtitle="Dinero"
							onClick={() =>
								cambiarTipo(
									"retirada"
								)
							}
						/>

					</div>

					{/* DESCRIPCIÓN */}

					<div className="mt-5 rounded-xl bg-slate-50 px-4 py-3">

						<p className="text-sm font-extrabold text-slate-700">
							{
								configuracion.titulo
							}
						</p>

						<p className="mt-1 text-xs leading-5 text-slate-400">
							{
								configuracion.descripcion
							}
						</p>

					</div>

					{/* ====================================== */}
					{/* FECHA                                  */}
					{/* ====================================== */}

					<div className="mt-5">

						<label className="mb-2 block text-sm font-bold text-slate-700">
							Fecha
						</label>

						<input
							type="date"
							value={
								form.fecha
							}
							onChange={(e) =>
								setForm({
									...form,
									fecha:
										e.target
											.value,
								})
							}
							className={
								inputClass
							}
						/>

					</div>

					{/* ====================================== */}
					{/* IMPORTE                                */}
					{/* ====================================== */}

					{form.tipo !==
						"valoracion" && (

							<div className="mt-4">

								<Field
									label={
										form.tipo ===
											"aportacion"
											? `Importe aportado (${inversion.moneda})`
											: `Importe retirado (${inversion.moneda})`
									}
									type="number"
									step="0.01"
									min="0"
									placeholder="0,00"
									value={
										form.importe
									}
									onChange={(
										value
									) =>
										setForm({
											...form,
											importe:
												value,
										})
									}
								/>

								<p className="mt-1.5 text-xs text-slate-400">
									{form.tipo ===
										"aportacion"
										? "Dinero nuevo que estás añadiendo a esta inversión."
										: "Dinero que estás sacando de esta inversión."}
								</p>

							</div>
						)}

					{/* ====================================== */}
					{/* VALOR FINAL                            */}
					{/* ====================================== */}

					<div className="mt-4">

						<Field
							label={
								configuracion.labelValor
							}
							type="number"
							step="0.01"
							min="0"
							placeholder="0,00"
							value={
								form.valor
							}
							onChange={(
								value
							) =>
								setForm({
									...form,
									valor: value,
								})
							}
						/>

						<p className="mt-1.5 text-xs leading-5 text-slate-400">
							{
								configuracion.ayudaValor
							}
						</p>

					</div>

					{/* ====================================== */}
					{/* RESUMEN DE OPERACIÓN                   */}
					{/* ====================================== */}

					{form.tipo !==
						"valoracion" &&
						form.importe.trim() !==
						"" && (

							<div
								className={`mt-5 rounded-2xl border px-4 py-4 ${form.tipo ===
										"aportacion"
										? "border-emerald-200 bg-emerald-50"
										: "border-amber-200 bg-amber-50"
									}`}
							>
								<p className="text-xs font-bold uppercase tracking-wider text-slate-500">
									{form.tipo ===
										"aportacion"
										? "Aportación"
										: "Retirada"}
								</p>

								<p
									className={`mt-1 text-xl font-extrabold ${form.tipo ===
											"aportacion"
											? "text-emerald-600"
											: "text-amber-600"
										}`}
								>
									{form.tipo ===
										"aportacion"
										? "+"
										: "−"}

									{dinero(
										numero(
											form.importe
										),
										inversion.moneda
									)}
								</p>

								{form.valor.trim() !==
									"" && (
										<p className="mt-2 text-xs font-semibold text-slate-500">
											Valor de la
											inversión después
											de la operación:{" "}
											<span className="font-extrabold text-slate-700">
												{dinero(
													numero(
														form.valor
													),
													inversion.moneda
												)}
											</span>
										</p>
									)}

							</div>
						)}

					{/* ====================================== */}
					{/* NOTAS                                  */}
					{/* ====================================== */}

					<div className="mt-4">

						<label className="mb-2 block text-sm font-bold text-slate-700">
							Notas
						</label>

						<textarea
							value={
								form.notas
							}
							onChange={(e) =>
								setForm({
									...form,
									notas:
										e.target
											.value,
								})
							}
							placeholder={
								form.tipo ===
									"valoracion"
									? "Ej. Valoración mensual..."
									: form.tipo ===
										"aportacion"
										? "Ej. Aportación mensual..."
										: "Ej. Retirada parcial..."
							}
							rows={3}
							className={
								inputClass
							}
						/>

					</div>

					{/* ====================================== */}
					{/* ACCIONES                               */}
					{/* ====================================== */}

					<div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

						<button
							type="button"
							onClick={cerrar}
							disabled={
								guardando
							}
							className="
								rounded-xl
								border border-slate-200
								bg-white
								px-5 py-3
								text-sm font-bold
								text-slate-500
								transition
								hover:bg-slate-50
								disabled:opacity-50
							"
						>
							Cancelar
						</button>

						<button
							type="submit"
							disabled={
								guardando ||
								cargandoUltimo
							}
							className="
								rounded-xl
								bg-[#006C7A]
								px-5 py-3
								text-sm font-bold
								text-white
								transition
								hover:bg-[#005964]
								disabled:cursor-not-allowed
								disabled:opacity-60
							"
						>
							{guardando
								? "Guardando..."
								: form.tipo ===
									"valoracion"
									? "Actualizar valor"
									: form.tipo ===
										"aportacion"
										? "Registrar aportación"
										: "Registrar retirada"}
						</button>

					</div>

				</form>

			</div>
		</div>
	);
}

/* ========================================================== */
/* BOTÓN TIPO OPERACIÓN                                       */
/* ========================================================== */

function OperacionButton({
	active,
	icon,
	title,
	subtitle,
	onClick,
}: {
	active: boolean;
	icon: string;
	title: string;
	subtitle: string;
	onClick: () => void;
}) {
	return (
		<button
			type="button"
			onClick={onClick}
			className={`
				rounded-2xl border
				px-3 py-4
				text-left
				transition
				${active
					? "border-[#008F8C] bg-[#EAF6F3] shadow-sm"
					: "border-slate-200 bg-white hover:border-[#008F8C]/40 hover:bg-slate-50"
				}
			`}
		>
			<div
				className={`
					flex h-8 w-8
					items-center
					justify-center
					rounded-lg
					text-lg font-extrabold
					${active
						? "bg-[#006C7A] text-white"
						: "bg-slate-100 text-slate-500"
					}
				`}
			>
				{icon}
			</div>

			<p
				className={`mt-3 text-sm font-extrabold ${active
						? "text-[#006C7A]"
						: "text-slate-700"
					}`}
			>
				{title}
			</p>

			<p className="mt-0.5 text-[11px] font-semibold text-slate-400">
				{subtitle}
			</p>
		</button>
	);
}

/* ========================================================== */
/* FIELD                                                      */
/* ========================================================== */

const inputClass = `
	w-full rounded-xl
	border border-slate-200
	bg-slate-50
	px-4 py-3
	text-sm font-semibold
	text-slate-700
	outline-none
	transition
	placeholder:text-slate-400
	focus:border-[#008F8C]
	focus:bg-white
	focus:ring-2
	focus:ring-[#008F8C]/10
`;

function Field({
	label,
	value,
	onChange,
	placeholder,
	type = "text",
	step,
	min,
}: {
	label: string;
	value: string;
	onChange: (value: string) => void;
	placeholder?: string;
	type?: string;
	step?: string;
	min?: string;
}) {
	return (
		<div>

			<label className="mb-2 block text-sm font-bold text-slate-700">
				{label}
			</label>

			<input
				type={type}
				step={step}
				min={min}
				value={value}
				onChange={(e) =>
					onChange(
						e.target.value
					)
				}
				placeholder={
					placeholder
				}
				className={inputClass}
			/>

		</div>
	);
}