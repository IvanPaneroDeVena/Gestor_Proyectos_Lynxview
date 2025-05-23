export const createProject = async (data: { name: string; createdBy: string }) => {
  // En una aplicación real, esta función haría una llamada a una API para crear un nuevo proyecto.
  // Para esta demostración, simplemente simulamos una respuesta exitosa después de un breve retraso.
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: Math.random().toString(36).substring(7),
        name: data.name,
        createdBy: data.createdBy,
        createdAt: new Date(),
      })
    }, 500)
  })
}
