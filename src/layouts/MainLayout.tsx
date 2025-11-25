import { useState } from "react";
import Header from "../components/header/Header";
import { Outlet } from "react-router-dom";
import FavoritosModal from "../components/favoritos/FavoritosModal";
import { useFavoritos } from "../hooks/useFavoritos";

export default function MainLayout() {
	const [showFavModal, setShowFavModal] = useState(false);
	const { favoritos } = useFavoritos();

	return (
		<div className="min-h-screen bg-[#D9ECEA]">

			{/* 🔥 PASAMOS LA FUNCIÓN AL HEADER */}
			<Header onShowFav={() => setShowFavModal(true)} />

			<Outlet />

			{/* MODAL */}
			{showFavModal && (
				<FavoritosModal
					favoritos={favoritos}
					onClose={() => setShowFavModal(false)}
					onImportOne={() => { }}
					onImportAll={() => { }}
				/>
			)}
		</div>
	);
}
