// src/pages/PerfilUsuario.tsx

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
	Check,
	Eye,
	EyeOff,
	KeyRound,
	ShieldCheck,
	Trash2,
	UserRound,
} from "lucide-react";

import { supabase } from "../supabase/client";
import Alert from "../components/alerts/Alert";

export default function PerfilUsuario() {
	const navigate = useNavigate();

	const [nombre, setNombre] = useState("");
	const [email, setEmail] = useState("");
	const [newPass, setNewPass] = useState("");

	const [mostrarPassword, setMostrarPassword] = useState(false);

	const [guardandoNombre, setGuardandoNombre] = useState(false);
	const [guardandoPassword, setGuardandoPassword] = useState(false);
	const [eliminando, setEliminando] = useState(false);

	const [alert, setAlert] = useState("");
	const [alertType, setAlertType] =
		useState<"success" | "error">("success");

	const [confirmDelete, setConfirmDelete] = useState(false);

	useEffect(() => {
		cargarPerfil();
	}, []);

	/* ========================================================== */
	/* CARGAR PERFIL                                              */
	/* ========================================================== */

	async function cargarPerfil() {
		const {
			data: { user },
		} = await supabase.auth.getUser();

		if (!user) return;

		setEmail(user.email ?? "");

		const { data: perfil, error } = await supabase
			.from("profiles")
			.select("nombre")
			.eq("id", user.id)
			.maybeSingle();

		if (error) {
			setAlertType("error");
			setAlert("No se pudo cargar el perfil.");
			return;
		}

		if (perfil) {
			setNombre(perfil.nombre ?? "");
		}
	}

	/* ========================================================== */
	/* GUARDAR NOMBRE                                             */
	/* ========================================================== */

	async function guardarNombre() {
		if (guardandoNombre) return;

		const nombreLimpio = nombre.trim();

		if (!nombreLimpio) {
			setAlert("Debes introducir un nombre.");
			setAlertType("error");
			return;
		}

		setGuardandoNombre(true);

		try {
			const {
				data: { user },
			} = await supabase.auth.getUser();

			if (!user) {
				setAlert("No se ha podido identificar al usuario.");
				setAlertType("error");
				return;
			}

			const { error } = await supabase
				.from("profiles")
				.update({
					nombre: nombreLimpio,
				})
				.eq("id", user.id);

			if (error) {
				setAlert("No se pudo actualizar el nombre.");
				setAlertType("error");
				return;
			}

			setNombre(nombreLimpio);

			setAlert("Nombre actualizado correctamente.");
			setAlertType("success");
		} finally {
			setGuardandoNombre(false);
		}
	}

	/* ========================================================== */
	/* CAMBIAR CONTRASEÑA                                         */
	/* ========================================================== */

	async function cambiarPassword() {
		if (guardandoPassword) return;

		if (!newPass.trim()) {
			setAlert("Introduce una nueva contraseña.");
			setAlertType("error");
			return;
		}

		if (newPass.length < 6) {
			setAlert(
				"La contraseña debe tener al menos 6 caracteres."
			);
			setAlertType("error");
			return;
		}

		setGuardandoPassword(true);

		try {
			const { error } = await supabase.auth.updateUser({
				password: newPass,
			});

			if (error) {
				setAlert(error.message);
				setAlertType("error");
				return;
			}

			setNewPass("");

			setAlert("Contraseña actualizada correctamente.");
			setAlertType("success");
		} finally {
			setGuardandoPassword(false);
		}
	}

	/* ========================================================== */
	/* ELIMINAR CUENTA                                            */
	/* ========================================================== */

	async function eliminarCuenta() {
		if (eliminando) return;

		setEliminando(true);

		try {
			const { error } = await supabase.rpc("delete_user");

			if (error) {
				setAlert("Error eliminando la cuenta.");
				setAlertType("error");
				return;
			}

			await supabase.auth.signOut();

			navigate("/login", {
				replace: true,
			});
		} finally {
			setEliminando(false);
		}
	}

	return (
		<main className="min-h-screen bg-transparent">

			<Alert
				message={alert}
				type={alertType}
				onClose={() => setAlert("")}
			/>

			<div className="mx-auto w-full max-w-3xl px-4 py-6 sm:px-6 lg:py-8">

				{/* ================================================== */}
				{/* CABECERA                                           */}
				{/* ================================================== */}

				<div className="mb-6 flex items-start justify-between gap-4">

					<div>
						<p
							className="mb-1 text-sm font-semibold"
							style={{ color: "#008F8C" }}
						>
							Mi cuenta
						</p>

						<h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
							Perfil
						</h1>

						<p className="mt-1 text-sm text-slate-500">
							Gestiona tus datos personales y la seguridad de tu cuenta.
						</p>
					</div>

					{/* Carácter en lugar de SVG */}
					<button
						type="button"
						onClick={() => navigate(-1)}
						className="
							flex h-10 w-10 shrink-0
							items-center justify-center
							rounded-xl border border-slate-200
							bg-white shadow-sm transition
							hover:border-[#008F8C]
							hover:bg-[#E8F6F3]
						"
						style={{
							color: "#006C7A",
						}}
						title="Volver"
						aria-label="Volver"
					>
						<span
							className="text-xl font-bold leading-none"
							style={{ color: "#006C7A" }}
						>
							←
						</span>
					</button>

				</div>

				<div className="space-y-5">

					{/* ================================================== */}
					{/* DATOS PERSONALES                                    */}
					{/* ================================================== */}

					<section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

						<div className="flex items-center gap-3 border-b border-slate-100 px-5 py-5 sm:px-6">

							<div
								className="flex h-10 w-10 items-center justify-center rounded-xl"
								style={{
									backgroundColor: "#E8F6F3",
									color: "#006C7A",
								}}
							>
								<UserRound size={18} />
							</div>

							<div>
								<h2 className="font-bold text-slate-800">
									Datos personales
								</h2>

								<p className="text-xs text-slate-400">
									Información de tu perfil en WalletBill.
								</p>
							</div>

						</div>

						<div className="space-y-5 p-5 sm:p-6">

							{/* NOMBRE */}
							<div>
								<label className="mb-2 block text-sm font-semibold text-slate-700">
									Nombre
								</label>

								<input
									type="text"
									value={nombre}
									onChange={(e) =>
										setNombre(e.target.value)
									}
									onKeyDown={(e) => {
										if (e.key === "Enter") {
											guardarNombre();
										}
									}}
									placeholder="Tu nombre"
									className="
										w-full rounded-xl
										border border-slate-200
										bg-slate-50
										px-4 py-3
										text-sm font-medium
										text-slate-700
										outline-none transition
										placeholder:text-slate-400
										focus:border-[#008F8C]
										focus:bg-white
										focus:ring-2
										focus:ring-[#008F8C]/10
									"
								/>
							</div>

							{/* EMAIL */}
							<div>
								<label className="mb-2 block text-sm font-semibold text-slate-700">
									Correo electrónico
								</label>

								<input
									type="email"
									value={email}
									readOnly
									className="
										w-full cursor-not-allowed
										rounded-xl border border-slate-200
										bg-slate-100
										px-4 py-3
										text-sm font-medium
										text-slate-500
										outline-none
									"
								/>

								<p className="mt-2 text-xs text-slate-400">
									El correo asociado a tu cuenta.
								</p>
							</div>

							<div className="flex justify-end">
								<button
									type="button"
									onClick={guardarNombre}
									disabled={guardandoNombre}
									className="
										inline-flex items-center
										justify-center gap-2
										rounded-xl px-5 py-3
										text-sm font-bold text-white
										shadow-sm transition
										hover:opacity-90
										disabled:cursor-not-allowed
										disabled:opacity-60
									"
									style={{
										background:
											"linear-gradient(135deg, #006C7A 0%, #008F8C 100%)",
									}}
								>
									{guardandoNombre ? (
										<>
											<span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
											Guardando...
										</>
									) : (
										<>
											<Check size={16} />
											Guardar nombre
										</>
									)}
								</button>
							</div>

						</div>
					</section>

					{/* ================================================== */}
					{/* SEGURIDAD                                          */}
					{/* ================================================== */}

					<section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

						<div className="flex items-center gap-3 border-b border-slate-100 px-5 py-5 sm:px-6">

							<div
								className="flex h-10 w-10 items-center justify-center rounded-xl"
								style={{
									backgroundColor: "#E8F6F3",
									color: "#006C7A",
								}}
							>
								<ShieldCheck size={18} />
							</div>

							<div>
								<h2 className="font-bold text-slate-800">
									Seguridad
								</h2>

								<p className="text-xs text-slate-400">
									Actualiza la contraseña de acceso.
								</p>
							</div>

						</div>

						<div className="p-5 sm:p-6">

							<label className="mb-2 block text-sm font-semibold text-slate-700">
								Nueva contraseña
							</label>

							<div className="relative">

								<KeyRound
									size={17}
									className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
								/>

								<input
									type={
										mostrarPassword
											? "text"
											: "password"
									}
									value={newPass}
									onChange={(e) =>
										setNewPass(e.target.value)
									}
									onKeyDown={(e) => {
										if (e.key === "Enter") {
											cambiarPassword();
										}
									}}
									placeholder="Nueva contraseña"
									autoComplete="new-password"
									className="
										w-full rounded-xl
										border border-slate-200
										bg-slate-50
										py-3 pl-11 pr-12
										text-sm font-medium
										text-slate-700
										outline-none transition
										placeholder:text-slate-400
										focus:border-[#008F8C]
										focus:bg-white
										focus:ring-2
										focus:ring-[#008F8C]/10
									"
								/>

								<button
									type="button"
									onClick={() =>
										setMostrarPassword(
											!mostrarPassword
										)
									}
									className="
										absolute right-3 top-1/2
										flex h-8 w-8
										-translate-y-1/2
										items-center justify-center
										rounded-lg text-slate-400
										transition hover:bg-slate-100
										hover:text-slate-600
									"
									aria-label={
										mostrarPassword
											? "Ocultar contraseña"
											: "Mostrar contraseña"
									}
								>
									{mostrarPassword ? (
										<EyeOff size={17} />
									) : (
										<Eye size={17} />
									)}
								</button>

							</div>

							<p className="mt-2 text-xs text-slate-400">
								Utiliza al menos 6 caracteres.
							</p>

							<div className="mt-5 flex justify-end">

								<button
									type="button"
									onClick={cambiarPassword}
									disabled={
										guardandoPassword ||
										!newPass
									}
									className="
										inline-flex items-center
										justify-center gap-2
										rounded-xl px-5 py-3
										text-sm font-bold text-white
										shadow-sm transition
										hover:opacity-90
										disabled:cursor-not-allowed
										disabled:opacity-40
									"
									style={{
										background:
											"linear-gradient(135deg, #006C7A 0%, #008F8C 100%)",
									}}
								>
									{guardandoPassword ? (
										<>
											<span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
											Actualizando...
										</>
									) : (
										<>
											<Check size={16} />
											Cambiar contraseña
										</>
									)}
								</button>

							</div>
						</div>
					</section>

					{/* ================================================== */}
					{/* ZONA PELIGROSA                                     */}
					{/* ================================================== */}

					<section className="rounded-3xl border border-rose-200 bg-white p-5 shadow-sm sm:p-6">

						<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

							<div>
								<p className="font-bold text-slate-800">
									Eliminar cuenta
								</p>

								<p className="mt-1 max-w-lg text-sm leading-6 text-slate-500">
									Elimina permanentemente tu cuenta y los datos asociados.
									Esta acción no se puede deshacer.
								</p>
							</div>

							<button
								type="button"
								onClick={() =>
									setConfirmDelete(true)
								}
								className="
									shrink-0 rounded-xl
									border border-rose-200
									bg-rose-50 px-4 py-2.5
									text-sm font-semibold
									text-rose-600 transition
									hover:bg-rose-100
								"
							>
								Eliminar cuenta
							</button>

						</div>
					</section>

				</div>
			</div>

			{/* ====================================================== */}
			{/* MODAL ELIMINAR CUENTA                                  */}
			{/* ====================================================== */}

			{confirmDelete && (
				<div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/30 px-4 backdrop-blur-sm">

					<div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl">

						<div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-500">
							<Trash2 size={21} />
						</div>

						<h2 className="text-xl font-bold text-slate-900">
							¿Eliminar tu cuenta?
						</h2>

						<p className="mt-2 text-sm leading-6 text-slate-500">
							Tu cuenta se eliminará de forma permanente.
							Esta acción no se puede deshacer.
						</p>

						<div className="mt-6 flex justify-end gap-3">

							<button
								type="button"
								onClick={() =>
									setConfirmDelete(false)
								}
								disabled={eliminando}
								className="
									rounded-xl border border-slate-200
									bg-white px-4 py-2.5
									text-sm font-semibold text-slate-600
									transition hover:bg-slate-50
								"
							>
								Cancelar
							</button>

							<button
								type="button"
								onClick={eliminarCuenta}
								disabled={eliminando}
								className="
									inline-flex items-center gap-2
									rounded-xl bg-rose-600
									px-4 py-2.5
									text-sm font-semibold text-white
									transition hover:bg-rose-700
									disabled:opacity-60
								"
							>
								{eliminando ? (
									<>
										<span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
										Eliminando...
									</>
								) : (
									<>
										Eliminar definitivamente
									</>
								)}
							</button>

						</div>
					</div>
				</div>
			)}

		</main>
	);
}