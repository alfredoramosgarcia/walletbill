import { useEffect, useState } from "react";
import { supabase } from "../supabase/client";
import { useNavigate } from "react-router-dom";

export default function AddMovimiento() {
	const navigate = useNavigate();

	const [tipo, setTipo] = useState("gasto");
	const [categoria, setCategoria] = useState("");
	const [categorias, setCategorias] = useState<any[]>([]);

	const [concepto, setConcepto] = useState("");
	const [cantidad, setCantidad] = useState("");
	const [favorito, setFavorito] = useState(false);

	const mes = new Date().getMonth() + 1;
	const año = new Date().getFullYear();

	// 🟩 FORMATEAR LABEL BONITO
	function formatearLabel(nombre: string) {
		// Reemplaza camelCase por espacios
		const conEspacios = nombre.replace(/([a-z])([A-Z])/g, "$1 $2");

		// Capitaliza cada palabra
		return conEspacios
			.split(" ")
			.map((w) => w.charAt(0).toUpperCase() + w.slice(1))
			.join(" ");
	}

	// 🟩 CARGAR CATEGORÍAS
	async function cargarCategorias(tipoSel: string) {
		const { data, error } = await supabase
			.from("categorias")
			.select("*")
			.eq("tipo", tipoSel)
			.order("nombre", { ascending: true });

		if (error) {
			console.log(error);
			return;
		}

		setCategorias(data);
		setCategoria(data[0]?.nombre || "");
	}

	useEffect(() => {
		cargarCategorias(tipo);
	}, [tipo]);

	// 🟩 GUARDAR MOVIMIENTO
	async function guardarMovimiento() {
		const { data: userData } = await supabase.auth.getUser();
		const user = userData?.user;
		if (!user) return alert("No hay usuario");

		const { error } = await supabase.from("movimientos").insert({
			user_id: user.id,
			tipo,
			categoria, // guardamos el valor original, NO el formateado
			concepto,
			cantidad: Number(cantidad),
			mes: mes.toString(),
			año,
		});

		if (error) {
			alert(error.message);
			return;
		}

		if (favorito) {
			await supabase.from("favoritos").upsert({
				user_id: user.id,
				tipo,
				categoria,
				concepto,
				cantidad: Number(cantidad),
			});
		}

		navigate("/");
	}

	return (
		<div className="h-screen p-6 bg-[#E0F2F1]">
			<div className="flex justify-between items-center mb-4">
				<h1 className="text-xl font-bold text-[#006C7A]">Añadir Movimiento</h1>

				<button
					onClick={() => navigate(-1)}
					className="px-4 py-2 bg-gray-300 rounded font-semibold"
				>
					← Volver
				</button>
			</div>

			<select
				className="w-full p-3 border rounded mb-3"
				value={tipo}
				onChange={(e) => setTipo(e.target.value)}
			>
				<option value="gasto">Gasto</option>
				<option value="ingreso">Ingreso</option>
			</select>

			<select
				className="w-full p-3 border rounded mb-3"
				value={categoria}
				onChange={(e) => setCategoria(e.target.value)}
			>
				{categorias.map((c) => (
					<option key={c.id} value={c.nombre}>
						{formatearLabel(c.nombre)}
					</option>
				))}
			</select>

			<input
				className="w-full p-3 border rounded mb-3"
				placeholder="Concepto"
				value={concepto}
				onChange={(e) => setConcepto(e.target.value)}
			/>

			<input
				className="w-full p-3 border rounded mb-3"
				type="number"
				placeholder="Cantidad"
				value={cantidad}
				onChange={(e) => setCantidad(e.target.value)}
			/>

			<label className="flex items-center gap-2 mb-4">
				<input
					type="checkbox"
					checked={favorito}
					onChange={(e) => setFavorito(e.target.checked)}
				/>
				<span className="font-semibold text-[#006C7A]">⭐ Guardar como favorito</span>
			</label>

			<button
				onClick={guardarMovimiento}
				className="w-full bg-[#0097A7] p-3 text-white rounded font-semibold"
			>
				Guardar
			</button>
		</div>
	);
}
