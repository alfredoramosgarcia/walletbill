export function formatCategoryTitle(name: string): string {
	// Añade espacio antes de mayúsculas interiores, ej: "GastoExtra" → "Gasto Extra"
	return name.replace(/([a-z])([A-Z])/g, "$1 $2").toUpperCase();
}
