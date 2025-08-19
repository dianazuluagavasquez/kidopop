# backend/products/serializers.py

from rest_framework import serializers
# --- 1. Importa ambos modelos: Product y Category ---
from .models import Product, Category

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

class ProductSerializer(serializers.ModelSerializer):
    # --- 2. Campo para MOSTRAR las categorías (solo lectura) ---
    # Al pedir un producto, esto mostrará los detalles completos de sus categorías.
    categories = CategorySerializer(many=True, read_only=True)

    # --- 3. Campo para RECIBIR las categorías (solo escritura) ---
    # Al crear/editar un producto, el frontend enviará aquí una lista de IDs de categorías, ej: [1, 5]
    category_ids = serializers.PrimaryKeyRelatedField(
        many=True,
        write_only=True,
        queryset=Category.objects.all(),
        source='categories' # Vincula este campo al campo 'categories' del modelo
    )

    class Meta:
        model = Product
        read_only_fields = ('owner',)
        # --- 4. Actualiza la lista de campos ---
        fields = (
            'id', 'owner', 'title', 'description', 
            'price', 'brand', 'image', 'latitude', 
            'longitude', 'location_text', 'condition', 'created_at',
            'categories', # Para mostrar
            'category_ids'  # Para recibir
        )