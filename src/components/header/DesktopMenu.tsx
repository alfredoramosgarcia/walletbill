import { useState, useRef, useEffect } from "react";

interface Props {
	onAdd: () => void;
	onSavePercents: () => void;
	onShowFav: () => void;
}

export default function DesktopMenu({ onAdd, onSavePercents, onShowFav }: Props) {
	const [open, setOpen] = useState(false);
	const menuRef = useRef<HTMLDivElement>(null);

	// Cerrar si clicas fuera
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
				<div
					className="absolute left-0 mt-2 w-56 bg-white shadow-xl rounded-xl p-3 z-[999] border border-gray-200 animate-fadeIn"
				>
					<button
						onClick={() => {
							onAdd();
							setOpen(false);
						}}
						className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-100 font-medium"
					>
						➕ Añadir movimiento
					</button>

					<button
						onClick={() => {
							onSavePercents();
							setOpen(false);
						}}
						className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-100 font-medium"
					>
						💾 Guardar porcentajes
					</button>

					<button
						onClick={() => {
							onShowFav();
							setOpen(false);
						}}
						className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-100 font-medium"
					>
						⭐ Favoritos
					</button>
				</div>
			)}
		</div>
	);
}
