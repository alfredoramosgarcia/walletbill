import { useEffect } from "react";

interface Props {
	message: string;
	onClose: () => void;
}

export default function Alert({ message, onClose }: Props) {
	useEffect(() => {
		if (!message) return;

		const t = setTimeout(onClose, 3000);
		return () => clearTimeout(t);
	}, [message]);

	if (!message) return null;

	return (
		<div className="fixed top-4 left-1/2 -translate-x-1/2 bg-white shadow-xl px-6 py-3 rounded-lg border border-teal-500 text-teal-700 z-50 animate-fadeIn">
			{message}
		</div>
	);
}
