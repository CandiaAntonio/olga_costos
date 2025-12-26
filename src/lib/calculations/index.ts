import { prisma } from '@/lib/db'

/**
 * Calcula el PCG (Precio Costo Gramo)
 * PCG = (Suma Costos Fijos + Depreciaciones) / Gramos Producidos Mes
 */
export async function calcularPCG(): Promise<number> {
  // Obtener configuración global
  const config = await prisma.configuracionGlobal.findFirst()
  const gramosProducidosMes = config?.gramosProducidosMes ?? 509

  // Sumar todos los costos fijos activos
  const costosFijos = await prisma.costoFijo.findMany({
    where: { activo: true }
  })
  const totalCostosFijos = costosFijos.reduce((sum, c) => sum + c.valor, 0)

  // Sumar todas las depreciaciones activas
  const depreciaciones = await prisma.depreciacion.findMany({
    where: { activo: true }
  })
  const totalDepreciaciones = depreciaciones.reduce((sum, d) => sum + d.valorMensual, 0)

  const totalMensual = totalCostosFijos + totalDepreciaciones

  return totalMensual / gramosProducidosMes
}

/**
 * Calcula el costo total de una pieza
 */
export function calcularCostoTotal(params: {
  pesoGramos: number
  pcg: number
  costoPiedras: number
  costoEsmalte: number
  costoEtapas: number
}): number {
  const { pesoGramos, pcg, costoPiedras, costoEsmalte, costoEtapas } = params
  const costoMaterial = pesoGramos * pcg
  return costoMaterial + costoPiedras + costoEsmalte + costoEtapas
}

/**
 * Calcula el precio sugerido y descuento máximo
 */
export function calcularPrecios(
  costoTotal: number,
  margenGanancia: number = 0.15,
  impuesto: number = 0.19
): { precioSugerido: number; descuentoMaximo: number } {
  // Precio = Costo / (1 - margen) * (1 + impuesto)
  const precioBase = costoTotal / (1 - margenGanancia)
  const precioSugerido = precioBase * (1 + impuesto)

  // Descuento máximo = hasta el punto de equilibrio (costo + impuesto)
  const puntoEquilibrio = costoTotal * (1 + impuesto)
  const descuentoMaximo = ((precioSugerido - puntoEquilibrio) / precioSugerido) * 100

  return {
    precioSugerido: Math.round(precioSugerido),
    descuentoMaximo: Math.round(descuentoMaximo * 10) / 10
  }
}

/**
 * Calcula la ganancia considerando si usa metal propio o del padre
 */
export function calcularGanancia(
  precioVenta: number,
  costoTotal: number,
  esMetalPropio: boolean
): { gananciaTotal: number; gananciaPapa: number; gananciaNeta: number } {
  const gananciaTotal = precioVenta - costoTotal

  if (esMetalPropio) {
    return { gananciaTotal, gananciaPapa: 0, gananciaNeta: gananciaTotal }
  }

  // Si usa metal del padre: 50% de la ganancia es para él
  const gananciaPapa = gananciaTotal * 0.5
  const gananciaNeta = gananciaTotal - gananciaPapa

  return {
    gananciaTotal: Math.round(gananciaTotal),
    gananciaPapa: Math.round(gananciaPapa),
    gananciaNeta: Math.round(gananciaNeta)
  }
}

/**
 * Convierte unidades de esmalte a gramos
 */
export function convertirAGramos(cantidad: number, unidad: string): number {
  const conversiones: Record<string, number> = {
    'kg': 1000,
    'g': 1,
    '20g': 20,
    '30g': 30,
    '1oz': 28.3495,
    'oz': 28.3495
  }

  const factor = conversiones[unidad.toLowerCase()] || 1
  return cantidad * factor
}

/**
 * Calcula precio por gramo de esmalte
 */
export function calcularPrecioPorGramo(
  precioCompra: number,
  cantidad: number,
  unidad: string
): number {
  const gramos = convertirAGramos(cantidad, unidad)
  return precioCompra / gramos
}

/**
 * Genera código de pieza
 * Formato: TIPO-MAT-PESO-PIEDRA1-PIEDRA2-NUM
 */
export function generarCodigoPieza(params: {
  tipoJoya: string
  material: string
  pesoGramos: number
  piedras: Array<{ tipo: string; cantidad: number }>
  numeroInventario: number
}): string {
  const { tipoJoya, material, pesoGramos, piedras, numeroInventario } = params

  // Mapeo de tipos de joya a códigos
  const tiposCodigo: Record<string, string> = {
    'aretes': 'AR',
    'anillo': 'AN',
    'collar': 'CO',
    'brazalete': 'BR',
    'dije': 'DJ',
    'broche': 'BC'
  }

  // Mapeo de materiales
  const materialesCodigo: Record<string, string> = {
    'plata': 'PL',
    'oro': 'OR'
  }

  const tipo = tiposCodigo[tipoJoya.toLowerCase()] || tipoJoya.slice(0, 2).toUpperCase()
  const mat = materialesCodigo[material.toLowerCase()] || material.slice(0, 2).toUpperCase()
  const peso = Math.round(pesoGramos)

  // Códigos de piedras
  const piedrasCodigo = piedras.map(p => {
    const codigo = p.tipo.slice(0, 2).toUpperCase()
    return `${codigo}${p.cantidad}`
  }).join('-')

  const num = numeroInventario.toString().padStart(3, '0')

  return piedrasCodigo
    ? `${tipo}-${mat}-${peso}G-${piedrasCodigo}-${num}`
    : `${tipo}-${mat}-${peso}G-${num}`
}

/**
 * Constantes de etapas de producción
 */
export const ETAPAS_PRODUCCION = [
  { numero: 1, nombre: 'Diseño', descripcion: 'Electricidad, computación, tiempo dedicado' },
  { numero: 2, nombre: 'Impresión 3D', descripcion: 'Costo de resina utilizada' },
  { numero: 3, nombre: 'Fundición', descripcion: 'Servicio externo' },
  { numero: 4, nombre: 'Preparación Esmaltado', descripcion: 'Tiempo y materiales de preparación' },
  { numero: 5, nombre: 'Esmaltado', descripcion: 'Aplicación de esmaltes (3-4g por pieza)' },
  { numero: 6, nombre: 'Acabado', descripcion: 'Brocas, seguetas, ácido' },
  { numero: 7, nombre: 'Engaste de Piedras', descripcion: 'Colocación de piedras preciosas' },
  { numero: 8, nombre: 'Pulido', descripcion: 'Materiales de pulido final' }
] as const
