import { useState } from "react";

// Hooks
import { useMovimientos } from "../../hooks/useMovimientos";
import { useFavoritos } from "../../hooks/useFavoritos";
import { usePorcentajes } from "../../hooks/usePorcentajes";

// Components
import Alert from "../../components/alerts/Alert";
import FavoritosModal from "../../components/favoritos/FavoritosModal";

import CategoryBox from "../../components/dashboard/CategoryBox";
import IngresosBox from "../../components/dashboard/IngresosBox";
import TotalesMes from "../../components/dashboard/TotalesMes";

import { supabase } from "../../supabase/client";
import type { Favorito } from "../../types/Favorito";
import { useFecha } from "../../context/FechaContext";




export default function Dashboard() {
	// ===============================
	// ESTADOS
	// ===============================
	const { mes, año } = useFecha();
	const [alertMsg, setAlertMsg] = useState("");
	const [showFavModal, setShowFavModal] = useState(false);
	const { movs, cargarMovimientos } = useMovimientos(mes, año);
	const { favoritos } = useFavoritos();
	const {
		pEsenciales,
		pAhorro,
		pEstilo,
		setPEsenciales,
		setPAhorro,
		setPEstilo
	} = usePorcentajes();

	// ===============================
	// IMPORTAR FAVORITOS
	// ===============================
	async function importarFavorito(fav: Favorito) {
		const user = (await supabase.auth.getUser()).data.user;
		if (!user) return;

		const { data: existe } = await supabase
			.from("movimientos")
			.select("*")
			.match({
				user_id: user.id,
				tipo: fav.tipo,
				categoria: fav.categoria,
				concepto: fav.concepto,
				cantidad: fav.cantidad,
				mes: mes.toString(),
				año,
			});

		if (existe && existe.length > 0) {
			setAlertMsg("Ese favorito ya existe este mes ✔️");
			return;
		}

		await supabase.from("movimientos").insert({
			user_id: user.id,
			tipo: fav.tipo,
			categoria: fav.categoria,
			concepto: fav.concepto,
			cantidad: fav.cantidad,
			mes: mes.toString(),
			año,
		});

		setAlertMsg("Movimiento importado ⭐");
		setShowFavModal(false);
		cargarMovimientos();
	}

	async function importarTodosFavoritos() {
		const user = (await supabase.auth.getUser()).data.user;
		if (!user) return;

		for (const fav of favoritos) {
			const { data: existe } = await supabase
				.from("movimientos")
				.select("*")
				.match({
					user_id: user.id,
					tipo: fav.tipo,
					categoria: fav.categoria,
					concepto: fav.concepto,
					cantidad: fav.cantidad,
					mes: mes.toString(),
					año,
				});

			if (!existe || existe.length === 0) {
				await supabase.from("movimientos").insert({
					user_id: user.id,
					tipo: fav.tipo,
					categoria: fav.categoria,
					concepto: fav.concepto,
					cantidad: fav.cantidad,
					mes: mes.toString(),
					año,
				});
			}
		}

		setAlertMsg("Favoritos importados ✔️");
		setShowFavModal(false);
		cargarMovimientos();
	}

	// ===============================
	// CÁLCULOS
	// ===============================
	const ingresos = movs.filter((m) => m.tipo === "ingreso");

	const esenciales = movs.filter((m) => m.categoria === "esenciales");
	const ahorro = movs.filter((m) => m.categoria === "ahorro");
	const estilo = movs.filter((m) => m.categoria === "estiloVida");
	const extra = movs.filter((m) => m.categoria === "extraordinarios");

	const totalIngresos = ingresos.reduce((a, m) => a + m.cantidad, 0);

	const totalES = esenciales.reduce((a, m) => a + m.cantidad, 0);
	const totalAH = ahorro.reduce((a, m) => a + m.cantidad, 0);
	const totalEST = estilo.reduce((a, m) => a + m.cantidad, 0);
	const totalEXTRA = extra.reduce((a, m) => a + m.cantidad, 0);

	const totalGastos =
		Math.abs(totalES) +
		Math.abs(totalAH) +
		Math.abs(totalEST) +
		Math.abs(totalEXTRA);

	const totalMes = totalIngresos - totalGastos;

	// Límites
	const limiteEs = (totalIngresos * pEsenciales) / 100;
	const limiteAh = (totalIngresos * pAhorro) / 100;
	const limiteEst = (totalIngresos * pEstilo) / 100;

	// ===============================
	// UI
	// ===============================
	return (
		<div className="min-h-screen bg-[#D9ECEA] p-4 md:p-6">

			<Alert message={alertMsg} onClose={() => setAlertMsg("")} />


			{/* GRID PRINCIPAL */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">

				<CategoryBox
					title="GASTOS ESENCIALES"
					percent={pEsenciales}
					movimientos={esenciales}
					total={totalES}
					limite={limiteEs}
					onPercentChange={setPEsenciales}
				/>

				<CategoryBox
					title="AHORRO E INVERSIÓN"
					percent={pAhorro}
					movimientos={ahorro}
					total={totalAH}
					limite={limiteAh}
					onPercentChange={setPAhorro}
				/>

				<CategoryBox
					title="ESTILO DE VIDA"
					percent={pEstilo}
					movimientos={estilo}
					total={totalEST}
					limite={limiteEst}
					onPercentChange={setPEstilo}
				/>

			</div>

			{/* EXTRAORDINARIOS + INGRESOS */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">

				<CategoryBox
					title="EXTRAORDINARIOS"
					percent={0}
					movimientos={extra}
					total={totalEXTRA}
					limite={0}
				/>

				<IngresosBox ingresos={ingresos} />
			</div>

			{/* TOTAL MES */}
			<TotalesMes totalMes={totalMes} />

			{/* MODAL FAVORITOS */}
			{showFavModal && (
				<FavoritosModal
					favoritos={favoritos}
					onClose={() => setShowFavModal(false)}
					onImportOne={importarFavorito}
					onImportAll={importarTodosFavoritos}
				/>
			)}
		</div>
	);
}
