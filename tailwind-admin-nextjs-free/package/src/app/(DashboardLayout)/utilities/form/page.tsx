import React from 'react'
import BreadcrumbComp from '../../layout/shared/breadcrumb/BreadcrumbComp'
import { getCloudflareContext } from '@opennextjs/cloudflare'

// Importamos tu formulario cliente
import FormularioMovimiento from '../../../components/forms/FormularioMovimiento'

const BCrumb = [{ to: '/', title: 'Home' }, { title: 'Forms' }]

export default async function Page() {
  let listaMaterias: any[] = [];
  let listaOperarios: any[] = [];

  try {
    // 1. Conectamos a D1
    const { env } = await getCloudflareContext({ async: true });
    const db = (env as any).MI_BASE_DE_DATOS;

    // 2. Consultamos SÓLO los campos que necesitamos para el select
const [materiasRes, operariosRes] = await Promise.all([
      db.prepare('SELECT id, codigo, nombre_insumo FROM inventario ORDER BY nombre_insumo ASC').all(),
      db.prepare('SELECT id, nombre_completo FROM usuarios WHERE activo = 1 ORDER BY nombre_completo ASC').all()
    ]);
    
    listaMaterias = materiasRes.results;
    listaOperarios = operariosRes.results;

  } catch (error) {
    console.error('Error conectando a D1 para extraer materias:', error);
  }

  return (
    <>
      <BreadcrumbComp title='Form Elements' items={BCrumb} />
      
      {/* 3. Renderizamos el formulario y le inyectamos los datos reales */}
      <FormularioMovimiento 
        materiasPrimasDB={listaMaterias} 
        operariosDB={listaOperarios}
      />
    </>
  )
}