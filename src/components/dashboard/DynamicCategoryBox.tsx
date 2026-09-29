// src/components/dashboard/DynamicCategoryBox.tsx

import { Link } from "react-router-dom";
import {
	ArrowDownRight,
	ArrowUpRight,
	ChevronRight,
	ReceiptText,
} from "lucide-react";

import { formatCategoryTitle } from "../../utils/formatCategoryTitle";

interface Props {
	categoria: string;
	categoriaId: string;
	movs: any[];
	tipo: "gasto" | "ingreso";
	totalIngresos: number;
}

function formatMoney(value: number) {
	return new Intl.NumberFormat("es-ES", {
		style: "currency",
		currency: "EUR",
	}).format(Math.abs(value));
}

export default function DynamicCategoryBox({
	categoria,
	movs,
	tipo,
	totalIngresos,
}: Props) {
	const total = movs.reduce(
		(acc, movimiento) => acc + Math.abs(movimiento.cantidad),
		0
	);

	const esGasto = tipo === "gasto";

	const porcentaje =
		esGasto && totalIngresos > 0
			? Math.min((total / totalIngresos) * 100, 100)
			: 0;

	return (
		<article className="group flex min-h-[330px] flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">

			{/* HEADER */}
			<div className="p-5 pb-4">

				<div className="flex items-start justify-between gap-4">

					<div className="flex min-w-0 items-center gap-3">
						<div
							className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${esGasto
								? "bg-rose-50 text-rose-500"
								: "bg-emerald-50 text-emerald-600"
								}`}
						>
							{esGasto ? (
								<ArrowDownRight size={20} />
							) : (
								<ArrowUpRight size={20} />
							)}
						</div>

						<div className="min-w-0">
							<p className="text-xs font-medium uppercase tracking-wider text-slate-400">
								{esGasto ? "Gasto" : "Ingreso"}
							</p>

							<h3 className="truncate text-base font-bold text-slate-900">
								{formatCategoryTitle(categoria)}
							</h3>
						</div>
					</div>

					<div className="shrink-0 text-right">
						<p
							className={`text-lg font-bold ${esGasto
								? "text-slate-900"
								: "text-emerald-600"
								}`}
						>
							{esGasto ? "−" : "+"}
							{formatMoney(total)}
						</p>

						<p className="mt-0.5 text-xs text-slate-400">
							{movs.length} movimiento
							{movs.length !== 1 ? "s" : ""}
						</p>
					</div>

				</div>

				{/* PORCENTAJE DE LOS INGRESOS */}
				{esGasto && totalIngresos > 0 && (
					<div className="mt-5">

						<div className="mb-2 flex items-center justify-between text-xs">
							<span className="text-slate-400">
								De tus ingresos
							</span>

							<span className="font-semibold text-slate-600">
								{porcentaje.toFixed(0)}%
							</span>
						</div>

						<div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
							<div
								className="h-full rounded-full bg-teal-500 transition-all duration-500"
								style={{
									width: `${porcentaje}%`,
								}}
							/>
						</div>

					</div>
				)}

			</div>

			{/* SEPARADOR */}
			<div className="mx-5 border-t border-slate-100" />

			{/* MOVIMIENTOS */}
			<div className="flex-1 px-3 py-2">

				{movs.length === 0 ? (

					<div className="flex h-full min-h-[150px] flex-col items-center justify-center px-4 text-center">

						<div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-50 text-slate-300">
							<ReceiptText size={18} />
						</div>

						<p className="text-sm font-medium text-slate-400">
							Sin movimientos
						</p>

						<p className="mt-1 text-xs text-slate-300">
							No hay movimientos este mes
						</p>

					</div>

				) : (

					<div className="max-h-[190px] overflow-y-auto pr-1">

						{movs.map((movimiento) => (

							<Link
								to={`/edit/${movimiento.id}`}
								key={movimiento.id}
								className="group/item flex items-center justify-between gap-3 rounded-2xl px-3 py-3 transition-colors hover:bg-slate-50"
							>

								<div className="flex min-w-0 items-center gap-3">

									<div
										className={`h-2 w-2 shrink-0 rounded-full ${esGasto
											? "bg-rose-400"
											: "bg-emerald-400"
											}`}
									/>

									<span className="truncate text-sm font-medium text-slate-700">
										{movimiento.concepto}
									</span>

								</div>

								<div className="flex shrink-0 items-center gap-1">

									<span
										className={`text-sm font-semibold ${esGasto
											? "text-rose-500"
											: "text-emerald-600"
											}`}
									>
										{esGasto ? "−" : "+"}
										{formatMoney(movimiento.cantidad)}
									</span>

									<ChevronRight
										size={15}
										className="text-slate-300 transition-transform group-hover/item:translate-x-0.5"
									/>

								</div>

							</Link>

						))}

					</div>

				)}

			</div>

			{/* FOOTER 
			<div className="border-t border-slate-100 bg-slate-50/50 px-5 py-3">

				<div className="flex items-center justify-between">

					<span className="text-xs font-medium text-slate-400">
						Total {esGasto ? "gastado" : "ingresado"}
					</span>

					<span
						className={`text-sm font-bold ${esGasto
								? "text-rose-500"
								: "text-emerald-600"
							}`}
					>
						{esGasto ? "−" : "+"}
						{formatMoney(total)}
					</span>

				</div>

			</div>*/}

		</article>
	);
}