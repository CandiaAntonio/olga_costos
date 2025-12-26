import Link from 'next/link'
import { prisma } from '@/lib/db'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { formatCOP } from '@/lib/utils'
import { Package, Plus } from 'lucide-react'

async function getPiezas() {
  return prisma.pieza.findMany({
    orderBy: { fechaCreacion: 'desc' },
    include: {
      piedras: {
        include: { tipoPiedra: true }
      }
    }
  })
}

export default async function PiezasPage() {
  const piezas = await getPiezas()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Piezas</h1>
          <p className="text-gray-500">Gestiona tus piezas de joyería</p>
        </div>
        <Link href="/piezas/nueva">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Nueva Pieza
          </Button>
        </Link>
      </div>

      {piezas.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <Package className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-semibold text-gray-900">No hay piezas</h3>
              <p className="mt-1 text-sm text-gray-500">
                Comienza creando tu primera pieza de joyería.
              </p>
              <div className="mt-6">
                <Link href="/piezas/nueva">
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Nueva Pieza
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Lista de Piezas ({piezas.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Código
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Nombre
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Tipo
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Peso
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Piedras
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
                  {piezas.map((pieza) => (
                    <tr key={pieza.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-blue-600">
                        <Link href={`/piezas/${pieza.id}`}>{pieza.codigo}</Link>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {pieza.nombre || '-'}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900 capitalize">
                        {pieza.tipoJoya}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">
                        {pieza.pesoGramos}g
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">
                        {pieza.piedras.length > 0
                          ? pieza.piedras.map(p => `${p.cantidad} ${p.tipoPiedra.nombre}`).join(', ')
                          : '-'}
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
          </CardContent>
        </Card>
      )}
    </div>
  )
}
