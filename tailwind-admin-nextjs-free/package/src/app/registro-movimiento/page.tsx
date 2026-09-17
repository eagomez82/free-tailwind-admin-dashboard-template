import { getRequestContext } from '@cloudflare/next-on-pages'
import FormularioMovimiento from '@/app/components/forms/FormularioMovimiento'

export const runtime = 'edge'

export default async function RegistroMovimientoPage() {
  let listaMaterias: any[] = []
  let listaOperarios: any[] = []

  try {
    const { env } = getRequestContext()
    const db = (env as any).MI_BASE_DE_DATOS

    const [materiasRes, operariosRes] = await Promise.all([
      db
        .prepare(
          'SELECT id, codigo, nombre_insumo FROM inventario ORDER BY nombre_insumo ASC'
        )
        .all(),
      db
        .prepare(
          'SELECT id, nombre_completo FROM usuarios WHERE activo = 1 ORDER BY nombre_completo ASC'
        )
        .all(),
    ])

    listaMaterias = materiasRes.results
    listaOperarios = operariosRes.results
  } catch (error) {
    console.error('Error conectando a D1 para extraer materias:', error)
  }

  return (
    <main className='min-h-screen bg-background p-4 md:p-8'>
      <FormularioMovimiento
        materiasPrimasDB={listaMaterias}
        operariosDB={listaOperarios}
      />
    </main>
  )
}
