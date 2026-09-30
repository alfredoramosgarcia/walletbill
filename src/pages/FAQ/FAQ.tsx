import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

import {
	faqSections,
	guides,
	type FAQItem,
	type Guide,
} from "./faqData";

/* ========================================================== */
/* COMPONENTE PRINCIPAL                                       */
/* ========================================================== */

export default function FAQ() {
	const [preguntaAbierta, setPreguntaAbierta] =
		useState<string | null>("como-empezar");

	const [guiaAbierta, setGuiaAbierta] =
		useState<string | null>(null);

	const [busqueda, setBusqueda] =
		useState("");

	/* ====================================================== */
	/* BUSCADOR                                              */
	/* ====================================================== */

	const terminoBusqueda = busqueda
		.trim()
		.toLowerCase();

	const guiasFiltradas = useMemo(() => {
		if (!terminoBusqueda) {
			return guides;
		}

		return guides.filter((guia) => {
			const coincideGuia =
				guia.titulo
					.toLowerCase()
					.includes(terminoBusqueda) ||
				guia.descripcion
					.toLowerCase()
					.includes(terminoBusqueda) ||
				guia.consejo
					?.toLowerCase()
					.includes(terminoBusqueda);

			const coincidePaso =
				guia.pasos.some(
					(paso) =>
						paso.titulo
							.toLowerCase()
							.includes(
								terminoBusqueda
							) ||
						paso.descripcion
							.toLowerCase()
							.includes(
								terminoBusqueda
							)
				);

			return coincideGuia || coincidePaso;
		});
	}, [terminoBusqueda]);

	const faqFiltradas = useMemo(() => {
		if (!terminoBusqueda) {
			return faqSections;
		}

		return faqSections
			.map((seccion) => ({
				...seccion,

				preguntas:
					seccion.preguntas.filter(
						(item) =>
							item.pregunta
								.toLowerCase()
								.includes(
									terminoBusqueda
								) ||
							item.respuesta
								.toLowerCase()
								.includes(
									terminoBusqueda
								)
					),
			}))
			.filter(
				(seccion) =>
					seccion.preguntas.length > 0
			);
	}, [terminoBusqueda]);

	const sinResultados =
		guiasFiltradas.length === 0 &&
		faqFiltradas.length === 0;

	/* ====================================================== */
	/* RENDER                                                */
	/* ====================================================== */

	return (
		<div className="min-h-screen bg-[#F2F9F7] text-slate-900">

			<main>

				{/* ================================================== */}
				{/* HERO                                               */}
				{/* ================================================== */}

				<section className="relative overflow-hidden px-5 pb-14 pt-16 lg:px-8 lg:pb-20 lg:pt-20">

					<div className="pointer-events-none absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-[#008F8C]/5 blur-3xl" />

					<div className="relative mx-auto max-w-4xl text-center">

						<div className="inline-flex items-center gap-2 rounded-full border border-[#008F8C]/15 bg-white px-4 py-2 shadow-sm">

							<span className="flex h-5 w-5 items-center justify-center rounded-md bg-[#EAF6F3] text-xs font-black text-[#006C7A]">
								?
							</span>

							<span className="text-xs font-extrabold uppercase tracking-[0.14em] text-[#008F8C]">
								Centro de ayuda
							</span>

						</div>

						<h1 className="mx-auto mt-7 max-w-3xl text-4xl font-black tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
							Aprende a utilizar{" "}
							<span className="text-[#006C7A]">
								WalletBill
							</span>
						</h1>

						<p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-500 sm:text-lg">
							Guías paso a paso y respuestas a
							las dudas más habituales para que
							puedas sacar el máximo partido a
							WalletBill desde el primer día.
						</p>

						{/* BUSCADOR */}

						<div className="relative mx-auto mt-9 max-w-2xl">

							<div className="absolute left-5 top-1/2 -translate-y-1/2 text-xl text-slate-400">
								⌕
							</div>

							<input
								type="text"
								value={busqueda}
								onChange={(e) =>
									setBusqueda(
										e.target.value
									)
								}
								placeholder="Busca: movimiento, categoría, inversión..."
								className="
									w-full
									rounded-2xl
									border border-slate-200
									bg-white
									py-4 pl-13 pr-12
									text-sm font-semibold
									text-slate-700
									shadow-lg
									shadow-slate-200/30
									outline-none
									transition
									placeholder:text-slate-400
									focus:border-[#008F8C]
									focus:ring-4
									focus:ring-[#008F8C]/10
								"
							/>

							{busqueda && (
								<button
									type="button"
									onClick={() =>
										setBusqueda("")
									}
									className="
										absolute right-4 top-1/2
										flex h-8 w-8
										-translate-y-1/2
										items-center justify-center
										rounded-lg
										text-lg font-bold
										text-slate-400
										transition
										hover:bg-slate-100
										hover:text-slate-700
									"
									aria-label="Limpiar búsqueda"
								>
									×
								</button>
							)}

						</div>

						<p className="mt-4 text-xs font-semibold text-slate-400">
							Encuentra rápidamente cualquier
							duda sobre WalletBill.
						</p>

					</div>
				</section>

				{/* ================================================== */}
				{/* PROCESO RÁPIDO                                     */}
				{/* ================================================== */}

				{!terminoBusqueda && (
					<section className="px-5 pb-16 lg:px-8">

						<div
							className="
								mx-auto max-w-7xl
								overflow-hidden
								rounded-[30px]
								bg-[#006C7A]
								p-6
								shadow-xl
								shadow-[#006C7A]/10
								md:p-8
								lg:p-10
							"
						>

							<div className="mb-8 max-w-2xl">

								<p className="text-xs font-extrabold uppercase tracking-[0.15em] text-[#7DE0D4]">
									Primeros pasos
								</p>

								<h2 className="mt-2 text-2xl font-black text-white md:text-3xl">
									Empieza con WalletBill
									en unos minutos
								</h2>

								<p className="mt-3 text-sm leading-6 text-white/65">
									No necesitas configurar
									todo desde el principio.
									Empieza por lo esencial y
									ve construyendo tu historial
									financiero.
								</p>

							</div>

							<div className="grid gap-3 md:grid-cols-5">

								<PasoRapido
									numero="1"
									titulo="Crea tu cuenta"
									texto="Regístrate y accede a tu espacio personal."
								/>

								<PasoRapido
									numero="2"
									titulo="Categorías"
									texto="Organiza cómo quieres clasificar tus movimientos."
								/>

								<PasoRapido
									numero="3"
									titulo="Movimientos"
									texto="Registra tus primeros ingresos y gastos."
								/>

								<PasoRapido
									numero="4"
									titulo="Dashboard"
									texto="Consulta ingresos, gastos y balance."
								/>

								<PasoRapido
									numero="5"
									titulo="Evoluciona"
									texto="Utiliza favoritos, evolución e inversiones."
								/>

							</div>

						</div>

					</section>
				)}

				{/* ================================================== */}
				{/* CONTENIDO                                          */}
				{/* ================================================== */}

				<div className="mx-auto max-w-7xl px-5 pb-24 lg:px-8">

					{sinResultados ? (
						<EstadoSinResultados
							busqueda={busqueda}
							onReset={() =>
								setBusqueda("")
							}
						/>
					) : (
						<>

							{/* ====================================== */}
							{/* GUÍAS PASO A PASO                     */}
							{/* ====================================== */}

							{guiasFiltradas.length > 0 && (
								<section>

									<SectionHeader
										eyebrow="Aprende WalletBill"
										titulo="Guías paso a paso"
										descripcion="Tutoriales sencillos para aprender a realizar las acciones principales."
										contador={
											guiasFiltradas.length
										}
									/>

									<div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">

										{guiasFiltradas.map(
											(guia) => (
												<GuiaCard
													key={
														guia.id
													}
													guia={
														guia
													}
													onClick={() =>
														setGuiaAbierta(
															guia.id
														)
													}
												/>
											)
										)}

									</div>

								</section>
							)}

							{/* ====================================== */}
							{/* FAQ                                   */}
							{/* ====================================== */}

							{faqFiltradas.length > 0 && (
								<section
									className={
										guiasFiltradas.length >
											0
											? "mt-20"
											: ""
									}
								>

									<SectionHeader
										eyebrow="Resuelve tus dudas"
										titulo="Preguntas frecuentes"
										descripcion="Respuestas rápidas a las dudas más habituales sobre WalletBill."
									/>

									<div className="mx-auto max-w-4xl space-y-10">

										{faqFiltradas.map(
											(seccion) => (
												<div
													key={
														seccion.id
													}
												>

													<div className="mb-4 flex items-end justify-between gap-4">

														<div>
															<h3 className="text-xl font-black text-slate-900">
																{
																	seccion.titulo
																}
															</h3>

															<p className="mt-1 text-sm leading-6 text-slate-500">
																{
																	seccion.descripcion
																}
															</p>
														</div>

														<span className="hidden shrink-0 rounded-lg bg-[#EAF6F3] px-2.5 py-1 text-xs font-extrabold text-[#006C7A] sm:block">
															{
																seccion
																	.preguntas
																	.length
															}
														</span>

													</div>

													<div className="space-y-2">

														{seccion.preguntas.map(
															(
																item
															) => (
																<Pregunta
																	key={
																		item.id
																	}
																	item={
																		item
																	}
																	abierta={
																		preguntaAbierta ===
																		item.id
																	}
																	onClick={() =>
																		setPreguntaAbierta(
																			preguntaAbierta ===
																				item.id
																				? null
																				: item.id
																		)
																	}
																/>
															)
														)}

													</div>

												</div>
											)
										)}

									</div>

								</section>
							)}

						</>
					)}

				</div>

				{/* ================================================== */}
				{/* CTA FINAL                                          */}
				{/* ================================================== */}

				<section className="border-t border-[#006C7A]/10 bg-white px-5 py-16 lg:px-8">

					<div className="mx-auto max-w-3xl text-center">

						<div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EAF6F3] text-xl font-black text-[#006C7A]">
							WB
						</div>

						<h2 className="mt-5 text-2xl font-black text-slate-900 sm:text-3xl">
							¿Listo para empezar?
						</h2>

						<p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-slate-500">
							Registra tus movimientos, organiza
							tus finanzas y empieza a construir
							una visión más clara de tu economía.
						</p>

						<div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">

							<Link
								to="/login"
								className="
									rounded-xl
									bg-[#006C7A]
									px-6 py-3
									text-sm font-extrabold
									text-white
									transition
									hover:bg-[#005964]
								"
							>
								Entrar en WalletBill →
							</Link>

							<Link
								to="/"
								className="
									rounded-xl
									border border-slate-200
									bg-white
									px-6 py-3
									text-sm font-bold
									text-slate-600
									transition
									hover:bg-slate-50
								"
							>
								Volver al inicio
							</Link>

						</div>

					</div>

				</section>

			</main>

			{/* ================================================== */}
			{/* MODAL GUÍA                                         */}
			{/* ================================================== */}

			{guiaAbierta && (
				<ModalGuia
					guia={
						guides.find(
							(guia) =>
								guia.id ===
								guiaAbierta
						) ?? null
					}
					onClose={() =>
						setGuiaAbierta(null)
					}
				/>
			)}

		</div>
	);
}

/* ========================================================== */
/* CABECERA DE SECCIÓN                                        */
/* ========================================================== */

function SectionHeader({
	eyebrow,
	titulo,
	descripcion,
	contador,
}: {
	eyebrow: string;
	titulo: string;
	descripcion: string;
	contador?: number;
}) {
	return (
		<div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">

			<div>
				<p className="text-xs font-extrabold uppercase tracking-[0.15em] text-[#008F8C]">
					{eyebrow}
				</p>

				<h2 className="mt-2 text-2xl font-black text-slate-900 sm:text-3xl">
					{titulo}
				</h2>

				<p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
					{descripcion}
				</p>
			</div>

			{contador !== undefined && (
				<span className="w-fit rounded-xl border border-[#008F8C]/10 bg-white px-3 py-2 text-xs font-extrabold text-[#006C7A] shadow-sm">
					{contador} guías
				</span>
			)}

		</div>
	);
}

/* ========================================================== */
/* GUÍA CARD                                                  */
/* ========================================================== */

function GuiaCard({
	guia,
	onClick,
}: {
	guia: Guide;
	onClick: () => void;
}) {
	return (
		<button
			type="button"
			onClick={onClick}
			className="
				group
				flex h-full
				flex-col
				rounded-[24px]
				border border-slate-200
				bg-white
				p-5
				text-left
				shadow-sm
				transition
				hover:-translate-y-1
				hover:border-[#008F8C]/30
				hover:shadow-lg
				hover:shadow-slate-200/50
			"
		>

			<div className="flex items-start justify-between gap-4">

				<div
					className="
						flex h-11 w-11
						items-center justify-center
						rounded-xl
						bg-[#EAF6F3]
						text-xl font-black
						text-[#006C7A]
						transition
						group-hover:bg-[#006C7A]
						group-hover:text-white
					"
				>
					{guia.icono}
				</div>

				<span className="rounded-lg bg-slate-50 px-2.5 py-1 text-[11px] font-extrabold text-slate-400">
					{guia.pasos.length} pasos
				</span>

			</div>

			<h3 className="mt-5 text-lg font-black text-slate-800">
				{guia.titulo}
			</h3>

			<p className="mt-2 flex-1 text-sm leading-6 text-slate-500">
				{guia.descripcion}
			</p>

			<div className="mt-5 flex items-center gap-2 text-sm font-extrabold text-[#006C7A]">
				Ver guía

				<span className="transition group-hover:translate-x-1">
					→
				</span>
			</div>

		</button>
	);
}

/* ========================================================== */
/* MODAL GUÍA                                                 */
/* ========================================================== */

function ModalGuia({
	guia,
	onClose,
}: {
	guia: Guide | null;
	onClose: () => void;
}) {
	if (!guia) {
		return null;
	}

	return (
		<div
			className="
				fixed inset-0 z-[100]
				flex items-center justify-center
				bg-slate-900/45
				px-4 py-6
				backdrop-blur-sm
			"
			onMouseDown={(e) => {
				if (e.target === e.currentTarget) {
					onClose();
				}
			}}
		>

			<div
				className="
					flex max-h-[92vh]
					w-full max-w-2xl
					flex-col
					overflow-hidden
					rounded-[28px]
					border border-white/60
					bg-white
					shadow-2xl
				"
			>

				{/* HEADER MODAL */}

				<div className="flex items-start justify-between gap-5 border-b border-slate-100 bg-[#F2F9F7] px-6 py-5 sm:px-7">

					<div className="flex items-start gap-4">

						<div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#006C7A] text-xl font-black text-white">
							{guia.icono}
						</div>

						<div>
							<p className="text-[11px] font-extrabold uppercase tracking-[0.15em] text-[#008F8C]">
								Guía paso a paso
							</p>

							<h2 className="mt-1 text-xl font-black text-slate-900 sm:text-2xl">
								{guia.titulo}
							</h2>

							<p className="mt-2 text-sm leading-6 text-slate-500">
								{guia.descripcion}
							</p>
						</div>

					</div>

					<button
						type="button"
						onClick={onClose}
						className="
							flex h-9 w-9
							shrink-0
							items-center justify-center
							rounded-xl
							border border-slate-200
							bg-white
							text-xl font-bold
							text-slate-400
							transition
							hover:text-slate-700
						"
						aria-label="Cerrar guía"
					>
						×
					</button>

				</div>

				{/* PASOS */}

				<div className="min-h-0 flex-1 overflow-y-auto px-6 py-6 sm:px-7">

					<div className="space-y-1">

						{guia.pasos.map(
							(paso, index) => (
								<div
									key={
										paso.numero
									}
									className="relative flex gap-4 pb-6"
								>

									{/* LÍNEA */}

									{index <
										guia.pasos
											.length -
										1 && (
											<div className="absolute bottom-0 left-[18px] top-9 w-px bg-[#008F8C]/20" />
										)}

									{/* NÚMERO */}

									<div
										className="
											relative z-10
											flex h-9 w-9
											shrink-0
											items-center justify-center
											rounded-xl
											bg-[#006C7A]
											text-sm font-black
											text-white
											shadow-sm
										"
									>
										{
											paso.numero
										}
									</div>

									{/* TEXTO */}

									<div className="pt-1">

										<h3 className="text-sm font-extrabold text-slate-800 sm:text-base">
											{
												paso.titulo
											}
										</h3>

										<p className="mt-1.5 text-sm leading-6 text-slate-500">
											{
												paso.descripcion
											}
										</p>

									</div>

								</div>
							)
						)}

					</div>

					{/* CONSEJO */}

					{guia.consejo && (
						<div className="mt-2 rounded-2xl border border-[#008F8C]/15 bg-[#EAF6F3] p-4">

							<div className="flex gap-3">

								<div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-sm font-black text-[#006C7A] shadow-sm">
									i
								</div>

								<div>
									<p className="text-xs font-extrabold uppercase tracking-wider text-[#006C7A]">
										Consejo WalletBill
									</p>

									<p className="mt-1.5 text-sm leading-6 text-slate-600">
										{
											guia.consejo
										}
									</p>
								</div>

							</div>

						</div>
					)}

				</div>

				{/* FOOTER MODAL */}

				<div className="border-t border-slate-100 bg-slate-50/70 px-6 py-4 sm:px-7">

					<button
						type="button"
						onClick={onClose}
						className="
							w-full
							rounded-xl
							bg-[#006C7A]
							px-5 py-3
							text-sm font-extrabold
							text-white
							transition
							hover:bg-[#005964]
						"
					>
						Entendido
					</button>

				</div>

			</div>

		</div>
	);
}

/* ========================================================== */
/* PREGUNTA FAQ                                               */
/* ========================================================== */

function Pregunta({
	item,
	abierta,
	onClick,
}: {
	item: FAQItem;
	abierta: boolean;
	onClick: () => void;
}) {
	return (
		<div
			className={`
				overflow-hidden
				rounded-2xl
				border
				bg-white
				transition
				${abierta
					? "border-[#008F8C]/30 shadow-md shadow-slate-200/30"
					: "border-slate-200 hover:border-[#008F8C]/20"
				}
			`}
		>

			<button
				type="button"
				onClick={onClick}
				className="
					flex w-full
					items-center justify-between
					gap-5
					px-5 py-4
					text-left
					sm:px-6
				"
			>

				<span className="text-sm font-extrabold leading-6 text-slate-800 sm:text-[15px]">
					{item.pregunta}
				</span>

				<span
					className={`
						flex h-8 w-8
						shrink-0
						items-center justify-center
						rounded-lg
						text-lg font-bold
						transition
						${abierta
							? "rotate-45 bg-[#006C7A] text-white"
							: "bg-[#EAF6F3] text-[#006C7A]"
						}
					`}
				>
					+
				</span>

			</button>

			{abierta && (
				<div className="border-t border-slate-100 px-5 py-4 sm:px-6">

					<p className="text-sm leading-7 text-slate-500">
						{item.respuesta}
					</p>

				</div>
			)}

		</div>
	);
}

/* ========================================================== */
/* PASO RÁPIDO                                                */
/* ========================================================== */

function PasoRapido({
	numero,
	titulo,
	texto,
}: {
	numero: string;
	titulo: string;
	texto: string;
}) {
	return (
		<div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-sm">

			<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-sm font-black text-[#006C7A]">
				{numero}
			</div>

			<h3 className="mt-4 text-sm font-extrabold text-white">
				{titulo}
			</h3>

			<p className="mt-1.5 text-xs leading-5 text-white/65">
				{texto}
			</p>

		</div>
	);
}

/* ========================================================== */
/* SIN RESULTADOS                                             */
/* ========================================================== */

function EstadoSinResultados({
	busqueda,
	onReset,
}: {
	busqueda: string;
	onReset: () => void;
}) {
	return (
		<div className="mx-auto max-w-2xl rounded-[28px] border border-slate-200 bg-white px-6 py-14 text-center shadow-sm">

			<div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EAF6F3] text-2xl font-black text-[#006C7A]">
				?
			</div>

			<h2 className="mt-5 text-xl font-black text-slate-800">
				No encontramos resultados
			</h2>

			<p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
				No hemos encontrado ninguna guía o pregunta
				relacionada con{" "}
				<span className="font-bold text-slate-700">
					"{busqueda}"
				</span>
				.
			</p>

			<button
				type="button"
				onClick={onReset}
				className="mt-6 rounded-xl bg-[#006C7A] px-5 py-3 text-sm font-extrabold text-white transition hover:bg-[#005964]"
			>
				Ver todo el centro de ayuda
			</button>

		</div>
	);
}