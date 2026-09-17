'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

// Importamos la acción de guardado desde la ruta real del proyecto
import { registrarMovimiento } from '../../actions/movimientos'

interface MateriaPrima {
  id: number;
  codigo: string;
  nombre_insumo: string;
}

interface Operario {
  id: number;
  nombre_completo: string;
}

interface FormularioProps {
  materiasPrimasDB: MateriaPrima[];
  operariosDB: Operario[];
}

export default function FormularioMovimiento({ materiasPrimasDB, operariosDB }: FormularioProps) {
  return (
    <div className='flex justify-center w-full mt-6'> 
      <div className='flex flex-col gap-6 w-full max-w-3xl'>
        <div className='flex justify-start'>
          <Button variant='outline' asChild>
            <Link href='/login'>Volver al login</Link>
          </Button>
        </div>
        <div className='rounded-xl border border-border md:p-6 p-4'>
          <h5 className='card-title'>Registro de uso de materia</h5>
          
          {/* 1. Reemplazamos el <div> por un <form> y lo conectamos a la acción */}
          <form action={registrarMovimiento} className='mt-6 flex flex-col gap-6'>

            {/* Select Materia Prima */}
            <div>
              <Label htmlFor='insumo_id'>Seleccione la materia prima</Label>
              <Select name="insumo_id" required>
                <SelectTrigger className='mt-2 w-full'>
                  <SelectValue placeholder='Seleccione un insumo...' />
                </SelectTrigger>
                <SelectContent>
                  {materiasPrimasDB.map((materia) => (
                    <SelectItem key={materia.id} value={materia.id.toString()}>
                      <span className="font-medium text-gray-500 mr-2">{materia.codigo}</span> 
                      {materia.nombre_insumo}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Select Unidad de Medida (Opcional, no se guarda en la tabla movimientos) */}
            <div>
              <Label>Seleccione la unidad de medida</Label>
              <Select>
                <SelectTrigger className='mt-2 w-full'>
                  <SelectValue placeholder='Seleccione una opción' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='ml'>ml</SelectItem>
                  <SelectItem value='lts'>lts</SelectItem>
                  <SelectItem value='gr'>gr</SelectItem>
                  <SelectItem value='kg'>kg</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Input Cantidad */}
            <div>
              <Label htmlFor='cantidad'>Cantidad del material</Label>
              <Input
                id='cantidad'
                name='cantidad'
                type='number' // Cambiado a number
                step='0.01'   // Permite decimales si los necesitas
                placeholder='Ej: 150'
                required
                className='mt-2'
              />
            </div>

            {/* Radio Tipo de Operación */}
            <div className='rounded-xl border border-border md:p-6 p-4'>
              <h5 className='card-title'>Seleccione el tipo de operación</h5>
              {/* Ajustamos los values para que coincidan con la Base de Datos */}
              <RadioGroup name="tipo_movimiento" defaultValue='ENTRADA' className='mt-6 flex gap-6'>
                <div className='flex items-center gap-2'>
                  <RadioGroupItem value='ENTRADA' id='entrada' />
                  <Label htmlFor='entrada'>Entrada al almacén</Label>
                </div>
                <div className='flex items-center gap-2'>
                  <RadioGroupItem value='SALIDA_PRODUCCION' id='salida' />
                  <Label htmlFor='salida'>Salida del almacén</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Select Operario */}
            <div>
              <Label htmlFor='usuario_id'>Operario responsable del movimiento</Label>
              <Select name="usuario_id" required>
                <SelectTrigger className='mt-2 w-full'>
                  <SelectValue placeholder='Seleccione un operario...' />
                </SelectTrigger>
                <SelectContent>
                  {operariosDB.map((operario) => (
                    <SelectItem key={operario.id} value={operario.id.toString()}>
                      {operario.nombre_completo}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Textarea Observación */}
            <div>
              <Label htmlFor='observacion'>Descripción del movimiento</Label>
              <Textarea
                id='observacion'
                name='observacion'
                placeholder='Descripción del movimiento...'
                rows={4}
                className='mt-2'
              />
            </div>

            {/* 2. Botón de Envío */}
            <div className="flex justify-end mt-4">
              <button 
                type="submit" 
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md transition-colors"
              >
                Guardar Movimiento
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  )
}