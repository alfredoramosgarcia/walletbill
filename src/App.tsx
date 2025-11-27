import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./hooks/useAuth";
import { FechaProvider } from "./context/FechaContext";
import { MovimientosProvider } from "./context/MovimientoContext";

import "./index.css";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard/Dashboard";
import AddMovimiento from "./pages/AddMovimiento";
import EditMovimiento from "./pages/EditMovimiento";
import Perfil from "./pages/Perfil";
import Evolucion from "./pages/Evolucion/Evolucion";

import ProtectedRoute from "./components/auth/ProtectedRoute";
import RedirectIfLogged from "./components/auth/RedirectIfLogged";

import MainLayout from "./layouts/MainLayout";
import AuthLayout from "./layouts/AuthLayout";

export default function App() {
	return (
		<AuthProvider>
			<FechaProvider>

				{/* 🟩 AÑADIDO: PROVIDER QUE FALTABA */}
				<MovimientosProvider>

					<BrowserRouter>
						<Routes>

							{/* ❌ Páginas sin header */}
							<Route element={<AuthLayout />}>
								<Route
									path="/login"
									element={
										<RedirectIfLogged>
											<Login />
										</RedirectIfLogged>
									}
								/>

								<Route
									path="/add"
									element={
										<ProtectedRoute>
											<AddMovimiento />
										</ProtectedRoute>
									}
								/>

								<Route
									path="/edit/:id"
									element={
										<ProtectedRoute>
											<EditMovimiento />
										</ProtectedRoute>
									}
								/>

								<Route
									path="/evolucion"
									element={
										<ProtectedRoute>
											<Evolucion />
										</ProtectedRoute>
									}
								/>
							</Route>

							{/* ✅ Páginas CON header */}
							<Route
								element={
									<ProtectedRoute>
										<MainLayout />
									</ProtectedRoute>
								}
							>
								<Route path="/" element={<Dashboard />} />
								<Route path="/perfil" element={<Perfil />} />
							</Route>

							{/* Redirección por defecto */}
							<Route path="*" element={<Navigate to="/" />} />

						</Routes>
					</BrowserRouter>

				</MovimientosProvider>
			</FechaProvider>
		</AuthProvider>
	);
}
