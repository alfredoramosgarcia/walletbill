// src/pages/PerfilUsuario.tsx
import { useEffect, useState } from "react";
import { supabase } from "../supabase/client";
import { useNavigate } from "react-router-dom";
import Alert from "../components/alerts/Alert";

export default function PerfilUsuario() {
	const navigate = useNavigate();

	const [nombre, setNombre] = useState("");
	const [newPass, setNewPass] = useState("");

	const [alert, setAlert] = useState("");
	const [error, setError] = useState("");
	const [, setLoading] = useState(false);

	const [confirmDelete, setConfirmDelete] = useState(false);

	useEffect(() => {
		cargarPerfil();
	}, []);

	async function cargarPerfil() {
		const { data: session } = await supabase.auth.getUser();
		const user = session?.user;
		if (!user) return;

		const { data: perfil } = await supabase
			.from("profiles")
			.select("*")
			.eq("id", user.id)
			.single();

		if (perfil) setNombre(perfil.nombre);
	}

	async function guardarNombre() {
		setLoading(true);
		setError("");

		const { data: session } = await supabase.auth.getUser();
		const user = session?.user;
		if (!user) return;

		const { error } = await supabase
			.from("profiles")
			.update({ nombre })
			.eq("id", user.id);

		setLoading(false);

		if (error) setError("No se pudo actualizar el nombre.");
		else setAlert("Nombre actualizado.");
	}

	async function cambiarPassword() {
		setLoading(true);
		setError("");

		const { error } = await supabase.auth.updateUser({
			password: newPass,
		});

		setLoading(false);

		if (error) setError(error.message);
		else setAlert("Contraseña actualizada.");
	}

	async function eliminarCuenta() {
		setLoading(true);
		setError("");

		const { error } = await supabase.rpc("delete_user");

		setLoading(false);

		if (error) {
			setError("Error eliminando cuenta.");
			return;
		}

		setAlert("Cuenta eliminada correctamente.");
		await supabase.auth.signOut();

		localStorage.removeItem("supabase.auth.token");
		localStorage.removeItem("supabase.auth.refresh_token");

		navigate("/login", { replace: true });
		window.location.reload();
	}

	return (
		<div className="min-h-screen flex items-center justify-center bg-[#D9ECEA] px-4">

			<Alert message={alert} onClose={() => setAlert("")} />

			<div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-lg">

				{/* Título + volver */}
				<div className="relative flex items-center justify-center mb-6">
					<h1 className="text-2xl font-bold text-[#006C7A]">Mi Perfil</h1>

					<button
						onClick={() => navigate(-1)}
						className="absolute right-0 px-4 py-2 bg-gray-200 text-black rounded-lg text-sm font-semibold hover:bg-gray-300 transition"
					>
						←
					</button>
				</div>

				{/* Error */}
				{error && (
					<div className="mb-3 p-3 bg-red-100 border border-red-300 text-red-700 rounded text-center text-sm">
						{error}
					</div>
				)}

				<div className="space-y-6">

					{/* Nombre */}
					<div>
						<label className="text-sm font-semibold text-black">Nombre</label>
						<input
							className="w-full mt-1 p-3 rounded-xl border bg-gray-50 text-black"
							type="text"
							value={nombre}
							onChange={(e) => setNombre(e.target.value)}
						/>
						<button
							onClick={guardarNombre}
							className="mt-2 px-4 py-2 bg-[#0097A7] text-white rounded-lg text-sm font-semibold hover:bg-[#008190] transition mx-auto block"
						>
							Guardar nombre
						</button>
					</div>

					{/* Contraseña */}
					<div>
						<label className="text-sm font-semibold text-black">Nueva contraseña</label>
						<input
							className="w-full mt-1 p-3 rounded-xl border bg-gray-50 text-black"
							type="password"
							value={newPass}
							onChange={(e) => setNewPass(e.target.value)}
						/>
						<button
							onClick={cambiarPassword}
							className="mt-2 px-4 py-2 bg-[#0097A7] text-white rounded-lg text-sm font-semibold hover:bg-[#008190] transition mx-auto block"
						>
							Cambiar contraseña
						</button>
					</div>

					{/* Borrar cuenta */}
					<div className="text-center">
						<button
							onClick={() => setConfirmDelete(true)}
							className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700 transition"
						>
							🗑️ Borrar mi cuenta
						</button>
					</div>

				</div>
			</div>

			{/* Modal delete */}
			{confirmDelete && (
				<div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
					<div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-sm text-center">
						<h2 className="text-lg font-semibold text-black mb-4">
							¿Eliminar tu cuenta?
						</h2>

						<p className="text-gray-600 text-sm mb-6">
							Esta acción no se puede deshacer.
						</p>

						<div className="flex justify-center gap-4">
							<button
								onClick={() => setConfirmDelete(false)}
								className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 text-black"
							>
								Cancelar
							</button>

							<button
								onClick={eliminarCuenta}
								className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
							>
								Eliminar
							</button>
						</div>
					</div>
				</div>
			)}

		</div>
	);
}
