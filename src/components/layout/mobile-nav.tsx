'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  Gem,
  Palette,
  Settings,
  Package,
  DollarSign,
  CalendarDays,
  Menu,
  X
} from 'lucide-react'

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Piezas', href: '/piezas', icon: Package },
  { name: 'Piedras', href: '/inventario/piedras', icon: Gem },
  { name: 'Esmaltes', href: '/inventario/esmaltes', icon: Palette },
  { name: 'Costos Fijos', href: '/costos-fijos', icon: DollarSign },
  { name: 'Ventas', href: '/ventas', icon: CalendarDays },
  { name: 'Configuración', href: '/configuracion', icon: Settings },
]

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  return (
    <div className="lg:hidden">
      {/* Header móvil */}
      <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm">
        <button
          type="button"
          className="-m-2.5 p-2.5 text-gray-700"
          onClick={() => setIsOpen(true)}
        >
          <span className="sr-only">Abrir menú</span>
          <Menu className="h-6 w-6" aria-hidden="true" />
        </button>
        <div className="flex-1 text-center">
          <span className="font-semibold text-gray-900">Joyería Olga</span>
        </div>
      </div>

      {/* Menú móvil */}
      {isOpen && (
        <div className="relative z-50">
          <div className="fixed inset-0 bg-gray-900/80" onClick={() => setIsOpen(false)} />
          <div className="fixed inset-0 flex">
            <div className="relative mr-16 flex w-full max-w-xs flex-1">
              <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                <button type="button" className="-m-2.5 p-2.5" onClick={() => setIsOpen(false)}>
                  <span className="sr-only">Cerrar menú</span>
                  <X className="h-6 w-6 text-white" aria-hidden="true" />
                </button>
              </div>

              <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-4">
                <div className="flex h-16 shrink-0 items-center">
                  <span className="text-xl font-bold">Joyería Olga</span>
                </div>
                <nav className="flex flex-1 flex-col">
                  <ul role="list" className="flex flex-1 flex-col gap-y-7">
                    <li>
                      <ul role="list" className="-mx-2 space-y-1">
                        {navigation.map((item) => {
                          const isActive = pathname === item.href ||
                            (item.href !== '/' && pathname.startsWith(item.href))
                          return (
                            <li key={item.name}>
                              <Link
                                href={item.href}
                                onClick={() => setIsOpen(false)}
                                className={cn(
                                  'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold',
                                  isActive
                                    ? 'bg-gray-100 text-blue-600'
                                    : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                                )}
                              >
                                <item.icon
                                  className={cn(
                                    'h-6 w-6 shrink-0',
                                    isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-blue-600'
                                  )}
                                  aria-hidden="true"
                                />
                                {item.name}
                              </Link>
                            </li>
                          )
                        })}
                      </ul>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
