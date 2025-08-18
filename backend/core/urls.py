# backend/core/urls.py

from django.contrib import admin
from django.urls import path, include

# --- ESTA ES LA IMPORTACIÓN CLAVE QUE FALTA ---
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('users.urls')),
    path('api/products/', include('products.urls')),
]

# Este bloque de código necesita la variable 'settings' para saber si está
# en modo de desarrollo (DEBUG) y para encontrar la ruta de los archivos multimedia.
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)