import { supabase } from "../../supabase/client";
import DesktopMenu from "./DesktopMenu";
import MesAnoSelector from "../../components/header/MesAnoSelector";
import type { Perfil } from "../../types/Perfil";

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
		<div className="hidden md:grid w-full grid-cols-3 items-center py-4 px-7">

			<div className="flex justify-start">
				<DesktopMenu
					onAdd={() => (window.location.href = "/add")}
					onSavePercents={guardarPorcentajes}
					onShowFav={onShowFav}
					onLimpiarMes={onLimpiarMes}
					mes={mes}
					año={año}
				/>
			</div>

			<div className="flex justify-center">
				<MesAnoSelector
					mes={mes}
					año={año}
					onMesChange={onMesChange}
					onAñoChange={onAñoChange}
				/>
			</div>

			<div className="flex justify-end items-center gap-3">
				{perfil && (
					<span className="font-semibold text-[#006C7A] text-lg">
						Bienvenido, {perfil.nombre}
					</span>
				)}

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
