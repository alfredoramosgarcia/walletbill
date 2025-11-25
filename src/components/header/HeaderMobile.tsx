import { Link } from "react-router-dom";
import { supabase } from "../../supabase/client";
import MesAnoSelector from "../../components/header/MesAnoSelector";
import type { Perfil } from "../../types/Perfil";

interface Props {
	perfil: Perfil | null;
	menuOpen: boolean;
	setMenuOpen: (v: boolean) => void;
	guardarPorcentajes: () => void;
	onShowFav: () => void;
	onLimpiarMes: () => void;
	mes: number;
	año: number;
	onMesChange: (n: number) => void;
	onAñoChange: (n: number) => void;
}

export default function HeaderMobile({
	perfil,
	menuOpen,
	setMenuOpen,
	guardarPorcentajes,
	onShowFav,
	onLimpiarMes,
	mes,
	año,
	onMesChange,
	onAñoChange
}: Props) {
	return (
		<div className="md:hidden flex flex-col items-center pt-2 w-full">

			{perfil && (
				<div className="flex flex-col items-center gap-1 mb-2 mt-2">
					<span className="font-semibold text-lg text-[#006C7A]">
						Bienvenido, {perfil.nombre}
					</span>
				</div>
			)}

			<button
				onClick={() => setMenuOpen(!menuOpen)}
				className="bg-[#0097A7] text-white px-6 py-3 rounded-xl shadow hover:bg-[#007f90] font-semibold flex items-center gap-2 mt-4 mb-3"
			>
				☰ Menú
			</button>

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
						onClick={onLimpiarMes}
						className="bg-red-500 text-white px-5 py-3 rounded-lg shadow text-center font-semibold hover:bg-red-600"
					>
						🧹 Limpiar mes
					</button>


					<button
						onClick={async () => {
							await supabase.auth.signOut();
							window.location.href = "/";
						}}
						className="bg-gray-500 text-white px-5 py-3 rounded-lg shadow text-center font-semibold hover:bg-gray-600"
					>
						Cerrar sesión
					</button>

				</div>
			)}

			<MesAnoSelector
				mes={mes}
				año={año}
				onMesChange={onMesChange}
				onAñoChange={onAñoChange}
			/>
		</div>
	);
}
