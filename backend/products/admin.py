# backend/products/admin.py

from django.contrib import admin
from .models import Category, Product

# Con estas líneas, le decimos a Django que muestre estos modelos en el panel de admin.
admin.site.register(Category)
admin.site.register(Product)
