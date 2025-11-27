import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../hooks/useAuth";
import { useMovimientos } from "../../hooks/useMovimientos";
import { useFavoritos } from "../../hooks/useFavoritos";
import { useCategorias } from "../../hooks/useCategorias";

import { useFecha } from "../../context/FechaContext";
import { useMovimientosRefresh } from "../../context/MovimientoContext";


import DynamicCategoryBox from "../../components/dashboard/DynamicCategoryBox";
import TotalesMes from "../../components/dashboard/TotalesMes";
import Alert from "../../components/alerts/Alert";
import FavoritosModal from "../../components/favoritos/FavoritosModal";
import { supabase } from "../../supabase/client";

import type { Favorito } from "../../types/Favorito";

export default function Dashboard() {
	const navigate = useNavigate();

	const { mes, año, } = useFecha();
	const { user } = useAuth();

	const { refreshKey, refreshMovimientos } = useMovimientosRefresh();

	const [alertMsg, setAlertMsg] = useState("");
	const [showFavModal, setShowFavModal] = useState(false);

	/* ----------------------------- MOVIMIENTOS ----------------------------- */
	const { movs } = useMovimientos(mes, año, refreshKey);

	/* ----------------------------- CATEGORÍAS ----------------------------- */
	const { categorias } = useCategorias();
	const gastos = categorias.filter((c) => c.tipo === "gasto");
	const ingresos = categorias.filter((c) => c.tipo === "ingreso");

	/* ----------------------------- FAVORITOS ----------------------------- */
	const { favoritos } = useFavoritos();

	/* ----------------------------- TOTALES MES ----------------------------- */
	const totalIngresos = movs
		.filter((m) => m.tipo === "ingreso")
		.reduce((a, m) => a + m.cantidad, 0);

	const totalGastos = movs
		.filter((m) => m.tipo === "gasto")
		.reduce((a, m) => a + m.cantidad, 0);

	const totalMes = totalIngresos - Math.abs(totalGastos);

	/* ----------------------------- FAVORITOS ----------------------------- */

	async function onImportOne(fav: Favorito): Promise<void> {
		if (!user) return;

		await supabase.from("movimientos").insert({
			user_id: user.id,
			tipo: fav.tipo,
			categoria: fav.categoria,
			concepto: fav.concepto,
			cantidad: fav.cantidad,
			mes: mes.toString(),
			año
		});

		refreshMovimientos();
		navigate("/");
		setAlertMsg("Movimiento importado.");
		setShowFavModal(false);
	}

	async function onImportAll(): Promise<void> {
		if (!user) return;

		for (const fav of favoritos) {
			await supabase.from("movimientos").insert({
				user_id: user.id,
				tipo: fav.tipo,
				categoria: fav.categoria,
				concepto: fav.concepto,
				cantidad: fav.cantidad,
				mes: mes.toString(),
				año
			});
		}

		refreshMovimientos();
		navigate("/");
		setAlertMsg("Favoritos importados.");
		setShowFavModal(false);
	}


	/* ----------------------------- RENDER UI ----------------------------- */

	return (
		<div className="min-h-screen bg-[#D9ECEA] p-4 md:p-6">

			<Alert message={alertMsg} onClose={() => setAlertMsg("")} />

			{/* ============================ GASTOS ============================ */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
				{gastos.map((c) => (
					<DynamicCategoryBox
						key={`${c.id}-${refreshKey}`}
						categoria={c.nombre}
						movs={movs.filter((m) => m.categoria === c.nombre)}
						tipo="gasto"
						totalIngresos={totalIngresos}
					/>
				))}
			</div>

			{/* ============================ INGRESOS ============================ */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
				{ingresos.map((c) => (
					<DynamicCategoryBox
						key={`${c.id}-${refreshKey}`}
						categoria={c.nombre}
						movs={movs.filter((m) => m.categoria === c.nombre)}
						tipo="ingreso"
						totalIngresos={totalIngresos}
					/>
				))}
			</div>


			<TotalesMes totalMes={totalMes} />

			{/* FAVORITOS */}
			{showFavModal && (
				<FavoritosModal
					favoritos={favoritos}
					onClose={() => setShowFavModal(false)}
					onImportOne={onImportOne}
					onImportAll={onImportAll}
				/>
			)}
		</div>
	);
}
