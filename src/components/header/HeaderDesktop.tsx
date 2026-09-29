import { Link, useLocation, useNavigate } from "react-router-dom";
import {
	BarChart3,
	Heart,
	LayoutDashboard,
	LogOut,
	Plus,
	Settings2,
	TrendingUp
} from "lucide-react";

import { supabase } from "../../supabase/client";
import MesAnoSelector from "./MesAnoSelector";
import type { Perfil } from "../../types/Perfil";
import walletBillLogo from "../../../public/notbackground.png";

interface Props {
	perfil: Perfil | null;
	onShowFav: () => void;
	onLimpiarMes: () => void;
	mes: number;
	año: number;
	onMesChange: (n: number) => void;
	onAñoChange: (n: number) => void;
}

export default function HeaderDesktop({
	perfil,
	onShowFav,
	onLimpiarMes,
	mes,
	año,
	onMesChange,
	onAñoChange,
}: Props) {
	const navigate = useNavigate();
	const location = useLocation();

	const isActive = (path: string) => location.pathname === path;

	async function cerrarSesion() {
		await supabase.auth.signOut();

		localStorage.removeItem("supabase.auth.token");
		localStorage.removeItem("supabase.auth.refresh_token");

		navigate("/", { replace: true });
		window.location.reload();
	}

	return (
		<div className="hidden w-full md:block">

			<div className="mx-auto flex h-[76px] max-w-[1600px] items-center gap-6 px-6 lg:px-8">

				{/* LOGO */}
				<Link
					to="/"
					className="flex shrink-0 items-center gap-3"
				>
					<img
						src={walletBillLogo}
						alt="WalletBill"
						className="h-12 w-12 object-contain"
					/>

					<div className="hidden lg:block">
						<p className="text-xl font-bold tracking-tight text-slate-900">
							Wallet
							<span style={{ color: "#008F8C" }}>
								Bill
							</span>
						</p>

						<p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
							Finanzas personales
						</p>
					</div>
				</Link>

				{/* NAVEGACIÓN */}
				{/* NAVEGACIÓN */}
				<nav className="flex items-center gap-1">

					<NavItem
						to="/dashboard"
						label="Inicio"
						active={isActive("/dashboard")}
						icon={<LayoutDashboard size={17} />}
					/>

					<NavItem
						to="/categorias"
						label="Categorías"
						active={isActive("/categorias")}
						icon={<Settings2 size={17} />}
					/>

					<NavItem
						to="/evolucion"
						label="Evolución"
						active={isActive("/evolucion")}
						icon={<BarChart3 size={17} />}
					/>

					<NavItem
						to="/inversiones"
						label="Inversiones"
						active={isActive("/inversiones")}
						icon={<TrendingUp size={17} />}
					/>

				</nav>

				{/* SEPARADOR */}
				<div className="hidden h-8 w-px bg-slate-200 xl:block" />

				{/* MES / AÑO */}
				<div className="hidden xl:block">
					<MesAnoSelector
						mes={mes}
						año={año}
						onMesChange={onMesChange}
						onAñoChange={onAñoChange}
					/>
				</div>

				{/* ESPACIO */}
				<div className="flex-1" />

				{/* ACCIONES */}
				<div className="flex items-center gap-2">

					{/* AÑADIR */}
					<button
						onClick={() => navigate("/add")}
						className="flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
					>
						<Plus size={17} />
						<span className="hidden lg:inline">
							Añadir
						</span>
					</button>

					{/* FAVORITOS */}
					<button
						onClick={onShowFav}
						title="Favoritos"
						aria-label="Favoritos"
						className="
		flex h-14 w-14 items-center justify-center
		rounded-2xl border border-slate-200
		bg-white
		shadow-sm
		transition-all
		hover:border-amber-200
		hover:bg-amber-50
		active:scale-95
	"
					>
						<span
							className="text-2xl font-bold leading-none"
							style={{ color: "#F59E0B" }}
						>
							★
						</span>
					</button>


					{/* LIMPIAR MES */}
					<button
						onClick={onLimpiarMes}
						title="Limpiar mes"
						aria-label="Limpiar mes"
						className="
		flex h-14 w-14 items-center justify-center
		rounded-2xl border border-slate-200
		bg-white
		shadow-sm
		transition-all
		hover:border-rose-200
		hover:bg-rose-50
		active:scale-95
	"
					>
						<span
							className="text-2xl font-bold leading-none"
							style={{ color: "#F43F5E" }}
						>
							×
						</span>
					</button>


					<div className="mx-2 h-8 w-px bg-slate-200" />


					{/* PERFIL */}
					<Link
						to="/perfil"
						className="
		flex items-center gap-3
		rounded-2xl px-3 py-2
		transition-all
		hover:bg-slate-50
	"
					>
						<div
							className="
			flex h-12 w-12 items-center justify-center
			rounded-full
		"
							style={{ backgroundColor: "#ECFDF5" }}
						>
							<span
								className="text-xl font-bold"
								style={{ color: "#00897B" }}
							>
								♙
							</span>
						</div>

						<div className="hidden max-w-[130px] lg:block">
							<p className="truncate text-base font-bold text-slate-700">
								{perfil?.nombre || "Usuario"}
							</p>

							<p className="text-xs font-medium text-slate-400">
								Mi perfil
							</p>
						</div>
					</Link>


					{/* CERRAR SESIÓN */}
					<button
						onClick={cerrarSesion}
						title="Cerrar sesión"
						aria-label="Cerrar sesión"
						className="
		flex h-14 w-14 items-center justify-center
		rounded-2xl border border-slate-200
		bg-white
		shadow-sm
		transition-all
		hover:border-rose-200
		hover:bg-rose-50
		active:scale-95
	"
					>
						<span
							className="text-2xl font-bold leading-none"
							style={{ color: "#E11D48" }}
						>
							↪
						</span>
					</button>
				</div>
			</div>

			{/* Selector para resoluciones intermedias */}
			<div className="border-t border-slate-100 px-6 py-2 xl:hidden">
				<div className="mx-auto flex max-w-[1600px] justify-center">
					<MesAnoSelector
						mes={mes}
						año={año}
						onMesChange={onMesChange}
						onAñoChange={onAñoChange}
					/>
				</div>
			</div>

		</div>
	);
}

interface NavItemProps {
	to: string;
	label: string;
	active: boolean;
	icon: React.ReactNode;
}

function NavItem({
	to,
	label,
	active,
	icon,
}: NavItemProps) {
	return (
		<Link
			to={to}
			className={`
				flex items-center gap-2 rounded-xl px-3 py-2.5
				text-sm font-medium transition
				${active
					? "bg-slate-100 text-slate-900"
					: "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
				}
			`}
		>
			{icon}
			<span className="hidden lg:inline">
				{label}
			</span>
		</Link>
	);
}