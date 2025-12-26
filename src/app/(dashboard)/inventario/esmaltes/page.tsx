import { prisma } from '@/lib/db'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { formatCOP } from '@/lib/utils'
import { Palette, Plus } from 'lucide-react'

async function getEsmaltes() {
  return prisma.esmalte.findMany({
    where: { activo: true },
    orderBy: { nombre: 'asc' }
  })
}

export default async function EsmaltesPage() {
  const esmaltes = await getEsmaltes()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Inventario de Esmaltes</h1>
          <p className="text-gray-500">Gestiona tus esmaltes y su precio por gramo</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Esmalte
        </Button>
      </div>

      {esmaltes.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <Palette className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-semibold text-gray-900">No hay esmaltes</h3>
              <p className="mt-1 text-sm text-gray-500">
                Comienza agregando esmaltes al inventario.
              </p>
              <p className="mt-2 text-xs text-gray-400">
                El sistema calculará automáticamente el precio por gramo según la unidad de compra.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {esmaltes.map((esmalte) => (
            <Card key={esmalte.id}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <div
                      className="w-4 h-4 rounded-full border"
                      style={{ backgroundColor: esmalte.color || '#ccc' }}
                    />
                    {esmalte.nombre}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Compra:</span>
                    <span>{esmalte.cantidadCompra} {esmalte.unidadCompra}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Precio compra:</span>
                    <span>{formatCOP(esmalte.precioCompra)}</span>
                  </div>
                  <div className="flex justify-between font-medium">
                    <span className="text-gray-700">Precio/gramo:</span>
                    <span className="text-green-600">{formatCOP(esmalte.precioPorGramo)}</span>
                  </div>
                  {esmalte.stockActual && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Stock:</span>
                      <span>{esmalte.stockActual}g</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
