import { Link } from "react-router-dom";
import type { Movimiento } from "../../types/Movimiento";

export default function IngresosBox({ ingresos }: { ingresos: Movimiento[] }) {
	const total = ingresos.reduce((a, m) => a + m.cantidad, 0);

	return (
		<div className="bg-white/80 p-4 rounded-xl shadow">

			<h2 className="font-bold text-lg text-[#006C7A]">INGRESOS</h2>

			<div className="h-48 overflow-auto border rounded p-2 bg-white mt-3 text-sm">
				{ingresos.map((m) => (
					<Link
						to={`/edit/${m.id}`}
						key={m.id}
						className="flex justify-between py-2 border-b hover:bg-gray-100"
					>
						<span className="truncate w-3/4">{m.concepto}</span>
						<span className="text-green-600">{m.cantidad.toFixed(2)}€</span>
					</Link>
				))}
			</div>

			<div className="flex justify-between mt-3 font-semibold">
				<span>TOTAL INGRESOS:</span>
				<span className="text-green-600">{total.toFixed(2)}€</span>
			</div>
		</div>
	);
}
