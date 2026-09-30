/* ========================================================== */
/* TIPOS                                                      */
/* ========================================================== */

export type FAQItem = {
	id: string;
	pregunta: string;
	respuesta: string;
};

export type FAQSection = {
	id: string;
	titulo: string;
	descripcion: string;
	preguntas: FAQItem[];
};

export type GuideStep = {
	numero: number;
	titulo: string;
	descripcion: string;
};

export type Guide = {
	id: string;
	titulo: string;
	descripcion: string;
	icono: string;
	pasos: GuideStep[];
	consejo?: string;
};

/* ========================================================== */
/* GUÍAS PASO A PASO                                         */
/* ========================================================== */

export const guides: Guide[] = [
	/* ------------------------------------------------------ */
	/* PRIMEROS PASOS                                        */
	/* ------------------------------------------------------ */

	{
		id: "empezar-walletbill",
		titulo: "Empezar a usar WalletBill",
		descripcion:
			"Configura WalletBill por primera vez y empieza a controlar tus finanzas.",
		icono: "→",
		pasos: [
			{
				numero: 1,
				titulo: "Crea tu cuenta",
				descripcion:
					"Regístrate en WalletBill e inicia sesión para acceder a tu espacio personal.",
			},
			{
				numero: 2,
				titulo: "Prepara tus categorías",
				descripcion:
					"Revisa las categorías que vas a utilizar para organizar tus ingresos y gastos.",
			},
			{
				numero: 3,
				titulo: "Añade tus primeros movimientos",
				descripcion:
					"Registra algunos ingresos y gastos del mes actual para empezar a construir tu resumen financiero.",
			},
			{
				numero: 4,
				titulo: "Consulta el Dashboard",
				descripcion:
					"WalletBill calculará automáticamente tus ingresos, gastos y balance utilizando los movimientos registrados.",
			},
			{
				numero: 5,
				titulo: "Continúa registrando tu actividad",
				descripcion:
					"Mantén tus movimientos actualizados para que WalletBill pueda mostrar una imagen cada vez más completa de tu economía.",
			},
		],
		consejo:
			"No necesitas introducir todo tu historial financiero para empezar. Puedes comenzar con el mes actual e ir utilizando WalletBill desde ese momento.",
	},

	/* ------------------------------------------------------ */
	/* AÑADIR MOVIMIENTO                                     */
	/* ------------------------------------------------------ */

	{
		id: "anadir-movimiento",
		titulo: "Añadir un movimiento",
		descripcion:
			"Registra un nuevo ingreso o gasto en WalletBill.",
		icono: "+",
		pasos: [
			{
				numero: 1,
				titulo: "Pulsa en añadir movimiento",
				descripcion:
					"Desde WalletBill utiliza el botón de añadir para abrir el formulario de nuevo movimiento.",
			},
			{
				numero: 2,
				titulo: "Selecciona el tipo",
				descripcion:
					"Indica si el movimiento es un ingreso o un gasto.",
			},
			{
				numero: 3,
				titulo: "Introduce el concepto",
				descripcion:
					"Escribe un nombre que te permita identificar fácilmente el movimiento, por ejemplo: Supermercado, Nómina, Gasolina o Internet.",
			},
			{
				numero: 4,
				titulo: "Introduce el importe",
				descripcion:
					"Indica la cantidad correspondiente al movimiento.",
			},
			{
				numero: 5,
				titulo: "Selecciona una categoría",
				descripcion:
					"Elige la categoría que mejor represente ese ingreso o gasto.",
			},
			{
				numero: 6,
				titulo: "Comprueba el periodo",
				descripcion:
					"Revisa el mes y año al que quieres asignar el movimiento.",
			},
			{
				numero: 7,
				titulo: "Guarda el movimiento",
				descripcion:
					"Confirma el formulario. El movimiento aparecerá en WalletBill y los cálculos del periodo se actualizarán.",
			},
		],
		consejo:
			"Utiliza conceptos sencillos y categorías consistentes. Esto hará que posteriormente sea mucho más fácil entender en qué estás gastando tu dinero.",
	},

	/* ------------------------------------------------------ */
	/* EDITAR MOVIMIENTO                                     */
	/* ------------------------------------------------------ */

	{
		id: "editar-movimiento",
		titulo: "Editar un movimiento",
		descripcion:
			"Corrige el concepto, importe, categoría u otros datos de un movimiento.",
		icono: "✎",
		pasos: [
			{
				numero: 1,
				titulo: "Localiza el movimiento",
				descripcion:
					"Entra en el periodo correspondiente y busca el movimiento que quieres modificar.",
			},
			{
				numero: 2,
				titulo: "Pulsa en editar",
				descripcion:
					"Utiliza la opción de edición del movimiento para abrir sus datos.",
			},
			{
				numero: 3,
				titulo: "Modifica la información",
				descripcion:
					"Cambia los datos que necesites corregir, como el concepto, importe o categoría.",
			},
			{
				numero: 4,
				titulo: "Guarda los cambios",
				descripcion:
					"Confirma la edición para actualizar el movimiento.",
			},
			{
				numero: 5,
				titulo: "Revisa el Dashboard",
				descripcion:
					"Los totales del periodo se actualizarán utilizando los nuevos datos del movimiento.",
			},
		],
		consejo:
			"Si detectas un movimiento incorrecto, es mejor editarlo que crear otro duplicado.",
	},

	/* ------------------------------------------------------ */
	/* CATEGORÍAS                                            */
	/* ------------------------------------------------------ */

	{
		id: "crear-categoria",
		titulo: "Crear y utilizar una categoría",
		descripcion:
			"Organiza tus movimientos para entender mejor tus ingresos y gastos.",
		icono: "▦",
		pasos: [
			{
				numero: 1,
				titulo: "Abre Categorías",
				descripcion:
					"Accede al apartado de gestión de categorías desde WalletBill.",
			},
			{
				numero: 2,
				titulo: "Crea una categoría",
				descripcion:
					"Utiliza la opción para añadir una nueva categoría.",
			},
			{
				numero: 3,
				titulo: "Ponle un nombre claro",
				descripcion:
					"Utiliza nombres fáciles de reconocer, como Alimentación, Transporte, Vivienda, Ocio, Nómina o Suscripciones.",
			},
			{
				numero: 4,
				titulo: "Guarda la categoría",
				descripcion:
					"Una vez creada quedará disponible para utilizarla al registrar tus movimientos.",
			},
			{
				numero: 5,
				titulo: "Asigna movimientos",
				descripcion:
					"Cuando añadas un ingreso o gasto, selecciona la categoría correspondiente.",
			},
			{
				numero: 6,
				titulo: "Mantén un criterio estable",
				descripcion:
					"Intenta utilizar siempre la misma categoría para gastos similares. De esta forma los resúmenes serán más útiles.",
			},
		],
		consejo:
			"No es necesario crear decenas de categorías. Empieza con grupos generales y crea categorías más específicas solamente cuando realmente te ayuden a analizar tus finanzas.",
	},

	/* ------------------------------------------------------ */
	/* FAVORITOS                                             */
	/* ------------------------------------------------------ */

	{
		id: "usar-favoritos",
		titulo: "Utilizar favoritos",
		descripcion:
			"Ahorra tiempo con los movimientos que utilizas habitualmente.",
		icono: "★",
		pasos: [
			{
				numero: 1,
				titulo: "Guarda movimientos habituales",
				descripcion:
					"Utiliza favoritos para aquellos movimientos que se repiten con frecuencia.",
			},
			{
				numero: 2,
				titulo: "Abre tus favoritos",
				descripcion:
					"Desde WalletBill accede al listado de movimientos favoritos guardados.",
			},
			{
				numero: 3,
				titulo: "Selecciona un favorito",
				descripcion:
					"Puedes importar únicamente el movimiento que necesites.",
			},
			{
				numero: 4,
				titulo: "O importa todos",
				descripcion:
					"Si tienes varios movimientos habituales, puedes importarlos conjuntamente al periodo actual.",
			},
			{
				numero: 5,
				titulo: "Revisa los movimientos",
				descripcion:
					"Comprueba los movimientos importados y modifica cualquiera que necesite un importe o dato diferente.",
			},
		],
		consejo:
			"Los favoritos son especialmente útiles para movimientos recurrentes como alquiler, suscripciones, nómina o determinados pagos mensuales.",
	},

	/* ------------------------------------------------------ */
	/* CAMBIAR MES                                           */
	/* ------------------------------------------------------ */

	{
		id: "cambiar-periodo",
		titulo: "Consultar otro mes o año",
		descripcion:
			"Navega por tu historial financiero utilizando el selector de periodo.",
		icono: "◷",
		pasos: [
			{
				numero: 1,
				titulo: "Localiza el selector",
				descripcion:
					"Utiliza el selector de mes y año disponible en WalletBill.",
			},
			{
				numero: 2,
				titulo: "Selecciona el mes",
				descripcion:
					"Escoge el mes que quieres consultar.",
			},
			{
				numero: 3,
				titulo: "Selecciona el año",
				descripcion:
					"Indica el año correspondiente.",
			},
			{
				numero: 4,
				titulo: "Consulta la información",
				descripcion:
					"WalletBill mostrará los movimientos y cálculos correspondientes al periodo seleccionado.",
			},
		],
	},

	/* ------------------------------------------------------ */
	/* DASHBOARD                                             */
	/* ------------------------------------------------------ */

	{
		id: "entender-dashboard",
		titulo: "Entender el Dashboard",
		descripcion:
			"Aprende a interpretar el resumen principal de WalletBill.",
		icono: "▥",
		pasos: [
			{
				numero: 1,
				titulo: "Comprueba el periodo",
				descripcion:
					"Antes de analizar los datos, revisa qué mes y año tienes seleccionados.",
			},
			{
				numero: 2,
				titulo: "Revisa tus ingresos",
				descripcion:
					"WalletBill suma los movimientos registrados como ingresos durante ese periodo.",
			},
			{
				numero: 3,
				titulo: "Revisa tus gastos",
				descripcion:
					"Los gastos muestran cuánto dinero has registrado como salida durante el periodo.",
			},
			{
				numero: 4,
				titulo: "Consulta el balance",
				descripcion:
					"El balance representa la diferencia entre los ingresos y los gastos registrados.",
			},
			{
				numero: 5,
				titulo: "Analiza las categorías",
				descripcion:
					"Utiliza la distribución por categorías para identificar dónde se concentran tus movimientos.",
			},
		],
		consejo:
			"El Dashboard es más útil cuando registras tus movimientos de forma regular y mantienes un criterio consistente al utilizar las categorías.",
	},

	/* ------------------------------------------------------ */
	/* EVOLUCIÓN                                             */
	/* ------------------------------------------------------ */

	{
		id: "usar-evolucion",
		titulo: "Consultar tu evolución",
		descripcion:
			"Observa cómo cambia tu situación financiera con el paso del tiempo.",
		icono: "↗",
		pasos: [
			{
				numero: 1,
				titulo: "Abre Evolución",
				descripcion:
					"Accede al apartado Evolución desde la navegación de WalletBill.",
			},
			{
				numero: 2,
				titulo: "Consulta los periodos",
				descripcion:
					"WalletBill utiliza la información registrada para mostrar cómo han cambiado tus resultados con el tiempo.",
			},
			{
				numero: 3,
				titulo: "Observa la tendencia",
				descripcion:
					"Analiza si tus balances mejoran, empeoran o se mantienen relativamente estables.",
			},
			{
				numero: 4,
				titulo: "Utiliza los datos como referencia",
				descripcion:
					"Compara diferentes periodos para entender mejor la evolución de tus finanzas.",
			},
		],
	},

	/* ------------------------------------------------------ */
	/* CREAR INVERSIÓN                                       */
	/* ------------------------------------------------------ */

	{
		id: "crear-inversion",
		titulo: "Añadir una inversión",
		descripcion:
			"Empieza a realizar el seguimiento de una inversión desde WalletBill.",
		icono: "◆",
		pasos: [
			{
				numero: 1,
				titulo: "Abre Inversiones",
				descripcion:
					"Accede al módulo de inversiones desde la navegación principal.",
			},
			{
				numero: 2,
				titulo: "Crea una nueva inversión",
				descripcion:
					"Pulsa la opción para añadir una inversión.",
			},
			{
				numero: 3,
				titulo: "Introduce sus datos",
				descripcion:
					"Indica el nombre, tipo de activo, moneda y el resto de información disponible.",
			},
			{
				numero: 4,
				titulo: "Indica la situación inicial",
				descripcion:
					"Si ya tienes dinero invertido, puedes registrar el valor actual y el capital que has aportado.",
			},
			{
				numero: 5,
				titulo: "Guarda la inversión",
				descripcion:
					"La inversión quedará disponible para realizar su seguimiento en WalletBill.",
			},
		],
		consejo:
			"El módulo de inversiones está pensado para llevar un seguimiento de tu patrimonio. Mantén las valoraciones actualizadas para obtener información más representativa.",
	},

	/* ------------------------------------------------------ */
	/* ACTUALIZAR INVERSIÓN                                  */
	/* ------------------------------------------------------ */

	{
		id: "actualizar-inversion",
		titulo: "Actualizar una inversión",
		descripcion:
			"Registra valoraciones, aportaciones y retiradas.",
		icono: "↗",
		pasos: [
			{
				numero: 1,
				titulo: "Selecciona la inversión",
				descripcion:
					"Entra en Inversiones y selecciona el activo que quieres actualizar.",
			},
			{
				numero: 2,
				titulo: "Crea un nuevo registro",
				descripcion:
					"Pulsa la opción para registrar nueva información de la inversión.",
			},
			{
				numero: 3,
				titulo: "Selecciona la operación",
				descripcion:
					"Indica si quieres actualizar únicamente su valor, registrar una aportación o registrar una retirada.",
			},
			{
				numero: 4,
				titulo: "Introduce los datos",
				descripcion:
					"Indica la fecha, importe de la operación cuando corresponda y el valor total de la inversión después de la operación.",
			},
			{
				numero: 5,
				titulo: "Guarda el registro",
				descripcion:
					"WalletBill incorporará el nuevo registro al histórico de la inversión.",
			},
			{
				numero: 6,
				titulo: "Consulta la evolución",
				descripcion:
					"Revisa el valor actual, capital aportado, retiradas, ganancia y evolución histórica de la inversión.",
			},
		],
		consejo:
			"Cuando registres una aportación o retirada, el valor debe representar el valor total de la inversión después de realizar la operación.",
	},
];

