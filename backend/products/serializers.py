# backend/products/serializers.py

from rest_framework import serializers
# --- 1. Importa ambos modelos: Product y Category ---
from .models import Product, Category

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

class ProductSerializer(serializers.ModelSerializer):
    categories = CategorySerializer(many=True, read_only=True)

    category_ids = serializers.PrimaryKeyRelatedField(
        many=True,
        write_only=True,
        queryset=Category.objects.all(),
        source='categories' # Vincula este campo al campo 'categories' del modelo
    )

    class Meta:
        model = Product
        read_only_fields = ('owner',)
        fields = (
            'id', 'owner', 'title', 'description', 
            'price', 'brand', 'image', 'latitude', 
            'longitude', 'location_text', 'condition', 'created_at',
            'categories',
            'category_ids' ,
            'status' ,
        )