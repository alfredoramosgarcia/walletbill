import { useState } from "react";
import HeaderMobile from "./HeaderMobile";
import HeaderDesktop from "./HeaderDesktop";
import { useAuth } from "../../hooks/useAuth";
import { useFecha } from "../../context/FechaContext";

interface Props {
	onShowFav: () => void;
	onLimpiarMes: () => void;
}

export default function Header({ onShowFav, onLimpiarMes }: Props) {
	const { perfil } = useAuth();
	const { mes, año, setMes, setAño } = useFecha();

	const [menuOpen, setMenuOpen] = useState(false);

	return (
		<header className="w-full">
			<HeaderMobile
				perfil={perfil}
				menuOpen={menuOpen}
				setMenuOpen={setMenuOpen}
				guardarPorcentajes={() => { }}
				onShowFav={onShowFav}
				onLimpiarMes={onLimpiarMes}
				mes={mes}
				año={año}
				onMesChange={setMes}
				onAñoChange={setAño}
			/>

			<HeaderDesktop
				perfil={perfil}
				guardarPorcentajes={() => { }}
				onShowFav={onShowFav}
				onLimpiarMes={onLimpiarMes}
				mes={mes}
				año={año}
				onMesChange={setMes}
				onAñoChange={setAño}
			/>

		</header>
	);
}
