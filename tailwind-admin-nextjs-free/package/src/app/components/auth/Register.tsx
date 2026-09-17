'use client'

import { useState } from 'react'
import FullLogo from '@/app/(DashboardLayout)/layout/shared/logo/FullLogo'
import CardBox from '@/app/components/shared/CardBox' // Verifica esta ruta si te da error
import Link from 'next/link'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

// Importamos la acción que acabamos de crear
import { registrarUsuario } from '@/app/actions/register'

export default function RegisterPage() {
  const [errorMsg, setErrorMsg] = useState('')

  const handleSubmit = async (formData: FormData) => {
    setErrorMsg('')
    const result = await registrarUsuario(formData)

    if (result?.error) {
      setErrorMsg(result.error)
    }
  }

  return (
    <>
      <div className='min-h-screen w-full flex justify-center items-center bg-lightprimary p-4'>
        <div className='md:min-w-[450px] min-w-full'>
          <CardBox>
            <div className='flex justify-center mb-4'>
              <FullLogo />
            </div>
            <p className='text-sm text-muted-foreground text-center mb-6'>
              Crear una nueva cuenta
            </p>

            {errorMsg && (
              <div className='mb-6 rounded border border-red-400 bg-red-100 px-4 py-3 text-sm text-red-700'>
                {errorMsg}
              </div>
            )}
            
            {/* INICIO DEL FORMULARIO CONECTADO AL ACTION */}
            <form action={handleSubmit} className="flex flex-col gap-4">
              
              <div>
                <Label htmlFor='cedula' className='font-medium mb-2 block'>
                  Cédula
                </Label>
                <Input id='cedula' name='cedula' type='text' placeholder='Ej: 10203040' required />
              </div>

              <div>
                <Label htmlFor='nombre_completo' className='font-medium mb-2 block'>
                  Nombre Completo
                </Label>
                <Input id='nombre_completo' name='nombre_completo' type='text' placeholder='Ej: Juan Pérez' required />
              </div>

              <div>
                <Label htmlFor='email' className='font-medium mb-2 block'>
                  Correo Electrónico
                </Label>
                <Input id='email' name='email' type='email' placeholder='correo@empresa.com' required />
              </div>

              {/* Campos necesarios para que la base de datos no arroje error */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor='cargo' className='font-medium mb-2 block'>Cargo</Label>
                  <Input id='cargo' name='cargo' type='text' placeholder='Ej: Operario' required />
                </div>
                <div>
                  <Label htmlFor='area' className='font-medium mb-2 block'>Área</Label>
                  <Input id='area' name='area' type='text' placeholder='Ej: Producción' required />
                </div>
              </div>

              <div>
                <Label htmlFor='password' className='font-medium mb-2 block'>
                  Contraseña
                </Label>
                <Input
                  id='password'
                  name='password'
                  type='password'
                  placeholder='Cree una contraseña'
                  minLength={8}
                  required
                />
              </div>

              <div>
                <Label htmlFor='confirm_password' className='font-medium mb-2 block'>
                  Confirmar contraseña
                </Label>
                <Input
                  id='confirm_password'
                  name='confirm_password'
                  type='password'
                  placeholder='Repita la contraseña'
                  minLength={8}
                  required
                />
              </div>

              {/* BOTÓN ACTUALIZADO PARA ENVIAR EL FORMULARIO */}
              <Button type="submit" className='w-full mt-2'>
                Registrarse
              </Button>
            </form>
            {/* FIN DEL FORMULARIO */}

            <div className='flex items-center gap-2 justify-center mt-6 flex-wrap'>
              <p className='text-base font-medium text-muted-foreground'>
                ¿Ya tiene una cuenta?
              </p>
              <Link
                href='/login'
                className='text-sm font-medium text-primary hover:text-primaryemphasis'>
                Ingresar
              </Link>
            </div>
          </CardBox>
        </div>
      </div>
    </>
  )
}