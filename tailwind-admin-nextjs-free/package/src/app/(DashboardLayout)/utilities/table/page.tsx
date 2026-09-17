import React from 'react'
import BreadcrumbComp from '../../layout/shared/breadcrumb/BreadcrumbComp'
//import BasicTable from '@/app/components/utilities/basic-table/BasicTable'
//import StripedRowTable from '@/app/components/utilities/striped-row-table/StripedRowTable'
//import HoverTable from '@/app/components/utilities/hover-table/HoverTable'
//import CheckboxTable from '@/app/components/utilities/checkbox-table/CheckboxTable'
import DataTable from '@/app/components/utilities/data-table/DataTable'
//import { EmployeesData } from '@/app/components/utilities/data'
import { getCloudflareContext } from '@opennextjs/cloudflare'

const BCrumb = [
  {
    to: '/',
    title: 'Home',
  },
  {
    title: 'Table',
  },
]

export default async function page() {
  let dbData: any[] = [];

  try {
    // 1. Obtenemos la conexión a D1 usando el nombre del binding
    const { env } = await getCloudflareContext({ async: true });
    const db = (env as any).MI_BASE_DE_DATOS;

    // 2. Ejecutamos la consulta SQL pura
    // NOTA: Cambia 'materia_prima' por el nombre real de tu tabla si es diferente
    const { results } = await db.prepare('SELECT * FROM inventario').all();
    dbData = results;

  } catch (error) {
    console.error('Error conectando a D1:', error);
  }

  // 3. Formateamos los datos mapeando exactamente las columnas de tu imagen
  const formattedData = dbData.map((row: any) => ({
    id: row.id,
    codigo: row.codigo,
    nombreInsumo: row.nombre_insumo,
    categoria: row.catego, // En la imagen dice 'catego', lo mapeamos a categoria
    stockActual: row.stock_actual,
    stockMinimo: row.stock_minimo,
    unidadMedida: row.unidad_medida,
    ubicacionAlmacen: row.ubicacion_almacen,
    creadoEn: row.creado_en
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