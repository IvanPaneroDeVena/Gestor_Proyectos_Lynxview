class AppException(Exception):
    """Excepción base de la aplicación"""
    def init(self, message: str, status_code: int = 500):
        self.message = message
        self.status_code = status_code
        super().init(self.message)
        
class NotFoundException(AppException):
    def init(self, message: str = "Recurso no encontrado"):
        super().init(message, 404)
        
class ValidationException(AppException):
    def init(self, message: str = "Error de validación"):
        super().init(message, 400)
            
class ConflictException(AppException):
    def init(self, message: str = "Conflicto de recursos"):
        super().init(message, 409)