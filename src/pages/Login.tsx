import { useState } from "react";
import { supabase } from "../supabase/client";
import ModalCrearCuenta from "./ModalCrearCuenta";

export default function Login() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const [showRegister, setShowRegister] = useState(false);
	const [errorMsg, setErrorMsg] = useState("");

	async function loginEmail() {
		setErrorMsg("");
		setLoading(true);

		const { error } = await supabase.auth.signInWithPassword({
			email,
			password,
		});

		setLoading(false);

		if (error) {
			if (error.message.includes("Email not confirmed")) {
				setErrorMsg(
					"Tu correo aún no ha sido verificado. Revisa tu bandeja de entrada."
				);
			} else {
				setErrorMsg("Credenciales incorrectas o email no verificado.");
			}
			return;
		}

		window.location.href = "/";
	}

	return (
		<div className="h-screen bg-[#E0F2F1] flex items-center justify-center p-6">
			<div className="bg-white shadow-xl rounded-xl p-8 w-full max-w-md">

				<h1 className="text-3xl font-bold text-[#006C7A] text-center mb-6">
					WalletBill
				</h1>

				{/* ERROR BONITO */}
				{errorMsg && (
					<div className="mb-4 p-3 rounded-lg bg-red-100 border border-red-300 text-red-700 flex items-center gap-2">
						<span className="text-xl">⚠️</span>
						<p>{errorMsg}</p>
					</div>
				)}

				{/* EMAIL */}
				<input
					className="w-full p-3 border rounded mb-3 bg-white text-black placeholder-gray-600"
					placeholder="Email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
				/>

				{/* PASSWORD */}
				<input
					type="password"
					className="w-full p-3 border rounded mb-4 bg-white text-black placeholder-gray-600"
					placeholder="Contraseña"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
				/>

				{/* LOGIN */}
				<button
					onClick={loginEmail}
					className="w-full bg-[#0097A7] text-white p-3 rounded mb-2"
					disabled={loading}
				>
					{loading ? "Comprobando..." : "Iniciar sesión"}
				</button>

				{/* REGISTRO */}
				<button
					onClick={() => setShowRegister(true)}
					className="w-full bg-gray-200 text-[#006C7A] p-3 rounded mb-4"
				>
					Crear cuenta
				</button>

				<ModalCrearCuenta
					show={showRegister}
					onClose={() => setShowRegister(false)}
				/>
			</div>
		</div>
	);
}
