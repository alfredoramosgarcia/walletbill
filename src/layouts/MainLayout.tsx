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
		<div
			className="min-h-screen text-slate-900"
			style={{
				background:
					"linear-gradient(135deg, #E7F4F2 0%, #F2F9F8 50%, #E4F2F0 100%)",
			}}
		>
			{/* ALERTA GLOBAL */}
			{alertMsg && (
				<div className="fixed left-1/2 top-5 z-[9999] w-[calc(100%-2rem)] max-w-md -translate-x-1/2 animate-fadeIn">
					<div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white/95 px-5 py-4 text-sm font-medium text-slate-700 shadow-xl backdrop-blur-xl">
						<div className="h-2.5 w-2.5 shrink-0 rounded-full bg-teal-500" />
						{alertMsg}
					</div>
				</div>
			)}

			{/* NAVEGACIÓN GLOBAL */}
			<div
				className="sticky top-0 z-40 border-b border-[#CFE5E1]"
				style={{
					background:
						"linear-gradient(135deg, #E3F2EF 0%, #F1F8F7 45%, #E5F3F1 100%)",
				}}
			>
				<Header
					onShowFav={() => setShowFavModal(true)}
					onLimpiarMes={() => setConfirmOpen(true)}
				/>
			</div>

			{/* CONTENIDO */}
			<div className="relative">
				<Outlet />
			</div>

			{/* FAVORITOS */}
			{showFavModal && (
				<FavoritosModal
					favoritos={favoritos}
					onClose={() => setShowFavModal(false)}
					onImportOne={importarUno}
					onImportAll={importarTodos}
				/>
			)}

			{/* CONFIRMACIÓN */}
			<ConfirmModal
				show={confirmOpen}
				message={`¿Seguro que quieres borrar TODOS los movimientos del mes ${mes}/${año}?`}
				onConfirm={confirmarLimpiarMes}
				onCancel={() => setConfirmOpen(false)}
			/>
		</div>
	);
}
