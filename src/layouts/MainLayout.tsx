import { useState } from "react";
import { Outlet } from "react-router-dom";

import Header from "../components/header/Header";
import FavoritosModal from "../components/favoritos/FavoritosModal";
import ConfirmModal from "../components/modals/ConfirmModal";

import { useFavoritos } from "../hooks/useFavoritos";
import { useFecha } from "../context/FechaContext";
import { useMovimientosRefresh } from "../context/MovimientoContext";
import { useAuth } from "../hooks/useAuth";

import type { Favorito } from "../types/Favorito";
import { supabase } from "../supabase/client";
import { limpiarMes } from "../utils/limpiarMes";

export default function MainLayout() {
	const [alertMsg, setAlertMsg] = useState("");
	const [showFavModal, setShowFavModal] = useState(false);

	// Modal confirmación LIMPIAR MES
	const [confirmOpen, setConfirmOpen] = useState(false);

	const { favoritos } = useFavoritos();
	const { mes, año } = useFecha();
	const { user } = useAuth();

	const { refreshMovimientos } = useMovimientosRefresh();

	function showAlert(msg: string) {
		setAlertMsg(msg);
		setTimeout(() => setAlertMsg(""), 2000);
	}

	/* ---------------------------------------------------------------------- */
	/*                        FAVORITOS → IMPORTAR UNO                        */
	/* ---------------------------------------------------------------------- */
	async function favoritoYaExiste(fav: Favorito) {
		if (!user) return true;

		const { data } = await supabase
			.from("movimientos")
			.select("*")
			.eq("user_id", user.id)
			.eq("mes", mes.toString())
			.eq("año", año)
			.eq("categoria", fav.categoria)
			.eq("concepto", fav.concepto)
			.eq("tipo", fav.tipo)
			.eq("cantidad", fav.cantidad);

		return data && data.length > 0;
	}

	async function importarUno(fav: Favorito) {
		if (!user) return;

		if (await favoritoYaExiste(fav)) {
			showAlert(`❗ "${fav.concepto}" ya está importado`);
			setShowFavModal(false);
			return;
		}

		await supabase.from("movimientos").insert({
			user_id: user.id,
			categoria: fav.categoria,
			concepto: fav.concepto,
			tipo: fav.tipo,
			cantidad: fav.cantidad,
			mes: mes.toString(),
			año,
		});

		refreshMovimientos(); // 🔥 refresca Dashboard
		showAlert(`✔ "${fav.concepto}" importado`);
	}

	/* ---------------------------------------------------------------------- */
	/*                      FAVORITOS → IMPORTAR TODOS                        */
	/* ---------------------------------------------------------------------- */
	async function importarTodos() {
		if (!user) return;

		for (const fav of favoritos) {
			if (await favoritoYaExiste(fav)) {
				showAlert(`❗ "${fav.concepto}" ya estaba importado`);
				setShowFavModal(false);
				return;
			}
		}

		for (const fav of favoritos) {
			await supabase.from("movimientos").insert({
				user_id: user.id,
				categoria: fav.categoria,
				concepto: fav.concepto,
				tipo: fav.tipo,
				cantidad: fav.cantidad,
				mes: mes.toString(),
				año,
			});
		}

		refreshMovimientos(); // 🔥 actualiza Dashboard
		showAlert("✔ Todos los favoritos fueron importados");
		setShowFavModal(false);
	}

	/* ---------------------------------------------------------------------- */
	/*                              LIMPIAR MES                               */
	/* ---------------------------------------------------------------------- */
	async function confirmarLimpiarMes() {
		if (!user) return;

		setConfirmOpen(false);

		const { error } = await limpiarMes(mes, año, user.id);

		if (error) {
			showAlert("❌ Error al limpiar el mes");
		} else {
			showAlert("✔ Mes limpiado correctamente");
			refreshMovimientos(); // 🔥 forzamos recarga en Dashboard
		}
	}

	/* ---------------------------------------------------------------------- */
	/*                                RENDER                                   */
	/* ---------------------------------------------------------------------- */
	return (
		<div className="min-h-screen bg-[#D9ECEA]">

			{/* ALERTA GLOBAL */}
			{alertMsg && (
				<div className="fixed top-4 left-1/2 -translate-x-1/2 bg-[#006C7A] text-white px-6 py-3 rounded-xl shadow-lg z-[9999] animate-fadeIn">
					{alertMsg}
				</div>
			)}

			{/* HEADER */}
			<Header
				onShowFav={() => setShowFavModal(true)}
				onLimpiarMes={() => setConfirmOpen(true)}
			/>

			{/* PÁGINAS HIJAS */}
			<Outlet />

			{/* MODAL FAVORITOS */}
			{showFavModal && (
				<FavoritosModal
					favoritos={favoritos}
					onClose={() => setShowFavModal(false)}
					onImportOne={importarUno}
					onImportAll={importarTodos}
				/>
			)}

			{/* MODAL CONFIRMAR LIMPIAR MES */}
			<ConfirmModal
				show={confirmOpen}
				message={`¿Seguro que quieres borrar TODOS los movimientos del mes ${mes}/${año}?`}
				onConfirm={confirmarLimpiarMes}
				onCancel={() => setConfirmOpen(false)}
			/>
		</div>
	);
}
