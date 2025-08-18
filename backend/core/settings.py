"""
Django settings for kidopop project.
"""
from decouple import config
import dj_database_url
from pathlib import Path
from datetime import timedelta # <-- Importa timedelta para la duración del token

# Build paths inside the project like this: BASE_DIR / 'subdir'.
# Esta es la ruta a la carpeta 'backend'
BASE_DIR = Path(__file__).resolve().parent.parent


# ==============================================================================
# CORE SETTINGS
# ==============================================================================

# Lee la SECRET_KEY desde tu archivo .env
# En tu .env, añade: SECRET_KEY='tu-clave-secreta-muy-larga-y-dificil'
SECRET_KEY = config('SECRET_KEY')

# Lee el modo DEBUG desde .env. Para producción, pon DEBUG=False en .env
# En tu .env, añade: DEBUG=True
DEBUG = config('DEBUG', default=False, cast=bool)

# Añade aquí la URL de tu frontend y tu backend cuando despliegues en Railway
# Ejemplo: ALLOWED_HOSTS = ['kidopop.up.railway.app', 'localhost']
ALLOWED_HOSTS = []


# ==============================================================================
# APPLICATION DEFINITION
# ==============================================================================

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    # Apps de terceros
    'corsheaders',
    'rest_framework',                   # <-- Para la API REST
    'rest_framework_simplejwt',         # <-- Para la autenticación JWT
    'channels',                         # <-- Para la mensajería en tiempo real

    # Mis Apps
    'users',                            # <-- Tu app de usuarios
    'products',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware',      # <-- Asegúrate que esté antes de CommonMiddleware
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

# Asegúrate que el nombre coincida con la carpeta que contiene settings.py
# Si tu carpeta es 'core', debe ser 'core.urls'
ROOT_URLCONF = 'core.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

# El nombre de tu carpeta de proyecto (la que contiene settings.py)
WSGI_APPLICATION = 'core.wsgi.application'
ASGI_APPLICATION = 'core.asgi.application' # <-- Para Django Channels


# ==============================================================================
# DATABASE
# ==============================================================================

DATABASES = {
    'default': dj_database_url.config(
        default=config('DATABASE_URL')
    )
}


# ==============================================================================
# PASSWORD VALIDATION
# ==============================================================================

AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]


# ==============================================================================
# INTERNATIONALIZATION
# ==============================================================================

LANGUAGE_CODE = 'es-es' # <-- Cambiado a español
TIME_ZONE = 'Europe/Madrid' # <-- Cambiado a tu zona horaria
USE_I18N = True
USE_TZ = True


# ==============================================================================
# STATIC FILES
# ==============================================================================

STATIC_URL = 'static/'


# ==============================================================================
# DJANGO REST FRAMEWORK & JWT
# ==============================================================================

REST_FRAMEWORK = {
    # <-- Configuración para que todas las rutas de la API requieran autenticación por defecto
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    )
}

# <-- Configuración de Simple JWT
SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(minutes=60), # Duración del token de acceso
    "REFRESH_TOKEN_LIFETIME": timedelta(days=1),    # Duración del token para refrescar
}


# ==============================================================================
# CORS - CROSS-ORIGIN RESOURCE SHARING
# ==============================================================================

# Tu configuración actual está bien para desarrollo.
# Para producción, puedes usar una variable de entorno.
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

# Opcional: Para el futuro, puedes leerlo desde el .env
# CORS_ALLOWED_ORIGINS = config('CORS_ALLOWED_ORIGINS', default="").split(',')


# ==============================================================================
# DJANGO CHANNELS
# ==============================================================================

# <-- Configuración para el chat en tiempo real. Puedes usar Redis en producción.
CHANNEL_LAYERS = {
    "default": {
        "BACKEND": "channels.layers.InMemoryChannelLayer"
    }
}

# URL para acceder a los archivos multimedia en el navegador
MEDIA_URL = '/media/'

# Directorio donde Django guardará los archivos subidos
MEDIA_ROOT = BASE_DIR / 'media'