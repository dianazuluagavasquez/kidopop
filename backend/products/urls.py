# backend/products/urls.py

from django.urls import path
from .views import ProductListCreateView, ProductDetailView

urlpatterns = [
    # Esta ruta corresponde a /api/products/ (para listar y crear)
    path('', ProductListCreateView.as_view(), name='product-list-create'),

    # Esta ruta corresponde a /api/products/<id>/ (para ver, editar y borrar un producto)
    path('<int:pk>/', ProductDetailView.as_view(), name='product-detail'),
]