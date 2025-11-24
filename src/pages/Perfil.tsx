import { useEffect, useState, useRef } from "react";
import { supabase } from "../supabase/client";
import { useNavigate } from "react-router-dom";

export default function Perfil() {
	const navigate = useNavigate();

	const [nombre, setNombre] = useState("");
	const [avatar, setAvatar] = useState("");
	const [showPasswordBox, setShowPasswordBox] = useState(false);

	// Password fields
	const [oldPassword, setOldPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [newPassword2, setNewPassword2] = useState("");

	// Input file
	const fileInputRef = useRef<HTMLInputElement | null>(null);

	useEffect(() => {
		cargarPerfil();
	}, []);

	// ==============================
	// CARGAR PERFIL
	// ==============================
	async function cargarPerfil() {
		const user = (await supabase.auth.getUser()).data.user;
		if (!user) return;

		const { data } = await supabase
			.from("profiles")
			.select("*")
			.eq("id", user.id)   // <-- CORREGIDO (antes: user_id)
			.single();

		if (data) {
			setNombre(data.nombre || "");
			setAvatar(data.avatar_url || "");
		}
	}


	// ==============================
	// SUBIR AVATAR AL STORAGE
	// ==============================
	async function handleFileSelect(e: any) {
		const file = e.target.files?.[0];
		if (!file) return;

		const user = (await supabase.auth.getUser()).data.user;
		if (!user) return;

		const ext = file.name.split(".").pop();
		const fileName = `${user.id}.${ext}`;
		const filePath = `avatars/${fileName}`;

		// Subir archivo
		const { error: uploadError } = await supabase.storage
			.from("avatars")
			.upload(filePath, file, { upsert: true });

		if (uploadError) {
			console.log(uploadError);
			alert("Error al subir la imagen");
			return;
		}

		// Obtener URL pública
		const { data: publicUrl } = supabase.storage
			.from("avatars")
			.getPublicUrl(filePath);

		if (!publicUrl) {
			alert("Error al obtener URL pública");
			return;
		}

		setAvatar(publicUrl.publicUrl);
	}

	// ==============================
	// GUARDAR PERFIL
	// ==============================
	async function guardarPerfil() {
		const { data: userData } = await supabase.auth.getUser();
		const user = userData?.user;

		if (!user) return alert("No hay usuario autenticado");

		const { error } = await supabase
			.from("profiles")
			.upsert(
				{
					id: user.id,       // 👈 CORRECTO: la PK es id
					nombre,
					avatar_url: avatar,
				},
				{ onConflict: "id" } // 👈 CORRECTO
			);

		if (error) {
			console.log(error);
			alert("Error al guardar el perfil");
			return;
		}

		navigate("/");
	}


	// ==============================
	// CAMBIO DE CONTRASEÑA
	// ==============================
	async function cambiarPassword() {
		if (!oldPassword || !newPassword || !newPassword2) {
			return alert("Rellena todos los campos");
		}

		if (newPassword !== newPassword2) {
			return alert("Las contraseñas nuevas no coinciden");
		}

		const user = (await supabase.auth.getUser()).data.user;
		if (!user) return;

		// Verificar contraseña antigua
		const { error: signInError } = await supabase.auth.signInWithPassword({
			email: user.email!,
			password: oldPassword,
		});

		if (signInError) {
			return alert("La contraseña actual no es correcta");
		}

		// Actualizar contraseña
		const { error } = await supabase.auth.updateUser({
			password: newPassword,
		});

		if (error) alert(error.message);
		else alert("Contraseña cambiada correctamente ✔️");
	}

	return (
		<div className="min-h-screen bg-[#E0F2F1] p-6">
			<button
				onClick={() => navigate(-1)}
				className="mb-4 px-4 py-2 bg-gray-300 rounded"
			>
				⬅ Volver
			</button>

			<h1 className="text-2xl font-bold text-[#006C7A] mb-6">Editar Perfil</h1>

			<div className="bg-white p-4 rounded-xl shadow space-y-4">

				{/* AVATAR */}
				<div className="flex flex-col items-center gap-2">
					<img
						src={avatar || "/icono.png"}
						className="w-28 h-28 rounded-full object-cover border cursor-pointer hover:scale-105 transition"
						onClick={() => fileInputRef.current?.click()}
					/>
					<p className="text-sm text-gray-600">Toca la imagen para cambiarla</p>

					<input
						type="file"
						accept="image/*"
						ref={fileInputRef}
						className="hidden"
						onChange={handleFileSelect}
					/>
				</div>

				{/* NOMBRE */}
				<input
					className="w-full p-3 border rounded"
					placeholder="Nombre"
					value={nombre}
					onChange={(e) => setNombre(e.target.value)}
				/>

				<button
					onClick={guardarPerfil}
					className="w-full bg-[#0097A7] text-white p-3 rounded"
				>
					Guardar Perfil
				</button>

				{/* CAMBIO CONTRASEÑA */}
				<div className="mt-4">
					<button
						onClick={() => setShowPasswordBox(!showPasswordBox)}
						className="text-sm text-[#006C7A] underline"
					>
						🔐 Cambiar contraseña
					</button>

					{showPasswordBox && (
						<div className="mt-3 bg-gray-50 border rounded-lg p-4 space-y-3">

							<input
								type="password"
								className="w-full p-3 border rounded"
								placeholder="Contraseña actual"
								value={oldPassword}
								onChange={(e) => setOldPassword(e.target.value)}
							/>

							<input
								type="password"
								className="w-full p-3 border rounded"
								placeholder="Nueva contraseña"
								value={newPassword}
								onChange={(e) => setNewPassword(e.target.value)}
							/>

							<input
								type="password"
								className="w-full p-3 border rounded"
								placeholder="Repetir nueva contraseña"
								value={newPassword2}
								onChange={(e) => setNewPassword2(e.target.value)}
							/>

							<button
								onClick={cambiarPassword}
								className="w-full bg-red-500 text-white p-3 rounded"
							>
								Confirmar Cambio
							</button>
						</div>
					)}
				</div>

			</div>
		</div>
	);
}
