// app/proyectos/nuevo/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function NuevoProyecto() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Estado del formulario
  const [formData, setFormData] = useState<ProjectCreate>({
    name: '',
    description: '',
    client_name: '',
    status: 'planning',
    budget: undefined,
    start_date: '',
    end_date: '',
  });

  // Manejar cambios en inputs
  const handleInputChange = (field: keyof ProjectCreate, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Enviar formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);

      // Preparar datos para enviar
      const projectData: ProjectCreate = {
        ...formData,
        // Convertir fechas al formato correcto para la API
        start_date: formData.start_date ? `${formData.start_date}T09:00:00` : undefined,
        end_date: formData.end_date ? `${formData.end_date}T18:00:00` : undefined,
      };

      // Crear proyecto via API
      const newProject = await apiClient.createProject(projectData);
      
      console.log('Proyecto creado:', newProject);
      
      // Redirigir a la lista de proyectos
      router.push('/proyectos');
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      console.error('Error creating project:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-6 max-w-2xl">
      {/* Header */}
      <div className="flex items-center mb-6">
        <Link href="/proyectos">
          <Button variant="outline" size="sm" className="mr-4">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Nuevo Proyecto</h1>
      </div>

      {/* Formulario */}
      <Card>
        <CardHeader>
          <CardTitle>Información del Proyecto</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                Error: {error}
              </div>
            )}

            {/* Nombre del proyecto */}
            <div>
              <Label htmlFor="name">Nombre del Proyecto *</Label>
              <Input
                id="name"
                type="text"
                required
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Ej: E-commerce Platform"
              />
            </div>

            {/* Descripción */}
            <div>
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Describe el proyecto en detalle..."
                rows={4}
              />
            </div>

            {/* Cliente */}
            <div>
              <Label htmlFor="client_name">Cliente</Label>
              <Input
                id="client_name"
                type="text"
                value={formData.client_name}
                onChange={(e) => handleInputChange('client_name', e.target.value)}
                placeholder="Ej: TechStore Solutions"
              />
            </div>

            {/* Estado */}
            <div>
              <Label htmlFor="status">Estado</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => handleInputChange('status', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="planning">Planificación</SelectItem>
                  <SelectItem value="active">Activo</SelectItem>
                  <SelectItem value="on_hold">En Pausa</SelectItem>
                  <SelectItem value="completed">Completado</SelectItem>
                  <SelectItem value="cancelled">Cancelado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Presupuesto */}
            <div>
              <Label htmlFor="budget">Presupuesto (€)</Label>
              <Input
                id="budget"
                type="number"
                min="0"
                step="0.01"
                value={formData.budget || ''}
                onChange={(e) => handleInputChange('budget', e.target.value ? parseFloat(e.target.value) : undefined)}
                placeholder="15000.00"
              />
            </div>

            {/* Fechas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="start_date">Fecha de Inicio</Label>
                <Input
                  id="start_date"
                  type="date"
                  value={formData.start_date}
                  onChange={(e) => handleInputChange('start_date', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="end_date">Fecha de Fin</Label>
                <Input
                  id="end_date"
                  type="date"
                  value={formData.end_date}
                  onChange={(e) => handleInputChange('end_date', e.target.value)}
                />
              </div>
            </div>

            {/* Botones */}
            <div className="flex justify-end space-x-4">
              <Link href="/proyectos">
                <Button type="button" variant="outline" disabled={loading}>
                  Cancelar
                </Button>
              </Link>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Creando...
                  </>
                ) : (
                  'Crear Proyecto'
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}