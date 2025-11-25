import { useState } from "react";
import HeaderMobile from "./HeaderMobile";
import HeaderDesktop from "./HeaderDesktop";
import { useAuth } from "../../hooks/useAuth";
import { useFecha } from "../../context/FechaContext";

interface Props {
	onShowFav: () => void;
}

export default function Header({ onShowFav }: Props) {
	const { perfil } = useAuth(); // 👈 YA VIENE DE Supabase
	const { mes, año, setMes, setAño } = useFecha();

	const [menuOpen, setMenuOpen] = useState(false);

	return (
		<header className="w-full">
			<HeaderMobile
				perfil={perfil} // 👈 Perfil
				menuOpen={menuOpen}
				setMenuOpen={setMenuOpen}
				guardarPorcentajes={() => { }}
				onShowFav={onShowFav}
				mes={mes}
				año={año}
				onMesChange={setMes}
				onAñoChange={setAño}
			/>

			<HeaderDesktop
				perfil={perfil}
				guardarPorcentajes={() => { }}
				onShowFav={onShowFav}
				mes={mes}
				año={año}
				onMesChange={setMes}
				onAñoChange={setAño}
			/>

		</header>
	);
}
