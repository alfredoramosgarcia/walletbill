import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./hooks/useAuth";

import "./index.css";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard/Dashboard";
import AddMovimiento from "./pages/AddMovimiento";
import EditMovimiento from "./pages/EditMovimiento";
import Perfil from "./pages/Perfil";

import ProtectedRoute from "./components/auth/ProtectedRoute";
import RedirectIfLogged from "./components/auth/RedirectIfLogged";

import MainLayout from "./layouts/MainLayout";
import { FechaProvider } from "./context/FechaContext";

// Layout sin header
import AuthLayout from "./layouts/AuthLayout";

export default function App() {
	return (
		<AuthProvider>
			<FechaProvider>
				<BrowserRouter>
					<Routes>

						{/* ❌ Páginas SIN HEADER */}
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
						</Route>

						{/* ✅ Páginas CON HEADER */}
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

						<Route path="*" element={<Navigate to="/" />} />

					</Routes>
				</BrowserRouter>
			</FechaProvider>
		</AuthProvider>
	);
}
