import csv
import json
import math
import os
import re
import sys
import time
import uuid

import pandas as pd
#import pyautogui
#import pygetwindow as gw
import skyfield.api
import skyfield.elementslib
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait
from webdriver_manager.chrome import ChromeDriverManager

# Opciones de navegación
options = Options()
options.add_argument('--window-size=1920,1080')
options.add_argument('--headless')

# Instalar automáticamente el ChromeDriver
ChromeDriverManager().install()

# Inicializar el navegador
driver = webdriver.Chrome(options=options)

driver.get('https://www.windy.com/es/-Temperatura-temp?temp')


latitud = sys.argv[1]
longitud = sys.argv[2]

# Esperar a que el elemento sea clickable
textarea = WebDriverWait(driver, 10).until(
    EC.element_to_be_clickable((By.CSS_SELECTOR, 'input#q'))
)

# Hacer clic en el elemento
textarea.click()

time.sleep(3)

# Escribir en el elemento
textarea.send_keys(latitud + ', ' + longitud)
textarea.send_keys(Keys.ENTER)
time.sleep(3)
textarea.send_keys(Keys.ENTER)
time.sleep(5)

# Dar click en el dot del punto en el mapa
# Realizar la acción de clic derecho utilizando pyautogui
dotElement = WebDriverWait(driver, 10).until(
    EC.element_to_be_clickable(
        (By.CSS_SELECTOR, 'div.leaflet-marker-icon.icon-dot'))
)


def perform_right_click(element):
    actions = Actions(element)
    btnElement = driver.findElement(By.CSS_SELECTOR, 'div.leaflet-marker-icon.icon-dot')
    actions.context(btnElement).perform()

perform_right_click(dotElement)
time.sleep(3)

temperatureOption = WebDriverWait(driver, 10).until(
    EC.element_to_be_clickable((By.CSS_SELECTOR, 'a[data-do="picker"]'))
)

temperatureOption.click()
time.sleep(3)

# Tomar los grados del picker
pickerGrades = driver.find_element(
    By.CSS_SELECTOR, 'div.picker-content span[data-ref="content"] big[data-do="changeMetric"]')
numberGrades = pickerGrades.text.split()[0]
print('Grados: ' + numberGrades)

# Pausa de 5 segundos para visualizar el resultado
time.sleep(5)


# CAPTURA DE DATOS DE PRESIÓN ATMÓSFERICA
driver.get('https://www.windy.com/es/-Presi%C3%B3n-pressure?pressure')

# Esperar a que el elemento sea clickable
textarea = WebDriverWait(driver, 10).until(
    EC.element_to_be_clickable((By.CSS_SELECTOR, 'input#q'))
)

# Hacer clic en el elemento
textarea.click()
time.sleep(3)

# Escribir en el elemento
textarea.send_keys(latitud + ', ' + longitud)
textarea.send_keys(Keys.ENTER)
time.sleep(3)
textarea.send_keys(Keys.ENTER)
time.sleep(5)

# Dar click en el dot del punto en el mapa
# Realizar la acción de clic derecho utilizando pyautogui
dotElement = WebDriverWait(driver, 10).until(
    EC.element_to_be_clickable(
        (By.CSS_SELECTOR, 'div.leaflet-marker-icon.icon-dot'))
)


def perform_right_click(element):
    # Obtener la posición del elemento en la ventana del navegador
    location = element.location
    x = location['x']
    y = location['y'] + 120

    # Simular el clic derecho utilizando pyautogui
    pyautogui.moveTo(x, y)
    pyautogui.click(button='right')


perform_right_click(dotElement)
time.sleep(3)

presionOption = WebDriverWait(driver, 10).until(
    EC.element_to_be_clickable((By.CSS_SELECTOR, 'a[data-do="picker"]'))
)

presionOption.click()
time.sleep(3)

# Tomar la presion del picker
pickerPresion = driver.find_element(
    By.CSS_SELECTOR, 'div.picker-content span[data-ref="content"] big[data-do="changeMetric"]')
numberPresion = pickerPresion.text.split()[0]
print('Presion: ' + numberPresion)

time.sleep(5)


# CAPTURAR DATOS DE CELASTRAK
driver.get('https://celestrak.org/NORAD/elements/gp.php?CATNR=56205')

# Esperar a que el elemento sea clickable
celastrak_element = driver.find_element(By.CSS_SELECTOR, 'pre')
textoCelastrak = celastrak_element.text
time.sleep(3)

try:
    tle_lines = textoCelastrak.strip().splitlines()
    if (len(tle_lines) > 2):
        satellite = skyfield.api.EarthSatellite(
            tle_lines[1], tle_lines[2], tle_lines[0])
    elif (len(tle_lines) == 2):
        satellite = skyfield.api.EarthSatellite(
            tle_lines[0], tle_lines[1], "UNKNOWN")
    else:
        raise Exception("TLE data needs at least two lines.")
except Exception as e:
    print("Unable to decode TLE data. Make the sure TLE data is formatted correctly." + e)
    exit(1)

