import { useEffect } from "react";

interface Props {
	message: string;
	type?: "success" | "error";
	onClose: () => void;
}

export default function Alert({ message, type = "success", onClose }: Props) {
	useEffect(() => {
		if (!message) return;

		const t = setTimeout(onClose, 3000);
		return () => clearTimeout(t);
	}, [message]);

	if (!message) return null;

	const styles =
		type === "error"
			? "bg-red-50 border-red-500 text-red-700"
			: "bg-white border-teal-500 text-teal-700";

	return (
		<div
			className={`fixed top-4 left-1/2 -translate-x-1/2 shadow-xl px-6 py-3 rounded-lg border z-50 animate-fadeIn ${styles}`}
		>
			{type === "error" && <span className="mr-2">⚠️</span>}
			{message}
		</div>
	);
}