/* ========================================================== */
/* PREGUNTAS FRECUENTES                                      */
/* ========================================================== */

export const faqSections: FAQSection[] = [
	/* ------------------------------------------------------ */
	/* PRIMEROS PASOS                                        */
	/* ------------------------------------------------------ */

	{
		id: "primeros-pasos",
		titulo: "Primeros pasos",
		descripcion:
			"Todo lo que necesitas saber antes de empezar.",
		preguntas: [
			{
				id: "que-es-walletbill",
				pregunta: "¿Qué es WalletBill?",
				respuesta:
					"WalletBill es una herramienta de gestión financiera personal que te permite registrar ingresos y gastos, organizarlos por categorías, consultar tu balance y observar cómo evoluciona tu economía.",
			},
			{
				id: "como-empezar",
				pregunta: "¿Cuál es la mejor forma de empezar?",
				respuesta:
					"Empieza creando tu cuenta y preparando unas categorías básicas. Después registra tus ingresos y gastos del mes actual. Con esos datos WalletBill podrá empezar a construir tu Dashboard y tus resúmenes financieros.",
			},
			{
				id: "necesito-historial",
				pregunta:
					"¿Tengo que introducir todos mis movimientos anteriores?",
				respuesta:
					"No. Puedes comenzar directamente con el mes actual. Si quieres disponer de un histórico más completo también puedes registrar información de periodos anteriores.",
			},
			{
				id: "necesito-cuenta",
				pregunta:
					"¿Necesito una cuenta para utilizar WalletBill?",
				respuesta:
					"Sí. La cuenta permite asociar tus movimientos, categorías, favoritos e inversiones a tu usuario.",
			},
		],
	},

	/* ------------------------------------------------------ */
	/* MOVIMIENTOS                                           */
	/* ------------------------------------------------------ */

	{
		id: "movimientos",
		titulo: "Ingresos y gastos",
		descripcion:
			"Cómo funciona el registro de tu actividad financiera.",
		preguntas: [
			{
				id: "que-es-movimiento",
				pregunta:
					"¿Qué es un movimiento en WalletBill?",
				respuesta:
					"Un movimiento es un ingreso o gasto que registras en WalletBill. Cada movimiento contiene la información necesaria para identificarlo y clasificarlo dentro de tu economía.",
			},
			{
				id: "diferencia-ingreso-gasto",
				pregunta:
					"¿Qué diferencia hay entre ingreso y gasto?",
				respuesta:
					"Un ingreso representa dinero que entra en tu economía, como una nómina o un cobro. Un gasto representa dinero que sale, como alimentación, alquiler, transporte o una suscripción.",
			},
			{
				id: "editar-movimiento-faq",
				pregunta:
					"¿Puedo modificar un movimiento después de crearlo?",
				respuesta:
					"Sí. Puedes editar un movimiento para corregir la información que hayas introducido.",
			},
			{
				id: "periodo-movimiento",
				pregunta:
					"¿Por qué es importante seleccionar correctamente el mes y el año?",
				respuesta:
					"WalletBill organiza los movimientos por periodos. Seleccionar correctamente el mes y el año permite que el movimiento aparezca en el resumen financiero correspondiente.",
			},
			{
				id: "balance",
				pregunta:
					"¿Cómo calcula WalletBill mi balance?",
				respuesta:
					"El balance se obtiene a partir de la diferencia entre los ingresos y los gastos registrados para el periodo seleccionado.",
			},
		],
	},

	/* ------------------------------------------------------ */
	/* CATEGORÍAS                                            */
	/* ------------------------------------------------------ */

	{
		id: "categorias",
		titulo: "Categorías",
		descripcion:
			"Organiza correctamente tus ingresos y gastos.",
		preguntas: [
			{
				id: "para-que-categorias",
				pregunta:
					"¿Para qué sirven las categorías?",
				respuesta:
					"Las categorías permiten agrupar movimientos similares para entender mejor de dónde procede tu dinero y en qué lo estás utilizando.",
			},
			{
				id: "categorias-propias",
				pregunta:
					"¿Puedo crear mis propias categorías?",
				respuesta:
					"Sí. Puedes gestionar tus categorías para adaptar WalletBill a la forma en la que quieres organizar tus finanzas.",
			},
			{
				id: "como-organizar-categorias",
				pregunta:
					"¿Cómo debería organizar mis categorías?",
				respuesta:
					"Lo recomendable es empezar con categorías generales que puedas mantener en el tiempo, como Alimentación, Vivienda, Transporte, Ocio o Suscripciones. Después puedes añadir categorías más específicas si realmente las necesitas.",
			},
			{
				id: "muchas-categorias",
				pregunta:
					"¿Es mejor tener muchas categorías?",
				respuesta:
					"No necesariamente. Una estructura sencilla y consistente suele ser más útil que tener muchas categorías que apenas utilizas.",
			},
		],
	},

	/* ------------------------------------------------------ */
	/* FAVORITOS                                             */
	/* ------------------------------------------------------ */

	{
		id: "favoritos",
		titulo: "Favoritos",
		descripcion:
			"Ahorra tiempo con tus movimientos recurrentes.",
		preguntas: [
			{
				id: "que-son-favoritos",
				pregunta:
					"¿Qué son los favoritos?",
				respuesta:
					"Los favoritos permiten reutilizar movimientos habituales para evitar introducir repetidamente la misma información.",
			},
			{
				id: "cuando-usar-favoritos",
				pregunta:
					"¿Cuándo debería utilizar favoritos?",
				respuesta:
					"Son especialmente útiles para movimientos recurrentes como nómina, alquiler, suscripciones, seguros u otros pagos habituales.",
			},
			{
				id: "importar-todos",
				pregunta:
					"¿Puedo importar todos mis favoritos a la vez?",
				respuesta:
					"Sí. WalletBill permite importar un favorito individual o importar conjuntamente los favoritos guardados al periodo correspondiente.",
			},
		],
	},

	/* ------------------------------------------------------ */
	/* DASHBOARD                                             */
	/* ------------------------------------------------------ */

	{
		id: "dashboard",
		titulo: "Dashboard y evolución",
		descripcion:
			"Entiende la información que WalletBill calcula para ti.",
		preguntas: [
			{
				id: "que-muestra-dashboard",
				pregunta:
					"¿Qué información muestra el Dashboard?",
				respuesta:
					"El Dashboard ofrece un resumen del periodo seleccionado utilizando tus movimientos registrados. Permite consultar ingresos, gastos, balance y la distribución de tu actividad financiera.",
			},
			{
				id: "que-es-evolucion",
				pregunta:
					"¿Para qué sirve Evolución?",
				respuesta:
					"Evolución permite observar cómo cambian tus resultados financieros con el paso del tiempo y comparar diferentes periodos.",
			},
			{
				id: "cambiar-mes",
				pregunta:
					"¿Cómo consulto otro mes?",
				respuesta:
					"Utiliza el selector de mes y año de WalletBill. Al cambiar el periodo se mostrará la información correspondiente.",
			},
		],
	},

	/* ------------------------------------------------------ */
	/* INVERSIONES                                           */
	/* ------------------------------------------------------ */

	{
		id: "inversiones",
		titulo: "Inversiones",
		descripcion:
			"Realiza un seguimiento básico de tu patrimonio.",
		preguntas: [
			{
				id: "para-que-inversiones",
				pregunta:
					"¿Para qué sirve el módulo de inversiones?",
				respuesta:
					"Permite registrar inversiones y realizar un seguimiento de su valor, capital aportado, retiradas y evolución.",
			},
			{
				id: "tipos-inversion",
				pregunta:
					"¿Qué tipo de inversiones puedo registrar?",
				respuesta:
					"Puedes utilizar el módulo para organizar diferentes tipos de activos, indicando su información y manteniendo actualizado su valor.",
			},
			{
				id: "valoracion-inversion",
				pregunta:
					"¿Qué significa actualizar el valor de una inversión?",
				respuesta:
					"Consiste en registrar cuánto vale la inversión en una fecha determinada sin que necesariamente se haya producido una aportación o retirada de capital.",
			},
			{
				id: "aportacion-inversion",
				pregunta:
					"¿Cómo registro que he invertido más dinero?",
				respuesta:
					"Selecciona la inversión, crea un nuevo registro y elige la opción de aportación. Introduce el capital añadido y el valor total de la inversión después de realizar la operación.",
			},
			{
				id: "retirada-inversion",
				pregunta:
					"¿Cómo registro una retirada de una inversión?",
				respuesta:
					"Crea un nuevo registro para la inversión y selecciona retirada. Introduce el importe retirado y el valor que queda en la inversión después de la operación.",
			},
			{
				id: "rentabilidad-inversion",
				pregunta:
					"¿Cómo calcula WalletBill la evolución de una inversión?",
				respuesta:
					"WalletBill utiliza las aportaciones, retiradas y valoraciones que has registrado para mostrar información sobre la evolución de la inversión. Por eso es importante mantener sus registros actualizados.",
			},
		],
	},

	/* ------------------------------------------------------ */
	/* CUENTA                                                */
	/* ------------------------------------------------------ */

	{
		id: "cuenta",
		titulo: "Cuenta y datos",
		descripcion:
			"Información básica sobre tu usuario de WalletBill.",
		preguntas: [
			{
				id: "datos-usuario",
				pregunta:
					"¿Mis datos están asociados a mi usuario?",
				respuesta:
					"Sí. La información que registras en WalletBill está asociada a tu cuenta para que puedas acceder a tus propios datos cuando inicies sesión.",
			},
			{
				id: "cerrar-sesion",
				pregunta:
					"¿Cómo cierro sesión?",
				respuesta:
					"Utiliza la opción Cerrar sesión disponible en WalletBill. Después tendrás que volver a identificarte para acceder a tu información.",
			},
		],
	},
];