import { supabase } from "../../supabase/client";
import type { Perfil } from "../../types/Perfil";
import DesktopMenu from "./DesktopMenu";

interface Props {
	perfil: Perfil | null;
	guardarPorcentajes: () => void;
	onShowFav: () => void;
	setAlertMsg: (msg: string) => void;
}

export default function HeaderDesktop({
	perfil,
	guardarPorcentajes,
	onShowFav,
	setAlertMsg
}: Props) {
	return (
		<div className="hidden md:flex w-full items-center justify-between mt-6">

			{/* MENÚ DESPLEGABLE PC */}
			<DesktopMenu
				onAdd={() => (window.location.href = "/add")}
				onSavePercents={() => {
					guardarPorcentajes();
					setAlertMsg("Porcentajes guardados ✔️");
				}}
				onShowFav={onShowFav}
			/>

			{/* PERFIL Y LOGOUT */}
			<div className="flex items-center gap-4">
				{perfil && (
					<div className="flex items-center gap-2">
						<img
							src={perfil.avatar_url || "/icono.png"}
							className="w-10 h-10 rounded-full border shadow object-cover"
						/>
						<span className="font-semibold text-[#006C7A] text-lg">{perfil.nombre}</span>
					</div>
				)}

				<button
					onClick={async () => {
						await supabase.auth.signOut();
						window.location.href = "/login";
					}}
					className="bg-white/80 text-red-600 font-semibold px-6 py-3 rounded shadow hover:bg-red-50"
				>
					Cerrar sesión
				</button>
			</div>

		</div>
	);
}
