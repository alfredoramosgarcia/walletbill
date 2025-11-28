// src/pages/Dashboard/Dashboard.tsx
import { useState } from "react";

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

	const { mes, año } = useFecha();
	const { user } = useAuth();

	const { refreshKey, refreshMovimientos } = useMovimientosRefresh();

	// ALERTAS
	const [alertMsg, setAlertMsg] = useState("");
	const [alertType, setAlertType] = useState<"success" | "error">("success");

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

	/* ----------------------------- IMPORTAR FAVORITO (UNO) ----------------------------- */

	async function onImportOne(fav: Favorito): Promise<void> {
		if (!user) return;

		const { error } = await supabase.from("movimientos").insert({
			user_id: user.id,
			tipo: fav.tipo,
			categoria: fav.categoria,
			concepto: fav.concepto,
			cantidad: fav.cantidad,
			mes: mes.toString(),
			año
		});

		if (error) {
			setAlertType("error");
			setAlertMsg("Error importando el movimiento.");
			return;
		}

		refreshMovimientos();
		setShowFavModal(false);

		setAlertType("success");
		setAlertMsg("Movimiento importado.");
	}

	/* ----------------------------- IMPORTAR TODOS ----------------------------- */

	async function onImportAll(): Promise<void> {
		if (!user) return;

		try {
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
			setShowFavModal(false);

			setAlertType("success");
			setAlertMsg("Favoritos importados.");

		} catch (err) {
			setAlertType("error");
			setAlertMsg("Error importando favoritos.");
		}
	}

	/* ----------------------------- RENDER UI ----------------------------- */

	return (
		<div className="min-h-screen bg-[#D9ECEA] p-4 md:p-6">

			{/* ALERTA SUPERIOR */}
			<Alert
				message={alertMsg}
				type={alertType}
				onClose={() => setAlertMsg("")}
			/>

			{/* ============================ GASTOS ============================ */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
				{gastos.map((c) => (
					<DynamicCategoryBox
						key={`${c.id}-${refreshKey}`}
						categoria={c.nombre}
						categoriaId={c.id}
						movs={movs.filter((m) => m.categoria === c.id)}
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
						categoriaId={c.id}
						movs={movs.filter((m) => m.categoria === c.id)}
						tipo="ingreso"
						totalIngresos={totalIngresos}
					/>
				))}
			</div>

			<TotalesMes totalMes={totalMes} />

			{/* FAVORITOS MODAL */}
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
