interface Props {
	mes: number;
	año: number;
	onMesChange: (v: number) => void;
	onAñoChange: (v: number) => void;
}

export default function MesAnoSelector({ mes, año, onMesChange, onAñoChange }: Props) {
	return (
		<div className="flex items-center gap-2 bg-white/80 px-4 py-2 rounded-lg shadow">
			<select
				className="p-2 rounded border"
				value={mes}
				onChange={(e) => onMesChange(Number(e.target.value))}
			>
				{Array.from({ length: 12 }).map((_, i) => (
					<option key={i} value={i + 1}>{i + 1}</option>
				))}
			</select>

			<select
				className="p-2 rounded border"
				value={año}
				onChange={(e) => onAñoChange(Number(e.target.value))}
			>
				{Array.from({ length: 6 }).map((_, i) => (
					<option key={i} value={2025 + i}>{2025 + i}</option>
				))}
			</select>
		</div>
	);
}
