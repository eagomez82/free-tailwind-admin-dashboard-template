'use server' // ¡Muy importante! Le dice a Next.js que esto solo corre en el servidor

import { getCloudflareContext } from '@opennextjs/cloudflare'
import { revalidatePath } from 'next/cache'

export async function registrarMovimiento(formData: FormData) {
  // 1. Extraemos los datos del formulario
  const insumo_id = formData.get('insumo_id');
  const usuario_id = formData.get('usuario_id');
  const tipo_movimiento = formData.get('tipo_movimiento');
  const cantidad = formData.get('cantidad');
  const observacion = formData.get('observacion');

  try {
    // 2. Conectamos a D1
    const { env } = await getCloudflareContext({ async: true });
    const db = (env as any).MI_BASE_DE_DATOS;

    // 3. Ejecutamos el INSERT usando .bind() para proteger contra inyección SQL
    await db.prepare(`
      INSERT INTO movimientos (insumo_id, usuario_id, tipo_movimiento, cantidad, observacion)
      VALUES (?, ?, ?, ?, ?)
    `).bind(insumo_id, usuario_id, tipo_movimiento, cantidad, observacion).run();

    // 4. Refrescamos la ruta para que la tabla se actualice instantáneamente
    // NOTA: Asegúrate de poner aquí la ruta exacta de tu página
    revalidatePath('/utilities/form')
    revalidatePath('/registro-movimiento')

  } catch (error) {
    console.error('Error al insertar el movimiento:', error);
    throw new Error('No se pudo guardar el registro');
  }
}