-- CreateTable
CREATE TABLE "ConfiguracionGlobal" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tipoCambio" REAL NOT NULL DEFAULT 4000,
    "impuesto" REAL NOT NULL DEFAULT 0.19,
    "margenGanancia" REAL NOT NULL DEFAULT 0.15,
    "gramosProducidosMes" REAL NOT NULL DEFAULT 509,
    "actualizadoEn" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "CostoFijo" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nombre" TEXT NOT NULL,
    "categoria" TEXT NOT NULL,
    "valor" REAL NOT NULL,
    "periodo" TEXT NOT NULL DEFAULT 'mensual',
    "notas" TEXT,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "creadoEn" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizadoEn" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Depreciacion" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nombre" TEXT NOT NULL,
    "valorInicial" REAL NOT NULL,
    "vidaUtilAnios" INTEGER NOT NULL,
    "fechaInicio" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "valorMensual" REAL NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true
);

-- CreateTable
CREATE TABLE "TipoPiedra" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nombre" TEXT NOT NULL,
    "precioCop" REAL NOT NULL,
    "esNatural" BOOLEAN NOT NULL DEFAULT true,
    "categoria" TEXT,
    "descripcion" TEXT,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "creadoEn" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Esmalte" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nombre" TEXT NOT NULL,
    "color" TEXT,
    "cantidadCompra" REAL NOT NULL,
    "unidadCompra" TEXT NOT NULL,
    "precioCompra" REAL NOT NULL,
    "precioPorGramo" REAL NOT NULL,
    "stockActual" REAL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "creadoEn" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Pieza" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "codigo" TEXT NOT NULL,
    "nombre" TEXT,
    "tipoJoya" TEXT NOT NULL,
    "coleccion" TEXT,
    "material" TEXT NOT NULL DEFAULT 'plata',
    "pesoGramos" REAL NOT NULL,
    "esMetalPropio" BOOLEAN NOT NULL DEFAULT true,
    "costoPCG" REAL,
    "costoMaterial" REAL,
    "costoPiedras" REAL,
    "costoEsmalte" REAL,
    "costoEtapas" REAL,
    "costoTotal" REAL,
    "precioSugerido" REAL,
    "descuentoMaximo" REAL,
    "estado" TEXT NOT NULL DEFAULT 'produccion',
    "fechaCreacion" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaTerminado" DATETIME,
    "notas" TEXT
);

-- CreateTable
CREATE TABLE "EtapaCosto" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "piezaId" TEXT NOT NULL,
    "etapa" INTEGER NOT NULL,
    "nombre" TEXT NOT NULL,
    "costoServicio" REAL,
    "costoMaterial" REAL,
    "costoConsumo" REAL,
    "tiempoHoras" REAL,
    "costoTotal" REAL NOT NULL,
    "notas" TEXT,
    "completada" BOOLEAN NOT NULL DEFAULT false,
    "fechaCompletada" DATETIME,
    CONSTRAINT "EtapaCosto_piezaId_fkey" FOREIGN KEY ("piezaId") REFERENCES "Pieza" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PiezaPiedra" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "piezaId" TEXT NOT NULL,
    "tipoPiedraId" TEXT NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "esPrincipal" BOOLEAN NOT NULL DEFAULT true,
    "tamano" TEXT,
    "limpieza" TEXT,
    "color" TEXT,
    "precioUnitario" REAL NOT NULL,
    "costoTotal" REAL NOT NULL,
    CONSTRAINT "PiezaPiedra_piezaId_fkey" FOREIGN KEY ("piezaId") REFERENCES "Pieza" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "PiezaPiedra_tipoPiedraId_fkey" FOREIGN KEY ("tipoPiedraId") REFERENCES "TipoPiedra" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Venta" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "piezaId" TEXT NOT NULL,
    "fecha" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "precioMarcado" REAL NOT NULL,
    "precioReal" REAL NOT NULL,
    "descuento" REAL,
    "gananciaTotal" REAL,
    "gananciaPapa" REAL,
    "gananciaNeta" REAL,
    "esExposicion" BOOLEAN NOT NULL DEFAULT false,
    "exposicionId" TEXT,
    "cliente" TEXT,
    "notas" TEXT,
    CONSTRAINT "Venta_piezaId_fkey" FOREIGN KEY ("piezaId") REFERENCES "Pieza" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Venta_exposicionId_fkey" FOREIGN KEY ("exposicionId") REFERENCES "Exposicion" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Exposicion" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nombre" TEXT NOT NULL,
    "ubicacion" TEXT,
    "fechaInicio" DATETIME NOT NULL,
    "fechaFin" DATETIME,
    "costoStand" REAL,
    "costoVitrina" REAL,
    "costoLuces" REAL,
    "costoMontaje" REAL,
    "costoTransporte" REAL,
    "costoOtros" REAL,
    "costoTotal" REAL,
    "piezasLlevadas" INTEGER,
    "costoPorPieza" REAL,
    "notas" TEXT
);

-- CreateTable
CREATE TABLE "ConfigEtapa" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "numeroEtapa" INTEGER NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "costoFijoDefault" REAL,
    "activo" BOOLEAN NOT NULL DEFAULT true
);

-- CreateIndex
CREATE UNIQUE INDEX "TipoPiedra_nombre_key" ON "TipoPiedra"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "Pieza_codigo_key" ON "Pieza"("codigo");

-- CreateIndex
CREATE INDEX "EtapaCosto_piezaId_idx" ON "EtapaCosto"("piezaId");

-- CreateIndex
CREATE INDEX "PiezaPiedra_piezaId_idx" ON "PiezaPiedra"("piezaId");

-- CreateIndex
CREATE INDEX "PiezaPiedra_tipoPiedraId_idx" ON "PiezaPiedra"("tipoPiedraId");

-- CreateIndex
CREATE UNIQUE INDEX "Venta_piezaId_key" ON "Venta"("piezaId");

-- CreateIndex
CREATE INDEX "Venta_exposicionId_idx" ON "Venta"("exposicionId");

-- CreateIndex
CREATE UNIQUE INDEX "ConfigEtapa_numeroEtapa_key" ON "ConfigEtapa"("numeroEtapa");
