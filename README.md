# FACSAT

## Requisitos para despliegue de los contenedores

El sistema operativo debe tener instalados estos paquetes:

- Git
- Docker

## Desplegar aplicación

```sh
git clone git@github.com:catd/facsat.git
cd facsat
```

Por defecto se trabaja la rama "master", si se quiere trabajar otra, en este caso "develop", se ejecuta:

```sh
git checkout develop
```

Se deben configurar las variables de entorno, para ello se debe crear el archivo `.env` tomando como base a `.env.example`:

```sh
# Credenciales para el contenedor de base de datos
NEXT_PUBLIC_USER_DB=user
NEXT_PUBLIC_PASS_DB=pass

# Conexión a servicios
API_KEY_VISUALCROSSING=valor_de_api_key_visualcrossing
URI_MONGO=mongodb://user:pass@facsat-db:27017

# Puertos visibles desde el host
EXTERNAL_PORT_DB=17017
EXTERNAL_PORT_WEB=30000
EXTERNAL_PORT_ADMINER=18000
```

Compilar y ejecutar los contenedores, el parámetro `--build` es necesario siempre que se quiera reconstruir los contenedores, no es necesario usarlo si solo se quieren iniciar los contenedores, según lo especificado en el archivo `docker-compose.yml`, pero no se quiere renovar la imagen que utilizan:

```sh
sudo docker compose up -d --build
```

Reiniciar contenedores (esto mantendrá los datos de la base de datos):

```sh
sudo docker compose down -d && sudo docker compose up -d
```

La aplicación quedará disponible en el puerto indicado por la variable `EXTERNAL_PORT_WEB` y la base de datos (MongoDB) en el que indique la variable `EXTERNAL_PORT_DB`, es decir que, si se mantienen los valores por defecto, la aplicación estará disponible en http://localhost:30000 y el administrador de la base de datos ([adminer](https://www.adminer.org)) en http://localhost:18000.

## Topología de contenedores

![Topología de contenedores](topology-ports-facsat.png)

## Configuración NGINX

Para asegurar el tráfico y servir la aplicación desde el servidor VPS se utiliza esta configuración:

```sh
server {
    listen 80;
    server_name facsat-qa.codaltec.com;

    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    server_name facsat-qa.codaltec.com;

    include /etc/nginx/ssl-config.conf;

    http2   on;

    location / {
        proxy_pass http://localhost:30000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    error_page 500 502 503 504 /50x.html;
    location = /50x.html {
        root /usr/share/nginx/html;
    }
}
```

## Despliegue automático

En el repositorio se incluye el script `autodeploy.sh` que debe ser configurado para que se ejecute mediante un cron en el servidor.

Si por ejemplo se quiere verificar cada 5 minutos si hay cambios en el código fuente:

```sh
*/5 * * * * /bin/sh /home/bbtpwzmy/containers/facsat/autodeploy.sh
```

**Nota**: El script verifica si hay cambios pendientes por desplegar y, únicamente, si es así los descarga en el servidor y reconstruye los contenedores. Es importante verificar la rama git que se está usando en la ruta de despliegue, para esto se ejecuta `git branch` y en el resultado del comando se mostrará (antecedida por un asterisco) la rama que está en uso.