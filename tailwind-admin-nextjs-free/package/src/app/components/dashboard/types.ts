export interface MonthlyMovement {
  year: string
  month: string
  entradas: number
  salidas: number
}

export interface InventorySummary {
  id: number
  nombre_insumo: string
  unidad_medida: string
  stock_actual: number
  stock_minimo: number
}

export interface RecentMovement {
  id: number
  nombre_insumo: string
  tipo_movimiento: string
  cantidad: number
  fecha: string
  nombre_completo: string
}

export interface DashboardData {
  monthlyMovements: MonthlyMovement[]
  movementTotals: {
    entradas: number
    salidas: number
    ajustes: number
  }
  inventory: InventorySummary[]
  recentMovements: RecentMovement[]
}
