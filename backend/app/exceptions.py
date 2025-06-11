class AppException(Exception):
    """Excepción base de la aplicación"""
    def __init__(self, message: str, status_code: int = 500):
        self.message = message
        self.status_code = status_code
        super().__init__(self.message)
        
class NotFoundException(AppException):
    def __init__(self, message: str = "Recurso no encontrado"):
        super().__init__(message, 404)
        
class ValidationException(AppException):
    def __init__(self, message: str = "Error de validación"):
        super().__init__(message, 400)
            
class ConflictException(AppException):
    def __init__(self, message: str = "Conflicto de recursos"):
        super().__init__(message, 409)