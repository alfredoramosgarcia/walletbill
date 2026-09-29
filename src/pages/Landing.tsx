// src/pages/Landing.tsx

import { useState } from "react";
import { Link } from "react-router-dom";
import ModalCrearCuenta from "./ModalCrearCuenta";

export default function Landing() {
	const [showRegister, setShowRegister] = useState(false);


	return (
		<div className="min-h-screen bg-[#F2F9F7] text-slate-900">

			{/* ====================================================== */}
			{/* HEADER                                                 */}
			{/* ====================================================== */}

			<header className="sticky top-0 z-50 border-b border-[#006C7A]/10 bg-[#F2F9F7]/90 backdrop-blur-xl">

				<div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-6 lg:px-8">

					{/* LOGO */}
					<Link
						to="/"
						className="flex items-center gap-3"
					>
						<img
							src="/notbackground.png"
							alt="WalletBill"
							className="h-11 w-11 object-contain"
						/>

						<div>
							<p className="text-xl font-extrabold tracking-tight text-slate-900">
								Wallet
								<span className="text-[#008F8C]">
									Bill
								</span>
							</p>

							<p className="hidden text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400 sm:block">
								Finanzas personales
							</p>
						</div>
					</Link>

					{/* NAV DESKTOP */}
					<nav className="hidden items-center gap-8 md:flex">
						<a
							href="#funciones"
							className="text-sm font-semibold text-slate-500 transition hover:text-[#006C7A]"
						>
							Funciones
						</a>

						<a
							href="#como-funciona"
							className="text-sm font-semibold text-slate-500 transition hover:text-[#006C7A]"
						>
							Cómo funciona
						</a>
					</nav>

					{/* AUTH */}
					<div className="flex items-center gap-2 sm:gap-3">

						<Link
							to="/login"
							className="
								rounded-xl px-3 py-2.5
								text-sm font-bold
								text-[#006C7A]
								transition hover:bg-[#E2F2EF]
								sm:px-4
							"
						>
							<span className="hidden sm:inline">
								Iniciar sesión
							</span>

							<span className="sm:hidden">
								Entrar
							</span>
						</Link>

						<button
							type="button"
							onClick={() => setShowRegister(true)}
							className="
		rounded-xl px-4 py-2.5
		text-sm font-bold text-white
		shadow-sm transition
		hover:-translate-y-0.5
		hover:shadow-md
	"
							style={{
								background:
									"linear-gradient(135deg, #006C7A 0%, #008F8C 100%)",
							}}
						>
							Crear cuenta
						</button>

					</div>
				</div>
			</header>

			{/* ====================================================== */}
			{/* HERO                                                   */}
			{/* ====================================================== */}

			<section className="relative overflow-hidden">

				{/* decoraciones */}
				<div className="pointer-events-none absolute -left-40 top-10 h-96 w-96 rounded-full bg-[#008F8C]/10 blur-3xl" />
				<div className="pointer-events-none absolute -right-40 top-20 h-[450px] w-[450px] rounded-full bg-[#006C7A]/10 blur-3xl" />

				<div className="relative mx-auto grid max-w-7xl items-center gap-14 px-5 py-20 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-28">

					{/* TEXTO */}
					<div>

						<div className="mb-6 inline-flex items-center rounded-full border border-[#008F8C]/20 bg-white px-4 py-2 text-xs font-bold text-[#006C7A] shadow-sm">
							<span className="mr-2 h-2 w-2 rounded-full bg-[#00A68F]" />
							Tus finanzas, más claras
						</div>

						<h1 className="max-w-xl text-4xl font-extrabold leading-[1.08] tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
							Controla tu dinero.
							<span className="block text-[#008F8C]">
								Entiende tus gastos.
							</span>
						</h1>

						<p className="mt-6 max-w-xl text-base leading-7 text-slate-500 sm:text-lg">
							WalletBill te ayuda a organizar tus ingresos,
							gastos y categorías para que puedas entender
							fácilmente cómo evoluciona tu dinero cada mes.
						</p>

						<div className="mt-8 flex flex-col gap-3 sm:flex-row">

							<button
								type="button"
								onClick={() => setShowRegister(true)}
								className="
		rounded-xl px-4 py-2.5
		text-sm font-bold text-white
		shadow-sm transition
		hover:-translate-y-0.5
		hover:shadow-md
	"
								style={{
									background:
										"linear-gradient(135deg, #006C7A 0%, #008F8C 100%)",
								}}
							>
								Crear cuenta
							</button>

							<Link
								to="/login"
								className="
									rounded-xl border
									border-slate-200 bg-white
									px-6 py-3.5
									text-center text-sm
									font-bold text-slate-700
									shadow-sm transition
									hover:border-[#008F8C]/40
									hover:bg-[#F8FCFB]
								"
							>
								Ya tengo una cuenta
							</Link>

						</div>

						<p className="mt-5 text-xs font-medium text-slate-400">
							Simple · Visual · Pensado para el día a día
						</p>

					</div>

					{/* ================================================== */}
					{/* MOCKUP DASHBOARD                                   */}
					{/* ================================================== */}

					<div className="relative">

						<div className="absolute -inset-10 rounded-full bg-[#008F8C]/10 blur-3xl" />

						<div className="relative rounded-[28px] border border-white/80 bg-white/80 p-3 shadow-2xl shadow-[#006C7A]/10 backdrop-blur">

							<div className="rounded-[22px] border border-slate-200 bg-[#F8FBFA] p-5 sm:p-6">

								{/* mini header */}
								<div className="mb-6 flex items-center justify-between">

									<div>
										<p className="text-xs font-semibold text-[#008F8C]">
											Resumen financiero
										</p>

										<p className="mt-1 text-lg font-bold text-slate-900">
											Tu economía
										</p>
									</div>

									<div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-600">
										Octubre 2026
									</div>

								</div>

								{/* balance */}
								<div
									className="relative overflow-hidden rounded-2xl p-5 text-white"
									style={{
										background:
											"linear-gradient(135deg, #006C7A 0%, #009B91 100%)",
									}}
								>
									<div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-white/10" />

									<p className="text-xs font-medium text-white/70">
										Balance
									</p>

									<p className="mt-2 text-3xl font-extrabold">
										1.284,50 €
									</p>

									<p className="mt-2 text-xs text-white/70">
										Balance disponible este mes
									</p>
								</div>

								{/* ingresos/gastos */}
								<div className="mt-3 grid grid-cols-2 gap-3">

									<div className="rounded-2xl border border-slate-200 bg-white p-4">
										<p className="text-[11px] font-semibold text-slate-400">
											Ingresos
										</p>

										<p className="mt-1 text-lg font-bold text-emerald-600">
											2.797,07 €
										</p>
									</div>

									<div className="rounded-2xl border border-slate-200 bg-white p-4">
										<p className="text-[11px] font-semibold text-slate-400">
											Gastos
										</p>

										<p className="mt-1 text-lg font-bold text-rose-500">
											1.512,57 €
										</p>
									</div>

								</div>

								{/* gráfico fake */}
								<div className="mt-3 rounded-2xl border border-slate-200 bg-white p-4">

									<div className="flex items-center justify-between">
										<p className="text-xs font-bold text-slate-700">
											Evolución
										</p>

										<p className="text-[10px] text-slate-400">
											Últimos 6 meses
										</p>
									</div>

									<div className="mt-5 flex h-24 items-end gap-2">

										{[45, 62, 38, 75, 58, 88, 68].map(
											(height, index) => (
												<div
													key={index}
													className="flex-1 rounded-t-md bg-[#008F8C]/20"
													style={{
														height: `${height}%`,
													}}
												/>
											)
										)}

									</div>

								</div>

							</div>
						</div>

						{/* floating card */}
						<div className="absolute -bottom-5 -left-4 hidden rounded-2xl border border-white bg-white p-4 shadow-xl sm:block">

							<p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
								Este mes
							</p>

							<p className="mt-1 text-sm font-bold text-[#006C7A]">
								+ 674,10 €
							</p>

						</div>

					</div>
				</div>
			</section>

			{/* ====================================================== */}
			{/* FUNCIONES                                              */}
			{/* ====================================================== */}

			<section
				id="funciones"
				className="border-y border-[#006C7A]/10 bg-white"
			>
				<div className="mx-auto max-w-7xl px-5 py-20 sm:px-6 lg:px-8">

					<div className="mx-auto mb-12 max-w-2xl text-center">

						<p className="text-sm font-bold text-[#008F8C]">
							Todo en un mismo lugar
						</p>

						<h2 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900">
							Lo importante de tus finanzas,
							sin complicaciones
						</h2>

						<p className="mt-4 text-sm leading-6 text-slate-500">
							WalletBill está pensado para darte una visión
							clara de tu economía sin convertir la gestión
							del dinero en otra tarea complicada.
						</p>

					</div>

					<div className="grid gap-5 md:grid-cols-3">

						<FeatureCard
							symbol="↕"
							title="Ingresos y gastos"
							description="Registra tus movimientos y consulta rápidamente cuánto entra y cuánto sale."
						/>

						<FeatureCard
							symbol="◫"
							title="Categorías"
							description="Organiza tus movimientos por categorías adaptadas a tu forma de gestionar el dinero."
						/>

						<FeatureCard
							symbol="↗"
							title="Evolución"
							description="Consulta cómo cambia tu balance mes a mes y entiende mejor la evolución de tus finanzas."
						/>

					</div>
				</div>
			</section>

			{/* ====================================================== */}
			{/* COMO FUNCIONA                                          */}
			{/* ====================================================== */}

			<section id="como-funciona">

				<div className="mx-auto max-w-7xl px-5 py-20 sm:px-6 lg:px-8">

					<div className="grid items-center gap-12 lg:grid-cols-2">

						<div>

							<p className="text-sm font-bold text-[#008F8C]">
								Una visión más sencilla
							</p>

							<h2 className="mt-2 max-w-lg text-3xl font-extrabold tracking-tight text-slate-900">
								Entiende dónde va tu dinero
							</h2>

							<p className="mt-5 max-w-lg text-sm leading-7 text-slate-500">
								Consulta tu balance mensual, separa ingresos
								y gastos y descubre qué categorías tienen
								más peso en tu economía.
							</p>

							<div className="mt-7 space-y-4">

								<CheckItem text="Balance mensual de un vistazo" />
								<CheckItem text="Ingresos y gastos separados" />
								<CheckItem text="Organización por categorías" />
								<CheckItem text="Evolución financiera anual" />

							</div>

						</div>

						{/* segunda mini UI */}
						<div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-xl shadow-[#006C7A]/5">

							<div className="mb-6 flex items-center justify-between">

								<div>
									<p className="text-xs font-semibold text-slate-400">
										Gastos
									</p>

									<p className="mt-1 text-2xl font-extrabold text-slate-900">
										1.512,57 €
									</p>
								</div>

								<div className="rounded-xl bg-rose-50 px-3 py-2 text-xs font-bold text-rose-500">
									54%
								</div>

							</div>

							<div className="h-2 overflow-hidden rounded-full bg-slate-100">
								<div className="h-full w-[54%] rounded-full bg-[#008F8C]" />
							</div>

							<div className="mt-7 space-y-5">

								<ExpenseRow
									name="Alimentación"
									value="483,20 €"
									percent="32%"
								/>

								<ExpenseRow
									name="Vivienda"
									value="450,00 €"
									percent="30%"
								/>

								<ExpenseRow
									name="Transporte"
									value="210,40 €"
									percent="14%"
								/>

							</div>

						</div>
					</div>
				</div>
			</section>

			{/* ====================================================== */}
			{/* CTA                                                    */}
			{/* ====================================================== */}

			<section className="px-5 pb-20 sm:px-6 lg:px-8">

				<div
					className="
						mx-auto max-w-7xl
						overflow-hidden rounded-[32px]
						px-6 py-14 text-center
						text-white shadow-xl
						sm:px-10
					"
					style={{
						background:
							"linear-gradient(135deg, #006C7A 0%, #008F8C 100%)",
					}}
				>
					<h2 className="text-3xl font-extrabold tracking-tight">
						Empieza a organizar tus finanzas
					</h2>

					<p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-white/75">
						Crea tu cuenta y empieza a tener una visión
						más clara de tus ingresos, gastos y balance.
					</p>

					<button
						type="button"
						onClick={() => setShowRegister(true)}
						className="
		mt-7 inline-block
		rounded-xl bg-white
		px-6 py-3.5
		text-sm font-bold
		text-[#006C7A]
		shadow-sm transition
		hover:-translate-y-0.5
		hover:shadow-lg
	"
					>
						Crear cuenta
					</button>

				</div>
			</section>

			{/* ====================================================== */}
			{/* FOOTER                                                 */}
			{/* ====================================================== */}

			<footer className="border-t border-[#006C7A]/10">

				<div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-5 py-7 sm:flex-row sm:px-6 lg:px-8">

					<div className="flex items-center gap-2">

						<img
							src="/notbackground.png"
							alt=""
							className="h-7 w-7 object-contain"
						/>

						<p className="font-extrabold text-slate-800">
							Wallet
							<span className="text-[#008F8C]">
								Bill
							</span>
						</p>

					</div>

					<p className="text-xs text-slate-400">
						Finanzas personales · WalletBill
					</p>

				</div>
			</footer>

		</div>
	);
}

/* ========================================================================== */
/* COMPONENTES                                                               */
/* ========================================================================== */

function FeatureCard({
	symbol,
	title,
	description,
}: {
	symbol: string;
	title: string;
	description: string;
}) {
	return (
		<div className="rounded-3xl border border-slate-200 bg-[#FBFDFC] p-6 transition hover:-translate-y-1 hover:shadow-lg">

			<div
				className="
					mb-5 flex h-11 w-11
					items-center justify-center
					rounded-xl text-lg font-bold
				"
				style={{
					backgroundColor: "#E3F3F0",
					color: "#006C7A",
				}}
			>
				{symbol}
			</div>

			<h3 className="font-bold text-slate-800">
				{title}
			</h3>

			<p className="mt-2 text-sm leading-6 text-slate-500">
				{description}
			</p>

		</div>
	);
}

function CheckItem({ text }: { text: string }) {
	return (
		<div className="flex items-center gap-3">

			<div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#E3F3F0] text-xs font-bold text-[#006C7A]">
				✓
			</div>

			<p className="text-sm font-semibold text-slate-600">
				{text}
			</p>

		</div>
	);
}

function ExpenseRow({
	name,
	value,
	percent,
}: {
	name: string;
	value: string;
	percent: string;
}) {
	return (
		<div className="flex items-center justify-between">

			<div>
				<p className="text-sm font-semibold text-slate-700">
					{name}
				</p>

				<p className="mt-0.5 text-xs text-slate-400">
					{percent} de tus gastos
				</p>
			</div>

			<p className="text-sm font-bold text-slate-800">
				{value}
			</p>

		</div>
	);
}