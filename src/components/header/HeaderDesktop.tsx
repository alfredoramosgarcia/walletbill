import { supabase } from "../../supabase/client";
import DesktopMenu from "./DesktopMenu";
import MesAnoSelector from "../../components/header/MesAnoSelector";
import type { Perfil } from "../../types/Perfil";
import { Link } from "react-router-dom";
import { HomeIcon } from "@heroicons/react/24/solid";

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
	return (
		<div className="hidden md:flex w-full items-center justify-between py-4 px-7">

			{/* IZQUIERDA → Menú + Evolución */}
			<div className="flex items-center gap-3">

				<DesktopMenu
					onAdd={() => (window.location.href = "/add")}
					onSavePercents={guardarPorcentajes}
					onShowFav={onShowFav}
					onLimpiarMes={onLimpiarMes}
					mes={mes}
					año={año}
				/>

				{/* BOTÓN EVOLUCIÓN — estilo WalletBill */}
				<button
					onClick={() => (window.location.href = "/evolucion")}
					className="
						px-5 py-3 rounded-lg shadow 
						font-semibold border border-[#0097A7]
						text-[#006C7A] bg-white/90 
						hover:bg-[#E0F4F5] transition"
				>
					📈 Evolución
				</button>

			</div>

			<div className="flex items-center gap-3">

				{/* ICONO HOME TRANSPARENTE */}
				<Link
					to="/"
					className="p-1 rounded-lg bg-transparent hover:bg-[#0097A710] transition"
				>
					<HomeIcon className="w-6 h-6 text-[#006C7A]" />
				</Link>

				{/* TEXTO DE BIENVENIDA */}
				<span className="font-semibold text-lg text-[#006C7A]">
					Bienvenido, {perfil?.nombre}
				</span>

			</div>


			{/* DERECHA → Selector y cerrar sesión */}
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
						window.location.href = "/";
					}}
					className="bg-white/80 text-red-600 font-semibold px-6 py-3 rounded shadow hover:bg-red-50"
				>
					Cerrar sesión
				</button>
			</div>
		</div>
	);
}
