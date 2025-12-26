import { prisma } from '@/lib/db'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { formatCOP } from '@/lib/utils'
import { DollarSign, Plus, TrendingDown, Calculator } from 'lucide-react'

async function getCostosFijos() {
  return prisma.costoFijo.findMany({
    where: { activo: true },
    orderBy: { nombre: 'asc' }
  })
}

async function getDepreciaciones() {
  return prisma.depreciacion.findMany({
    where: { activo: true }
  })
}

async function getConfig() {
  return prisma.configuracionGlobal.findFirst()
}

export default async function CostosFijosPage() {
  const [costosFijos, depreciaciones, config] = await Promise.all([
    getCostosFijos(),
    getDepreciaciones(),
    getConfig()
  ])

  const totalCostosFijos = costosFijos.reduce((sum, c) => sum + c.valor, 0)
  const totalDepreciaciones = depreciaciones.reduce((sum, d) => sum + d.valorMensual, 0)
  const totalMensual = totalCostosFijos + totalDepreciaciones
  const gramosProducidos = config?.gramosProducidosMes || 509
  const pcg = totalMensual / gramosProducidos

  // Agrupar costos por categoría
  const costosPorCategoria = costosFijos.reduce((acc, costo) => {
    const cat = costo.categoria || 'otros'
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(costo)
    return acc
  }, {} as Record<string, typeof costosFijos>)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Costos Fijos</h1>
          <p className="text-gray-500">Gestiona tus costos mensuales y depreciaciones</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Costo
        </Button>
      </div>

      {/* Resumen */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-blue-700">Total Costos Fijos</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-blue-900">{formatCOP(totalCostosFijos)}</p>
          </CardContent>
        </Card>

        <Card className="bg-orange-50 border-orange-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-orange-700">Depreciaciones</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-orange-900">{formatCOP(totalDepreciaciones)}</p>
          </CardContent>
        </Card>

        <Card className="bg-purple-50 border-purple-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-purple-700">Total Mensual</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-purple-900">{formatCOP(totalMensual)}</p>
          </CardContent>
        </Card>

        <Card className="bg-green-50 border-green-200">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <Calculator className="h-4 w-4 text-green-600" />
              <CardTitle className="text-sm text-green-700">PCG (Costo/Gramo)</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-900">{formatCOP(Math.round(pcg))}</p>
            <p className="text-xs text-green-600">Basado en {gramosProducidos}g/mes</p>
          </CardContent>
        </Card>
      </div>

      {/* Costos por Categoría */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {Object.entries(costosPorCategoria).map(([categoria, costos]) => (
          <Card key={categoria}>
            <CardHeader>
              <CardTitle className="capitalize flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                {categoria === 'servicio' ? 'Servicios' :
                 categoria === 'material' ? 'Materiales' :
                 categoria === 'consumible' ? 'Consumibles' : 'Otros'}
              </CardTitle>
              <CardDescription>
                Total: {formatCOP(costos.reduce((s, c) => s + c.valor, 0))}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {costos.map((costo) => (
                  <div key={costo.id} className="flex justify-between items-center py-2 border-b last:border-0">
                    <span className="text-sm text-gray-700">{costo.nombre}</span>
                    <span className="font-medium">{formatCOP(costo.valor)}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Depreciaciones */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingDown className="h-5 w-5" />
              Depreciaciones
            </CardTitle>
            <CardDescription>
              Total mensual: {formatCOP(totalDepreciaciones)}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {depreciaciones.map((dep) => (
                <div key={dep.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">{dep.nombre}</span>
                    <span className="text-lg font-bold">{formatCOP(dep.valorMensual)}/mes</span>
                  </div>
                  <div className="text-sm text-gray-500">
                    <p>Valor inicial: {formatCOP(dep.valorInicial)}</p>
                    <p>Vida útil: {dep.vidaUtilAnios} años</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
