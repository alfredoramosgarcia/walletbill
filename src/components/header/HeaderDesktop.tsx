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
		<div className="hidden md:flex w-full items-center justify-between mt-6">

			{/* MENÚ DESPLEGABLE (PC) */}
			<DesktopMenu
				onAdd={() => (window.location.href = "/add")}
				onSavePercents={guardarPorcentajes}
				onShowFav={onShowFav}
			/>

			{/* TEXTO DE BIENVENIDA */}
			<div className="flex items-center gap-4">

				{perfil && (
					<div className="flex items-center gap-2">
						<span className="font-semibold text-[#006C7A] text-lg">
							Bienvenido, {perfil.nombre}
						</span>
					</div>
				)}

				{/* CERRAR SESIÓN (PC) */}
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
