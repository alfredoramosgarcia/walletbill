import { Link } from "react-router-dom";
import type { Movimiento } from "../../types/Movimiento";

interface Props {
	title: string;
	percent: number;
	movimientos: Movimiento[];
	total: number;
	limite: number;
	onPercentChange?: (value: number) => void;
}

export default function CategoryBox({
	title,
	percent,
	movimientos,
	total,
	limite,
	onPercentChange,
}: Props) {
	const sobrante = (limite - Math.abs(total)).toFixed(2);

	return (
		<div className="bg-white/80 backdrop-blur shadow p-4 rounded-xl">

			{/* Título + Porcentaje editable */}
			<div className="flex justify-between font-bold text-lg text-[#006C7A]">
				<span>{title}</span>

				{onPercentChange && (
					<div className="flex items-center gap-1">
						<input
							className="w-14 text-center border rounded px-1 bg-white text-black"
							type="number"
							value={percent}
							onChange={(e) => {
								const v = Math.min(100, Math.max(0, Number(e.target.value)));
								onPercentChange(v);
							}}
						/>
						<span>%</span>
					</div>
				)}
			</div>

			{/* Movimientos */}
			<div className="h-48 overflow-auto border rounded p-2 bg-white mt-3 text-sm">
				{movimientos.map((m) => (
					<Link
						to={`/edit/${m.id}`}
						key={m.id}
						className="flex justify-between py-2 border-b hover:bg-gray-100"
					>
						<span className="truncate w-3/4">{m.concepto}</span>
						<span className="text-red-600">{m.cantidad.toFixed(2)}€</span>
					</Link>
				))}
			</div>

			{/* Totales */}
			<div className="mt-3 text-sm font-semibold space-y-1">

				<div className="flex justify-between">
					<span>TOTAL GASTOS:</span>
					<span className="text-red-600">{Math.abs(total).toFixed(2)}€</span>
				</div>

				<div className="flex justify-between">
					<span>LÍMITE {percent}%:</span>
					<span>{limite.toFixed(2)}€</span>
				</div>

				<div className="flex justify-between">
					<span>SOBRANTE:</span>
					<span className={Number(sobrante) < 0 ? "text-red-600" : "text-green-600"}>
						{sobrante}€
					</span>
				</div>
			</div>
		</div>
	);
}
