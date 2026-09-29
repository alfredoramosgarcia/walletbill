interface Props {
	mes: number;
	año: number;
	onMesChange: (v: number) => void;
	onAñoChange: (v: number) => void;
}

const MESES = [
	"Enero",
	"Febrero",
	"Marzo",
	"Abril",
	"Mayo",
	"Junio",
	"Julio",
	"Agosto",
	"Septiembre",
	"Octubre",
	"Noviembre",
	"Diciembre",
];

export default function MesAnoSelector({
	mes,
	año,
	onMesChange,
	onAñoChange,
}: Props) {

	function mesAnterior() {
		if (mes === 1) {
			onMesChange(12);
			onAñoChange(año - 1);
		} else {
			onMesChange(mes - 1);
		}
	}

	function mesSiguiente() {
		if (mes === 12) {
			onMesChange(1);
			onAñoChange(año + 1);
		} else {
			onMesChange(mes + 1);
		}
	}

	return (
		<div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white p-1.5 shadow-sm">

			{/* ANTERIOR */}
			<button
				type="button"
				onClick={mesAnterior}
				aria-label="Mes anterior"
				title="Mes anterior"
				className="
					flex h-9 w-9 shrink-0
					items-center justify-center
					rounded-xl
					bg-slate-100
					text-slate-900
					transition-all
					hover:bg-slate-900
					hover:text-white
					active:scale-90
				"
			>
				<span
					className="block text-3xl font-bold leading-none"
					style={{ color: "inherit" }}
				>
					‹
				</span>
			</button>

			{/* MES */}
			<select
				value={mes}
				onChange={(e) =>
					onMesChange(Number(e.target.value))
				}
				aria-label="Seleccionar mes"
				className="
					min-w-[100px]
					cursor-pointer
					border-0
					bg-white
					px-1 py-2
					text-center
					text-sm font-bold
					text-slate-800
					outline-none
				"
			>
				{MESES.map((nombre, index) => (
					<option
						key={nombre}
						value={index + 1}
					>
						{nombre}
					</option>
				))}
			</select>

			{/* AÑO */}
			<select
				value={año}
				onChange={(e) =>
					onAñoChange(Number(e.target.value))
				}
				aria-label="Seleccionar año"
				className="
					cursor-pointer
					border-0
					bg-white
					px-1 py-2
					text-sm font-semibold
					text-slate-500
					outline-none
				"
			>
				{Array.from({ length: 11 }).map((_, i) => {
					const year = 2023 + i;

					return (
						<option
							key={year}
							value={year}
						>
							{year}
						</option>
					);
				})}
			</select>

			{/* SIGUIENTE */}
			<button
				type="button"
				onClick={mesSiguiente}
				aria-label="Mes siguiente"
				title="Mes siguiente"
				className="
					flex h-9 w-9 shrink-0
					items-center justify-center
					rounded-xl
					bg-slate-100
					text-slate-900
					transition-all
					hover:bg-slate-900
					hover:text-white
					active:scale-90
				"
			>
				<span
					className="block text-3xl font-bold leading-none"
					style={{ color: "inherit" }}
				>
					›
				</span>
			</button>

		</div>
	);
}