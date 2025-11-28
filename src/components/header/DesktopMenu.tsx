import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface Props {
	onAdd: () => void;
	onSavePercents: () => void;
	onShowFav: () => void;
	onLimpiarMes: () => void;
	mes: number;
	año: number;
}

export default function DesktopMenu({
	onAdd,
	onShowFav,
	onLimpiarMes
}: Props) {

	const [open, setOpen] = useState(false);
	const menuRef = useRef<HTMLDivElement>(null);
	const navigate = useNavigate();

	// Cerrar al hacer clic fuera
	useEffect(() => {
		function handleClickOutside(e: MouseEvent) {
			if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
				setOpen(false);
			}
		}
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	return (
		<div className="relative" ref={menuRef}>
			<button
				onClick={() => setOpen(!open)}
				className="bg-[#0097A7] text-white px-6 py-3 rounded-xl shadow hover:bg-[#007f90] font-semibold"
			>
				Menú ▼
			</button>

			{open && (
				<div className="absolute left-0 mt-2 w-56 bg-white shadow-xl rounded-xl p-3 z-[999] border border-gray-200 animate-fadeIn">

					{/* AÑADIR */}
					<button
						onClick={() => {
							onAdd();        // ✔ dashboard o header controla todo
							setOpen(false);
						}}
						className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-100 font-medium"
					>
						➕ Añadir movimiento
					</button>

					{/* FAVORITOS */}
					<button
						onClick={() => {
							onShowFav();
							setOpen(false);
						}}
						className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-100 font-medium"
					>
						⭐ Favoritos
					</button>

					<button
						onClick={() => navigate("/categorias")}
						className="flex items-center gap-2 px-3 py-2 rounded-lg text-[#006C7A] font-semibold hover:bg-[#0097A710] transition"
					>
						📂 Categorías
					</button>


					{/* LIMPIAR MES */}
					<button
						onClick={() => {
							onLimpiarMes();     // ✔ dashboard controla limpieza y refresh
							setOpen(false);
						}}
						className="w-full text-left px-4 py-2 rounded-lg hover:bg-red-100 font-medium text-red-600"
					>
						🧹 Limpiar mes
					</button>

				</div>
			)}
		</div>
	);
}
