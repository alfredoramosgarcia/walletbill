import type { Favorito } from "../../types/Favorito";

interface Props {
	favoritos: Favorito[];
	onClose: () => void;
	onImportOne: (fav: Favorito) => void;
	onImportAll: () => void;
}

export default function FavoritosModal({
	favoritos,
	onClose,
	onImportOne,
	onImportAll,
}: Props) {
	return (
		<div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
			<div className="bg-white p-6 w-11/12 max-w-md shadow-xl rounded-xl">
				<h2 className="text-xl font-bold text-[#006C7A] mb-3">⭐ Importar Favoritos</h2>

				<button
					onClick={onImportAll}
					className="w-full bg-green-600 text-white py-3 rounded mb-4 hover:bg-green-700"
				>
					📥 Importar TODOS
				</button>

				<div className="max-h-80 overflow-auto border rounded p-2 bg-gray-50">
					{favoritos.length === 0 && (
						<p className="text-center py-3 text-gray-500">
							No tienes favoritos guardados.
						</p>
					)}

					{favoritos.map((f) => (
						<div
							key={f.id}
							className="p-3 border-b flex justify-between items-center"
						>
							<div>
								<p className="font-bold text-[#006C7A] text-lg">{f.concepto}</p>
								<p className="text-sm text-gray-600">
									{f.categoria} · {f.tipo}
								</p>
							</div>

							<button
								onClick={() => onImportOne(f)}
								className="bg-[#0097A7] text-white px-4 py-2 rounded"
							>
								Importar
							</button>
						</div>
					))}
				</div>

				<button
					onClick={onClose}
					className="w-full mt-4 bg-gray-300 p-3 rounded"
				>
					Cerrar
				</button>
			</div>
		</div>
	);
}
