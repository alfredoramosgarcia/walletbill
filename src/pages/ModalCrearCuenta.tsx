// src/components/ModalCrearCuenta.tsx
import { useState } from "react";
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

	const [alertMsg, setAlertMsg] = useState("");
	const [alertType, setAlertType] =
		useState<"error" | "success">("error");

	if (!show) return null;

	function isValidEmail(email: string) {
		return /\S+@\S+\.\S+/.test(email);
	}

	// ==========================================================
	// CREAR CUENTA + PERFIL
	// ==========================================================

	async function crearCuenta() {
		setAlertMsg("");

		// VALIDACIONES...
		if (nombre.trim().length === 0) {
			setAlertType("error");
			setAlertMsg("Debes introducir tu nombre.");
			return;
		}
		if (!isValidEmail(email)) {
			setAlertType("error");
			setAlertMsg("El correo introducido no es válido.");
			return;
		}
		if (password !== password2) {
			setAlertType("error");
			setAlertMsg("Las contraseñas no coinciden.");
			return;
		}

		setLoading(true);

		// 1) Crear usuario
		const { data, error: signUpError } = await supabase.auth.signUp({
			email,
			password
		});

		if (signUpError) {
			setAlertType("error");
			setAlertMsg(signUpError.message);
			return;
		}

		// 2) Obtener el usuario
		const user = data.user ?? data.session?.user;

		if (!user) {
			setAlertType("error");
			setAlertMsg("Confirma tu correo para activar la cuenta.");
			return;
		}

		const userId = user.id;

		// 3) Crear perfil
		const { error: profileError } = await supabase
			.from("profiles")
			.upsert({
				id: userId,
				nombre,
				avatar_url: ""
			});

		if (profileError) {
			console.log("ERROR PROFILE:", profileError);
		}



		setAlertType("success");
		setAlertMsg("Cuenta creada. Revisa tu correo para confirmar.");

		setTimeout(() => {
			onClose();
		}, 2000);
	}

	return (
		<div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
			<div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md animate-fade-in">

				<h2 className="text-2xl font-bold text-[#006C7A] text-center mb-4">
					Crear Cuenta
				</h2>

				{alertMsg && (
					<div
						className={`mb-4 p-3 rounded-lg border flex items-center gap-2 animate-fade-in
							${alertType === "error"
								? "bg-red-100 border-red-300 text-red-700"
								: "bg-green-100 border-green-300 text-green-700"
							}`}
					>
						<span className="text-xl">
							{alertType === "error" ? "⚠️" : "✅"}
						</span>
						<p>{alertMsg}</p>
					</div>
				)}

				{/* NOMBRE */}
				<input
					type="text"
					className="w-full p-3 border rounded mb-3 bg-gray-50 text-black"
					placeholder="Tu nombre *"
					value={nombre}
					onChange={(e) => setNombre(e.target.value)}
				/>

				{/* EMAIL */}
				<input
					type="email"
					className="w-full p-3 border rounded mb-3 bg-gray-50 text-black"
					placeholder="Tu correo *"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
				/>

				{/* CONTRASEÑA */}
				<input
					type="password"
					className="w-full p-3 border rounded mb-3 bg-gray-50 text-black"
					placeholder="Contraseña *"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
				/>

				{/* REPETIR CONTRASEÑA */}
				<input
					type="password"
					className="w-full p-3 border rounded mb-4 bg-gray-50 text-black"
					placeholder="Repetir contraseña *"
					value={password2}
					onChange={(e) => setPassword2(e.target.value)}
				/>

				<button
					onClick={crearCuenta}
					disabled={loading}
					className="w-full bg-[#0097A7] text-white p-3 rounded mb-3 hover:bg-[#008190] transition"
				>
					{loading ? "Creando..." : "Crear cuenta"}
				</button>

				<button
					onClick={onClose}
					className="w-full bg-gray-200 text-[#006C7A] p-3 rounded hover:bg-gray-300 transition"
				>
					Cancelar
				</button>
			</div>
		</div>
	);
}
