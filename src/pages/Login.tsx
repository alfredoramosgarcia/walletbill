// src/pages/Login.tsx
import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";

import { supabase } from "../supabase/client";
import ModalCrearCuenta from "./ModalCrearCuenta";

export default function Login() {
	const navigate = useNavigate();

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const [loading, setLoading] = useState(false);
	const [showRegister, setShowRegister] = useState(false);
	const [showPassword, setShowPassword] = useState(false);

	const [errorMsg, setErrorMsg] = useState("");

	async function loginEmail(e?: FormEvent) {
		e?.preventDefault();

		if (loading) return;

		setErrorMsg("");

		const emailLimpio = email.trim();

		if (!emailLimpio || !password) {
			setErrorMsg("Introduce tu email y contraseña.");
			return;
		}

		setLoading(true);

		try {
			const { data, error } = await supabase.auth.signInWithPassword({
				email: emailLimpio,
				password,
			});

			if (error) {
				if (error.message.includes("Email not confirmed")) {
					setErrorMsg(
						"Tu correo aún no ha sido verificado. Revisa tu bandeja de entrada."
					);
				} else {
					setErrorMsg(
						"El email o la contraseña no son correctos."
					);
				}

				return;
			}

			// Comprobamos que Supabase realmente ha creado la sesión
			if (!data.session || !data.user) {
				setErrorMsg(
					"No se pudo iniciar la sesión. Inténtalo de nuevo."
				);
				return;
			}

			// Login correcto
			navigate("/dashboard", {
				replace: true,
			});

		} catch (error) {
			console.error("Error login:", error);

			setErrorMsg(
				"Ha ocurrido un error al iniciar sesión."
			);
		} finally {
			setLoading(false);
		}
	}

	return (
		<main
			className="
				relative flex min-h-screen
				items-center justify-center
				overflow-hidden px-4 py-8
				sm:px-6
			"
			style={{
				background:
					"linear-gradient(135deg, #D9ECEA 0%, #EAF6F4 45%, #CFE9E5 100%)",
			}}
		>
			{/* DECORACIÓN DE FONDO */}
			<div
				className="
					pointer-events-none absolute
					-left-32 -top-32
					h-96 w-96 rounded-full
					opacity-20 blur-3xl
				"
				style={{
					backgroundColor: "#008F8C",
				}}
			/>

			<div
				className="
					pointer-events-none absolute
					-bottom-40 -right-32
					h-[420px] w-[420px]
					rounded-full opacity-20 blur-3xl
				"
				style={{
					backgroundColor: "#006C7A",
				}}
			/>

			<div className="relative z-10 w-full max-w-md">

				{/* ================================================== */}
				{/* MARCA                                              */}
				{/* ================================================== */}

				<div className="mb-7 text-center">

					{/* AQUÍ PODRÁS PONER TU PNG DE WALLETBILL */}
					{/* LOGO WALLETBILL */}
					<button
						type="button"
						onClick={() => navigate("/")}
						className="
		mx-auto mb-4
		flex items-center justify-center
		border-0 bg-transparent p-0
		transition
		hover:scale-105
		active:scale-95
	"
						title="Volver al inicio"
						aria-label="Volver al inicio"
					>
						<img
							src="/notbackground.png"
							alt="WalletBill"
							className="h-20 w-20 object-contain"
						/>
					</button>

					<h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
						Wallet
						<span style={{ color: "#008F8C" }}>
							Bill
						</span>
					</h1>

					<p className="mt-2 text-sm font-medium text-slate-500">
						Tus finanzas, bajo control.
					</p>

				</div>

				{/* ================================================== */}
				{/* LOGIN                                              */}
				{/* ================================================== */}

				<div className="overflow-hidden rounded-3xl border border-white/70 bg-white shadow-xl shadow-slate-900/5">

					<div className="border-b border-slate-100 px-6 py-5 sm:px-8">

						<h2 className="text-xl font-bold text-slate-900">
							Bienvenido
						</h2>

						<p className="mt-1 text-sm text-slate-400">
							Inicia sesión para acceder a WalletBill.
						</p>

					</div>

					<form
						onSubmit={loginEmail}
						className="p-6 sm:p-8"
					>

						{/* ERROR */}
						{errorMsg && (
							<div className="mb-5 flex gap-3 rounded-xl border border-rose-200 bg-rose-50 p-3.5">

								<span
									className="mt-0.5 font-bold"
									style={{
										color: "#E11D48",
									}}
								>
									!
								</span>

								<p className="text-sm leading-5 text-rose-600">
									{errorMsg}
								</p>

							</div>
						)}

						{/* EMAIL */}
						<div className="mb-5">

							<label
								htmlFor="email"
								className="mb-2 block text-sm font-semibold text-slate-700"
							>
								Correo electrónico
							</label>

							<input
								id="email"
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
						<div className="mb-6">

							<label
								htmlFor="password"
								className="mb-2 block text-sm font-semibold text-slate-700"
							>
								Contraseña
							</label>

							<div className="relative">

								<input
									id="password"
									type={
										showPassword
											? "text"
											: "password"
									}
									autoComplete="current-password"
									placeholder="Tu contraseña"
									value={password}
									onChange={(e) =>
										setPassword(e.target.value)
									}
									className="
										w-full rounded-xl
										border border-slate-200
										bg-slate-50
										py-3 pl-4 pr-14
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

								{/* Evitamos SVG por los problemas
								    que hemos visto con tus iconos */}
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

						{/* LOGIN */}
						<button
							type="submit"
							disabled={loading}
							className="
								flex w-full
								items-center justify-center
								rounded-xl px-5 py-3.5
								text-sm font-bold
								text-white shadow-sm
								transition
								hover:opacity-90
								disabled:cursor-not-allowed
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

									Comprobando...

								</div>
							) : (
								"Iniciar sesión"
							)}
						</button>

						{/* SEPARADOR */}
						<div className="my-6 flex items-center gap-4">

							<div className="h-px flex-1 bg-slate-200" />

							<span className="text-xs font-medium text-slate-400">
								o
							</span>

							<div className="h-px flex-1 bg-slate-200" />

						</div>

						{/* REGISTRO */}
						<div className="text-center">

							<p className="mb-3 text-sm text-slate-500">
								¿Todavía no tienes una cuenta?
							</p>

							<button
								type="button"
								onClick={() =>
									setShowRegister(true)
								}
								className="
									w-full rounded-xl
									border px-5 py-3
									text-sm font-bold
									transition
									hover:bg-[#E8F6F3]
								"
								style={{
									borderColor: "#B8DCD8",
									color: "#006C7A",
								}}
							>
								Crear cuenta
							</button>

						</div>

					</form>
				</div>

				<p className="mt-6 text-center text-xs text-slate-400">
					WalletBill · Finanzas personales
				</p>

			</div>

			<ModalCrearCuenta
				show={showRegister}
				onClose={() =>
					setShowRegister(false)
				}
			/>

		</main>
	);
}