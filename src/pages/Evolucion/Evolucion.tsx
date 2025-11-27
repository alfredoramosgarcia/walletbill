import { useEffect, useState } from "react";
import { supabase } from "../../supabase/client";
import { useAuth } from "../../hooks/useAuth";
import { useFecha } from "../../context/FechaContext";
import { HomeIcon } from "@heroicons/react/24/solid";
import { Link } from "react-router-dom";

import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	Tooltip,
	ResponsiveContainer,
	CartesianGrid
} from "recharts";

// Tooltip personalizado
function CustomTooltip({ active, payload, label }: any) {
	if (active && payload && payload.length) {
		return (
			<div
				className="bg-white shadow-lg border rounded-lg p-3"
				style={{ color: "#006C7A" }}
			>
				<p className="font-semibold">{label}</p>
				<p>
					Total: {payload[0].value} €
				</p>
			</div>
		);
	}
	return null;
}


export default function Evolucion() {
	const { user } = useAuth();
	const { año, setAño } = useFecha();

	const [data, setData] = useState<any[]>([]);

	const meses = [
		"Enero", "Febrero", "Marzo", "Abril",
		"Mayo", "Junio", "Julio", "Agosto",
		"Septiembre", "Octubre", "Noviembre", "Diciembre"
	];

	useEffect(() => {
		if (user) load();
	}, [user, año]);

	async function load() {
		const añoAnterior = año - 1;

		// 1) Cargar diciembre del año anterior
		const { data: diciembreAnterior } = await supabase
			.from("historicobalance")
			.select("*")
			.eq("user_id", user!.id)
			.eq("año", añoAnterior)
			.eq("mes", 12)
			.single();

		// 2) Cargar todos los meses del año actual
		const { data: mesesActual } = await supabase
			.from("historicobalance")
			.select("*")
			.eq("user_id", user!.id)
			.eq("año", año)
			.order("mes");

		// 3) Preparar estructura final
		const result: any[] = [];

		// Si diciembre del año anterior existe → añadirlo primero
		if (diciembreAnterior) {
			result.push({
				...diciembreAnterior,
				etiqueta: `Dic. ${año - 1}`
			});
		}

		// Después añadir todos los meses del año actual
		if (mesesActual) {
			result.push(
				...mesesActual.map((r) => ({
					...r,
					etiqueta: meses[r.mes - 1]
				}))
			);
		}

		setData(result);
	}


	async function updateValue(id: string, value: number) {
		await supabase
			.from("historicobalance")
			.update({ total: value })
			.eq("id", id);

		load();
	}

	return (
		<div className="p-6 bg-[#D9ECEA] min-h-screen">

			{/* ===== HEADER CUSTOM SIN LAYOUT ===== */}
			<div className="flex items-center justify-between mb-6">

				{/* ICONO HOME */}
				<Link
					to="/"
					className="p-2 rounded-lg bg-transparent hover:bg-[#0097A710] transition"
				>
					<HomeIcon className="w-7 h-7 text-[#006C7A]" />
				</Link>

				{/* ⭐ TÍTULO */}
				<h1 className="text-2xl md:text-3xl font-bold text-[#006C7A] text-center flex-1">
					📈 Evolución financiera
				</h1>

				{/* 🔽 SELECT AÑO */}
				<select
					value={año}
					onChange={(e) => setAño(Number(e.target.value))}
					className="border rounded-lg px-3 py-2 shadow bg-white text-[#006C7A] font-semibold ml-4"
				>
					{Array.from({ length: 10 }).map((_, i) => (
						<option key={i} value={2025 + i}>
							{2025 + i}
						</option>
					))}
				</select>

			</div>

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

				{/* ===================== GRÁFICA ===================== */}
				<div className="bg-white p-5 shadow-xl rounded-xl">
					<h2 className="text-xl font-semibold text-[#006C7A] mb-4">
						Evolución {año}
					</h2>

					<div className="h-80">
						<ResponsiveContainer width="100%" height="100%">
							<LineChart
								data={data}
								margin={{ top: 20, right: 20, bottom: 10, left: 0 }}
							>
								<CartesianGrid strokeDasharray="3 3" opacity={0.2} />
								<XAxis dataKey="etiqueta" tick={{ fill: "#006C7A" }} />
								<YAxis tick={{ fill: "#006C7A" }} />

								{/* Tooltip personalizado */}
								<Tooltip content={<CustomTooltip />} />

								<Line
									type="monotone"
									dataKey="total"
									stroke="#0097A7"
									strokeWidth={4}
									dot={{ r: 6, fill: "#006C7A" }}
									activeDot={{ r: 8 }}
								/>
							</LineChart>
						</ResponsiveContainer>

					</div>
				</div>

				{/* ===================== TABLA ===================== */}
				<div className="bg-white p-5 shadow-xl rounded-xl">

					<h2 className="text-xl font-semibold text-[#006C7A] mb-4">
						Totales del año
					</h2>

					{/* SCROLL SOLO EN MÓVIL */}
					<div className="overflow-x-auto">

						<table className="w-full text-left min-w-[380px]">

							<thead>
								<tr className="text-[#006C7A] font-semibold border-b">
									<th className="py-2 w-1/2">Mes</th>
									<th className="w-1/2">Total (€)</th>
								</tr>
							</thead>

							<tbody>
								{data.map(r => (
									<tr key={r.id} className="border-b">

										{/* Nombre del mes visible SIEMPRE */}
										<td className="py-3 font-semibold text-[#006C7A]">
											{r.etiqueta}
										</td>

										<td className="py-3">

											{/* INPUT PEQUEÑO Y RESPONSIVE */}
											<input
												type="number"
												inputMode="decimal"
												className="
													w-24 md:w-32
													bg-white
													text-[#006C7A]
													border border-gray-300
													rounded-lg
													px-2 py-1
													text-base
													focus:outline-none
													focus:ring-2
													focus:ring-[#0097A7]
													appearance-none
												"
												defaultValue={r.total}
												onBlur={(e) =>
													updateValue(r.id, Number(e.target.value))
												}
											/>
										</td>

									</tr>
								))}
							</tbody>

						</table>

					</div>

				</div>

			</div>

		</div>
	);
}
