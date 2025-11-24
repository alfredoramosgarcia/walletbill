interface Props {
	totalMes: number;
}

export default function TotalesMes({ totalMes }: Props) {
	return (
		<div className="w-full flex justify-center mt-8 mb-6 px-4">
			<div className="bg-white rounded-xl shadow py-4 px-6 w-full max-w-md">

				<span className="block text-center font-bold text-[#004D40] text-xl md:text-2xl">
					TOTAL MES:
				</span>

				<span
					className={`block text-center font-bold text-xl md:text-2xl mt-1 ${totalMes < 0 ? "text-red-600" : "text-green-600"
						}`}
				>
					{totalMes.toFixed(2)} €
				</span>

			</div>
		</div>
	);
}
