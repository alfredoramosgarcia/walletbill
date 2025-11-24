import {
	createContext,
	useContext,
	useEffect,
	useState,
	type ReactNode,
} from "react";
import { supabase } from "../supabase/client";

interface AuthContextType {
	user: any;
	loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
	user: null,
	loading: true,
});

export function AuthProvider({ children }: { children: ReactNode }) {
	const [user, setUser] = useState<any>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		let mounted = true;

		// Obtener usuario actual al cargar
		supabase.auth.getUser().then(({ data }) => {
			if (!mounted) return;
			setUser(data?.user ?? null);
			setLoading(false);
		});

		// Escuchar login/logout
		const { data: listener } = supabase.auth.onAuthStateChange(
			(_event, session) => {
				if (!mounted) return;
				setUser(session?.user ?? null);
			}
		);

		// Cleanup
		return () => {
			mounted = false;
			listener.subscription.unsubscribe();
		};
	}, []);

	return (
		<AuthContext.Provider value={{ user, loading }}>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuth() {
	return useContext(AuthContext);
}
