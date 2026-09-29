import { Link, useLocation, useNavigate } from "react-router-dom";
import {
	BarChart3,
	Heart,
	LayoutDashboard,
	LogOut,
	Menu,
	Plus,
	Settings2,
	Sparkles,
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
	menuOpen,
	setMenuOpen,
	onShowFav,
	onLimpiarMes,
	mes,
	año,
	onMesChange,
	onAñoChange,
}: Props) {
	const navigate = useNavigate();
	const location = useLocation();

	async function cerrarSesion() {
		await supabase.auth.signOut();

		localStorage.removeItem("supabase.auth.token");
		localStorage.removeItem("supabase.auth.refresh_token");

		navigate("/login", { replace: true });
		window.location.reload();
	}

	function goTo(path: string) {
		navigate(path);
		setMenuOpen(false);
	}

	return (
		<div className="relative w-full md:hidden">

			{/* HEADER PRINCIPAL */}
			<div className="flex h-16 items-center justify-between px-4">

				{/* LOGO */}
				<Link
					to="/"
					onClick={() => setMenuOpen(false)}
					className="flex items-center gap-2.5"
				>
					<div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-white">
						<Sparkles size={17} />
					</div>

					<p className="text-lg font-bold tracking-tight text-slate-900">
						Wallet<span className="text-teal-600">Bill</span>
					</p>
				</Link>

				{/* DERECHA */}
				<div className="flex items-center gap-1">

					<Link
						to="/perfil"
						className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-500 transition active:bg-slate-100"
					>
						<User size={20} />
					</Link>

					<button
						onClick={() => setMenuOpen(!menuOpen)}
						className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-700 transition active:bg-slate-100"
					>
						{menuOpen ? (
							<X size={22} />
						) : (
							<Menu size={22} />
						)}
					</button>

				</div>
			</div>

			{/* MES / AÑO */}
			{!menuOpen && (
				<div className="border-t border-slate-100 px-4 py-2">
					<div className="flex justify-center">
						<MesAnoSelector
							mes={mes}
							año={año}
							onMesChange={onMesChange}
							onAñoChange={onAñoChange}
						/>
					</div>
				</div>
			)}

			{/* MENÚ */}
			{menuOpen && (
				<div className="absolute left-3 right-3 top-[68px] z-50 overflow-hidden rounded-3xl border border-slate-200 bg-white p-3 shadow-2xl">

					{/* USUARIO */}
					<div className="mb-2 flex items-center gap-3 rounded-2xl bg-slate-50 p-3">

						<div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-50 text-teal-700">
							<User size={19} />
						</div>

						<div>
							<p className="text-sm font-semibold text-slate-800">
								{perfil?.nombre || "Usuario"}
							</p>

							<p className="text-xs text-slate-400">
								WalletBill
							</p>
						</div>

					</div>

					{/* NAVEGACIÓN */}
					<div className="space-y-1">

						<MobileMenuItem
							icon={<LayoutDashboard size={18} />}
							label="Inicio"
							active={location.pathname === "/"}
							onClick={() => goTo("/")}
						/>

						<MobileMenuItem
							icon={<BarChart3 size={18} />}
							label="Evolución"
							active={location.pathname === "/evolucion"}
							onClick={() => goTo("/evolucion")}
						/>

						<MobileMenuItem
							icon={<Settings2 size={18} />}
							label="Categorías"
							active={location.pathname === "/categorias"}
							onClick={() => goTo("/categorias")}
						/>

						<MobileMenuItem
							icon={<Heart size={18} />}
							label="Favoritos"
							onClick={() => {
								onShowFav();
								setMenuOpen(false);
							}}
						/>

					</div>

					{/* ACCIÓN PRINCIPAL */}
					<button
						onClick={() => goTo("/add")}
						className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition active:scale-[0.98]"
					>
						<Plus size={18} />
						Añadir movimiento
					</button>

					{/* ACCIONES SECUNDARIAS */}
					<div className="mt-3 border-t border-slate-100 pt-2">

						<button
							onClick={() => {
								onLimpiarMes();
								setMenuOpen(false);
							}}
							className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-rose-500 transition active:bg-rose-50"
						>
							<Trash2 size={17} />
							Limpiar mes
						</button>

						<button
							onClick={cerrarSesion}
							className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-500 transition active:bg-slate-50"
						>
							<LogOut size={17} />
							Cerrar sesión
						</button>

					</div>

				</div>
			)}

		</div>
	);
}

interface MobileMenuItemProps {
	icon: React.ReactNode;
	label: string;
	active?: boolean;
	onClick: () => void;
}

function MobileMenuItem({
	icon,
	label,
	active = false,
	onClick,
}: MobileMenuItemProps) {
	return (
		<button
			onClick={onClick}
			className={`
				flex w-full items-center gap-3 rounded-xl px-3 py-2.5
				text-left text-sm font-medium transition
				${active
					? "bg-teal-50 text-teal-700"
					: "text-slate-600 active:bg-slate-50"
				}
			`}
		>
			{icon}
			{label}
		</button>
	);
}