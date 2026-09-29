import {
	useEffect,
	useMemo,
	useState,
} from "react";

import {
	Area,
	AreaChart,
	CartesianGrid,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";

import { supabase } from "../../supabase/client";
import { useAuth } from "../../hooks/useAuth";

import ModalNuevaInversion from "./components/ModalNuevaInversion";
import ModalRegistroInversion from "./components/ModalRegistroInversion";

/* ========================================================== */
/* TIPOS                                                      */
/* ========================================================== */

export type Inversion = {
	id: string;
	user_id: string;
	nombre: string;
	tipo: string;
	simbolo: string | null;
	moneda: string;
	descripcion: string | null;
	created_at: string;
};

export type MovimientoInversion = {
	id: string;
	inversion_id: string;
	user_id: string;
	fecha: string;
	valor: number;
	aportacion: number;
	retirada: number;
	notas: string | null;
	created_at: string;
};

/* ========================================================== */
/* HELPERS                                                    */
/* ========================================================== */

function dinero(
	value: number,
	moneda = "EUR"
) {
	return new Intl.NumberFormat("es-ES", {
		style: "currency",
		currency: moneda,
		maximumFractionDigits: 2,
	}).format(value);
}

function porcentaje(value: number) {
	return new Intl.NumberFormat("es-ES", {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	}).format(value);
}

function fechaCorta(fecha: string) {
	const [year, month, day] =
		fecha.split("-");

	return new Intl.DateTimeFormat(
		"es-ES",
		{
			day: "2-digit",
			month: "short",
			year: "numeric",
		}
	).format(
		new Date(
			Number(year),
			Number(month) - 1,
			Number(day)
		)
	);
}

function mesCorto(fecha: string) {
	const [year, month, day] =
		fecha.split("-");

	return new Intl.DateTimeFormat(
		"es-ES",
		{
			month: "short",
			year: "2-digit",
		}
	).format(
		new Date(
			Number(year),
			Number(month) - 1,
			Number(day)
		)
	);
}

/* ========================================================== */
/* COMPONENTE                                                 */
/* ========================================================== */

export default function Inversiones() {
	const { user } = useAuth();

	const [inversiones, setInversiones] =
		useState<Inversion[]>([]);

	const [
		inversionSeleccionada,
		setInversionSeleccionada,
	] = useState("");

	const [movimientos, setMovimientos] =
		useState<MovimientoInversion[]>([]);

	const [loading, setLoading] =
		useState(true);

	const [
		loadingMovimientos,
		setLoadingMovimientos,
	] = useState(false);

	const [
		showNuevaInversion,
		setShowNuevaInversion,
	] = useState(false);

	const [
		showNuevoRegistro,
		setShowNuevoRegistro,
	] = useState(false);

	const [error, setError] =
		useState("");

	/* ====================================================== */
	/* CARGAR INVERSIONES                                     */
	/* ====================================================== */

	useEffect(() => {
		if (!user) return;

		void cargarInversiones();
	}, [user]);

	async function cargarInversiones(
		seleccionarId?: string
	) {
		if (!user) return;

		setLoading(true);

		const { data, error } =
			await supabase
				.from("inversiones")
				.select("*")
				.eq("user_id", user.id)
				.order("created_at", {
					ascending: true,
				});

		if (error) {
			console.error(error);

			setError(
				"No se han podido cargar las inversiones."
			);

			setLoading(false);
			return;
		}

		const lista =
			(data as Inversion[]) ?? [];

		setInversiones(lista);

		if (
			seleccionarId &&
			lista.some(
				(item) =>
					item.id === seleccionarId
			)
		) {
			setInversionSeleccionada(
				seleccionarId
			);
		} else {
			setInversionSeleccionada(
				(actual) => {
					if (
						actual &&
						lista.some(
							(item) =>
								item.id === actual
						)
					) {
						return actual;
					}

					return lista[0]?.id ?? "";
				}
			);
		}

		setLoading(false);
	}

	/* ====================================================== */
	/* CARGAR MOVIMIENTOS                                     */
	/* ====================================================== */

	useEffect(() => {
		if (
			!user ||
			!inversionSeleccionada
		) {
			setMovimientos([]);
			return;
		}

		void cargarMovimientos();
	}, [user, inversionSeleccionada]);

	async function cargarMovimientos() {
		if (
			!user ||
			!inversionSeleccionada
		) {
			return;
		}

		setLoadingMovimientos(true);

		const { data, error } =
			await supabase
				.from(
					"inversion_movimientos"
				)
				.select("*")
				.eq(
					"inversion_id",
					inversionSeleccionada
				)
				.eq(
					"user_id",
					user.id
				)
				.order("fecha", {
					ascending: true,
				});

		if (error) {
			console.error(error);

			setError(
				"No se ha podido cargar el histórico."
			);

			setLoadingMovimientos(false);
			return;
		}

		setMovimientos(
			(data as MovimientoInversion[]) ??
			[]
		);

		setLoadingMovimientos(false);
	}

	/* ====================================================== */
	/* INVERSIÓN ACTUAL                                       */
	/* ====================================================== */

	const inversionActual = useMemo(
		() =>
			inversiones.find(
				(item) =>
					item.id ===
					inversionSeleccionada
			) ?? null,
		[
			inversiones,
			inversionSeleccionada,
		]
	);

	/* ====================================================== */
	/* RESUMEN                                                */
	/* ====================================================== */

	const resumen = useMemo(() => {
		const totalAportado =
			movimientos.reduce(
				(total, movimiento) =>
					total +
					Number(
						movimiento.aportacion
					),
				0
			);

		const totalRetirado =
			movimientos.reduce(
				(total, movimiento) =>
					total +
					Number(
						movimiento.retirada
					),
				0
			);

		const ultimo =
			movimientos.length > 0
				? movimientos[
				movimientos.length - 1
				]
				: null;

		const valorActual = ultimo
			? Number(ultimo.valor)
			: 0;

		const capitalNeto =
			totalAportado -
			totalRetirado;

		const ganancia =
			valorActual +
			totalRetirado -
			totalAportado;

		const rentabilidad =
			totalAportado > 0
				? (ganancia /
					totalAportado) *
				100
				: 0;

		return {
			totalAportado,
			totalRetirado,
			capitalNeto,
			valorActual,
			ganancia,
			rentabilidad,
		};
	}, [movimientos]);

	/* ====================================================== */
	/* GRÁFICA                                                */
	/* ====================================================== */

	const datosGrafica = useMemo(() => {
		let aportado = 0;
		let retirado = 0;

		return movimientos.map(
			(movimiento) => {
				aportado += Number(
					movimiento.aportacion
				);

				retirado += Number(
					movimiento.retirada
				);

				return {
					fecha: mesCorto(
						movimiento.fecha
					),

					valor: Number(
						movimiento.valor
					),

					capital:
						aportado -
						retirado,
				};
			}
		);
	}, [movimientos]);

	/* ====================================================== */
	/* ELIMINAR REGISTRO                                      */
	/* ====================================================== */

	async function eliminarRegistro(
		id: string
	) {
		if (!user) return;

		const confirmar =
			window.confirm(
				"¿Eliminar este registro del histórico?"
			);

		if (!confirmar) return;

		const { error } =
			await supabase
				.from(
					"inversion_movimientos"
				)
				.delete()
				.eq("id", id)
				.eq(
					"user_id",
					user.id
				);

		if (error) {
			console.error(error);

			setError(
				"No se ha podido eliminar el registro."
			);

			return;
		}

		await cargarMovimientos();
	}

	/* ====================================================== */
	/* ELIMINAR INVERSIÓN                                     */
	/* ====================================================== */

	async function eliminarInversion() {
		if (
			!user ||
			!inversionActual
		) {
			return;
		}

		const confirmar =
			window.confirm(
				`¿Eliminar "${inversionActual.nombre}" y todo su histórico?`
			);

		if (!confirmar) return;

		const { error } =
			await supabase
				.from("inversiones")
				.delete()
				.eq(
					"id",
					inversionActual.id
				)
				.eq(
					"user_id",
					user.id
				);

		if (error) {
			console.error(error);

			setError(
				"No se ha podido eliminar la inversión."
			);

			return;
		}

		setInversionSeleccionada("");
		setMovimientos([]);

		await cargarInversiones();
	}

	/* ====================================================== */
	/* LOADING                                                */
	/* ====================================================== */

	if (loading) {
		return (
			<div className="flex min-h-[400px] items-center justify-center">
				<div className="text-center">

					<div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-[#008F8C]/20 border-t-[#008F8C]" />

					<p className="mt-4 text-sm font-semibold text-slate-400">
						Cargando inversiones...
					</p>

				</div>
			</div>
		);
	}

	/* ====================================================== */
	/* RENDER                                                 */
	/* ====================================================== */

	return (
		<div className="mx-auto w-full max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8">

			{/* ================================================== */}
			{/* CABECERA                                           */}
			{/* ================================================== */}

			<div className="mb-7 flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">

				<div>
					<p className="text-sm font-bold text-[#008F8C]">
						Patrimonio
					</p>

					<h1 className="mt-1 text-3xl font-extrabold tracking-tight text-slate-900">
						Mis inversiones
					</h1>

					<p className="mt-2 text-sm text-slate-500">
						Controla la evolución de tus
						activos, aportaciones y
						ganancias.
					</p>
				</div>

				<div className="flex flex-col gap-3 sm:flex-row">

					{inversiones.length > 0 && (
						<div className="min-w-[240px]">

							<label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-400">
								Inversión
							</label>

							<select
								value={
									inversionSeleccionada
								}
								onChange={(e) =>
									setInversionSeleccionada(
										e.target.value
									)
								}
								className="
									h-12 w-full
									rounded-xl
									border border-slate-200
									bg-white px-4
									font-semibold
									text-slate-700
									outline-none
									transition
									focus:border-[#008F8C]
									focus:ring-2
									focus:ring-[#008F8C]/10
								"
							>
								{inversiones.map(
									(inversion) => (
										<option
											key={
												inversion.id
											}
											value={
												inversion.id
											}
										>
											{
												inversion.nombre
											}

											{inversion.simbolo
												? ` · ${inversion.simbolo}`
												: ""}
										</option>
									)
								)}
							</select>

						</div>
					)}

					<button
						type="button"
						onClick={() => {
							setError("");
							setShowNuevaInversion(
								true
							);
						}}
						className="
							self-end rounded-xl
							px-5 py-3.5
							text-sm font-bold
							text-white shadow-sm
							transition
							hover:-translate-y-0.5
							hover:shadow-md
						"
						style={{
							background:
								"linear-gradient(135deg, #006C7A 0%, #008F8C 100%)",
						}}
					>
						+ Nueva inversión
					</button>

				</div>
			</div>

			{/* ERROR */}

			{error && (
				<div className="mb-6 flex items-center justify-between rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-600">

					<span>{error}</span>

					<button
						type="button"
						onClick={() =>
							setError("")
						}
						className="ml-4 text-lg"
					>
						×
					</button>

				</div>
			)}

			{/* ================================================== */}
			{/* SIN INVERSIONES                                    */}
			{/* ================================================== */}

			{inversiones.length === 0 ? (

				<div className="rounded-[28px] border border-slate-200 bg-white px-6 py-20 text-center shadow-sm">

					<div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#E3F3F0] text-2xl font-extrabold text-[#006C7A]">
						↗
					</div>

					<h2 className="mt-5 text-xl font-extrabold text-slate-800">
						Aún no tienes inversiones
					</h2>

					<p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
						Puedes registrar acciones,
						fondos, criptomonedas,
						inmuebles o cualquier otro
						activo que quieras controlar.
					</p>

					<button
						type="button"
						onClick={() => {
							setError("");
							setShowNuevaInversion(
								true
							);
						}}
						className="mt-6 rounded-xl bg-[#006C7A] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#005964]"
					>
						Crear mi primera inversión
					</button>

				</div>

			) : inversionActual ? (

				<>

					{/* ========================================== */}
					{/* INFO ACTIVO                                */}
					{/* ========================================== */}

					<div className="mb-5 flex flex-col justify-between gap-4 rounded-2xl border border-[#006C7A]/10 bg-[#EAF6F3] px-5 py-4 sm:flex-row sm:items-center">

						<div className="flex items-center gap-4">

							<div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-lg font-extrabold text-[#006C7A] shadow-sm">
								{inversionActual.nombre
									.charAt(0)
									.toUpperCase()}
							</div>

							<div>

								<div className="flex flex-wrap items-center gap-2">

									<h2 className="font-extrabold text-slate-800">
										{
											inversionActual.nombre
										}
									</h2>

									{inversionActual.simbolo && (
										<span className="rounded-lg bg-white px-2 py-1 text-[10px] font-extrabold uppercase text-[#008F8C]">
											{
												inversionActual.simbolo
											}
										</span>
									)}

								</div>

								<p className="mt-1 text-xs font-semibold capitalize text-slate-400">
									{
										inversionActual.tipo
									}
									{" · "}
									{
										inversionActual.moneda
									}
								</p>

							</div>

						</div>

						<div className="flex flex-wrap gap-2">

							<button
								type="button"
								onClick={() => {
									setError("");

									setShowNuevoRegistro(
										true
									);
								}}
								className="rounded-xl bg-[#006C7A] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#005964]"
							>
								+ Añadir registro
							</button>

							<button
								type="button"
								onClick={
									eliminarInversion
								}
								className="rounded-xl border border-rose-200 bg-white px-4 py-2.5 text-sm font-bold text-rose-500 transition hover:bg-rose-50"
							>
								Eliminar
							</button>

						</div>

					</div>

					{/* ========================================== */}
					{/* KPIS                                       */}
					{/* ========================================== */}

					<div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

						<Kpi
							label="Valor actual"
							value={dinero(
								resumen.valorActual,
								inversionActual.moneda
							)}
							description="Última valoración registrada"
							primary
						/>

						<Kpi
							label="Capital neto"
							value={dinero(
								resumen.capitalNeto,
								inversionActual.moneda
							)}
							description="Aportaciones − retiradas"
						/>

						<Kpi
							label="Ganancia"
							value={`${resumen.ganancia >= 0
								? "+"
								: ""
								}${dinero(
									resumen.ganancia,
									inversionActual.moneda
								)}`}
							description="Resultado acumulado"
							positive={
								resumen.ganancia >= 0
							}
						/>

						<Kpi
							label="Rentabilidad"
							value={`${resumen.rentabilidad >=
								0
								? "+"
								: ""
								}${porcentaje(
									resumen.rentabilidad
								)} %`}
							description="Rentabilidad simple"
							positive={
								resumen.rentabilidad >=
								0
							}
						/>

					</div>

					{/* ========================================== */}
					{/* GRÁFICA                                    */}
					{/* ========================================== */}

					<div className="mt-5 rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">

						<div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

							<div>
								<p className="text-xs font-bold uppercase tracking-wider text-[#008F8C]">
									Evolución
								</p>

								<h3 className="mt-1 text-lg font-extrabold text-slate-800">
									Valor de la inversión
								</h3>
							</div>

							<div className="flex flex-wrap gap-4 text-xs font-semibold text-slate-400">
								<span>
									● Valor
								</span>

								<span>
									○ Capital neto
								</span>
							</div>

						</div>

						{loadingMovimientos ? (

							<div className="flex h-[320px] items-center justify-center text-sm font-semibold text-slate-400">
								Cargando histórico...
							</div>

						) : datosGrafica.length ===
							0 ? (

							<div className="flex h-[320px] flex-col items-center justify-center rounded-2xl bg-slate-50 text-center">

								<p className="font-bold text-slate-600">
									Todavía no hay datos
								</p>

								<p className="mt-1 text-sm text-slate-400">
									Añade la primera
									valoración para comenzar
									la gráfica.
								</p>

							</div>

						) : (

							<div className="h-[340px] w-full">

								<ResponsiveContainer
									width="100%"
									height="100%"
								>
									<AreaChart
										data={
											datosGrafica
										}
										margin={{
											top: 10,
											right: 10,
											left: 0,
											bottom: 0,
										}}
									>

										<defs>
											<linearGradient
												id="walletInvestmentGradient"
												x1="0"
												y1="0"
												x2="0"
												y2="1"
											>
												<stop
													offset="5%"
													stopColor="#008F8C"
													stopOpacity={
														0.25
													}
												/>

												<stop
													offset="95%"
													stopColor="#008F8C"
													stopOpacity={
														0
													}
												/>
											</linearGradient>
										</defs>

										<CartesianGrid
											strokeDasharray="3 3"
											vertical={
												false
											}
											stroke="#E2E8F0"
										/>

										<XAxis
											dataKey="fecha"
											tick={{
												fill: "#94A3B8",
												fontSize: 11,
											}}
											axisLine={
												false
											}
											tickLine={
												false
											}
										/>

										<YAxis
											tick={{
												fill: "#94A3B8",
												fontSize: 11,
											}}
											axisLine={
												false
											}
											tickLine={
												false
											}
											width={75}
											tickFormatter={(
												value
											) =>
												new Intl.NumberFormat(
													"es-ES",
													{
														notation:
															"compact",
														maximumFractionDigits: 1,
													}
												).format(
													value
												)
											}
										/>

										<Tooltip
											formatter={(
												value
											) =>
												dinero(
													Number(
														value
													),
													inversionActual.moneda
												)
											}
										/>

										<Area
											type="monotone"
											dataKey="capital"
											name="Capital neto"
											stroke="#94A3B8"
											strokeWidth={
												2
											}
											strokeDasharray="6 5"
											fill="transparent"
										/>

										<Area
											type="monotone"
											dataKey="valor"
											name="Valor"
											stroke="#008F8C"
											strokeWidth={
												3
											}
											fill="url(#walletInvestmentGradient)"
										/>

									</AreaChart>
								</ResponsiveContainer>

							</div>
						)}

					</div>

					{/* ========================================== */}
					{/* DETALLE CAPITAL                            */}
					{/* ========================================== */}

					<div className="mt-5 grid gap-4 md:grid-cols-3">

						<MiniKpi
							label="Total aportado"
							value={dinero(
								resumen.totalAportado,
								inversionActual.moneda
							)}
						/>

						<MiniKpi
							label="Total retirado"
							value={dinero(
								resumen.totalRetirado,
								inversionActual.moneda
							)}
						/>

						<MiniKpi
							label="Capital neto"
							value={dinero(
								resumen.capitalNeto,
								inversionActual.moneda
							)}
						/>

					</div>

					{/* ========================================== */}
					{/* HISTÓRICO                                  */}
					{/* ========================================== */}

					<div className="mt-5 overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-sm">

						<div className="flex items-center justify-between border-b border-slate-100 px-5 py-5 sm:px-6">

							<div>
								<p className="text-xs font-bold uppercase tracking-wider text-[#008F8C]">
									Actividad
								</p>

								<h3 className="mt-1 text-lg font-extrabold text-slate-800">
									Histórico
								</h3>
							</div>

							<button
								type="button"
								onClick={() => {
									setError("");

									setShowNuevoRegistro(
										true
									);
								}}
								className="rounded-xl border border-[#008F8C]/20 bg-[#EAF6F3] px-4 py-2.5 text-sm font-bold text-[#006C7A] transition hover:bg-[#DDF1ED]"
							>
								+ Registro
							</button>

						</div>

						{movimientos.length ===
							0 ? (

							<div className="px-6 py-14 text-center">

								<p className="font-bold text-slate-600">
									Sin registros
								</p>

								<p className="mt-1 text-sm text-slate-400">
									Registra una valoración
									para comenzar el
									histórico.
								</p>

							</div>

						) : (

							<div className="overflow-x-auto">

								<table className="w-full min-w-[760px]">

									<thead className="bg-slate-50">
										<tr className="text-left text-[11px] font-bold uppercase tracking-wider text-slate-400">

											<th className="px-6 py-3">
												Fecha
											</th>

											<th className="px-6 py-3">
												Valor
											</th>

											<th className="px-6 py-3">
												Aportación
											</th>

											<th className="px-6 py-3">
												Retirada
											</th>

											<th className="px-6 py-3">
												Notas
											</th>

											<th className="px-6 py-3 text-right">
												Acción
											</th>

										</tr>
									</thead>

									<tbody className="divide-y divide-slate-100">

										{[
											...movimientos,
										]
											.reverse()
											.map(
												(
													movimiento
												) => (

													<tr
														key={
															movimiento.id
														}
														className="transition hover:bg-slate-50/70"
													>

														<td className="whitespace-nowrap px-6 py-4 text-sm font-semibold text-slate-700">
															{fechaCorta(
																movimiento.fecha
															)}
														</td>

														<td className="whitespace-nowrap px-6 py-4 text-sm font-extrabold text-slate-800">
															{dinero(
																Number(
																	movimiento.valor
																),
																inversionActual.moneda
															)}
														</td>

														<td className="whitespace-nowrap px-6 py-4 text-sm font-semibold text-emerald-600">
															{Number(
																movimiento.aportacion
															) >
																0
																? `+${dinero(
																	Number(
																		movimiento.aportacion
																	),
																	inversionActual.moneda
																)}`
																: "—"}
														</td>

														<td className="whitespace-nowrap px-6 py-4 text-sm font-semibold text-amber-600">
															{Number(
																movimiento.retirada
															) >
																0
																? dinero(
																	Number(
																		movimiento.retirada
																	),
																	inversionActual.moneda
																)
																: "—"}
														</td>

														<td className="max-w-[260px] truncate px-6 py-4 text-sm text-slate-400">
															{movimiento.notas ||
																"—"}
														</td>

														<td className="px-6 py-4 text-right">

															<button
																type="button"
																onClick={() =>
																	eliminarRegistro(
																		movimiento.id
																	)
																}
																className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-rose-200 bg-rose-50 font-bold text-rose-500 transition hover:bg-rose-100"
																title="Eliminar registro"
															>
																×
															</button>

														</td>

													</tr>
												)
											)}

									</tbody>

								</table>

							</div>
						)}

					</div>

				</>

			) : null}

			{/* ================================================== */}
			{/* MODALES EXTERNOS                                   */}
			{/* ================================================== */}

			<ModalNuevaInversion
				open={showNuevaInversion}
				onClose={() =>
					setShowNuevaInversion(false)
				}
				onCreated={async (id) => {
					await cargarInversiones(
						id
					);
				}}
				onError={setError}
			/>

			{inversionActual && (
				<ModalRegistroInversion
					open={
						showNuevoRegistro
					}
					inversion={
						inversionActual
					}
					onClose={() =>
						setShowNuevoRegistro(
							false
						)
					}
					onCreated={async () => {
						await cargarMovimientos();
					}}
					onError={setError}
				/>
			)}

		</div>
	);
}

/* ========================================================== */
/* COMPONENTES PEQUEÑOS                                       */
/* ========================================================== */

function Kpi({
	label,
	value,
	description,
	primary = false,
	positive,
}: {
	label: string;
	value: string;
	description: string;
	primary?: boolean;
	positive?: boolean;
}) {
	if (primary) {
		return (
			<div
				className="relative overflow-hidden rounded-[22px] p-5 text-white shadow-sm"
				style={{
					background:
						"linear-gradient(135deg, #006C7A 0%, #008F8C 100%)",
				}}
			>
				<div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-white/10" />

				<p className="text-xs font-semibold text-white/70">
					{label}
				</p>

				<p className="mt-2 text-2xl font-extrabold">
					{value}
				</p>

				<p className="mt-2 text-xs text-white/60">
					{description}
				</p>
			</div>
		);
	}

	return (
		<div className="rounded-[22px] border border-slate-200 bg-white p-5 shadow-sm">

			<p className="text-xs font-semibold text-slate-400">
				{label}
			</p>

			<p
				className={`mt-2 text-2xl font-extrabold ${positive === undefined
					? "text-slate-800"
					: positive
						? "text-emerald-600"
						: "text-rose-500"
					}`}
			>
				{value}
			</p>

			<p className="mt-2 text-xs text-slate-400">
				{description}
			</p>

		</div>
	);
}

function MiniKpi({
	label,
	value,
}: {
	label: string;
	value: string;
}) {
	return (
		<div className="rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">

			<p className="text-xs font-semibold text-slate-400">
				{label}
			</p>

			<p className="mt-1 text-lg font-extrabold text-slate-800">
				{value}
			</p>

		</div>
	);
}