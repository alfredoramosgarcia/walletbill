import { useEffect, useState } from "react";
import { supabase } from "../supabase/client";
import { useParams, useNavigate } from "react-router-dom";

export default function EditMovimiento() {
	const { id } = useParams();
	const navigate = useNavigate();

	const [mov, setMov] = useState<any>(null);
	const [favorito, setFavorito] = useState(false);
	const [favId, setFavId] = useState<string | null>(null);

	useEffect(() => {
		cargar();
	}, []);

	// =====================================================
	// CARGAR MOVIMIENTO Y FAVORITO
	// =====================================================
	async function cargar() {
		const { data } = await supabase
			.from("movimientos")
			.select("*")
			.eq("id", id)
			.single();

		setMov(data);

		// Buscar favorito SOLO por user_id + concepto + categoria
		const { data: fav } = await supabase
			.from("favoritos")
			.select("*")
			.eq("user_id", data.user_id)
			.eq("concepto", data.concepto)
			.eq("categoria", data.categoria)
			.limit(1)
			.single();

		setFavorito(!!fav);
		setFavId(fav?.id || null);
	}


	// =====================================================
	// GUARDAR CAMBIOS
	// =====================================================
	async function guardar() {
		// 1) Actualizar movimiento
		await supabase
			.from("movimientos")
			.update({
				categoria: mov.categoria,
				concepto: mov.concepto,
				tipo: mov.tipo,
				cantidad: Number(mov.cantidad),
			})
			.eq("id", id);

		// 2) Si está marcado como favorito → upsert
		if (favorito) {
			await supabase.from("favoritos").upsert({
				id: favId || undefined, // si existe, lo actualiza
				user_id: mov.user_id,
				tipo: mov.tipo,
				categoria: mov.categoria,
				concepto: mov.concepto,
				cantidad: Number(mov.cantidad),
			});
		}

		// 3) Si NO está marcado → eliminar usando el ID real
		else if (favId) {
			await supabase.from("favoritos").delete().eq("id", favId);
		}

		navigate("/");
	}


	// =====================================================
	// BORRAR MOVIMIENTO
	// =====================================================
	async function borrar() {
		const { data: sessionData } = await supabase.auth.getSession();
		const session = sessionData?.session;

		// Borrar movimiento
		await supabase.from("movimientos").delete().eq("id", id);

		// Mantener sesión activa (iOS issue workaround)
		if (session) {
			await supabase.auth.setSession({
				access_token: session.access_token,
				refresh_token: session.refresh_token,
			});
		}

		navigate("/");
	}

	// Loader
	if (!mov)
		return (
			<div className="h-screen flex items-center justify-center">
				<div className="animate-spin h-16 w-16 rounded-full border-t-4 border-[#006C7A]"></div>
			</div>
		);

	// =====================================================
	// UI
	// =====================================================
	return (
		<div className="h-screen p-6 bg-[#E0F2F1]">
			<div className="flex justify-between items-center mb-4">
				<h1 className="text-xl font-bold text-[#006C7A]">Editar Movimiento</h1>

				<button
					onClick={() => navigate(-1)}
					className="px-4 py-2 bg-gray-300 rounded font-semibold"
				>
					← Volver
				</button>
			</div>

			<input
				className="w-full p-3 border rounded mb-3"
				value={mov.categoria}
				onChange={(e) => setMov({ ...mov, categoria: e.target.value })}
			/>

			<input
				className="w-full p-3 border rounded mb-3"
				value={mov.concepto}
				onChange={(e) => setMov({ ...mov, concepto: e.target.value })}
			/>

			<select
				className="w-full p-3 border rounded mb-3"
				value={mov.tipo}
				onChange={(e) => setMov({ ...mov, tipo: e.target.value })}
			>
				<option value="gasto">Gasto</option>
				<option value="ingreso">Ingreso</option>
			</select>

			<input
				className="w-full p-3 border rounded mb-3"
				type="number"
				value={mov.cantidad}
				onChange={(e) => setMov({ ...mov, cantidad: e.target.value })}
			/>

			<label className="flex items-center gap-2 mb-4">
				<input
					type="checkbox"
					checked={favorito}
					onChange={(e) => setFavorito(e.target.checked)}
				/>
				<span className="font-semibold text-[#006C7A]">⭐ Guardar como favorito</span>
			</label>

			<div className="flex flex-col gap-3 mt-4">
				<button
					onClick={guardar}
					className="w-full bg-[#0097A7] p-3 text-white rounded font-semibold"
				>
					Guardar cambios
				</button>

				<button
					onClick={borrar}
					className="w-full bg-red-500 p-3 text-white rounded font-semibold"
				>
					🗑️ Eliminar movimiento
				</button>
			</div>
		</div>
	);
}
