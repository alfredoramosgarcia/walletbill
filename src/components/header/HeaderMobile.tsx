import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../../supabase/client";
import MesAnoSelector from "../../components/header/MesAnoSelector";
import type { Perfil } from "../../types/Perfil";
import { HomeIcon } from "@heroicons/react/24/solid";

interface Props {
	perfil: Perfil | null;
	menuOpen: boolean;
	setMenuOpen: (v: boolean) => void;
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
	onShowFav,
	onLimpiarMes,
	mes,
	año,
	onMesChange,
	onAñoChange
}: Props) {

	const navigate = useNavigate();

	return (
		<div className="md:hidden flex flex-col items-center pt-2 w-full">

			<Link to="/" className="p-2 rounded-lg hover:bg-[#0097A710] transition">
				<HomeIcon className="w-7 h-7 text-[#006C7A]" />
			</Link>

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
				<div className="w-full bg-white shadow-xl rounded-xl p-4 flex flex-col gap-3">

					<button
						className="bg-[#0097A7] text-white px-5 py-3 rounded-lg shadow text-center font-semibold hover:bg-[#007c8b]"
						onClick={() => {
							navigate("/add");
							setMenuOpen(false);
						}}
					>
						+ Añadir Movimiento
					</button>

					<button
						onClick={() => {
							onShowFav();
							setMenuOpen(false);
						}}
						className="bg-yellow-500 text-white px-5 py-3 rounded-lg shadow text-center font-semibold hover:bg-yellow-600"
					>
						⭐ Favoritos
					</button>

					<button
						onClick={() => {
							onLimpiarMes();
							setMenuOpen(false);
						}}
						className="bg-red-500 text-white px-5 py-3 rounded-lg shadow text-center font-semibold hover:bg-red-600"
					>
						🧹 Limpiar mes
					</button>

					<button
						onClick={() => {
							navigate("/evolucion");
							setMenuOpen(false);
						}}
						className="px-5 py-3 rounded-lg shadow font-semibold border border-[#0097A7] text-[#006C7A] bg-white hover:bg-[#E0F4F5]"
					>
						📈 Evolución
					</button>

					<button
						onClick={async () => {
							await supabase.auth.signOut();
							navigate("/");
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
