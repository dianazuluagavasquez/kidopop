# backend/products/permissions.py

from rest_framework import permissions

class IsOwnerOrReadOnly(permissions.BasePermission):
    """
    Permiso personalizado para permitir que solo los dueños de un objeto
    puedan editarlo o borrarlo.
    """
    def has_object_permission(self, request, view, obj):
        # Los permisos de lectura (GET, HEAD, OPTIONS) se permiten a cualquiera.
        if request.method in permissions.SAFE_METHODS:
            return True

        # Los permisos de escritura (POST, PUT, PATCH, DELETE) solo se
        # permiten si el usuario que hace la petición es el dueño del producto.
        return obj.owner == request.user