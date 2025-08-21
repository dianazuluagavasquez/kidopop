# backend/products/views.py

from rest_framework import generics, permissions
from django.db.models import Q  # <-- CORRECCIÓN #1: Se añade la importación de Q
from .models import Product, Category # <-- CORRECCIÓN #2: Se eliminan las importaciones incorrectas
from .serializers import ProductSerializer, CategorySerializer
from .permissions import IsOwnerOrReadOnly

class ProductListCreateView(generics.ListCreateAPIView):
    serializer_class = ProductSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        queryset = Product.objects.filter(status='available')

        search_term = self.request.query_params.get('search', None)
        if search_term:
            # La búsqueda ahora funciona porque Q está importado
            queryset = queryset.filter(
                Q(title__icontains=search_term) | Q(description__icontains=search_term)
            )

        category_id = self.request.query_params.get('category', None)
        if category_id and category_id != '':
            queryset = queryset.filter(categories__id=category_id)
            
        return queryset.order_by('-created_at')

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class ProductDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly]


class CategoryListView(generics.ListAPIView):
    queryset = Category.objects.all().order_by('name')
    serializer_class = CategorySerializer
    permission_classes = [permissions.AllowAny]