// components/projects-table.tsx
'use client';

import { useState, useEffect } from 'react';
import { projectsApi, Project } from '@/lib/api/projects';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Search, Plus, Edit, Trash2 } from 'lucide-react';
import Link from 'next/link';

export default function ProjectsTable() {
  // Estado del componente
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [total, setTotal] = useState(0);

  // Función para cargar proyectos
  const loadProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await projectsApi.getAll({
        limit: 50,
        search: search || undefined,
      });
      
      setProjects(response.projects);
      setTotal(response.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      console.error('Error loading projects:', err);
    } finally {
      setLoading(false);
    }
  };

  // Cargar proyectos al montar el componente
  useEffect(() => {
    loadProjects();
  }, []);

  // Buscar cuando cambie el término de búsqueda
  useEffect(() => {
    const timer = setTimeout(() => {
      loadProjects();
    }, 500); // Debounce de 500ms

    return () => clearTimeout(timer);
  }, [search]);

  // Función para eliminar proyecto
  const handleDelete = async (id: number, name: string) => {
    if (!window.confirm(`¿Estás seguro de eliminar el proyecto "${name}"?`)) {
      return;
    }

    try {
      await projectsApi.delete(id);
      await loadProjects(); // Recargar la lista
    } catch (err) {
      alert('Error al eliminar el proyecto');
      console.error('Error deleting project:', err);
    }
  };

  // Función para obtener color del badge según estado
  const getStatusBadgeVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case 'planning':
        return 'secondary';
      case 'active':
        return 'default';
      case 'completed':
        return 'outline';
      case 'on_hold':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Cargando proyectos...</span>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center">
            <p className="text-red-600 mb-4">Error: {error}</p>
            <Button onClick={loadProjects} variant="outline">
              Reintentar
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Proyectos ({total})</CardTitle>
          <Link href="/proyectos/nuevo">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Proyecto
            </Button>
          </Link>
        </div>
        
        {/* Barra de búsqueda */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar proyectos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </CardHeader>

      <CardContent>
        {projects.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">No se encontraron proyectos</p>
            <Link href="/proyectos/nuevo">
              <Button>Crear primer proyecto</Button>
            </Link>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Presupuesto</TableHead>
                <TableHead>Fecha Inicio</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.map((project) => (
                <TableRow key={project.id}>
                  <TableCell>
                    <div>
                      <Link 
                        href={`/proyectos/${project.id}`}
                        className="font-medium hover:underline"
                      >
                        {project.name}
                      </Link>
                      {project.description && (
                        <p className="text-sm text-gray-500 mt-1">
                          {project.description.substring(0, 100)}
                          {project.description.length > 100 ? '...' : ''}
                        </p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{project.client_name || 'Sin cliente'}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(project.status)}>
                      {project.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {project.budget ? `€${project.budget.toLocaleString()}` : 'Sin presupuesto'}
                  </TableCell>
                  <TableCell>
                    {project.start_date 
                      ? new Date(project.start_date).toLocaleDateString('es-ES')
                      : 'Sin fecha'
                    }
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Link href={`/proyectos/${project.id}/editar`}>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(project.id, project.name)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}