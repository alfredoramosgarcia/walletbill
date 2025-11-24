import { useState } from "react";

export function usePorcentajes() {
	const [pEsenciales, setPEsenciales] = useState(
		Number(localStorage.getItem("pEsenciales") || 50)
	);

	const [pAhorro, setPAhorro] = useState(
		Number(localStorage.getItem("pAhorro") || 20)
	);

	const [pEstilo, setPEstilo] = useState(
		Number(localStorage.getItem("pEstilo") || 30)
	);

	function guardar() {
		const suma = pEsenciales + pAhorro + pEstilo;

		if (suma !== 100) {
			return { ok: false, msg: "La suma debe ser 100%" };
		}

		localStorage.setItem("pEsenciales", pEsenciales.toString());
		localStorage.setItem("pAhorro", pAhorro.toString());
		localStorage.setItem("pEstilo", pEstilo.toString());

		return { ok: true, msg: "Porcentajes guardados" };
	}

	return {
		pEsenciales,
		pAhorro,
		pEstilo,
		setPEsenciales,
		setPAhorro,
		setPEstilo,
		guardar,
	};
}
