import {
	createContext,
	useContext,
	useEffect,
	useState,
	type ReactNode,
} from "react";
import { supabase } from "../supabase/client";
import type { User } from "@supabase/supabase-js";
import type { Perfil } from "../types/Perfil";

interface AuthContextType {
	user: User | null;
	perfil: Perfil | null;
	loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
	user: null,
	perfil: null,
	loading: true,
});

export function AuthProvider({ children }: { children: ReactNode }) {
	const [user, setUser] = useState<User | null>(null);
	const [perfil, setPerfil] = useState<Perfil | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		async function load() {
			const { data } = await supabase.auth.getUser();
			const u = data?.user ?? null;

			setUser(u);

			if (u) {
				const { data: p } = await supabase
					.from("profiles") // 👈 tu tabla real
					.select("*")
					.eq("id", u.id)  // 👈 id = UID del usuario
					.single();

				setPerfil(p ?? null);
			}

			setLoading(false);
		}

		load();
	}, []);

	return (
		<AuthContext.Provider value={{ user, perfil, loading }}>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuth() {
	return useContext(AuthContext);
}
