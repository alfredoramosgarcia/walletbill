import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../../supabase/client";
import MesAnoSelector from "../../components/header/MesAnoSelector";
import type { Perfil } from "../../types/Perfil";
import { UserCircleIcon } from "@heroicons/react/24/solid";

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

			{/* PERFIL + BIENVENIDA */}
			{perfil && (
				<div className="flex items-center gap-1 mb-2 mt-2">
					<Link
						to="/perfil"
						className="p-1 rounded-lg hover:bg-[#0097A710] transition"
						style={{ WebkitTapHighlightColor: "transparent" }}
					>
						<UserCircleIcon className="w-6 h-6 text-[#006C7A]" />
					</Link>

					<span className="font-semibold text-lg text-[#006C7A]">
						Bienvenido, {perfil.nombre}
					</span>
				</div>
			)}

			{/* FILA: BOTÓN MENÚ + EVOLUCIÓN */}
			{!menuOpen && (
				<div className="flex justify-between items-center px-6 mt-2 mb-1 gap-6">

					{/* BOTÓN MENÚ */}
					<button
						onClick={() => setMenuOpen(true)}
						className="bg-[#0097A7] text-white px-6 py-3 rounded-xl shadow hover:bg-[#007f90] font-semibold"
						style={{ WebkitTapHighlightColor: "transparent" }}
					>
						☰ Menú
					</button>

					{/* BOTÓN EVOLUCIÓN */}
					<button
						onClick={() => navigate("/evolucion")}
						className="text-center py-3 px-4 text-[#006C7A] font-semibold bg-white border border-gray-200 rounded-lg hover:bg-gray-100 transition"
						style={{ WebkitTapHighlightColor: "transparent" }}
					>
						📈 Evolución
					</button>


				</div>
			)}

			{/* BOTÓN MENÚ SOLO cuando está abierto */}
			{menuOpen && (
				<button
					onClick={() => setMenuOpen(false)}
					className="bg-[#0097A7] text-white px-6 py-3 rounded-xl shadow hover:bg-[#007f90] font-semibold mt-4 mb-3"
					style={{ WebkitTapHighlightColor: "transparent" }}
				>
					☰ Menú
				</button>
			)}

			{/* MENÚ DESPLEGADO */}
			{menuOpen && (
				<div
					className="w-full border border-gray-200 rounded-xl p-3 mt-2 bg-white"
					style={{
						WebkitTapHighlightColor: "transparent",
						backgroundColor: "white"
					}}
				>
					<div className="flex flex-col divide-y divide-gray-200">

						<button
							onClick={() => {
								navigate("/add");
								setMenuOpen(false);
							}}
							className="text-center py-3 px-2 text-[#006C7A] font-semibold hover:bg-gray-100 transition bg-white"
							style={{ WebkitTapHighlightColor: "transparent" }}
						>
							+ Añadir movimiento
						</button>

						<button
							onClick={() => {
								onShowFav();
								setMenuOpen(false);
							}}
							className="text-center py-3 px-2 text-[#006C7A] font-semibold hover:bg-gray-100 transition bg-white"
							style={{ WebkitTapHighlightColor: "transparent" }}
						>
							⭐ Favoritos
						</button>

						<button
							onClick={() => {
								onLimpiarMes();
								setMenuOpen(false);
							}}
							className="text-center py-3 px-2 text-red-600 font-semibold hover:bg-red-50 transition bg-white"
							style={{ WebkitTapHighlightColor: "transparent" }}
						>
							🧹 Limpiar mes
						</button>

						<button
							onClick={() => {
								navigate("/categorias");
								setMenuOpen(false);
							}}
							className="text-center py-3 px-2 text-[#006C7A] font-semibold hover:bg-gray-100 transition bg-white"
							style={{ WebkitTapHighlightColor: "transparent" }}
						>
							📂 Categorías
						</button>

						<button
							onClick={async () => {
								await supabase.auth.signOut();
								localStorage.removeItem("supabase.auth.token");
								localStorage.removeItem("supabase.auth.refresh_token");

								navigate("/login", { replace: true });
								window.location.reload();
							}}
							className="text-center py-3 px-2 text-red-600 font-semibold hover:bg-red-50 transition bg-white"
							style={{ WebkitTapHighlightColor: "transparent" }}
						>
							Cerrar sesión
						</button>

					</div>
				</div>
			)}

			{/* SELECTOR MES / AÑO */}
			{!menuOpen && (
				<div className="mt-4 flex justify-center w-full">
					<div className="max-w-[280px]">
						<MesAnoSelector
							mes={mes}
							año={año}
							onMesChange={onMesChange}
							onAñoChange={onAñoChange}
						/>
					</div>
				</div>
			)}

		</div>
	);
}
