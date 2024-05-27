#!/bin/bash

# Autor: Javier Leonardo Cerón Puentes
# Descripción: Este script se utiliza para actualizar el código fuente
# del proyecto desde un repositorio Git y reiniciar los contenedores. 
# Si no se encuentran cambios en el repositorio remoto, muestra un mensaje 
# indicando que no hay actualizaciones.

# Definir rutas y nombres de comandos
PROYECTO_DIR="/home/bbtpwzmy/containers/facsat"

# Cambiar al directorio del proyecto
cd "$PROYECTO_DIR"

# Realizar git pull y capturar la salida en una variable
git_output=$(/usr/bin/git pull origin)

# Verificar si hay actualizaciones
if [[ "$git_output" == *"Already "* || "$git_output" == *"actualizado"* ]]; then
    # No hay cambios en el repositorio remoto
    echo "No se encontraron cambios en el repositorio remoto."
else
    /usr/bin/git rev-parse HEAD > version.txt
    /usr/bin/docker compose down && /usr/bin/docker compose up -d --build
fi