# backend/products/models.py
from django.contrib.auth.models import User
from django.db import models

class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)
    
    def __str__(self):
        return self.name

class Product(models.Model):
  owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='products')
  title = models.CharField(max_length=200)
  description = models.TextField()
  price = models.DecimalField(max_digits=10, decimal_places=2)
  created_at = models.DateTimeField(auto_now_add=True)

  brand = models.CharField(max_length=100, blank=True, null=True)
  image = models.ImageField(upload_to='product_images/', blank=True, null=True)
  latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
  longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
  categories = models.ManyToManyField(Category, related_name='products', blank=True)
  location_text = models.CharField(max_length=255, blank=True, null=True)

  # --- NUEVO CAMPO DE ESTADO ---
  class Condition(models.TextChoices):
      NEW = 'new', 'Nuevo'
      USED = 'used', 'Usado'
      ACCEPTABLE = 'acceptable', 'Aceptable'

  condition = models.CharField(
      max_length=10,
      choices=Condition.choices,
      default=Condition.NEW  # Por defecto, un producto será 'Nuevo'
  )

  def __str__(self):
      return self.title




    