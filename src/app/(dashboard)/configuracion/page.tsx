import { prisma } from '@/lib/db'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { formatCOP } from '@/lib/utils'
import { Settings, DollarSign, Percent, Scale } from 'lucide-react'

async function getConfig() {
  return prisma.configuracionGlobal.findFirst()
}

async function getEtapas() {
  return prisma.configEtapa.findMany({
    orderBy: { numeroEtapa: 'asc' }
  })
}

export default async function ConfiguracionPage() {
  const [config, etapas] = await Promise.all([
    getConfig(),
    getEtapas()
  ])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Configuración</h1>
        <p className="text-gray-500">Parámetros globales del sistema</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Configuración Global */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Parámetros Globales
            </CardTitle>
            <CardDescription>
              Valores que afectan todos los cálculos del sistema
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-gray-400" />
                <span className="text-sm font-medium">Tipo de Cambio</span>
              </div>
              <span className="text-lg font-bold">
                {formatCOP(config?.tipoCambio || 4000)} / USD
              </span>
            </div>

            <div className="flex items-center justify-between py-3 border-b">
              <div className="flex items-center gap-2">
                <Percent className="h-4 w-4 text-gray-400" />
                <span className="text-sm font-medium">Impuesto</span>
              </div>
              <span className="text-lg font-bold">
                {((config?.impuesto || 0.19) * 100).toFixed(0)}%
              </span>
            </div>

            <div className="flex items-center justify-between py-3 border-b">
              <div className="flex items-center gap-2">
                <Percent className="h-4 w-4 text-gray-400" />
                <span className="text-sm font-medium">Margen de Ganancia</span>
              </div>
              <span className="text-lg font-bold">
                {((config?.margenGanancia || 0.15) * 100).toFixed(0)}%
              </span>
            </div>

            <div className="flex items-center justify-between py-3">
              <div className="flex items-center gap-2">
                <Scale className="h-4 w-4 text-gray-400" />
                <span className="text-sm font-medium">Gramos Producidos/Mes</span>
              </div>
              <span className="text-lg font-bold">
                {config?.gramosProducidosMes || 509}g
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Etapas de Producción */}
        <Card>
          <CardHeader>
            <CardTitle>Etapas de Producción</CardTitle>
            <CardDescription>
              Flujo de trabajo para costear cada pieza
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {etapas.map((etapa) => (
                <div
                  key={etapa.id}
                  className="flex items-start gap-3 py-3 border-b last:border-0"
                >
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">
                    {etapa.numeroEtapa}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{etapa.nombre}</p>
                    {etapa.descripcion && (
                      <p className="text-sm text-gray-500">{etapa.descripcion}</p>
                    )}
                    {etapa.costoFijoDefault && (
                      <p className="text-xs text-green-600 mt-1">
                        Costo por defecto: {formatCOP(etapa.costoFijoDefault)}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="py-4">
          <p className="text-sm text-gray-500 text-center">
            Para modificar estos valores, contacta al administrador del sistema.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
