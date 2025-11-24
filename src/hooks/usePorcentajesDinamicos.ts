import { useEffect, useState } from "react";

export function usePorcentajesDinamicos(mes: number, año: number, categoriasGasto: string[]) {
	const key = `porcentajes-${mes}-${año}`;

	const [porcentajes, setPorcentajes] = useState<Record<string, number>>({});

	useEffect(() => {
		const stored = localStorage.getItem(key);
		if (stored) {
			setPorcentajes(JSON.parse(stored));
		} else {
			// Por defecto
			const defaults: Record<string, number> = {};
			categoriasGasto.forEach((c) => {
				if (c.includes("ESENCIAL")) defaults[c] = 50;
				else if (c.includes("AHORRO")) defaults[c] = 20;
				else if (c.includes("ESTILO")) defaults[c] = 30;
				else defaults[c] = 0;
			});
			setPorcentajes(defaults);
		}
	}, [mes, año]);

	function setPercent(cat: string, value: number) {
		setPorcentajes((prev) => ({ ...prev, [cat]: value }));
	}

	function guardar() {
		localStorage.setItem(key, JSON.stringify(porcentajes));
	}

	return { porcentajes, setPercent, guardar };
}
