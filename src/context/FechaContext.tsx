import { createContext, useContext, useState } from "react";

const FechaContext = createContext<any>(null);

export function FechaProvider({ children }: { children: React.ReactNode }) {
	const [mes, setMes] = useState(new Date().getMonth() + 1);
	const [año, setAño] = useState(new Date().getFullYear());

	return (
		<FechaContext.Provider value={{ mes, setMes, año, setAño }}>
			{children}
		</FechaContext.Provider>
	);
}

export function useFecha() {
	return useContext(FechaContext);
}
