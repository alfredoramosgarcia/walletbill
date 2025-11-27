import { useState } from "react";
import { supabase } from "../../supabase/client";

import { useAuth } from "../../hooks/useAuth";
import { useMovimientos } from "../../hooks/useMovimientos";
import { useFavoritos } from "../../hooks/useFavoritos";
import { useCategorias } from "../../hooks/useCategorias";
import { usePorcentajesDB } from "../../hooks/usePorcentajesDB";
import { useFecha } from "../../context/FechaContext";
import { useMovimientosRefresh } from "../../context/MovimientoContext";

import { limpiarMes as limpiarMesDB } from "../../utils/limpiarMes";

import DynamicCategoryBox from "../../components/dashboard/DynamicCategoryBox";
import TotalesMes from "../../components/dashboard/TotalesMes";
import Alert from "../../components/alerts/Alert";
import FavoritosModal from "../../components/favoritos/FavoritosModal";

import type { Favorito } from "../../types/Favorito";

export default function Dashboard() {
	/* ----------------------------- CONTEXTOS ----------------------------- */
	const { mes, año } = useFecha();
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

	/* ----------------------------- PORCENTAJES ----------------------------- */
	const {
		porcentajes,
		updatePercent,
		loading
	} = usePorcentajesDB(
		user?.id ?? null,
		gastos.map((g) => ({ id: g.id, nombre: g.nombre })),
		mes,
		año
	);

	/* ----------------------------- TOTALES MES ----------------------------- */
	const totalIngresos = movs
		.filter((m) => m.tipo === "ingreso")
		.reduce((a, m) => a + m.cantidad, 0);

	const totalGastos = movs
		.filter((m) => m.tipo === "gasto")
		.reduce((a, m) => a + m.cantidad, 0);

	const totalMes = totalIngresos - Math.abs(totalGastos);

	/* =====================================================================
		 FAVORITOS — IMPORTAR UNO
	===================================================================== */
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
		setShowFavModal(false);
		setAlertMsg("Movimiento importado.");
	}

	/* =====================================================================
		 FAVORITOS — IMPORTAR TODOS
	===================================================================== */
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
		setShowFavModal(false);
		setAlertMsg("Todos los favoritos fueron importados.");
	}

	/* =====================================================================
		 LIMPIAR MES
	===================================================================== */
	async function onLimpiarMes(): Promise<void> {
		if (!user) return;

		await limpiarMesDB(mes, año, user.id);

		refreshMovimientos();
		setAlertMsg("Mes limpiado correctamente.");
	}

	/* ----------------------------- RENDER UI ----------------------------- */

	return (
		<div className="min-h-screen bg-[#D9ECEA] p-4 md:p-6">

			{/* ALERTA */}
			<Alert message={alertMsg} onClose={() => setAlertMsg("")} />

			{loading && (
				<div className="text-center font-semibold text-gray-600">
					Cargando porcentajes...
				</div>
			)}

			{/* ============================ GASTOS ============================ */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
				{gastos.map((c) => (
					<DynamicCategoryBox
						key={`${refreshKey}-gasto-${c.id}`}
						categoria={c.nombre}
						movs={movs.filter((m) => m.categoria === c.nombre)}
						tipo="gasto"
						percent={porcentajes[c.id] ?? 0}
						onPercentChange={(v: number) => updatePercent(c.id, v)}
						totalIngresos={totalIngresos}
					/>

				))}
			</div>

			{/* ============================ INGRESOS ============================ */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
				{ingresos.map((c) => (
					<DynamicCategoryBox
						key={`${refreshKey}-ingreso-${c.id}`}
						categoria={c.nombre}
						movs={movs.filter((m) => m.categoria === c.nombre)}
						tipo="ingreso"
						percent={0}
						onPercentChange={() => { }}
						totalIngresos={totalIngresos}
					/>

				))}
			</div>

			<TotalesMes totalMes={totalMes} />

			{/* ========================== FAVORITOS MODAL ========================== */}
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
