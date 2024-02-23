# ---------------------------------------------------------------------

import csv
import json
import math
import os
import re
import sys
import time
import uuid

import skyfield.api
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait
from webdriver_manager.chrome import ChromeDriverManager
from webdriver_manager.firefox import GeckoDriverManager
from webdriver_manager.microsoft import EdgeChromiumDriverManager

def iniciar_navegador():
    browsers = ['firefox', 'chromium']

    for browser_name in browsers:
        try:
            if browser_name == 'firefox':
                options = webdriver.FirefoxOptions()
                options.add_argument('--headless')
                options.add_argument('--disable-extensions')
                options.add_argument('--disable-notifications')
                options.add_argument('--window-size=1920x1080')
                browser = webdriver.Firefox(options=options)
                driver_manager = GeckoDriverManager()
            elif browser_name == 'chromium':
                options = webdriver.EdgeOptions()
                options.use_chromium = True
                options.add_argument('--headless')
                options.add_argument('--disable-extensions')
                options.add_argument('--disable-notifications')
                options.add_argument('--window-size=1920x1080')
                browser = webdriver.Edge(options=options)
                driver_manager = EdgeChromiumDriverManager()

            driver_manager.install()
            return browser
        except Exception as e:
            print(f"No se pudo iniciar {browser_name}: {e}")
            continue

    print("Ningún navegador disponible.")
    return None


def obtener_tle(driver):
    try:
        driver.get('https://celestrak.org/NORAD/elements/gp.php?CATNR=56205')
        celastrak_element = driver.find_element(By.CSS_SELECTOR, 'pre')
        textoCelastrak = celastrak_element.text

        tle_lines = textoCelastrak.strip().splitlines()
        if len(tle_lines) > 2:
            satellite = skyfield.api.EarthSatellite(tle_lines[1], tle_lines[2], tle_lines[0])
        elif len(tle_lines) == 2:
            satellite = skyfield.api.EarthSatellite(tle_lines[0], tle_lines[1], "UNKNOWN")
        else:
            raise Exception("TLE data needs at least two lines.")
        
        classifications = {"U": "Unclassified", "C": "Classified", "S": "Secret"}
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

        return TLE

    except Exception as e:
        error_message = f"Error al obtener TLE data: {e}"
        print(error_message)
        raise ValueError(error_message)


def obtener_datos_unixtimestamp(driver):
    try:
        driver.get('https://www.unixtimestamp.com/')
        inputTimestamp = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.CSS_SELECTOR, 'input#timestamp'))
        )
        hora_juliana_element =  WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.CSS_SELECTOR, 'div.epoch'))
        )
        hora_juliana = hora_juliana_element.text
        inputTimestamp.click()
        time.sleep(2)
        inputTimestamp.send_keys(hora_juliana)
        time.sleep(2)
        inputTimestamp.send_keys(Keys.ENTER)
        time.sleep(2)

        hora_element = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.CSS_SELECTOR, 'span#hour1'))
        )
        minuto_element = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.CSS_SELECTOR, 'span#minute1'))
        )
        segundo_element = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.CSS_SELECTOR, 'span#second1'))
        )
        hora_local_element =WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.CSS_SELECTOR, 'td.local'))
        )

        hora = hora_element.text
        minuto = minuto_element.text
        segundo = segundo_element.text
        horaUTC = hora + ':' + minuto + ':' + segundo
        horaLocal = hora_local_element.text

        return hora_juliana, horaUTC, horaLocal
    except Exception as e:
        error_message = f"Error al obtener datos de Unixtimestamp: {e}"
        print(error_message)
        raise ValueError(error_message)


def obtener_datos_n2yo(driver):
    try:
        driver.get('https://www.n2yo.com/?s=56205')
        
        altitud_element = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.CSS_SELECTOR, 'div#sataltkm'))
        )
        elevation_element = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.CSS_SELECTOR, 'div#satel'))
        )
        altitud = altitud_element.text
        elevation = elevation_element.text

        return altitud, elevation
    except Exception as e:
        error_message = f"Error al obtener datos de N2YO: {e}"
        print(error_message)
        raise ValueError(error_message)


def exportar_a_json(latitud, longitud, horaLocal, hora_juliana, horaUTC, altitud, elevation, TLE):
    try:
        resultado = {
            "id": str(uuid.uuid4()),
            "latitud": latitud,
            "longitud": longitud,
            "localTime": horaLocal,
            "julianTime": hora_juliana,
            "utcTime": horaUTC,
            "altitude": altitud,
            "elevation": elevation,
            "TLE": TLE
        }
        print(resultado)
        return resultado
    except Exception as e:
        error_message = f"Error al exportar a JSON: {e}"
        print(error_message)
        raise ValueError(error_message)

# Inicializar el navegador
driver = iniciar_navegador()

if not driver:
    sys.exit(1)

latitud = sys.argv[1]
longitud = sys.argv[2]

# Obtener TLE data
TLE = obtener_tle(driver)

# Obtener datos de Unixtimestamp
horaLocal, hora_juliana, horaUTC = obtener_datos_unixtimestamp(driver)

# Obtener datos de N2YO
altitud, elevation = obtener_datos_n2yo(driver)

# Exportar a JSON
exportar_a_json(latitud, longitud, horaLocal, hora_juliana, horaUTC, altitud, elevation, TLE)

driver.quit()
