interface ConfirmModalProps {
	show: boolean;
	message: string;
	onConfirm: () => void;
	onCancel: () => void;
}

export default function ConfirmModal({ show, message, onConfirm, onCancel }: ConfirmModalProps) {
	if (!show) return null;

	return (
		<div className="fixed inset-0 bg-black/40 flex justify-center items-center z-[9999]">
			<div className="bg-white p-6 rounded-xl shadow-xl w-80 animate-fadeIn">

				<p className="text-lg font-semibold text-gray-800 mb-4">{message}</p>

				<div className="flex justify-between gap-3">
					<button
						onClick={onCancel}
						className="w-1/2 py-2 rounded-lg bg-gray-300 hover:bg-gray-400 font-semibold"
					>
						Cancelar
					</button>

					<button
						onClick={onConfirm}
						className="w-1/2 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white font-semibold"
					>
						Borrar
					</button>
				</div>
			</div>
		</div>
	);
}
