// src/pages/Dashboard/Dashboard.tsx

import { ArrowDownRight, ArrowUpRight, Wallet } from "lucide-react";

import { useMovimientos } from "../../hooks/useMovimientos";
import { useCategorias } from "../../hooks/useCategorias";

import { useFecha } from "../../context/FechaContext";
import { useMovimientosRefresh } from "../../context/MovimientoContext";

import DynamicCategoryBox from "../../components/dashboard/DynamicCategoryBox";
import TotalesMes from "../../components/dashboard/TotalesMes";

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

export default function Dashboard() {
	const { mes, año } = useFecha();
	const { refreshKey } = useMovimientosRefresh();

	const { movs } = useMovimientos(mes, año, refreshKey);
	const { categorias } = useCategorias();

	const gastos = categorias.filter((c) => c.tipo === "gasto");
	const ingresos = categorias.filter((c) => c.tipo === "ingreso");

	const totalIngresos = movs
		.filter((m) => m.tipo === "ingreso")
		.reduce((acc, m) => acc + m.cantidad, 0);

	const totalGastos = movs
		.filter((m) => m.tipo === "gasto")
		.reduce((acc, m) => acc + Math.abs(m.cantidad), 0);

	const totalMes = totalIngresos - totalGastos;

	const porcentajeGastado =
		totalIngresos > 0
			? Math.min((totalGastos / totalIngresos) * 100, 100)
			: 0;

	return (
		<main className="min-h-screen">
			<div className="mx-auto w-full max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">

				{/* CABECERA */}
				<section className="mb-8">
					<p
						className="mb-1 text-sm font-semibold"
						style={{ color: "#008F8C" }}
					>
						Resumen financiero
					</p>

					<div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
						<div>
							<h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
								Tu economía
							</h1>

							<p className="mt-1 text-sm text-slate-500">
								{MESES[mes - 1]} {año}
							</p>
						</div>

						<p className="mt-2 text-sm text-slate-400 sm:mt-0">
							{movs.length} movimiento{movs.length !== 1 ? "s" : ""}
						</p>
					</div>
				</section>

				{/* KPIs */}
				<section className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">

					{/* BALANCE */}
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
									Balance
								</span>

								<div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/15">
									<span className="text-xl">€</span>
								</div>
							</div>

							<p className="text-3xl font-bold tracking-tight text-white">
								{formatMoney(totalMes)}
							</p>

							<p className="mt-2 text-sm text-white/70">
								Disponible este mes
							</p>
						</div>
					</div>

					{/* INGRESOS */}
					<div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
						<div className="mb-5 flex items-center justify-between">
							<span className="text-sm font-medium text-slate-500">
								Ingresos
							</span>

							<div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
								<ArrowUpRight size={19} />
							</div>
						</div>

						<p className="text-3xl font-bold tracking-tight text-slate-900">
							{formatMoney(totalIngresos)}
						</p>

						<p className="mt-2 text-sm text-slate-400">
							Total ingresado
						</p>
					</div>

					{/* GASTOS */}
					<div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
						<div className="mb-5 flex items-center justify-between">
							<span className="text-sm font-medium text-slate-500">
								Gastos
							</span>

							<div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-rose-50 text-rose-500">
								<ArrowDownRight size={19} />
							</div>
						</div>

						<p className="text-3xl font-bold tracking-tight text-slate-900">
							{formatMoney(totalGastos)}
						</p>

						<div className="mt-4">
							<div className="mb-2 flex items-center justify-between text-xs">
								<span className="text-slate-400">
									Respecto a tus ingresos
								</span>

								<span className="font-semibold text-slate-600">
									{porcentajeGastado.toFixed(0)}%
								</span>
							</div>

							<div className="h-2 overflow-hidden rounded-full bg-slate-100">
								<div
									className="h-full rounded-full transition-all duration-500"
									style={{
										width: `${porcentajeGastado}%`,
										backgroundColor: "#00A6A6",
									}}
								/>
							</div>
						</div>
					</div>
				</section>

				{/* GASTOS */}
				<section className="mb-10">
					<div className="mb-4 flex items-center justify-between">
						<div>
							<h2 className="text-lg font-bold text-slate-900">
								Gastos
							</h2>

							<p className="text-sm text-slate-500">
								Control por categorías
							</p>
						</div>

						<div className="rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-500">
							{gastos.length} categorías
						</div>
					</div>

					{gastos.length > 0 ? (
						<div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
							{gastos.map((c) => (
								<DynamicCategoryBox
									key={`${c.id}-${refreshKey}`}
									categoria={c.nombre}
									categoriaId={c.id}
									movs={movs.filter(
										(m) => m.categoria === c.id
									)}
									tipo="gasto"
									totalIngresos={totalIngresos}
								/>
							))}
						</div>
					) : (
						<EmptyState text="Todavía no tienes categorías de gasto." />
					)}
				</section>

				{/* INGRESOS */}
				<section className="mb-8">
					<div className="mb-4 flex items-center justify-between">
						<div>
							<h2 className="text-lg font-bold text-slate-900">
								Ingresos
							</h2>

							<p className="text-sm text-slate-500">
								Tus fuentes de ingresos
							</p>
						</div>

						<div className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600">
							{ingresos.length} categorías
						</div>
					</div>

					{ingresos.length > 0 ? (
						<div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
							{ingresos.map((c) => (
								<DynamicCategoryBox
									key={`${c.id}-${refreshKey}`}
									categoria={c.nombre}
									categoriaId={c.id}
									movs={movs.filter(
										(m) => m.categoria === c.id
									)}
									tipo="ingreso"
									totalIngresos={totalIngresos}
								/>
							))}
						</div>
					) : (
						<EmptyState text="Todavía no tienes categorías de ingreso." />
					)}
				</section>

				{/* Mantenemos tu componente */}
				<TotalesMes totalMes={totalMes} />

			</div>
		</main>
	);
}

function EmptyState({ text }: { text: string }) {
	return (
		<div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-10 text-center">
			<p className="text-sm text-slate-500">{text}</p>
		</div>
	);
}