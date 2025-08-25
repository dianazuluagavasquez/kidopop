# backend/products/views.py

from rest_framework import generics, permissions
from django.db.models import Q, F
from django.db.models.functions.math import Radians, Sin, Cos, Sqrt, ATan2
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
            queryset = queryset.filter(
                Q(title__icontains=search_term) | Q(description__icontains=search_term)
            )

        category_id = self.request.query_params.get('category', None)
        if category_id and category_id != '':
            queryset = queryset.filter(categories__id=category_id)

        user_lat = self.request.query_params.get('latitude', None)
        user_lon = self.request.query_params.get('longitude', None)

        if user_lat and user_lon:
            user_lat = float(user_lat)
            user_lon = float(user_lon)

            dlat = Radians(F('latitude') - user_lat)
            dlon = Radians(F('longitude') - user_lon)
            a = (Sin(dlat/2) * Sin(dlat/2) +
                 Cos(Radians(user_lat)) * Cos(Radians(F('latitude'))) *
                 Sin(dlon/2) * Sin(dlon/2))
            c = 2 * ATan2(Sqrt(a), Sqrt(1 - a))
            distance = 6371 * c

            queryset = queryset.annotate(distance=distance).order_by('distance')
        else:
            queryset = queryset.order_by('-created_at')
            
        return queryset

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