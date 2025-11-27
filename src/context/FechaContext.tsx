import { createContext, useContext, useState } from "react";

interface FechaContextType {
	mes: number;
	año: number;
	setMes: (m: number) => void;
	setAño: (a: number) => void;
}

const FechaContext = createContext<FechaContextType>({
	mes: 1,
	año: 2025,
	setMes: () => { },
	setAño: () => { },
});

export function FechaProvider({ children }: { children: React.ReactNode }) {
	// Cargar mes/año desde localStorage si existe
	const storedMes = localStorage.getItem("mes");
	const storedAño = localStorage.getItem("año");

	const [mes, setMesState] = useState(
		storedMes ? Number(storedMes) : new Date().getMonth() + 1
	);
	const [año, setAñoState] = useState(
		storedAño ? Number(storedAño) : new Date().getFullYear()
	);

	function setMes(m: number) {
		setMesState(m);
		localStorage.setItem("mes", m.toString());
	}

	function setAño(a: number) {
		setAñoState(a);
		localStorage.setItem("año", a.toString());
	}

	return (
		<FechaContext.Provider value={{ mes, año, setMes, setAño }}>
			{children}
		</FechaContext.Provider>
	);
}

export function useFecha() {
	return useContext(FechaContext);
}
