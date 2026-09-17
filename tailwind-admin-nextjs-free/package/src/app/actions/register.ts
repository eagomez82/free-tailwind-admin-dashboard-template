'use server'

import { getRequestContext } from '@cloudflare/next-on-pages'
import { redirect } from 'next/navigation'

export async function registrarUsuario(formData: FormData) {
  const cedula = formData.get('cedula');
  const nombre_completo = formData.get('nombre_completo');
  const email = formData.get('email');
  const cargo = formData.get('cargo');
  const area = formData.get('area');
  const password = formData.get('password');
  const confirm_password = formData.get('confirm_password');
  const turno = 'MAÑANA';

  if (
    typeof password !== 'string' ||
    typeof confirm_password !== 'string' ||
    password.length < 8
  ) {
    return { error: 'La contraseña debe tener al menos 8 caracteres.' };
  }

  if (password !== confirm_password) {
    return { error: 'Las contraseñas no coinciden.' };
  }

  try {
    let db: any = null;

    // Intentamos obtener el contexto de Cloudflare de forma segura
    try {
      const context = getRequestContext();
      db = (context?.env as any)?.MI_BASE_DE_DATOS;
    } catch (e) {
      // Si falla porque estamos en entorno Node local, lo capturamos silenciosamente
    }

    // Si por alguna razón no tenemos el binding de Cloudflare directamente en la acción,
    // en entorno local de desarrollo podemos usar una alternativa o validar el entorno.
    if (!db) {
      console.warn("Aviso: Ejecutando acción fuera del Edge runtime de Cloudflare.");
      return { error: 'El entorno local requiere una configuración especial para Server Actions con D1. Usa una API Route o verifica la ejecución.' };
    }

    // 1. Verificamos si la cédula o el email ya existen
    const usuarioExistente: any = await db.prepare(
      'SELECT cedula, email FROM usuarios WHERE cedula = ? OR email = ?'
    ).bind(cedula, email).first();

    if (usuarioExistente) {
      if (usuarioExistente.cedula === cedula) {
        return { error: 'Esta cédula ya se encuentra registrada en el sistema.' };
      }
      if (usuarioExistente.email === email) {
        return { error: 'Este correo electrónico ya está en uso.' };
      }
    }

    const salt = crypto.getRandomValues(new Uint8Array(16));
    const key = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(password),
      'PBKDF2',
      false,
      ['deriveBits']
    );
    const derivedBits = await crypto.subtle.deriveBits(
      {
        name: 'PBKDF2',
        salt,
        iterations: 100000,
        hash: 'SHA-256',
      },
      key,
      256
    );
    const toBase64 = (value: Uint8Array) =>
      btoa(String.fromCharCode(...value));
    const password_hash = `pbkdf2_sha256$100000$${toBase64(salt)}$${toBase64(
      new Uint8Array(derivedBits)
    )}`;

    // 2. Insertamos el nuevo usuario
    await db.prepare(`
      INSERT INTO usuarios (cedula, nombre_completo, email, cargo, area, turno, password_hash)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).bind(cedula, nombre_completo, email, cargo, area, turno, password_hash).run();

  } catch (error) {
    console.error('Error al registrar usuario:', error);
    return { error: 'Ocurrió un error inesperado al procesar el registro en la base de datos.' };
  }

  redirect('/login');
}