// src/components/dashboard/DynamicCategoryBox.tsx
import { Link } from "react-router-dom";
import { formatCategoryTitle } from "../../utils/formatCategoryTitle";

interface Props {
	categoria: string;      // nombre visible
	categoriaId: string;    // UUID real (no se usa dentro, pero TS lo exige)
	movs: any[];
	tipo: "gasto" | "ingreso";
	totalIngresos: number;
}

export default function DynamicCategoryBox({
	categoria,
	movs,
	tipo
}: Props) {

	const total = movs.reduce((a, m) => a + m.cantidad, 0);

	return (
		<div className="bg-white/80 backdrop-blur-sm shadow p-4 rounded-xl">

			{/* TÍTULO */}
			<div className="font-bold text-lg text-[#006C7A] uppercase">
				{formatCategoryTitle(categoria)}
			</div>

			{/* MOVIMIENTOS */}
			<div className="h-48 overflow-auto border rounded p-2 bg-white mt-3 text-sm">
				{movs.map((m) => (
					<Link
						to={`/edit/${m.id}`}
						key={m.id}
						className="flex justify-between py-2 border-b hover:bg-gray-100"
					>
						<span>{m.concepto}</span>
						<span className={tipo === "gasto" ? "text-red-600" : "text-green-600"}>
							{m.cantidad.toFixed(2)}€
						</span>
					</Link>
				))}
			</div>

			{/* INFO FINAL */}
			<div className="mt-3 text-sm font-semibold space-y-1 text-gray-800">

				{tipo === "gasto" ? (
					<div className="flex justify-between">
						<span>TOTAL GASTADO:</span>
						<span className="text-red-600">
							{Math.abs(total).toFixed(2)}€
						</span>
					</div>
				) : (
					<div className="flex justify-between">
						<span>TOTAL INGRESOS:</span>
						<span className="text-green-600">
							{Math.abs(total).toFixed(2)}€
						</span>
					</div>
				)}

			</div>

		</div>
	);
}
