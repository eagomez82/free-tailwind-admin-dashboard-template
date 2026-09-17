import React from 'react'
import BreadcrumbComp from '../../layout/shared/breadcrumb/BreadcrumbComp'
//import BasicTable from '@/app/components/utilities/basic-table/BasicTable'
//import StripedRowTable from '@/app/components/utilities/striped-row-table/StripedRowTable'
//import HoverTable from '@/app/components/utilities/hover-table/HoverTable'
//import CheckboxTable from '@/app/components/utilities/checkbox-table/CheckboxTable'
import DataTable from '@/app/components/utilities/data-table/DataTable'
//import { EmployeesData } from '@/app/components/utilities/data'
import { getRequestContext } from '@cloudflare/next-on-pages'

const BCrumb = [
  {
    to: '/',
    title: 'Home',
  },
  {
    title: 'Table',
  },
]

export const runtime = 'edge'; // Obligatorio para usar D1 en Next.js

export default async function Reports() {
  let dbData: any[] = [];

  try {
    // 1. Obtenemos la conexión a D1 usando el nombre del binding
    const { env } = getRequestContext();
    const db = (env as any).MI_BASE_DE_DATOS;
    const query = `SELECT 
      mov.id, 
      mov.tipo_movimiento, 
      mov.cantidad, 
      mov.fecha,  
      mov.observacion, 
      inv.nombre_insumo, 
      usu.nombre_completo 
      FROM movimientos as mov 
      JOIN inventario as inv on mov.insumo_id = inv.id 
      JOIN usuarios as usu on mov.usuario_id = usu.id`;
    // 2. Ejecutamos la consulta SQL pura
    // NOTA: Cambia 'materia_prima' por el nombre real de tu tabla si es diferente
    const { results } = await db.prepare(query).all();
    dbData = results;

  } catch (error) {
    console.error('Error conectando a D1:', error);
  }
  // 3. Formateamos los datos mapeando exactamente las columnas de tu imagen
  const formattedData = dbData.map((row: any) => ({
    'nombreinsumo': row.nombre_insumo,
    'tipomovimiento': row.tipo_movimiento,
    'cantidad': row.cantidad,
    'fecha': row.fecha,
    'nombrecompleto': row.nombre_completo,
    'observacion': row.observacion,
  }));

  return (
    <>
      <BreadcrumbComp title='Inventario de Materia Prima' items={BCrumb} />
      <div className='flex gap-6 flex-col mt-6'>
        {/* Pasamos los datos formateados a la tabla */}
        <DataTable data={formattedData.length > 0 ? formattedData : []} />
      </div>
    </>
  )
}