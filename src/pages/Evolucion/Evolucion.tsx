// src/pages/Evolucion/Evolucion.tsx

import { useEffect, useMemo, useState } from "react";
import {
	ArrowDownRight,
	ArrowUpRight,
	BarChart3,
	CalendarDays,
	Minus,
	TrendingUp,
} from "lucide-react";

import {
	CartesianGrid,
	Line,
	LineChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";

import { supabase } from "../../supabase/client";
import { useAuth } from "../../hooks/useAuth";
import { useFecha } from "../../context/FechaContext";

interface BalanceHistorico {
	id: string;
	mes: number;
	año: number;
	total: number;
	etiqueta: string;
}

const MESES = [
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

function formatMoney(value: number) {
	return new Intl.NumberFormat("es-ES", {
		style: "currency",
		currency: "EUR",
	}).format(value);
}

/* -------------------------------------------------------------------------- */
/*                                  TOOLTIP                                   */
/* -------------------------------------------------------------------------- */

function CustomTooltip({ active, payload, label }: any) {
	if (!active || !payload || !payload.length) {
		return null;
	}

	return (
		<div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-xl">
			<p className="text-xs font-medium text-slate-400">
				{label}
			</p>

			<p
				className="mt-1 text-base font-bold"
				style={{ color: "#006C7A" }}
			>
				{formatMoney(Number(payload[0].value))}
			</p>
		</div>
	);
}

/* -------------------------------------------------------------------------- */
/*                                 COMPONENTE                                 */
/* -------------------------------------------------------------------------- */

export default function Evolucion() {
	const { user } = useAuth();
	const { año, setAño } = useFecha();

	const [data, setData] = useState<BalanceHistorico[]>([]);

	useEffect(() => {
		if (user) {
			load();
		}
	}, [user, año]);

	async function load() {
		if (!user) return;

		const añoAnterior = año - 1;

		const { data: diciembreAnterior } = await supabase
			.from("historicobalance")
			.select("*")
			.eq("user_id", user.id)
			.eq("año", añoAnterior)
			.eq("mes", 12)
			.maybeSingle();

		const { data: mesesActual } = await supabase
			.from("historicobalance")
			.select("*")
			.eq("user_id", user.id)
			.eq("año", año)
			.order("mes");

		const result: BalanceHistorico[] = [];

		if (diciembreAnterior) {
			result.push({
				...diciembreAnterior,
				etiqueta: `Dic. ${añoAnterior}`,
			});
		}

		if (mesesActual) {
			result.push(
				...mesesActual.map((registro) => ({
					...registro,
					etiqueta: MESES[registro.mes - 1],
				}))
			);
		}

		setData(result);
	}

	async function updateValue(id: string, value: number) {
		const { error } = await supabase
			.from("historicobalance")
			.update({ total: value })
			.eq("id", id);

		if (!error) {
			await load();
		}
	}

	/* ---------------------------------------------------------------------- */
	/*                              ESTADÍSTICAS                              */
	/* ---------------------------------------------------------------------- */

	const datosAñoActual = useMemo(
		() => data.filter((registro) => registro.año === año),
		[data, año]
	);

	const registrosConBalance = datosAñoActual.filter(
		(registro) => registro.total !== 0
	);

	const ultimoRegistro =
		registrosConBalance.length > 0
			? registrosConBalance[registrosConBalance.length - 1]
			: null;

	const primerRegistro =
		datosAñoActual.length > 0
			? datosAñoActual[0]
			: null;

	const variacionAnual =
		primerRegistro &&
			ultimoRegistro &&
			primerRegistro.total !== 0
			? ((ultimoRegistro.total - primerRegistro.total) /
				Math.abs(primerRegistro.total)) *
			100
			: null;

	const mejorRegistro =
		datosAñoActual.length > 0
			? datosAñoActual.reduce((mejor, actual) =>
				actual.total > mejor.total ? actual : mejor
			)
			: null;

	return (
		<main className="min-h-screen bg-transparent">
			<div className="mx-auto w-full max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">

				{/* ========================================================== */}
				{/* CABECERA                                                   */}
				{/* ========================================================== */}

				<section className="mb-8">
					<div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">

						<div>
							<p
								className="mb-1 text-sm font-semibold"
								style={{ color: "#008F8C" }}
							>
								Análisis financiero
							</p>

							<h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
								Evolución
							</h1>

							<p className="mt-1 text-sm text-slate-500">
								Consulta cómo ha evolucionado tu balance durante el año.
							</p>
						</div>

						{/* SELECTOR AÑO */}
						<div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white p-1.5 shadow-sm">

							<div
								className="flex h-9 w-9 items-center justify-center rounded-xl"
								style={{
									backgroundColor: "#E8F6F3",
									color: "#006C7A",
								}}
							>
								<CalendarDays size={18} />
							</div>

							<select
								value={año}
								onChange={(e) =>
									setAño(Number(e.target.value))
								}
								className="cursor-pointer bg-transparent px-3 py-2 text-sm font-bold text-slate-700 outline-none"
							>
								{Array.from({ length: 11 }).map((_, i) => {
									const year = 2023 + i;

									return (
										<option key={year} value={year}>
											{year}
										</option>
									);
								})}
							</select>

						</div>
					</div>
				</section>

				{/* ========================================================== */}
				{/* RESUMEN                                                    */}
				{/* ========================================================== */}

				<section className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">

					{/* BALANCE ACTUAL */}
					<div
						className="relative overflow-hidden rounded-3xl p-6 text-white shadow-sm"
						style={{
							background:
								"linear-gradient(135deg, #006C7A 0%, #008F8C 55%, #00A6A6 100%)",
						}}
					>
						<div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10" />

						<div className="relative">
							<div className="mb-5 flex items-center justify-between">
								<span className="text-sm font-medium text-white/80">
									Último balance
								</span>

								<div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/15">
									<TrendingUp size={19} />
								</div>
							</div>

							<p className="text-3xl font-bold tracking-tight">
								{ultimoRegistro
									? formatMoney(ultimoRegistro.total)
									: "—"}
							</p>

							<p className="mt-2 text-sm text-white/70">
								{ultimoRegistro?.etiqueta || `Sin datos en ${año}`}
							</p>
						</div>
					</div>

					{/* VARIACIÓN */}
					<div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

						<div className="mb-5 flex items-center justify-between">
							<span className="text-sm font-medium text-slate-500">
								Variación anual
							</span>

							<div
								className="flex h-10 w-10 items-center justify-center rounded-2xl"
								style={{
									backgroundColor:
										variacionAnual !== null &&
											variacionAnual < 0
											? "#FFF1F2"
											: "#ECFDF5",
									color:
										variacionAnual !== null &&
											variacionAnual < 0
											? "#F43F5E"
											: "#059669",
								}}
							>
								{variacionAnual === null ? (
									<Minus size={19} />
								) : variacionAnual >= 0 ? (
									<ArrowUpRight size={19} />
								) : (
									<ArrowDownRight size={19} />
								)}
							</div>
						</div>

						<p className="text-3xl font-bold tracking-tight text-slate-900">
							{variacionAnual !== null
								? `${variacionAnual >= 0 ? "+" : ""}${variacionAnual.toFixed(1)}%`
								: "—"}
						</p>

						<p className="mt-2 text-sm text-slate-400">
							Primer mes vs. último mes
						</p>
					</div>

					{/* MEJOR MES */}
					<div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

						<div className="mb-5 flex items-center justify-between">
							<span className="text-sm font-medium text-slate-500">
								Mejor balance
							</span>

							<div
								className="flex h-10 w-10 items-center justify-center rounded-2xl"
								style={{
									backgroundColor: "#E8F6F3",
									color: "#006C7A",
								}}
							>
								<BarChart3 size={19} />
							</div>
						</div>

						<p className="text-3xl font-bold tracking-tight text-slate-900">
							{mejorRegistro
								? formatMoney(mejorRegistro.total)
								: "—"}
						</p>

						<p className="mt-2 text-sm text-slate-400">
							{mejorRegistro?.etiqueta || "Sin datos"}
						</p>
					</div>

				</section>

				{/* ========================================================== */}
				{/* GRÁFICA + TABLA                                            */}
				{/* ========================================================== */}

				<section className="grid grid-cols-1 gap-6 xl:grid-cols-[1.35fr_1fr]">

					{/* GRÁFICA */}
					<div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">

						<div className="mb-6">
							<p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
								Balance
							</p>

							<h2 className="mt-1 text-lg font-bold text-slate-900">
								Evolución durante {año}
							</h2>
						</div>

						{data.length > 0 ? (
							<div className="h-[360px] w-full">
								<ResponsiveContainer width="100%" height="100%">
									<LineChart
										data={data}
										margin={{
											top: 10,
											right: 15,
											bottom: 10,
											left: 0,
										}}
									>
										<CartesianGrid
											strokeDasharray="4 4"
											stroke="#E2E8F0"
											vertical={false}
										/>

										<XAxis
											dataKey="etiqueta"
											axisLine={false}
											tickLine={false}
											tick={{
												fill: "#94A3B8",
												fontSize: 12,
											}}
											dy={10}
										/>

										<YAxis
											axisLine={false}
											tickLine={false}
											tick={{
												fill: "#94A3B8",
												fontSize: 12,
											}}
											width={65}
											tickFormatter={(value) =>
												`${value}€`
											}
										/>

										<Tooltip
											content={<CustomTooltip />}
											cursor={{
												stroke: "#CBD5E1",
												strokeDasharray: "4 4",
											}}
										/>

										<Line
											type="monotone"
											dataKey="total"
											stroke="#008F8C"
											strokeWidth={3}
											dot={{
												r: 5,
												fill: "#FFFFFF",
												stroke: "#008F8C",
												strokeWidth: 3,
											}}
											activeDot={{
												r: 7,
												fill: "#006C7A",
												stroke: "#FFFFFF",
												strokeWidth: 3,
											}}
										/>
									</LineChart>
								</ResponsiveContainer>
							</div>
						) : (
							<div className="flex h-[360px] flex-col items-center justify-center text-center">

								<div
									className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl"
									style={{
										backgroundColor: "#E8F6F3",
										color: "#006C7A",
									}}
								>
									<BarChart3 size={24} />
								</div>

								<p className="font-semibold text-slate-700">
									Sin datos todavía
								</p>

								<p className="mt-1 max-w-xs text-sm text-slate-400">
									Los balances mensuales aparecerán aquí cuando estén disponibles.
								</p>

							</div>
						)}

					</div>

					{/* TABLA */}
					<div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

						<div className="border-b border-slate-100 px-5 py-5 sm:px-6">
							<p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
								Detalle
							</p>

							<h2 className="mt-1 text-lg font-bold text-slate-900">
								Totales mensuales
							</h2>
						</div>

						<div className="overflow-x-auto">

							<table className="w-full min-w-[500px] text-left">

								<thead>
									<tr className="border-b border-slate-100 bg-slate-50/70">
										<th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
											Mes
										</th>

										<th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
											Balance
										</th>

										<th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-400">
											Variación
										</th>
									</tr>
								</thead>

								<tbody>
									{data.map((registro, index) => {

										const anterior =
											index > 0
												? data[index - 1].total
												: null;

										let porcentaje: number | null = null;
										let infinito = false;

										if (anterior !== null) {
											if (anterior === 0) {
												if (registro.total !== 0) {
													infinito = true;
												} else {
													porcentaje = 0;
												}
											} else {
												porcentaje =
													((registro.total - anterior) /
														Math.abs(anterior)) *
													100;
											}
										}

										const positivo =
											infinito ||
											(porcentaje !== null &&
												porcentaje > 0);

										const negativo =
											porcentaje !== null &&
											porcentaje < 0;

										return (
											<tr
												key={registro.id}
												className="border-b border-slate-100 last:border-0 transition hover:bg-slate-50/70"
											>
												{/* MES */}
												<td className="px-6 py-4">
													<p className="text-sm font-semibold text-slate-700">
														{registro.etiqueta}
													</p>
												</td>

												{/* BALANCE EDITABLE */}
												<td className="px-4 py-3">
													<div className="relative w-32">

														<input
															type="number"
															inputMode="decimal"
															defaultValue={registro.total}
															onBlur={(e) =>
																updateValue(
																	registro.id,
																	Number(e.target.value)
																)
															}
															className="
																w-full rounded-xl
																border border-slate-200
																bg-white
																px-3 py-2 pr-7
																text-sm font-semibold
																text-slate-700
																outline-none
																transition
																focus:border-[#008F8C]
																focus:ring-2
																focus:ring-[#008F8C]/10
															"
														/>

														<span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">
															€
														</span>

													</div>
												</td>

												{/* VARIACIÓN */}
												<td className="px-6 py-4 text-right">

													{anterior === null ? (
														<span className="text-sm text-slate-400">
															—
														</span>
													) : (
														<span
															className={`
																inline-flex items-center gap-1
																rounded-full px-2.5 py-1
																text-xs font-bold
																${positivo
																	? "bg-emerald-50 text-emerald-600"
																	: negativo
																		? "bg-rose-50 text-rose-500"
																		: "bg-slate-100 text-slate-500"
																}
															`}
														>
															{positivo && (
																<ArrowUpRight size={13} />
															)}

															{negativo && (
																<ArrowDownRight size={13} />
															)}

															{infinito
																? "∞%"
																: porcentaje !== null
																	? `${porcentaje > 0 ? "+" : ""}${porcentaje.toFixed(1)}%`
																	: "—"}
														</span>
													)}

												</td>
											</tr>
										);
									})}

								</tbody>

							</table>

						</div>

						{data.length === 0 && (
							<div className="px-6 py-12 text-center">
								<p className="text-sm text-slate-400">
									No hay balances registrados para {año}.
								</p>
							</div>
						)}

					</div>

				</section>

			</div>
		</main>
	);
}