import { useState } from "react";
import HeaderDesktop from "./HeaderDesktop";
import HeaderMobile from "./HeaderMobile";
import MesAnoSelector from "./MesAnoSelector";
import { usePerfil } from "../../hooks/usePerfil";
import { useDashboardHeaderActions } from "../../hooks/useDashboardHeaderActions";

import { useFecha } from "../../context/FechaContext";

export default function Header() {
	const { mes, setMes, año, setAño } = useFecha();

	const { perfil } = usePerfil();
	const { guardarPorcentajes, abrirFavoritosModal } = useDashboardHeaderActions();


	// menú mobile
	const [menuOpen, setMenuOpen] = useState(false);

	return (
		<header className="w-full py-4 px-4 md:px-6 relative">

			{/* DESKTOP */}
			<div className="hidden md:flex items-center justify-between relative">

				{/* MENÚ (IZQUIERDA) */}
				<HeaderDesktop
					perfil={perfil}
					guardarPorcentajes={guardarPorcentajes}
					onShowFav={abrirFavoritosModal}
				/>

				{/* SELECTOR CENTRADO */}
				<div className="absolute left-1/2 -translate-x-1/2">
					<MesAnoSelector
						mes={mes}
						año={año}
						onMesChange={setMes}
						onAñoChange={setAño}
					/>
				</div>

			</div>

			{/* MOBILE */}
			<HeaderMobile
				perfil={perfil}
				menuOpen={menuOpen}
				setMenuOpen={setMenuOpen}
				guardarPorcentajes={guardarPorcentajes}
				onShowFav={abrirFavoritosModal}
				mes={mes}
				año={año}
				onMesChange={setMes}
				onAñoChange={setAño}
			/>
		</header>
	);
}
