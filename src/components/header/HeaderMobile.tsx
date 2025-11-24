import { Link } from "react-router-dom";
import type { Perfil } from "../../types/Perfil";
import { supabase } from "../../supabase/client";

interface Props {
	perfil: Perfil | null;
	menuOpen: boolean;
	setMenuOpen: (v: boolean) => void;
	guardarPorcentajes: () => void;
	onShowFav: () => void;
}

export default function HeaderMobile({
	perfil,
	menuOpen,
	setMenuOpen,
	guardarPorcentajes,
	onShowFav,
}: Props) {
	return (
		<div className="md:hidden flex flex-col items-center mt-6 w-full">

			{/* Perfil */}
			{perfil && (
				<div className="flex flex-col items-center gap-2 mb-3 mt-2">
					<img
						src={perfil.avatar_url || "/icono.png"}
						className="w-16 h-16 rounded-full border shadow-md object-cover"
					/>
					<span className="font-semibold text-lg text-[#006C7A]">
						{perfil.nombre}
					</span>
				</div>
			)}

			{/* Botón menú */}
			<button
				onClick={() => setMenuOpen(!menuOpen)}
				className="bg-[#0097A7] text-white px-6 py-3 rounded-xl shadow hover:bg-[#007f90] font-semibold flex items-center gap-2 mb-3"
			>
				☰ Menú
			</button>

			{/* Menú desplegable */}
			{menuOpen && (
				<div className="w-full bg-white shadow-xl rounded-xl p-4 flex flex-col gap-3 animate-fadeIn">

					<Link
						to="/add"
						className="bg-[#0097A7] text-white px-5 py-3 rounded-lg shadow text-center font-semibold hover:bg-[#007c8b]"
					>
						+ Añadir Movimiento
					</Link>

					<button
						onClick={guardarPorcentajes}
						className="bg-[#006C7A] text-white px-5 py-3 rounded-lg shadow text-center font-semibold hover:bg-[#005663]"
					>
						Guardar Porcentajes
					</button>

					<button
						onClick={onShowFav}
						className="bg-yellow-500 text-white px-5 py-3 rounded-lg shadow text-center font-semibold hover:bg-yellow-600"
					>
						⭐ Favoritos
					</button>

					<button
						onClick={async () => {
							await supabase.auth.signOut();
							window.location.href = "/";
						}}
						className="bg-red-500 text-white px-5 py-3 rounded-lg shadow text-center font-semibold hover:bg-red-600"
					>
						Cerrar sesión
					</button>
				</div>
			)}
		</div>
	);
}
