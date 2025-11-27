import { supabase } from "../../supabase/client";
import DesktopMenu from "./DesktopMenu";
import MesAnoSelector from "../../components/header/MesAnoSelector";
import type { Perfil } from "../../types/Perfil";
import { Link, useNavigate } from "react-router-dom";
import { HomeIcon } from "@heroicons/react/24/solid";
import { useFecha } from "../../context/FechaContext";

interface Props {
	perfil: Perfil | null;
	guardarPorcentajes: () => void;
	onShowFav: () => void;
	onLimpiarMes: () => void;
	mes: number;
	año: number;
	onMesChange: (n: number) => void;
	onAñoChange: (n: number) => void;
}

export default function HeaderDesktop({
	perfil,
	guardarPorcentajes,
	onShowFav,
	onLimpiarMes,
	mes,
	año,
	onMesChange,
	onAñoChange
}: Props) {

	const navigate = useNavigate();

	return (
		<div className="hidden md:flex w-full items-center justify-between py-4 px-7">

			{/* IZQUIERDA */}
			<div className="flex items-center gap-3">

				<DesktopMenu
					onAdd={() => navigate("/add")}
					onSavePercents={guardarPorcentajes}
					onShowFav={onShowFav}
					// ✔ SOLO llamamos la función del Dashboard
					onLimpiarMes={onLimpiarMes}
					mes={mes}
					año={año}
				/>

				<button
					onClick={() => navigate("/evolucion")}
					className="px-5 py-3 rounded-lg shadow 
						font-semibold border border-[#0097A7]
						text-[#006C7A] bg-white/90 
						hover:bg-[#E0F4F5] transition"
				>
					📈 Evolución
				</button>
			</div>

			{/* CENTRO */}
			<div className="flex items-center gap-3">
				<Link to="/" className="p-1 rounded-lg hover:bg-[#0097A710] transition">
					<HomeIcon className="w-6 h-6 text-[#006C7A]" />
				</Link>

				<span className="font-semibold text-lg text-[#006C7A]">
					Bienvenido, {perfil?.nombre}
				</span>
			</div>

			{/* DERECHA */}
			<div className="flex items-center gap-4">
				<MesAnoSelector
					mes={mes}
					año={año}
					onMesChange={onMesChange}
					onAñoChange={onAñoChange}
				/>

				<button
					onClick={async () => {
						await supabase.auth.signOut();
						navigate("/");
					}}
					className="bg-white/80 text-red-600 font-semibold px-6 py-3 rounded shadow hover:bg-red-50"
				>
					Cerrar sesión
				</button>
			</div>

		</div>
	);
}
