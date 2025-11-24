import { Link } from "react-router-dom";

interface Props {
	categoria: string;
	movs: any[];
	tipo: "gasto" | "ingreso";
	percent: number;
	onPercentChange: (v: number) => void;
	totalIngresos: number;
}

export default function DynamicCategoryBox({
	categoria,
	movs,
	tipo,
	percent,
	onPercentChange,
	totalIngresos
}: Props) {
	const total = movs.reduce((a, m) => a + m.cantidad, 0);

	const limite = tipo === "gasto" ? (totalIngresos * percent) / 100 : 0;
	const sobrante = tipo === "gasto" ? (limite - Math.abs(total)) : 0;

	const pctUsado =
		totalIngresos > 0 && tipo === "gasto"
			? ((Math.abs(total) / totalIngresos) * 100).toFixed(2)
			: "0.00";

	return (
		<div className="bg-white/80 backdrop-blur-sm shadow p-4 rounded-xl">

			{/* TÍTULO */}
			<div className="flex justify-between items-center font-bold text-lg text-[#006C7A] uppercase">
				{categoria}

				{tipo === "gasto" && (
					<div className="flex items-center gap-1">
						<input
							type="number"
							className="w-14 text-center border rounded px-1 bg-white text-black"
							value={percent}
							onChange={(e) => {
								const n = Math.max(0, Math.min(100, Number(e.target.value)));
								onPercentChange(n);
							}}
						/>
						<span>%</span>
					</div>
				)}
			</div>

			{/* MOVIMIENTOS */}
			<div className="h-48 overflow-auto border rounded p-2 bg-white mt-3 text-sm">
				{movs.map((m) => (
					<Link
						to={`/edit/${m.id}`}
						key={m.id}
						className="flex justify-between py-2 border-b hover:bg-gray-100"
					>
						<span className="truncate w-3/4">{m.concepto}</span>
						<span className={tipo === "gasto" ? "text-red-600" : "text-green-600"}>
							{m.cantidad.toFixed(2)}€
						</span>
					</Link>
				))}
			</div>

			{/* INFO FINAL */}
			<div className="mt-3 text-sm font-semibold space-y-1">

				{tipo === "gasto" ? (
					<>
						<div className="flex justify-between">
							<span>TOTAL GASTADO:</span>
							<span className="text-red-600">{Math.abs(total).toFixed(2)}€</span>
						</div>

						<div className="flex justify-between">
							<span>LÍMITE {percent}%:</span>
							<span>{limite.toFixed(2)}€</span>
						</div>

						<div className="flex justify-between">
							<span>SOBRANTE:</span>
							<span className={sobrante < 0 ? "text-red-600" : "text-green-600"}>
								{sobrante.toFixed(2)}€
							</span>
						</div>

						<div className="flex justify-between">
							<span>USADO:</span>
							<span>{pctUsado}%</span>
						</div>
					</>
				) : (
					<div className="flex justify-between">
						<span>TOTAL INGRESOS:</span>
						<span className="text-green-600">{Math.abs(total).toFixed(2)}€</span>
					</div>
				)}
			</div>

		</div>
	);
}