classifications = {
    "U": "Unclassified",
    "C": "Classified",
    "S": "Secret"
}
classification = classifications.get(satellite.model.classification, "Unknown")
xpdotp = 1440.0 / (2.0 * math.pi)
TLE = {
    "Norad_Id": satellite.model.satnum,
    "International_Classification": classification,
    "International_Designation": satellite.model.intldesg,
    "Epoch_Time_(ISO)": satellite.epoch.utc_iso(),
    "First_Derivative_Mean_Motion": satellite.model.ndot * xpdotp * 1440.0,
    "Second_Derivative_Mean_Motion": satellite.model.nddot * xpdotp * 1440.0 * 1440.0,
    "Inclination": math.degrees(satellite.model.inclo),
    "Right_Ascension_of_the_Ascending_Node": math.degrees(satellite.model.nodeo),
    "Eccentricity": satellite.model.ecco,
    "Argument_of_Perigee": math.degrees(satellite.model.argpo),
    "Mean_Anomaly": math.degrees(satellite.model.mo),
    "Mean_Motion": (satellite.model.no_kozai * 60 * 24) / (2 * math.pi),
    "Revolution_Number_at_Epoch": satellite.model.revnum
}

time.sleep(5)

# CAPTURA DE DATOS DE UNIXTIMESTAMP
driver.get('https://www.unixtimestamp.com/')

inputTimestamp = driver.find_element(By.CSS_SELECTOR, 'input#timestamp')

hora_juliana_element = driver.find_element(By.CSS_SELECTOR, 'div.epoch')
hora_juliana = hora_juliana_element.text
inputTimestamp.click()
time.sleep(3)
inputTimestamp.send_keys(hora_juliana)
time.sleep(1)
inputTimestamp.send_keys(Keys.ENTER)
time.sleep(3)

hora_element = driver.find_element(By.CSS_SELECTOR, 'span#hour1')
minuto_element = driver.find_element(By.CSS_SELECTOR, 'span#minute1')
segundo_element = driver.find_element(By.CSS_SELECTOR, 'span#second1')
hora_local_element = driver.find_element(By.CSS_SELECTOR, 'td.local')

hora = hora_element.text
minuto = minuto_element.text
segundo = segundo_element.text
horaUTC = hora + ':' + minuto + ':' + segundo

horaLocal = hora_local_element.text

print('Hora local: ' + horaLocal)
print('Hora Juliana: ' + hora_juliana)
print('Hora UTC: ' + horaUTC)

time.sleep(5)

# CAPTURA DE DATOS DESDE N2YO
driver.get('https://www.n2yo.com/?s=56205')

altitud_element = WebDriverWait(driver, 10).until(
    EC.element_to_be_clickable((By.CSS_SELECTOR, 'div#sataltkm'))
)
elevation_element = WebDriverWait(driver, 10).until(
    EC.element_to_be_clickable((By.CSS_SELECTOR, 'div#satel'))
)

altitud = altitud_element.text
elevation = elevation_element.text

time.sleep(5)

# EXPORTACIÓN DE DATA A ARCHIVOS EXCEL
# Ruta del archivo
ruta_archivo = "public/results/datos.csv"
# Crear una lista con los elementos individuales a escribir en cada columna
fila = [numberGrades, numberPresion, textoCelastrak,
        horaLocal, hora_juliana, horaUTC, altitud, elevation]
# Abrir el archivo CSV en modo escritura, utilizando el modo "append"
with open(ruta_archivo, "a", newline="") as archivo_csv:
    # Crear un objeto escritor CSV con el delimitador de coma
    escritor_csv = csv.writer(archivo_csv, delimiter=',')
    # Escribir la fila en el archivo CSV
    escritor_csv.writerow(fila)
print("Datos guardados en el archivo:", ruta_archivo)


# EXPORTACIÓN DE DATA A ARCHIVOS JSON
ruta_archivojson = "public/results/datos.json"
# Crear un diccionario con los datos de la consulta actual
consulta_actual = {
    "id": str(uuid.uuid4()),  # Generar un identificador único
    "latitud": latitud,
    "longitud": longitud,
    "temperature": numberGrades,
    "pressure": numberPresion,
    "localTime": horaLocal,
    "julianTime": hora_juliana,
    "utcTime": horaUTC,
    "altitude": altitud,
    "elevation": elevation,
    "TLE": TLE,
}

# Cargar el contenido del archivo JSON solo si no está vacío
try:
    with open(ruta_archivojson, "r") as archivo_json:
        contenido_json = archivo_json.read()
        if contenido_json:
            consultas_previas = json.loads(contenido_json)
        else:
            consultas_previas = []
except FileNotFoundError:
    consultas_previas = []

# Agregar los datos de la consulta actual a la lista de consultas previas
consultas_previas.append(consulta_actual)

# Guardar la lista actualizada en el archivo JSON
with open(ruta_archivojson, "w") as archivo_json:
    json.dump(consultas_previas, archivo_json)

print("Datos guardados en el archivo JSON:", ruta_archivojson)


# Crear objeto GeoJSON
geojson = {
    "type": "Feature",
    "geometry": {
        "type": "Point",
        "coordinates": [longitud, latitud]
    },
    "properties": {
        "temperature": numberGrades,
        "pressure": numberPresion,
        "localTime": horaLocal,
        "julianTime": hora_juliana,
        "utcTime": horaUTC,
        "altitude": altitud,
        "elevation": elevation,
        "TLE": TLE,
    }
}

# Guardar información en archivo GeoJSON
ruta_geojson = 'public/results/datos.geojson'
with open(ruta_geojson, 'w') as archivo_geojson:
    json.dump(geojson, archivo_geojson)
print("Datos guardados en el archivo GeoJSON:", ruta_geojson)

time.sleep(5)
