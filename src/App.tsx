import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./hooks/useAuth";

import "./index.css"

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard/Dashboard";
import AddMovimiento from "./pages/AddMovimiento";
import EditMovimiento from "./pages/EditMovimiento";

import ProtectedRoute from "./components/auth/ProtectedRoute";
import RedirectIfLogged from "./components/auth/RedirectIfLogged";
import Perfil from "./pages/Perfil";





export default function App() {
	return (
		<AuthProvider>
			<BrowserRouter>
				<Routes>
					{/* Login accesible solo si NO estás logueado */}
					<Route
						path="/login"
						element={
							<RedirectIfLogged>
								<Login />
							</RedirectIfLogged>
						}
					/>

					<Route
						path="/perfil"
						element={
							<ProtectedRoute>
								<Perfil />
							</ProtectedRoute>
						}
					/>

					{/* Dashboard y movimientos solo para usuarios logueados */}
					<Route
						path="/"
						element={
							<ProtectedRoute>
								<Dashboard />
							</ProtectedRoute>
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

					{/* Cualquier ruta desconocida → Dashboard si logueado o Login */}
					<Route path="*" element={<Navigate to="/" />} />
				</Routes>
			</BrowserRouter>
		</AuthProvider>
	);
}
