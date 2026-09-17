
import { getRequestContext } from '@cloudflare/next-on-pages'
import SalesOverview from "../components/dashboard/SalesOverview";
import { YearlyBreakup } from "../components/dashboard/YearlyBreakup";
import { MonthlyEarning } from "../components/dashboard/MonthlyEarning";
import { RecentTransaction } from "../components/dashboard/RecentTransaction";
import { ProductPerformance } from "../components/dashboard/ProductPerformance";
import { Footer } from "../components/dashboard/Footer";
import { TopCards } from "../components/dashboard/TopCards";
import ProfileWelcome from "../components/dashboard/ProfileWelcome";
import { DashboardData } from '../components/dashboard/types'

export const runtime = 'edge'

const emptyDashboardData: DashboardData = {
  monthlyMovements: [],
  movementTotals: { entradas: 0, salidas: 0, ajustes: 0 },
  inventory: [],
  recentMovements: [],
}

export default async function Page() {
  let dashboardData = emptyDashboardData

  try {
    const { env } = getRequestContext()
    const db = (env as any).MI_BASE_DE_DATOS

    const [monthlyResult, totalsResult, inventoryResult, recentResult] =
      await Promise.all([
        db
          .prepare(`
            SELECT
              strftime('%Y', fecha) AS year,
              strftime('%m', fecha) AS month,
              COALESCE(SUM(CASE WHEN tipo_movimiento = 'ENTRADA' THEN cantidad ELSE 0 END), 0) AS entradas,
              COALESCE(SUM(CASE WHEN tipo_movimiento = 'SALIDA_PRODUCCION' THEN cantidad ELSE 0 END), 0) AS salidas
            FROM movimientos
            GROUP BY year, month
            ORDER BY year, month
          `)
          .all(),
        db
          .prepare(`
            SELECT
              COALESCE(SUM(CASE WHEN tipo_movimiento = 'ENTRADA' THEN cantidad ELSE 0 END), 0) AS entradas,
              COALESCE(SUM(CASE WHEN tipo_movimiento = 'SALIDA_PRODUCCION' THEN cantidad ELSE 0 END), 0) AS salidas,
              COALESCE(SUM(CASE WHEN tipo_movimiento = 'AJUSTE' THEN cantidad ELSE 0 END), 0) AS ajustes
            FROM movimientos
          `)
          .first(),
        db
          .prepare(`
            SELECT id, nombre_insumo, unidad_medida, stock_actual, stock_minimo
            FROM inventario
            ORDER BY stock_actual ASC, nombre_insumo ASC
            LIMIT 8
          `)
          .all(),
        db
          .prepare(`
            SELECT
              m.id, i.nombre_insumo, m.tipo_movimiento, m.cantidad, m.fecha,
              u.nombre_completo
            FROM movimientos m
            JOIN inventario i ON i.id = m.insumo_id
            JOIN usuarios u ON u.id = m.usuario_id
            ORDER BY m.fecha DESC, m.id DESC
            LIMIT 6
          `)
          .all(),
      ])

    dashboardData = {
      monthlyMovements: monthlyResult.results.map((item: any) => ({
        year: String(item.year),
        month: String(item.month),
        entradas: Number(item.entradas) || 0,
        salidas: Number(item.salidas) || 0,
      })),
      movementTotals: {
        entradas: Number(totalsResult?.entradas) || 0,
        salidas: Number(totalsResult?.salidas) || 0,
        ajustes: Number(totalsResult?.ajustes) || 0,
      },
      inventory: inventoryResult.results.map((item: any) => ({
        id: Number(item.id),
        nombre_insumo: String(item.nombre_insumo),
        unidad_medida: String(item.unidad_medida),
        stock_actual: Number(item.stock_actual) || 0,
        stock_minimo: Number(item.stock_minimo) || 0,
      })),
      recentMovements: recentResult.results.map((item: any) => ({
        id: Number(item.id),
        nombre_insumo: String(item.nombre_insumo),
        tipo_movimiento: String(item.tipo_movimiento),
        cantidad: Number(item.cantidad) || 0,
        fecha: String(item.fecha),
        nombre_completo: String(item.nombre_completo),
      })),
    }
  } catch (error) {
    console.error('Error cargando datos del dashboard:', error)
  }

  return (
    <>
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12">
          <ProfileWelcome/>
        </div>
        <div className="col-span-12">
          <TopCards />
        </div>
        <div className="lg:col-span-8 col-span-12">
          <SalesOverview monthlyMovements={dashboardData.monthlyMovements} />
        </div>
        <div className="lg:col-span-4 col-span-12">
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12">
              <YearlyBreakup movementTotals={dashboardData.movementTotals} />
            </div>
            <div className="col-span-12">
              <MonthlyEarning monthlyMovements={dashboardData.monthlyMovements} />
            </div>
          </div>
        </div>
        <div className="lg:col-span-4 col-span-12">
          <RecentTransaction movements={dashboardData.recentMovements} />
        </div>
        <div className="lg:col-span-8 col-span-12 flex">
          <ProductPerformance inventory={dashboardData.inventory} />
        </div>
        <div className="col-span-12">
          <Footer />
        </div>
      </div>
    </>
  );
};
