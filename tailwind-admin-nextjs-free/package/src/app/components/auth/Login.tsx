'use client'

import FullLogo from '@/app/(DashboardLayout)/layout/shared/logo/FullLogo'
import CardBox from '../shared/CardBox'
import Link from 'next/link'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export const Login = () => {
  return (
    <>
      <div className='h-screen w-full flex justify-center items-center bg-lightprimary'>
        <div className='md:min-w-[450px] min-w-max'>
          <CardBox>
            <div className='flex justify-center mb-4'>
              <FullLogo />
            </div>
            <p className='text-sm text-muted-foreground text-center mb-6'>
              Bienvenido a Tailwind-Admin
            </p>
            <div>
              <div className='mb-2 block'>
                <Label htmlFor='username1' className='font-medium'>
                  Usuario
                </Label>
              </div>
              <Input
                id='username1'
                type='text'
                placeholder='Ingrese su usuario'
                required
              />
            </div>
            <div className='mt-6'>
              <div className='mb-2 block'>
                <Label htmlFor='password1' className='font-medium'>
                  Contraseña
                </Label>
              </div>
              <Input
                id='password1'
                type='password'
                placeholder='Ingrese su contraseña'
                required
              />
            </div>
            <div className='flex flex-wrap gap-6 items-center justify-between my-6'>
              <div className='flex items-center gap-2'>
                <Checkbox id='remember' checked />
                <Label
                  className='text-link font-normal text-sm'
                  htmlFor='remember'>
                  Recordar este dispositivo
                </Label>
              </div>
              <Link
                href='#'
                className='text-sm font-medium text-primary hover:text-primaryemphasis'>
                ¿Olvidó su contraseña?
              </Link>
            </div>
            <Button className='w-full' asChild>
              <Link href='/'>              Ingresar</Link>
            </Button>
            <Button className='w-full mt-3' variant='outline' asChild>
              <Link href='/registro-movimiento'>Registrar movimiento</Link>
            </Button>
            <div className='flex items center gap-2 justify-center mt-6 flex-wrap'>
              <p className='text-base font-medium text-muted-foreground'>
                ¿Nuevo en TailwindAdmin?
              </p>
              <Link
                href='/auth/register'
                className='text-sm font-medium text-primary hover:text-primaryemphasis'>
                Crear una cuenta
              </Link>
            </div>
          </CardBox>
        </div>
      </div>
    </>
  )
}
