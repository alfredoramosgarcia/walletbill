// src/components/ModalCrearCuenta.tsx

import { useState, type FormEvent } from "react";
import { supabase } from "../supabase/client";

export default function ModalCrearCuenta({
	show,
	onClose,
}: {
	show: boolean;
	onClose: () => void;
}) {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [password2, setPassword2] = useState("");
	const [nombre, setNombre] = useState("");

	const [loading, setLoading] = useState(false);

	const [showPassword, setShowPassword] = useState(false);
	const [showPassword2, setShowPassword2] = useState(false);

	const [alertMsg, setAlertMsg] = useState("");
	const [alertType, setAlertType] =
		useState<"error" | "success">("error");

	if (!show) return null;

	/* ========================================================== */
	/* HELPERS                                                    */
	/* ========================================================== */

	function isValidEmail(email: string) {
		return /\S+@\S+\.\S+/.test(email);
	}

	function limpiarFormulario() {
		setEmail("");
		setPassword("");
		setPassword2("");
		setNombre("");
		setAlertMsg("");
		setShowPassword(false);
		setShowPassword2(false);
	}

	function cerrarModal() {
		if (loading) return;

		limpiarFormulario();
		onClose();
	}

	/* ========================================================== */
	/* CREAR CUENTA                                               */
	/* ========================================================== */

	async function crearCuenta(e?: FormEvent) {
		e?.preventDefault();

		if (loading) return;

		setAlertMsg("");

		const nombreLimpio = nombre.trim();
		const emailLimpio = email.trim().toLowerCase();

		/* VALIDACIONES */

		if (!nombreLimpio) {
			setAlertType("error");
			setAlertMsg("Debes introducir tu nombre.");
			return;
		}

		if (!isValidEmail(emailLimpio)) {
			setAlertType("error");
			setAlertMsg("El correo introducido no es válido.");
			return;
		}

		if (password.length < 6) {
			setAlertType("error");
			setAlertMsg(
				"La contraseña debe tener al menos 6 caracteres."
			);
			return;
		}

		if (password !== password2) {
			setAlertType("error");
			setAlertMsg("Las contraseñas no coinciden.");
			return;
		}

		setLoading(true);

		try {
			/* -------------------------------------------------- */
			/* 1. CREAR USUARIO                                   */
			/* -------------------------------------------------- */

			const {
				data,
				error: signUpError,
			} = await supabase.auth.signUp({
				email: emailLimpio,
				password,
			});

			if (signUpError) {
				setAlertType("error");
				setAlertMsg(signUpError.message);
				return;
			}

			/* -------------------------------------------------- */
			/* 2. OBTENER USUARIO                                 */
			/* -------------------------------------------------- */

			const user =
				data.user ??
				data.session?.user;

			if (!user) {
				setAlertType("success");
				setAlertMsg(
					"Cuenta creada. Revisa tu correo para confirmar tu cuenta."
				);
				return;
			}

			/* -------------------------------------------------- */
			/* 3. CREAR PERFIL                                    */
			/* -------------------------------------------------- */

			const { error: profileError } =
				await supabase
					.from("profiles")
					.upsert({
						id: user.id,
						nombre: nombreLimpio,
						avatar_url: "",
					});

			if (profileError) {
				console.error(
					"ERROR PROFILE:",
					profileError
				);

				setAlertType("error");
				setAlertMsg(
					"La cuenta se ha creado, pero hubo un problema creando el perfil."
				);

				return;
			}

			/* -------------------------------------------------- */
			/* OK                                                 */
			/* -------------------------------------------------- */

			setAlertType("success");
			setAlertMsg(
				"Cuenta creada. Revisa tu correo para confirmar."
			);

			setTimeout(() => {
				limpiarFormulario();
				onClose();
			}, 2200);

		} catch (error) {
			console.error(
				"Error creando cuenta:",
				error
			);

			setAlertType("error");
			setAlertMsg(
				"Ha ocurrido un error creando la cuenta."
			);
		} finally {
			setLoading(false);
		}
	}

	/* ========================================================== */
	/* RENDER                                                     */
	/* ========================================================== */

	return (
		<div
			className="
				fixed inset-0 z-[100]
				flex items-center justify-center
				bg-slate-900/40
				px-4 py-6
				backdrop-blur-sm
			"
		>
			<div
				className="
					relative w-full max-w-md
					overflow-hidden
					rounded-[28px]
					border border-white/70
					bg-white
					shadow-2xl
					shadow-slate-900/20
				"
			>

				{/* ================================================== */}
				{/* CABECERA                                           */}
				{/* ================================================== */}

				<div
					className="
						relative overflow-hidden
						border-b border-slate-100
						px-6 pb-6 pt-7
						text-center
					"
					style={{
						background:
							"linear-gradient(135deg, #F2F9F7 0%, #E3F3F0 100%)",
					}}
				>

					{/* DECORACIÓN */}
					<div className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full bg-[#008F8C]/10" />

					{/* CERRAR */}
					<button
						type="button"
						onClick={cerrarModal}
						disabled={loading}
						className="
							absolute right-4 top-4 z-10
							flex h-9 w-9
							items-center justify-center
							rounded-xl
							border border-slate-200
							bg-white
							text-lg font-bold
							text-slate-400
							shadow-sm transition
							hover:bg-slate-50
							hover:text-slate-700
							disabled:opacity-50
						"
						aria-label="Cerrar"
					>
						×
					</button>

					{/* LOGO */}
					<img
						src="/notbackground.png"
						alt="WalletBill"
						className="mx-auto mb-3 h-16 w-16 object-contain"
					/>

					<h2 className="text-2xl font-extrabold tracking-tight text-slate-900">
						Crea tu cuenta
					</h2>

					<p className="mt-2 text-sm text-slate-500">
						Empieza a organizar tus finanzas con{" "}
						<span className="font-bold text-[#008F8C]">
							WalletBill
						</span>
					</p>

				</div>

				{/* ================================================== */}
				{/* FORMULARIO                                         */}
				{/* ================================================== */}

				<form
					onSubmit={crearCuenta}
					className="
						max-h-[70vh]
						overflow-y-auto
						p-6
					"
				>

					{/* ALERTA */}
					{alertMsg && (
						<div
							className={`
								mb-5 flex items-start gap-3
								rounded-xl border p-3.5
								${alertType === "error"
									? "border-rose-200 bg-rose-50 text-rose-600"
									: "border-emerald-200 bg-emerald-50 text-emerald-700"
								}
							`}
						>
							<span className="mt-0.5 text-sm font-extrabold">
								{alertType === "error"
									? "!"
									: "✓"}
							</span>

							<p className="text-sm leading-5">
								{alertMsg}
							</p>
						</div>
					)}

					{/* NOMBRE */}
					<div className="mb-4">

						<label
							htmlFor="register-name"
							className="mb-2 block text-sm font-semibold text-slate-700"
						>
							Nombre
						</label>

						<input
							id="register-name"
							type="text"
							autoComplete="name"
							placeholder="Tu nombre"
							value={nombre}
							onChange={(e) =>
								setNombre(e.target.value)
							}
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
					<div className="mb-4">

						<label
							htmlFor="register-email"
							className="mb-2 block text-sm font-semibold text-slate-700"
						>
							Correo electrónico
						</label>

						<input
							id="register-email"
							type="email"
							autoComplete="email"
							placeholder="nombre@email.com"
							value={email}
							onChange={(e) =>
								setEmail(e.target.value)
							}
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

					{/* PASSWORD */}
					<div className="mb-4">

						<label
							htmlFor="register-password"
							className="mb-2 block text-sm font-semibold text-slate-700"
						>
							Contraseña
						</label>

						<div className="relative">

							<input
								id="register-password"
								type={
									showPassword
										? "text"
										: "password"
								}
								autoComplete="new-password"
								placeholder="Mínimo 6 caracteres"
								value={password}
								onChange={(e) =>
									setPassword(
										e.target.value
									)
								}
								className="
									w-full rounded-xl
									border border-slate-200
									bg-slate-50
									py-3 pl-4 pr-20
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
									setShowPassword(
										!showPassword
									)
								}
								className="
									absolute right-2
									top-1/2
									-translate-y-1/2
									rounded-lg px-3 py-2
									text-xs font-bold
									transition
									hover:bg-slate-100
								"
								style={{
									color: "#006C7A",
								}}
							>
								{showPassword
									? "Ocultar"
									: "Ver"}
							</button>

						</div>

					</div>

					{/* REPETIR PASSWORD */}
					<div className="mb-6">

						<label
							htmlFor="register-password2"
							className="mb-2 block text-sm font-semibold text-slate-700"
						>
							Repetir contraseña
						</label>

						<div className="relative">

							<input
								id="register-password2"
								type={
									showPassword2
										? "text"
										: "password"
								}
								autoComplete="new-password"
								placeholder="Repite tu contraseña"
								value={password2}
								onChange={(e) =>
									setPassword2(
										e.target.value
									)
								}
								className={`
									w-full rounded-xl
									border bg-slate-50
									py-3 pl-4 pr-20
									text-sm font-medium
									text-slate-700
									outline-none transition
									placeholder:text-slate-400
									focus:bg-white
									focus:ring-2
									${password2 &&
										password !== password2
										? "border-rose-300 focus:border-rose-400 focus:ring-rose-100"
										: "border-slate-200 focus:border-[#008F8C] focus:ring-[#008F8C]/10"
									}
								`}
							/>

							<button
								type="button"
								onClick={() =>
									setShowPassword2(
										!showPassword2
									)
								}
								className="
									absolute right-2
									top-1/2
									-translate-y-1/2
									rounded-lg px-3 py-2
									text-xs font-bold
									transition
									hover:bg-slate-100
								"
								style={{
									color: "#006C7A",
								}}
							>
								{showPassword2
									? "Ocultar"
									: "Ver"}
							</button>

						</div>

						{/* FEEDBACK CONTRASEÑAS */}
						{password2 && (
							<p
								className={`mt-2 text-xs font-semibold ${password === password2
									? "text-emerald-600"
									: "text-rose-500"
									}`}
							>
								{password === password2
									? "✓ Las contraseñas coinciden"
									: "Las contraseñas no coinciden"}
							</p>
						)}

					</div>

					{/* CREAR */}
					<button
						type="submit"
						disabled={loading}
						className="
							flex w-full
							items-center justify-center
							rounded-xl
							px-5 py-3.5
							text-sm font-bold
							text-white
							shadow-sm transition
							hover:-translate-y-0.5
							hover:shadow-md
							disabled:cursor-not-allowed
							disabled:translate-y-0
							disabled:opacity-60
						"
						style={{
							background:
								"linear-gradient(135deg, #006C7A 0%, #008F8C 100%)",
						}}
					>
						{loading ? (
							<div className="flex items-center gap-2">

								<span
									className="
										h-4 w-4
										animate-spin rounded-full
										border-2 border-white/30
										border-t-white
									"
								/>

								Creando cuenta...

							</div>
						) : (
							"Crear mi cuenta"
						)}
					</button>

					{/* CANCELAR */}
					<button
						type="button"
						onClick={cerrarModal}
						disabled={loading}
						className="
							mt-3 w-full
							rounded-xl
							border border-slate-200
							bg-white
							px-5 py-3
							text-sm font-semibold
							text-slate-500
							transition
							hover:bg-slate-50
							hover:text-slate-700
							disabled:opacity-50
						"
					>
						Cancelar
					</button>

					<p className="mt-5 text-center text-[11px] leading-5 text-slate-400">
						Al crear una cuenta podrás empezar a organizar
						tus ingresos, gastos y evolución financiera.
					</p>

				</form>

			</div>
		</div>
	);
}