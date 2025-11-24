import { Link } from "react-router-dom";
import type { Perfil } from "../../types/Perfil";
import { supabase } from "../../supabase/client";

interface Props {
	perfil: Perfil | null;
	guardarPorcentajes: () => void;
	onShowFav: () => void;
}

export default function HeaderDesktop({ perfil, guardarPorcentajes, onShowFav }: Props) {
	return (
		<div className="hidden md:flex w-full items-center justify-between mt-4 relative">
			{/* Botones izquierda */}
			<div className="flex gap-3">
				<Link
					to="/add"
					className="bg-[#0097A7] text-white px-6 py-3 rounded shadow hover:bg-[#007f90]"
				>
					+ Añadir
				</Link>

				<button
					className="bg-[#006C7A] text-white px-6 py-3 rounded shadow hover:bg-[#005663]"
					onClick={guardarPorcentajes}
				>
					Guardar porcentajes
				</button>

				<button
					onClick={onShowFav}
					className="bg-yellow-500 text-white px-6 py-3 rounded shadow hover:bg-yellow-600"
				>
					⭐ Favoritos
				</button>
			</div>

			{/* Perfil */}
			{perfil && (
				<Link
					to="/perfil"
					className="flex items-center gap-3 mr-4"
				>
					<img
						src={perfil.avatar_url || "/icono.png"}
						className="w-10 h-10 rounded-full border object-cover shadow"
					/>
					<span className="font-semibold text-[#006C7A] text-lg">
						{perfil.nombre}
					</span>
				</Link>
			)}

			{/* Logout */}
			<button
				onClick={async () => {
					await supabase.auth.signOut();
					window.location.href = "/";
				}}
				className="text-red-600 font-semibold bg-white/80 px-6 py-3 rounded shadow"
			>
				Cerrar sesión
			</button>
		</div>
	);
}
