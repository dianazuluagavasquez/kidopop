# backend/products/serializers.py

from rest_framework import serializers
from .models import Product

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        read_only_fields = ('owner',)
        # Asegúrate de que todos los campos del modelo estén aquí
        fields = (
            'id', 'owner', 'title', 'description', 
            'price', 'brand', 'image', 'latitude', 
            'longitude', 'condition', 'created_at'
        )