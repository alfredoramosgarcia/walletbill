import { useState } from "react";

interface Props {
	onAdd: () => void;
	onSavePercents: () => void;
	onShowFav: () => void;
}

export default function DesktopMenu({ onAdd, onSavePercents, onShowFav }: Props) {
	const [open, setOpen] = useState(false);

	return (
		<div className="relative z-50 inline-block">

			<button
				onClick={() => setOpen(!open)}
				className="bg-[#0097A7] text-white px-5 py-2 rounded-lg shadow hover:bg-[#008291] transition font-semibold border border-black"
			>
				Menú ▼
			</button>

			{open && (
				<div
					className="
						absolute left-0 top-full mt-2
						w-56 
						bg-[#D9ECEA]
						border border-[#b1d5d2]
						shadow-2xl
						rounded-xl
						overflow-hidden
						animate-fadeIn
						z-50
					"
				>
					<button onClick={() => { setOpen(false); onAdd(); }}
						className="w-full text-left px-5 py-3 hover:bg-[#c3e1dd] transition">
						+ Añadir
					</button>

					<button onClick={() => { setOpen(false); onSavePercents(); }}
						className="w-full text-left px-5 py-3 hover:bg-[#c3e1dd] transition">
						Guardar porcentajes
					</button>

					<button onClick={() => { setOpen(false); onShowFav(); }}
						className="w-full text-left px-5 py-3 hover:bg-[#c3e1dd] transition">
						⭐ Favoritos
					</button>
				</div>
			)}

		</div>
	);
}
