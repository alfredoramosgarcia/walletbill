import { supabase } from "../../supabase/client";
import type { Perfil } from "../../types/Perfil";
import DesktopMenu from "./DesktopMenu";

interface Props {
	perfil: Perfil | null;
	guardarPorcentajes: () => void;
	onShowFav: () => void;
}

export default function HeaderDesktop({ perfil, guardarPorcentajes, onShowFav }: Props) {
	return (
		<div className="flex items-center justify-between w-full">

			{/* MENÚ DESPLEGABLE (PC) */}
			<DesktopMenu
				onAdd={() => (window.location.href = "/add")}
				onSavePercents={guardarPorcentajes}
				onShowFav={onShowFav}
			/>

			{/* PERFIL + LOGOUT (DERECHA) */}
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
