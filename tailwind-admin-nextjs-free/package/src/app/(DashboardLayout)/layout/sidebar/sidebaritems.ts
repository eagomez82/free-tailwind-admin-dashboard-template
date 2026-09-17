export interface ChildItem {
  id?: number | string
  name?: string
  icon?: string
  children?: ChildItem[]
  item?: unknown
  url?: string
  color?: string
  disabled?: boolean
  subtitle?: string
  badge?: boolean
  badgeType?: string
  isPro?: boolean
}

export interface MenuItem {
  heading?: string
  name?: string
  icon?: string
  id?: number | string
  to?: string
  items?: MenuItem[]
  children?: ChildItem[]
  url?: string
  disabled?: boolean
  subtitle?: string
  badgeType?: string
  badge?: boolean
  isPro?: boolean
}

const SidebarContent: MenuItem[] = [
  {
    heading: 'Inicio',
    children: [
      {
        name: 'Dashboard',
        icon: 'solar:widget-2-linear',
        id: 'dashboard',
        url: '/',
        isPro: false,
      },
    ],
  },
  {
    heading: 'Páginas',
    children: [
      {
        name: 'Gestión de Inventario',
        icon: 'solar:server-linear',
        id: 'inventario',
        url: '/utilities/table',
      },
      {
        name: 'Registro de planta',
        icon: 'solar:document-add-linear',
        id: 'registro-planta',
        url: '/utilities/form',
      },
      {
        name: 'Reportes y Auditoría',
        icon: 'solar:document-add-linear',
        id: 'reportes',
        url: '/utilities/Reports',
      },
    ],
  },
]

export default SidebarContent
