import { createContext, useContext, useState } from "react";

interface MovimientosContextType {
	refreshKey: number;
	refreshMovimientos: () => void;
}

const MovimientosContext = createContext<MovimientosContextType>({
	refreshKey: 0,
	refreshMovimientos: () => { },
});

export function MovimientosProvider({ children }: { children: React.ReactNode }) {
	const [refreshKey, setRefreshKey] = useState(0);

	function refreshMovimientos() {
		setRefreshKey((k) => k + 1);
	}

	return (
		<MovimientosContext.Provider value={{ refreshKey, refreshMovimientos }}>
			{children}
		</MovimientosContext.Provider>
	);
}

export function useMovimientosRefresh() {
	return useContext(MovimientosContext);
}
