// src/pages/AddMovimiento.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase/client";
import { useFecha } from "../context/FechaContext";
import Alert from "../components/alerts/Alert";

interface Categoria {
	id: string;
	nombre: string;
	tipo: "gasto" | "inreso";
}

export default function AddMovimiento() {
	const navigate = useNavigate();
	const { mes, año } = useFecha();

	const [tipo, setTipo] = useState<"gasto" | "ingreso">("gasto");
	const [categoria, setCategoria] = useState("");
	const [categorias, setCategorias] = useState<Categoria[]>([]);
	const [concepto, setConcepto] = useState("");
	const [cantidad, setCantidad] = useState("");
	const [favorito, setFavorito] = useState(false);

	// ALERTA
	const [alertMsg, setAlertMsg] = useState("");
	const [alertType, setAlertType] = useState<"success" | "error">("success");

	function formatearLabel(nombre: string) {
		const conEspacios = nombre.replace(/([a-z])([A-Z])/g, "$1 $2");
		return conEspacios
			.split(" ")
			.map((w) => w.charAt(0).toUpperCase() + w.slice(1))
			.join(" ");
	}

	useEffect(() => {
		cargarCategorias(tipo);
	}, [tipo]);

	async function cargarCategorias(tipoSel: "gasto" | "ingreso") {
		const { data } = await supabase
			.from("categorias")
			.select("*")
			.eq("tipo", tipoSel)
			.order("nombre", { ascending: true });

		if (data) setCategorias(data);
	}

	async function guardar() {
		const errores: string[] = [];

		if (!tipo) errores.push("el tipo");
		if (!categoria) errores.push("la categoría");
		if (!concepto.trim()) errores.push("el concepto");
		if (!cantidad) errores.push("la cantidad");

		if (errores.length > 0) {
			setAlertMsg("Debes completar: " + errores.join(", "));
			setAlertType("error");
			return;
		}

		const user = (await supabase.auth.getUser()).data.user;
		if (!user) return;

		const insertData = {
			user_id: user.id,
			tipo,
			categoria,
			concepto,
			cantidad: Number(cantidad),
			mes: mes.toString(),
			año,
		};

		const { data: inserted, error } = await supabase
			.from("movimientos")
			.insert(insertData)
			.select()
			.single();

		if (error) {
			setAlertMsg("No se pudo guardar el movimiento.");
			setAlertType("error");
			return;
		}

		if (favorito && inserted) {
			await supabase.from("favoritos").insert({
				user_id: user.id,
				tipo,
				categoria,
				concepto,
				cantidad: Number(cantidad),
			});
		}

		setAlertType("success");
		setAlertMsg("Movimiento guardado correctamente.");

		setTimeout(() => navigate("/"), 800);
	}

	return (
		<div className="min-h-screen flex items-center justify-center bg-[#D9ECEA] px-4">

			{/* ALERTA SUPERIOR */}
			<Alert message={alertMsg} type={alertType} onClose={() => setAlertMsg("")} />

			<div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-lg">

				{/* Título + volver */}
				<div className="relative flex items-center justify-center mb-6 pr-10">
					<h1 className="text-2xl font-bold text-[#006C7A]">Añadir Movimiento</h1>

					<button
						onClick={() => navigate(-1)}
						className="absolute right-0 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg text-sm font-semibold hover:bg-gray-300 transition"
					>
						←
					</button>
				</div>

				<div className="space-y-6">

					{/* Tipo */}
					<select
						className="w-full p-3 rounded-xl border bg-gray-50 text-black"
						value={tipo}
						onChange={(e) => setTipo(e.target.value as "gasto" | "ingreso")}
					>
						<option value="gasto">Gasto</option>
						<option value="ingreso">Ingreso</option>
					</select>

					{/* Categoría */}
					<select
						className="w-full p-3 rounded-xl border bg-gray-50 text-black"
						value={categoria}
						onChange={(e) => setCategoria(e.target.value)}
					>
						<option value="">Seleccionar categoría</option>
						{categorias.map((c) => (
							<option key={c.id} value={c.id}>
								{formatearLabel(c.nombre)}
							</option>
						))}
					</select>

					{/* Concepto */}
					<input
						className="w-full p-3 rounded-xl border bg-gray-50 text-black"
						placeholder="Concepto"
						value={concepto}
						onChange={(e) => setConcepto(e.target.value)}
					/>

					{/* Cantidad */}
					<input
						className="w-full p-3 rounded-xl border bg-gray-50 text-black"
						type="number"
						placeholder="Cantidad"
						value={cantidad}
						onChange={(e) => setCantidad(e.target.value)}
					/>

					{/* Favorito */}
					<label className="flex items-center gap-2">
						<input
							type="checkbox"
							checked={favorito}
							onChange={(e) => setFavorito(e.target.checked)}
						/>
						<span className="font-semibold text-[#006C7A]">
							⭐ Guardar como favorito
						</span>
					</label>

					{/* Botón Guardar */}
					<button
						onClick={guardar}
						className="w-full bg-[#0097A7] text-white p-3 rounded-lg font-semibold hover:bg-[#008190] transition"
					>
						Guardar movimiento
					</button>
				</div>
			</div>
		</div>
	);
}
