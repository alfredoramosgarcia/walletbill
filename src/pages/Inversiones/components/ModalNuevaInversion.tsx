import {
	useState,
	type FormEvent,
} from "react";

import { supabase } from "../../../supabase/client";
import { useAuth } from "../../../hooks/useAuth";

/* ========================================================== */
/* TIPOS                                                      */
/* ========================================================== */

type Props = {
	open: boolean;
	onClose: () => void;
	onCreated: (id: string) => void | Promise<void>;
	onError: (message: string) => void;
};

type NuevaInversionForm = {
	nombre: string;
	tipo: string;
	simbolo: string;
	moneda: string;
	descripcion: string;

	fechaInicial: string;
	valorInicial: string;
	aportacionInicial: string;
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

function porcentaje(value: number) {
	return new Intl.NumberFormat(
		"es-ES",
		{
			minimumFractionDigits: 2,
			maximumFractionDigits: 2,
		}
	).format(value);
}

function crearFormularioInicial(): NuevaInversionForm {
	return {
		nombre: "",
		tipo: "bolsa",
		simbolo: "",
		moneda: "EUR",
		descripcion: "",

		fechaInicial: fechaHoy(),
		valorInicial: "",
		aportacionInicial: "",
	};
}

/* ========================================================== */
/* COMPONENTE                                                 */
/* ========================================================== */

export default function ModalNuevaInversion({
	open,
	onClose,
	onCreated,
	onError,
}: Props) {
	const { user } = useAuth();

	const [form, setForm] =
		useState<NuevaInversionForm>(
			crearFormularioInicial
		);

	const [guardando, setGuardando] =
		useState(false);

	const [errorLocal, setErrorLocal] =
		useState("");

	/* ====================================================== */
	/* CÁLCULOS                                               */
	/* ====================================================== */

	const valorInicial =
		numero(form.valorInicial);

	const aportacionInicial =
		numero(form.aportacionInicial);

	const gananciaInicial =
		valorInicial -
		aportacionInicial;

	const rentabilidadInicial =
		aportacionInicial > 0
			? (gananciaInicial /
				aportacionInicial) *
			100
			: 0;

	const tieneDatosIniciales =
		form.valorInicial.trim() !== "" ||
		form.aportacionInicial.trim() !== "";

	/* ====================================================== */
	/* CERRAR                                                 */
	/* ====================================================== */

	function cerrar() {
		if (guardando) return;

		setErrorLocal("");

		onClose();
	}

	/* ====================================================== */
	/* CREAR INVERSIÓN                                        */
	/* ====================================================== */

	async function crearInversion(
		e: FormEvent<HTMLFormElement>
	) {
		e.preventDefault();

		if (!user || guardando) {
			return;
		}

		setErrorLocal("");
		onError("");

		const nombre =
			form.nombre.trim();

		if (!nombre) {
			setErrorLocal(
				"Introduce un nombre para la inversión."
			);

			return;
		}

		if (
			tieneDatosIniciales &&
			!form.fechaInicial
		) {
			setErrorLocal(
				"Selecciona la fecha inicial."
			);

			return;
		}

		if (
			valorInicial < 0 ||
			aportacionInicial < 0
		) {
			setErrorLocal(
				"Los importes no pueden ser negativos."
			);

			return;
		}

		setGuardando(true);

		let inversionCreadaId:
			| string
			| null = null;

		try {
			/* ========================================== */
			/* CREAR INVERSIÓN                            */
			/* ========================================== */

			const {
				data: nuevaInversion,
				error: errorInversion,
			} = await supabase
				.from("inversiones")
				.insert({
					user_id: user.id,

					nombre,

					tipo:
						form.tipo,

					simbolo:
						form.simbolo
							.trim()
							.toUpperCase() ||
						null,

					moneda:
						form.moneda,

					descripcion:
						form.descripcion.trim() ||
						null,
				})
				.select("id")
				.single();

			if (errorInversion) {
				throw errorInversion;
			}

			if (!nuevaInversion?.id) {
				throw new Error(
					"No se ha obtenido el ID de la inversión."
				);
			}

			inversionCreadaId =
				nuevaInversion.id;

			/* ========================================== */
			/* REGISTRO INICIAL                          */
			/* ========================================== */

			if (tieneDatosIniciales) {
				const {
					error:
					errorRegistroInicial,
				} = await supabase
					.from(
						"inversion_movimientos"
					)
					.insert({
						inversion_id:
							nuevaInversion.id,

						user_id:
							user.id,

						fecha:
							form.fechaInicial,

						valor:
							valorInicial,

						aportacion:
							aportacionInicial,

						retirada: 0,

						notas:
							"Registro inicial",
					});

				if (
					errorRegistroInicial
				) {
					throw errorRegistroInicial;
				}
			}

			/* ========================================== */
			/* TERMINADO                                  */
			/* ========================================== */

			const id =
				nuevaInversion.id;

			setForm(
				crearFormularioInicial()
			);

			setErrorLocal("");

			onClose();

			await onCreated(id);
		} catch (error) {
			console.error(
				"Error creando inversión:",
				error
			);

			/*
			 * Si la inversión se creó pero falló
			 * el registro inicial, intentamos
			 * eliminarla para no dejarla a medias.
			 */
			if (inversionCreadaId) {
				const {
					error: rollbackError,
				} = await supabase
					.from("inversiones")
					.delete()
					.eq(
						"id",
						inversionCreadaId
					)
					.eq(
						"user_id",
						user.id
					);

				if (rollbackError) {
					console.error(
						"Error revirtiendo inversión:",
						rollbackError
					);
				}
			}

			setErrorLocal(
				"No se ha podido crear la inversión."
			);
		} finally {
			setGuardando(false);
		}
	}

	/* ====================================================== */
	/* NO RENDERIZAR                                          */
	/* ====================================================== */

	if (!open) {
		return null;
	}

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
							Patrimonio
						</p>

						<h2 className="mt-1 text-xl font-extrabold text-slate-900">
							Nueva inversión
						</h2>

						<p className="mt-1 text-sm text-slate-500">
							Añade un activo a tu
							cartera.
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

				{/* ========================================== */}
				{/* FORMULARIO                                 */}
				{/* ========================================== */}

				<form
					onSubmit={
						crearInversion
					}
					className="p-6"
				>
					{/* ERROR */}

					{errorLocal && (
						<div className="mb-5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-600">
							{errorLocal}
						</div>
					)}

					{/* NOMBRE */}

					<Field
						label="Nombre"
						placeholder="Ej. Apple, Bitcoin, S&P 500..."
						value={form.nombre}
						onChange={(value) =>
							setForm({
								...form,
								nombre: value,
							})
						}
						required
					/>

					{/* TIPO / MONEDA */}

					<div className="mt-4 grid gap-4 sm:grid-cols-2">

						<div>
							<label className="mb-2 block text-sm font-bold text-slate-700">
								Tipo
							</label>

							<select
								value={
									form.tipo
								}
								onChange={(
									e
								) =>
									setForm({
										...form,
										tipo:
											e
												.target
												.value,
									})
								}
								className={
									inputClass
								}
							>
								<option value="bolsa">
									Bolsa / Acción
								</option>

								<option value="etf">
									ETF
								</option>

								<option value="fondo">
									Fondo
								</option>

								<option value="cripto">
									Criptomoneda
								</option>

								<option value="inmueble">
									Inmueble
								</option>

								<option value="deposito">
									Depósito
								</option>

								<option value="empresa">
									Empresa
								</option>

								<option value="otro">
									Otro
								</option>
							</select>
						</div>

						<div>
							<label className="mb-2 block text-sm font-bold text-slate-700">
								Moneda
							</label>

							<select
								value={
									form.moneda
								}
								onChange={(
									e
								) =>
									setForm({
										...form,
										moneda:
											e
												.target
												.value,
									})
								}
								className={
									inputClass
								}
							>
								<option value="EUR">
									EUR · €
								</option>

								<option value="USD">
									USD · $
								</option>

								<option value="GBP">
									GBP · £
								</option>
							</select>
						</div>

					</div>

					{/* TICKER */}

					<div className="mt-4">
						<Field
							label="Símbolo / ticker"
							placeholder="Opcional · Ej. AAPL"
							value={
								form.simbolo
							}
							onChange={(
								value
							) =>
								setForm({
									...form,
									simbolo:
										value.toUpperCase(),
								})
							}
						/>
					</div>

					{/* DESCRIPCIÓN */}

					<div className="mt-4">

						<label className="mb-2 block text-sm font-bold text-slate-700">
							Descripción
						</label>

						<textarea
							value={
								form.descripcion
							}
							onChange={(e) =>
								setForm({
									...form,
									descripcion:
										e.target
											.value,
								})
							}
							placeholder="Opcional"
							rows={3}
							className={
								inputClass
							}
						/>

					</div>

					{/* ====================================== */}
					{/* ESTADO INICIAL                         */}
					{/* ====================================== */}

					<div className="mt-6 rounded-2xl border border-[#008F8C]/15 bg-[#F2F9F7] p-5">

						<div>
							<p className="text-sm font-extrabold text-slate-800">
								Estado inicial
							</p>

							<p className="mt-1 text-xs leading-5 text-slate-500">
								Introduce la
								situación actual de
								esta inversión para
								comenzar su
								histórico.
							</p>
						</div>

						{/* FECHA */}

						<div className="mt-4">

							<label className="mb-2 block text-sm font-bold text-slate-700">
								Fecha inicial
							</label>

							<input
								type="date"
								value={
									form.fechaInicial
								}
								onChange={(
									e
								) =>
									setForm({
										...form,
										fechaInicial:
											e
												.target
												.value,
									})
								}
								className={
									inputClass
								}
							/>

						</div>

						{/* VALOR / CAPITAL */}

						<div className="mt-4 grid gap-4 sm:grid-cols-2">

							<Field
								label={`Valor actual (${form.moneda})`}
								type="number"
								step="0.01"
								min="0"
								placeholder="0,00"
								value={
									form.valorInicial
								}
								onChange={(
									value
								) =>
									setForm({
										...form,
										valorInicial:
											value,
									})
								}
							/>

							<Field
								label={`Capital aportado (${form.moneda})`}
								type="number"
								step="0.01"
								min="0"
								placeholder="0,00"
								value={
									form.aportacionInicial
								}
								onChange={(
									value
								) =>
									setForm({
										...form,
										aportacionInicial:
											value,
									})
								}
							/>

						</div>

						<p className="mt-3 text-xs leading-5 text-slate-400">
							El valor actual es lo
							que vale hoy el activo.
							El capital aportado es
							el dinero total que has
							invertido.
						</p>

						{/* RESULTADO */}

						{tieneDatosIniciales && (
							<div className="mt-5 grid gap-3 sm:grid-cols-2">

								<Resumen
									label="Ganancia inicial"
									value={`${gananciaInicial >= 0 ? "+" : ""}${dinero(
										gananciaInicial,
										form.moneda
									)}`}
									positive={
										gananciaInicial >=
										0
									}
								/>

								<Resumen
									label="Rentabilidad"
									value={`${rentabilidadInicial >= 0 ? "+" : ""}${porcentaje(
										rentabilidadInicial
									)} %`}
									positive={
										rentabilidadInicial >=
										0
									}
								/>

							</div>
						)}

					</div>

					{/* ====================================== */}
					{/* BOTONES                                */}
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
								guardando
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
								? "Creando..."
								: "Crear inversión"}
						</button>

					</div>

				</form>

			</div>
		</div>
	);
}

/* ========================================================== */
/* COMPONENTES AUXILIARES                                     */
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
	required = false,
}: {
	label: string;
	value: string;
	onChange: (value: string) => void;
	placeholder?: string;
	type?: string;
	step?: string;
	min?: string;
	required?: boolean;
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
				required={required}
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

function Resumen({
	label,
	value,
	positive,
}: {
	label: string;
	value: string;
	positive: boolean;
}) {
	return (
		<div className="rounded-xl border border-white bg-white px-4 py-3 shadow-sm">

			<p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
				{label}
			</p>

			<p
				className={`mt-1 text-lg font-extrabold ${positive
						? "text-emerald-600"
						: "text-rose-500"
					}`}
			>
				{value}
			</p>

		</div>
	);
}