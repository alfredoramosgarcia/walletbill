import { useState, type ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import {
	BarChart3,
	CalendarDays,
	Heart,
	LayoutDashboard,
	LogOut,
	Menu,
	Plus,
	Settings2,
	TrendingUp,
	Trash2,
	User,
	X,
} from "lucide-react";

import { supabase } from "../../supabase/client";
import MesAnoSelector from "./MesAnoSelector";
import type { Perfil } from "../../types/Perfil";

interface Props {
	perfil: Perfil | null;
	menuOpen: boolean;
	setMenuOpen: (v: boolean) => void;
	onShowFav: () => void;
	onLimpiarMes: () => void;
	mes: number;
	año: number;
	onMesChange: (n: number) => void;
	onAñoChange: (n: number) => void;
}

export default function HeaderMobile({
	perfil,
	menuOpen: _menuOpen,
	setMenuOpen: _setMenuOpen,
	onShowFav,
	onLimpiarMes,
	mes,
	año,
	onMesChange,
	onAñoChange,
}: Props) {
	const navigate = useNavigate();
	const location = useLocation();

	const [menuVistas, setMenuVistas] = useState(false);
	const [menuOpciones, setMenuOpciones] = useState(false);
	const [selectorFecha, setSelectorFecha] = useState(false);

	function cerrarMenus() {
		setMenuVistas(false);
		setMenuOpciones(false);
		setSelectorFecha(false);
	}

	function goTo(path: string) {
		cerrarMenus();
		navigate(path);
	}

	function toggleVistas() {
		setMenuOpciones(false);
		setSelectorFecha(false);
		setMenuVistas((value) => !value);
	}

	function toggleOpciones() {
		setMenuVistas(false);
		setSelectorFecha(false);
		setMenuOpciones((value) => !value);
	}

	function toggleFecha() {
		setMenuVistas(false);
		setMenuOpciones(false);
		setSelectorFecha((value) => !value);
	}

	async function cerrarSesion() {
		cerrarMenus();

		await supabase.auth.signOut();

		navigate("/login", {
			replace: true,
		});
	}

	return (
		<div className="relative z-50 w-full md:hidden">

			{/* ================================================== */}
			{/* CABECERA                                           */}
			{/* ================================================== */}

			<div
				className="
					flex h-[64px]
					items-center justify-between
					border-b border-[#006C7A]/10
					bg-[#EAF6F3]
					px-4
				"
			>

				{/* LOGO */}

				<button
					type="button"
					onClick={() => goTo("/dashboard")}
					className="
						flex items-center gap-2
						border-0 bg-transparent p-0
					"
				>
					<img
						src="/notbackground.png"
						alt="WalletBill"
						className="h-10 w-10 object-contain"
					/>

					<span className="text-lg font-extrabold tracking-tight text-slate-900">
						Wallet
						<span className="text-[#008F8C]">
							Bill
						</span>
					</span>
				</button>

			</div>

			{/* ================================================== */}
			{/* BARRA DE CONTROLES                                 */}
			{/* ================================================== */}

			<div
				className="
					grid grid-cols-[1fr_auto_auto]
					items-center gap-2
					border-b border-slate-200
					bg-white
					px-3 py-2
				"
			>

				{/* MES */}

				<button
					type="button"
					onClick={toggleFecha}
					className={`
						flex h-10 min-w-0
						items-center gap-2
						rounded-xl
						border
						px-3
						text-sm font-bold
						transition
						${selectorFecha
							? "border-[#008F8C]/30 bg-[#E5F5F2] text-[#006C7A]"
							: "border-slate-200 bg-white text-slate-600"
						}
					`}
				>
					<CalendarDays
						size={17}
						className="shrink-0"
					/>

					<span className="truncate">
						{nombreMes(mes)} {año}
					</span>
				</button>

				{/* VISTAS */}

				<button
					type="button"
					onClick={toggleVistas}
					className={`
						flex h-10
						items-center justify-center
						gap-1.5
						rounded-xl
						border
						px-3
						text-sm font-bold
						transition
						${menuVistas
							? "border-[#008F8C]/30 bg-[#E5F5F2] text-[#006C7A]"
							: "border-slate-200 bg-white text-slate-600"
						}
					`}
				>
					<Menu size={17} />

					<span className="hidden min-[390px]:inline">
						Vistas
					</span>
				</button>

				{/* OPCIONES */}

				<button
					type="button"
					onClick={toggleOpciones}
					className={`
						flex h-10
						items-center justify-center
						gap-1.5
						rounded-xl
						border
						px-3
						text-sm font-bold
						transition
						${menuOpciones
							? "border-[#008F8C]/30 bg-[#E5F5F2] text-[#006C7A]"
							: "border-slate-200 bg-white text-slate-600"
						}
					`}
				>
					<Plus size={18} />

					<span className="hidden min-[390px]:inline">
						Opciones
					</span>
				</button>

			</div>

			{/* ================================================== */}
			{/* SELECTOR MES / AÑO                                 */}
			{/* ================================================== */}

			{selectorFecha && (
				<Dropdown>

					<div className="mb-3">

						<p className="text-xs font-bold uppercase tracking-wider text-[#008F8C]">
							Periodo
						</p>

						<p className="mt-1 text-sm text-slate-500">
							Selecciona el mes que quieres consultar.
						</p>

					</div>

					<div className="rounded-2xl bg-[#F3FAF8] p-3">

						<MesAnoSelector
							mes={mes}
							año={año}
							onMesChange={onMesChange}
							onAñoChange={onAñoChange}
						/>

					</div>

				</Dropdown>
			)}

			{/* ================================================== */}
			{/* MENÚ VISTAS                                       */}
			{/* ================================================== */}

			{menuVistas && (
				<Dropdown>

					<div className="mb-3 flex items-center justify-between">

						<div>
							<p className="text-xs font-bold uppercase tracking-wider text-[#008F8C]">
								Navegación
							</p>

							<p className="mt-1 text-sm text-slate-500">
								¿Dónde quieres ir?
							</p>
						</div>

						<button
							type="button"
							onClick={() =>
								setMenuVistas(false)
							}
							className="
								flex h-9 w-9
								items-center justify-center
								rounded-xl
								bg-slate-50
								text-slate-400
							"
						>
							<X size={18} />
						</button>

					</div>

					<div className="grid grid-cols-2 gap-2">

						<ViewButton
							icon={
								<LayoutDashboard
									size={19}
								/>
							}
							label="Inicio"
							active={
								location.pathname ===
								"/dashboard"
							}
							onClick={() =>
								goTo("/dashboard")
							}
						/>

						<ViewButton
							icon={
								<TrendingUp
									size={19}
								/>
							}
							label="Inversiones"
							active={location.pathname.startsWith(
								"/inversiones"
							)}
							onClick={() =>
								goTo("/inversiones")
							}
						/>

						<ViewButton
							icon={
								<BarChart3
									size={19}
								/>
							}
							label="Evolución"
							active={
								location.pathname ===
								"/evolucion"
							}
							onClick={() =>
								goTo("/evolucion")
							}
						/>

						<ViewButton
							icon={
								<Settings2
									size={19}
								/>
							}
							label="Categorías"
							active={
								location.pathname ===
								"/categorias"
							}
							onClick={() =>
								goTo("/categorias")
							}
						/>

					</div>

				</Dropdown>
			)}

			{/* ================================================== */}
			{/* MENÚ OPCIONES                                      */}
			{/* ================================================== */}

			{menuOpciones && (
				<Dropdown>

					<div className="mb-3 flex items-center justify-between">

						<div>
							<p className="text-xs font-bold uppercase tracking-wider text-[#008F8C]">
								Opciones
							</p>

							<p className="mt-1 text-sm text-slate-500">
								Acciones del mes y de tu cuenta.
							</p>
						</div>

						<button
							type="button"
							onClick={() =>
								setMenuOpciones(false)
							}
							className="
								flex h-9 w-9
								items-center justify-center
								rounded-xl
								bg-slate-50
								text-slate-400
							"
						>
							<X size={18} />
						</button>

					</div>

					{/* AÑADIR */}

					<button
						type="button"
						onClick={() => goTo("/add")}
						className="
							flex w-full
							items-center justify-center
							gap-2
							rounded-xl
							bg-[#006C7A]
							px-4 py-3
							text-sm font-bold
							text-white
							transition
							active:bg-[#005964]
						"
					>
						<Plus size={18} />

						Añadir movimiento
					</button>

					{/* RESTO */}

					<div className="mt-2 grid grid-cols-2 gap-2">

						<OptionButton
							icon={<Heart size={18} />}
							label="Favoritos"
							onClick={() => {
								cerrarMenus();
								onShowFav();
							}}
						/>

						<OptionButton
							icon={<User size={18} />}
							label="Mi perfil"
							onClick={() =>
								goTo("/perfil")
							}
						/>

						<OptionButton
							icon={<Trash2 size={18} />}
							label="Limpiar mes"
							danger
							onClick={() => {
								cerrarMenus();
								onLimpiarMes();
							}}
						/>

						<OptionButton
							icon={<LogOut size={18} />}
							label="Cerrar sesión"
							onClick={cerrarSesion}
						/>

					</div>

				</Dropdown>
			)}

		</div>
	);
}

/* ========================================================== */
/* DROPDOWN                                                   */
/* ========================================================== */

function Dropdown({
	children,
}: {
	children: ReactNode;
}) {
	return (
		<div
			className="
				absolute
				left-3 right-3
				top-[122px]
				z-[100]
				rounded-[22px]
				border border-slate-200
				bg-white
				p-4
				shadow-xl
			"
		>
			{children}
		</div>
	);
}

/* ========================================================== */
/* BOTÓN DE VISTA                                             */
/* ========================================================== */

function ViewButton({
	icon,
	label,
	active,
	onClick,
}: {
	icon: ReactNode;
	label: string;
	active: boolean;
	onClick: () => void;
}) {
	return (
		<button
			type="button"
			onClick={onClick}
			className={`
				flex min-h-[64px]
				flex-col
				items-center justify-center
				gap-1.5
				rounded-2xl
				border
				text-sm font-bold
				transition
				${active
					? "border-[#008F8C]/30 bg-[#E5F5F2] text-[#006C7A]"
					: "border-slate-200 bg-white text-slate-600 active:bg-slate-50"
				}
			`}
		>
			{icon}

			<span>{label}</span>
		</button>
	);
}

/* ========================================================== */
/* BOTÓN OPCIONES                                             */
/* ========================================================== */

function OptionButton({
	icon,
	label,
	onClick,
	danger = false,
}: {
	icon: ReactNode;
	label: string;
	onClick: () => void;
	danger?: boolean;
}) {
	return (
		<button
			type="button"
			onClick={onClick}
			className={`
				flex min-h-[58px]
				items-center
				gap-2
				rounded-xl
				border
				px-3
				text-left
				text-xs font-bold
				transition
				${danger
					? "border-rose-100 bg-rose-50 text-rose-500 active:bg-rose-100"
					: "border-slate-100 bg-slate-50 text-slate-600 active:bg-slate-100"
				}
			`}
		>
			{icon}

			<span>{label}</span>
		</button>
	);
}

/* ========================================================== */
/* NOMBRE MES                                                 */
/* ========================================================== */

function nombreMes(mes: number) {
	const meses = [
		"Enero",
		"Febrero",
		"Marzo",
		"Abril",
		"Mayo",
		"Junio",
		"Julio",
		"Agosto",
		"Septiembre",
		"Octubre",
		"Noviembre",
		"Diciembre",
	];

	/*
	 * Esto admite tanto mes 1-12 como, por seguridad,
	 * el caso 0 para enero.
	 */
	if (mes >= 1 && mes <= 12) {
		return meses[mes - 1];
	}

	return meses[mes] ?? "Mes";
}