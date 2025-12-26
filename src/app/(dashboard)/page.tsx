import Link from 'next/link'
import { prisma } from '@/lib/db'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { formatCOP } from '@/lib/utils'
import { Package, DollarSign, TrendingUp, Gem } from 'lucide-react'

async function getStats() {
  const [piezasEnProduccion, totalPiedras, totalCostosFijos] = await Promise.all([
    prisma.pieza.count({ where: { estado: 'produccion' } }),
    prisma.tipoPiedra.count({ where: { activo: true } }),
    prisma.costoFijo.aggregate({
      _sum: { valor: true },
      where: { activo: true }
    })
  ])

  return {
    piezasEnProduccion,
    totalPiedras,
    totalCostosFijos: totalCostosFijos._sum.valor || 0
  }
}

async function getPiezasRecientes() {
  return prisma.pieza.findMany({
    take: 5,
    orderBy: { fechaCreacion: 'desc' },
    include: {
      piedras: {
        include: { tipoPiedra: true }
      }
    }
  })
}

export default async function DashboardPage() {
  const stats = await getStats()
  const piezasRecientes = await getPiezasRecientes()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <Link href="/piezas/nueva">
          <Button>+ Nueva Pieza</Button>
        </Link>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Piezas en Producción
            </CardTitle>
            <Package className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.piezasEnProduccion}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Tipos de Piedras
            </CardTitle>
            <Gem className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPiedras}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Costos Fijos Mensuales
            </CardTitle>
            <DollarSign className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCOP(stats.totalCostosFijos)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Ganancia del Mes
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">$0</div>
            <p className="text-xs text-gray-500">Sin ventas registradas</p>
          </CardContent>
        </Card>
      </div>

      {/* Piezas Recientes */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Piezas Recientes</CardTitle>
            <Link href="/piezas" className="text-sm text-blue-600 hover:underline">
              Ver todas
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {piezasRecientes.length === 0 ? (
            <div className="text-center py-8">
              <Gem className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-semibold text-gray-900">No hay piezas</h3>
              <p className="mt-1 text-sm text-gray-500">
                Comienza creando tu primera pieza de joyería.
              </p>
              <div className="mt-6">
                <Link href="/piezas/nueva">
                  <Button>+ Nueva Pieza</Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Código
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Tipo
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Peso
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Costo Total
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Estado
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {piezasRecientes.map((pieza) => (
                    <tr key={pieza.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-blue-600">
                        <Link href={`/piezas/${pieza.id}`}>{pieza.codigo}</Link>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900 capitalize">
                        {pieza.tipoJoya}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">
                        {pieza.pesoGramos}g
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {pieza.costoTotal ? formatCOP(pieza.costoTotal) : '-'}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          pieza.estado === 'produccion'
                            ? 'bg-yellow-100 text-yellow-800'
                            : pieza.estado === 'terminada'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {pieza.estado}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
