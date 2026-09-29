import type { Favorito } from "../../types/Favorito";

interface Props {
	favoritos: Favorito[];
	onClose: () => void;
	onImportOne: (fav: Favorito) => void;
	onImportAll: () => void;
}

export default function FavoritosModal({
	favoritos,
	onClose,
	onImportOne,
	onImportAll,
}: Props) {
	return (
		<div
			className="
				fixed inset-0 z-[100]
				flex items-center justify-center
				bg-slate-900/40
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
					flex max-h-[90vh]
					w-full max-w-lg
					flex-col
					overflow-hidden
					rounded-[28px]
					border border-white/70
					bg-white
					shadow-2xl
				"
			>
				{/* ========================================== */}
				{/* CABECERA                                   */}
				{/* ========================================== */}

				<div className="flex items-start justify-between border-b border-slate-100 bg-[#F2F9F7] px-6 py-5">
					<div className="flex items-center gap-4">
						<div
							className="
								flex h-11 w-11
								shrink-0 items-center justify-center
								rounded-xl
								bg-white
								text-xl
								shadow-sm
							"
						>
							★
						</div>

						<div>
							<p className="text-xs font-bold uppercase tracking-wider text-[#008F8C]">
								Movimientos
							</p>

							<h2 className="mt-1 text-xl font-extrabold text-slate-900">
								Mis favoritos
							</h2>

							<p className="mt-1 text-sm text-slate-500">
								Importa rápidamente tus movimientos habituales.
							</p>
						</div>
					</div>

					<button
						type="button"
						onClick={onClose}
						className="
							flex h-9 w-9
							shrink-0 items-center justify-center
							rounded-xl
							border border-slate-200
							bg-white
							text-xl font-bold
							text-slate-400
							transition
							hover:border-slate-300
							hover:text-slate-700
						"
						aria-label="Cerrar favoritos"
						title="Cerrar"
					>
						×
					</button>
				</div>

				{/* ========================================== */}
				{/* CONTENIDO                                  */}
				{/* ========================================== */}

				<div className="min-h-0 flex-1 overflow-y-auto p-6">
					{favoritos.length > 0 ? (
						<>
							{/* IMPORTAR TODOS */}

							<button
								type="button"
								onClick={onImportAll}
								className="
									mb-5 flex w-full
									items-center justify-between
									rounded-2xl
									bg-[#006C7A]
									px-5 py-4
									text-left text-white
									shadow-sm
									transition
									hover:bg-[#005964]
									hover:shadow-md
								"
							>
								<div>
									<p className="text-sm font-extrabold">
										Importar todos
									</p>

									<p className="mt-1 text-xs text-white/70">
										Añade los {favoritos.length} favoritos al mes actual
									</p>
								</div>

								<span
									className="
										flex h-9 w-9
										items-center justify-center
										rounded-xl
										bg-white/10
										text-lg font-bold
									"
								>
									↓
								</span>
							</button>

							{/* LISTADO */}

							<div className="mb-3 flex items-center justify-between">
								<p className="text-xs font-bold uppercase tracking-wider text-slate-400">
									Favoritos guardados
								</p>

								<span
									className="
										rounded-lg
										bg-[#EAF6F3]
										px-2.5 py-1
										text-xs font-extrabold
										text-[#006C7A]
									"
								>
									{favoritos.length}
								</span>
							</div>

							<div className="space-y-2">
								{favoritos.map((favorito) => {
									const esIngreso =
										favorito.tipo === "ingreso";

									return (
										<div
											key={favorito.id}
											className="
												group
												flex items-center justify-between
												gap-4
												rounded-2xl
												border border-slate-200
												bg-white
												px-4 py-3.5
												transition
												hover:border-[#008F8C]/30
												hover:bg-[#F8FCFB]
											"
										>
											<div className="flex min-w-0 items-center gap-3">
												<div
													className={`
														flex h-10 w-10
														shrink-0
														items-center justify-center
														rounded-xl
														text-lg font-extrabold
														${esIngreso
															? "bg-emerald-50 text-emerald-600"
															: "bg-rose-50 text-rose-500"
														}
													`}
												>
													{esIngreso ? "+" : "−"}
												</div>

												<div className="min-w-0">
													<p className="truncate text-sm font-extrabold text-slate-800">
														{favorito.concepto}
													</p>

													<div className="mt-1 flex items-center gap-2">
														<span
															className={`
																rounded-md
																px-2 py-0.5
																text-[10px]
																font-extrabold
																uppercase
																${esIngreso
																	? "bg-emerald-50 text-emerald-600"
																	: "bg-rose-50 text-rose-500"
																}
															`}
														>
															{favorito.tipo}
														</span>
													</div>
												</div>
											</div>

											<button
												type="button"
												onClick={() =>
													onImportOne(favorito)
												}
												className="
													shrink-0
													rounded-xl
													border border-[#008F8C]/20
													bg-[#EAF6F3]
													px-3.5 py-2
													text-xs font-extrabold
													text-[#006C7A]
													transition
													hover:border-[#008F8C]/30
													hover:bg-[#DDF1ED]
												"
											>
												Importar
											</button>
										</div>
									);
								})}
							</div>
						</>
					) : (
						/* ================================== */
						/* VACÍO                              */
						/* ================================== */

						<div className="py-12 text-center">
							<div
								className="
									mx-auto flex h-16 w-16
									items-center justify-center
									rounded-2xl
									bg-[#EAF6F3]
									text-2xl
									text-[#006C7A]
								"
							>
								★
							</div>

							<h3 className="mt-5 text-lg font-extrabold text-slate-800">
								No tienes favoritos
							</h3>

							<p className="mx-auto mt-2 max-w-xs text-sm leading-6 text-slate-500">
								Guarda tus movimientos habituales como favoritos para
								importarlos rápidamente cada mes.
							</p>
						</div>
					)}
				</div>

				{/* ========================================== */}
				{/* PIE                                        */}
				{/* ========================================== */}

				<div className="border-t border-slate-100 bg-slate-50/70 px-6 py-4">
					<button
						type="button"
						onClick={onClose}
						className="
							w-full rounded-xl
							border border-slate-200
							bg-white
							px-5 py-3
							text-sm font-bold
							text-slate-600
							transition
							hover:bg-slate-50
							hover:text-slate-800
						"
					>
						Cerrar
					</button>
				</div>
			</div>
		</div>
	);
}