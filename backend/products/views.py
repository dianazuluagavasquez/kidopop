# backend/products/views.py

from rest_framework import generics, permissions
from .models import Product, Category
from .serializers import ProductSerializer, CategorySerializer

# Esta clase se encarga de listar todos los productos y de crear nuevos
class ProductListCreateView(generics.ListCreateAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    # Permite que cualquiera vea la lista, pero solo usuarios
    # autenticados pueden crear productos.
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    # Asigna automáticamente el producto al usuario que hace la petición
    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

# Esta clase maneja ver, actualizar y borrar un producto específico
class ProductDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

# Vista para listar todas las categorías
class CategoryListView(generics.ListAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.AllowAny]