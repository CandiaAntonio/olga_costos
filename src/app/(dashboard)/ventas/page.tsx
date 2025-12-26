import { prisma } from '@/lib/db'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCOP } from '@/lib/utils'
import { ShoppingBag, TrendingUp } from 'lucide-react'

async function getVentas() {
  return prisma.venta.findMany({
    orderBy: { fecha: 'desc' },
    include: {
      pieza: true
    }
  })
}

export default async function VentasPage() {
  const ventas = await getVentas()
  const totalVentas = ventas.reduce((sum, v) => sum + v.precioReal, 0)
  const totalGanancias = ventas.reduce((sum, v) => sum + (v.gananciaNeta || 0), 0)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Ventas</h1>
        <p className="text-gray-500">Registro de ventas y ganancias</p>
      </div>

      {/* Resumen */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-500">Total Ventas</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{ventas.length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-500">Ingresos</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-blue-600">{formatCOP(totalVentas)}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-500">Ganancia Neta</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-600">{formatCOP(totalGanancias)}</p>
          </CardContent>
        </Card>
      </div>

      {ventas.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <ShoppingBag className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-semibold text-gray-900">No hay ventas</h3>
              <p className="mt-1 text-sm text-gray-500">
                Las ventas se registran desde el detalle de cada pieza.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Historial de Ventas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Fecha
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Pieza
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Precio Marcado
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Precio Real
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Descuento
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Ganancia
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {ventas.map((venta) => (
                    <tr key={venta.id}>
                      <td className="px-4 py-3 text-sm text-gray-500">
                        {new Date(venta.fecha).toLocaleDateString('es-CO')}
                      </td>
                      <td className="px-4 py-3 text-sm text-blue-600">
                        {venta.pieza.codigo}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">
                        {formatCOP(venta.precioMarcado)}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {formatCOP(venta.precioReal)}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">
                        {venta.descuento ? `${venta.descuento}%` : '-'}
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-green-600">
                        {venta.gananciaNeta ? formatCOP(venta.gananciaNeta) : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
