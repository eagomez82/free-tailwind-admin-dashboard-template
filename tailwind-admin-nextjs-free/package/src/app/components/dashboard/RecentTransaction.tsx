import CardBox from '../shared/CardBox'
import { DashboardData } from './types'

export const RecentTransaction = ({
  movements,
}: {
  movements: DashboardData['recentMovements']
}) => (
  <CardBox className='h-full w-full'>
    <div className='flex flex-col'>
      <h5 className='card-title'>Movimientos recientes</h5>
      <p className='text-sm text-muted-foreground font-normal'>
        Últimos registros de inventario
      </p>
    </div>
    <div className='mt-6'>
      {movements.map((item) => (
        <div key={item.id} className='flex gap-x-3 border-b border-border py-3'>
          <div className='w-1/4 text-end text-sm text-muted-foreground'>
            {new Date(item.fecha).toLocaleDateString('es-CO')}
          </div>
          <div className='w-3/4'>
            <p className='font-medium text-foreground'>{item.nombre_insumo}</p>
            <p className='text-sm text-muted-foreground'>
              {item.tipo_movimiento.replace('_', ' ')}: {item.cantidad} · {item.nombre_completo}
            </p>
          </div>
        </div>
      ))}
      {movements.length === 0 && (
        <p className='py-6 text-center text-muted-foreground'>
          No hay movimientos registrados.
        </p>
      )}
    </div>
  </CardBox>
)
