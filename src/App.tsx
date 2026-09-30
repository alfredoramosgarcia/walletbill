import {
	BrowserRouter,
	Navigate,
	Route,
	Routes,
} from "react-router-dom";

import { AuthProvider } from "./hooks/useAuth";
import { FechaProvider } from "./context/FechaContext";
import { MovimientosProvider } from "./context/MovimientoContext";

import "./index.css";

/* PÁGINAS PÚBLICAS */
import Landing from "./pages/Landing";
import Login from "./pages/Login";

/* PÁGINAS PRIVADAS */
import Dashboard from "./pages/Dashboard/Dashboard";
import AddMovimiento from "./pages/AddMovimiento";
import EditMovimiento from "./pages/EditMovimiento";
import Perfil from "./pages/Perfil";
import Evolucion from "./pages/Evolucion/Evolucion";
import GestionCategorias from "./pages/GestionCategorias";
import Inversiones from "./pages/Inversiones/Inversiones";
import FAQ from "./pages/FAQ/FAQ"

/* AUTH */
import ProtectedRoute from "./components/auth/ProtectedRoute";
import RedirectIfLogged from "./components/auth/RedirectIfLogged";

/* LAYOUTS */
import MainLayout from "./layouts/MainLayout";
import AuthLayout from "./layouts/AuthLayout";

export default function App() {
	return (
		<AuthProvider>
			<FechaProvider>
				<MovimientosProvider>
					<BrowserRouter>
						<Routes>

							{/* ======================================== */}
							{/* LANDING PÚBLICA                         */}
							{/* ======================================== */}

							<Route
								path="/"
								element={<Landing />}
							/>

							{/* ======================================== */}
							{/* AUTENTICACIÓN                           */}
							{/* ======================================== */}

							<Route element={<AuthLayout />}>

								<Route
									path="/login"
									element={
										<RedirectIfLogged>
											<Login />
										</RedirectIfLogged>
									}
								/>

							</Route>

							{/* ======================================== */}
							{/* APLICACIÓN PRIVADA                      */}
							{/* ======================================== */}

							<Route
								element={
									<ProtectedRoute>
										<MainLayout />
									</ProtectedRoute>
								}
							>

								<Route
									path="/dashboard"
									element={<Dashboard />}
								/>

								<Route
									path="/add"
									element={<AddMovimiento />}
								/>

								<Route
									path="/edit/:id"
									element={<EditMovimiento />}
								/>

								<Route
									path="/categorias"
									element={<GestionCategorias />}
								/>

								<Route
									path="/evolucion"
									element={<Evolucion />}
								/>

								<Route
									path="/perfil"
									element={<Perfil />}
								/>

								<Route
									path="/inversiones"
									element={<Inversiones />}
								/>

								<Route path="/faq" element={<FAQ />} />

							</Route>

							{/* ======================================== */}
							{/* FALLBACK                                */}
							{/* ======================================== */}

							<Route
								path="*"
								element={
									<Navigate
										to="/"
										replace
									/>
								}
							/>

						</Routes>
					</BrowserRouter>
				</MovimientosProvider>
			</FechaProvider>
		</AuthProvider>
	);
}