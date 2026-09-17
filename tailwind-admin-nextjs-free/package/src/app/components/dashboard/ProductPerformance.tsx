'use client'

import CardBox from '../shared/CardBox'
import { DashboardData } from './types'

export const ProductPerformance = ({
  inventory,
}: {
  inventory: DashboardData['inventory']
}) => (
  <CardBox>
    <div className='mb-6'>
      <h5 className='card-title'>Estado del inventario</h5>
      <p className='text-sm text-muted-foreground font-normal'>
        Insumos con menor existencia actual
      </p>
    </div>
    <div className='overflow-x-auto'>
      <table className='w-full text-left'>
        <thead>
          <tr className='border-b border-border'>
            <th className='py-3 text-sm font-semibold'>Insumo</th>
            <th className='py-3 text-sm font-semibold'>Existencia</th>
            <th className='py-3 text-sm font-semibold'>Mínimo</th>
          </tr>
        </thead>
        <tbody>
          {inventory.map((item) => (
            <tr key={item.id} className='border-b border-border'>
              <td className='py-3 text-sm font-medium'>{item.nombre_insumo}</td>
              <td className='py-3 text-sm'>
                {item.stock_actual} {item.unidad_medida}
              </td>
              <td className='py-3 text-sm text-muted-foreground'>
                {item.stock_minimo} {item.unidad_medida}
              </td>
            </tr>
          ))}
          {inventory.length === 0 && (
            <tr>
              <td colSpan={3} className='py-6 text-center text-muted-foreground'>
                No hay insumos registrados.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </CardBox>
)
