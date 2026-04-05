# MicroDAGR Mobile App - Development Guide

## 1. Visió General
L'objectiu principal d'aquest projecte és crear una aplicació mòbil per a dispositius Android (APK) i posteriorment per a iOS, que reprodueixi fidelment el dispositiu **MicroDAGR** inclòs al mod **ACE3** per l'Arma 3.

A diferència d'una reproducció purament visual, l'app ha d'estar vinculada en temps real amb el joc (live-telemetry). Això significa que la informació mostrada a l'app (com ara l'azimut, les coordenades, la velocitat i els waypoints) ha de ser extreta del personatge que s'està utilitzant a l'Arma 3 al mateix moment. A més, des de l'app es podrà interactuar amb la interfície del MicroDAGR del joc.

## 2. Investigació i Arxius Base
Durant la meva exploració, he analitzat l'addon del MicroDAGR original d'ACE3:
- **Lògica de la Interfície (`fnc_updateDisplay.sqf`)**: 
  - Utilitza funcions com `CBA_fnc_headDir` per a l'azimut/heading.
  - La posició s'obté amb `getPosASL ACE_player`, convertida després a format MGRS i referència de mapa amb `EFUNC(common,getMapGridFromPos)`.
  - La velocitat s'obté de `speed (vehicle ACE_player)`.
  - El sistema de waypoints es llegeix d'una variable interna que gestiona l'app i utilitza `[ACE_player] call BIS_fnc_dirTo` per a la distància i rumbs respecte al waypoint.

## 3. Arquitectura Proposada
Per aconseguir que l'App estigui vinculada a l'Arma 3, desenvoluparem l'arquitectura en **3 Capes**:

1. **El Mod / Addon (Arma 3 Component)**
   - Crearem un petit *script/addon* en SQF que s'executarà de fons. La seva funció serà llegir i injectar constantment (ex. cada 0.2 segons) les variables rellevants com Posició, Heading, Velocitat, i Punts de ruta del MicroDAGR.
   - Enviarà i rebrà aquesta informació fora de l'entorn del joc.
   
2. **El Servidor Pont (Local Bridge)**
   - Per comunicar el joc amb un mòbil extern, necessitàrem transportar les dades.
   - Es crearà un petit servidor web a l'PC que funciona com a intermediari entre la informació proveïda per l'Arma 3 (ex. a través d'una extensió d'Arma existent o un tracker en NodeJS/C#) i l'app mòbil usant comunicació WebSocket a la freqüència de la xarxa local (Wi-Fi).

3. **L'Aplicació Mòbil (Frontend)**
   - S'utilitzarà un framework modern (React / Vite) per a desenvolupament àgil web, dissenyant la rèplica visual interactiva del MicroDAGR amb alta atenció a les animacions, fluïdesa i aparença "premium".
   - Mitjançant *Capacitor*, el codi web es convertirà a aplicació mòbil per generar l'APK.
   - S'alimentarà via WebSockets de les dades del Servidor Pont.

## 4. Components Desenvolupats i Instruccions d'Ús

A continuació es detalla l'estat actual i com posar-ho tot en marxa:

### 1. El Mod d'Arma 3 (`microdagr_bridge`)
- **Acció**: S'han preparat els arxius de configuració i l'script base DINS d'aquesta mateixa carpeta a `microdagr_bridge`.
- Aquest add-on usa `diag_log` per expulsar la informació de telemetria al fitxer de log `.rpt` de l'Arma 3 de forma contínua amb un impacte gairebé invisible al rendiment en comparació de llibreries pesades via TCP.
- **Instruccions d'Empaquetat (Addon Builder)**: Per evitar l'error "Script not found", cal crear el `.pbo` correctament:
  1. Obre l'Addon Builder de les Arma 3 Tools.
  2. **Source Directory**: Selecciona l'última carpeta de dins: `\@microdagr_bridge\addons\microdagr_bridge`
  3. **Destination Directory**: Toca deixar-ho a la carpeta justa abans: `\@microdagr_bridge\addons`
  4. Desmarca la casella "Binarize".
  5. Entra a "Options" (a la dreta) i escriu com a **Addon Prefix**: `microdagr_bridge`
  6. Fes clic a Pack. Acaba col·locant la carpeta root `@microdagr_bridge` com a mod local al joc.

### 2. Utilitats Ràpides per Executar (Scripts `.bat`)
S'han generat dos arxius a la teva carpeta principal per engegar el Node i l'aplicació amb un simple doble clic (evitant així haver-ho de fer tot per consola).
- **`Start_Bridge.bat`**: Llegeix a temps real i "escolta" l'arxiu RPT del joc per captar la telemetria, oferint les dades al port 8080.
- **`Start_App.bat`**: Engega Vite React, compila la interfície dinàmica i l'obre de seguida al teu navegador de preferència.

### Pròxims Passos / Millores per al Futur
S'aconsella, un cop es tingui el sistema a l'Arma funcionant i validat en temps real (sense missatges d'error a consola JSON i visualitzant l'azimut o velocitat corecta), treballar a fons l'extracció de *Waypoints List* dins la missió usant les funcions nadiues `ace_microdagr_fnc_...` per enviar el llistat i poder visualitzar i mapejar millor l'acció a l'app directament sota format de coordenades en comptes de missatges de prova mockejats.

## 5. Extracció de Mapes: Topogràfic i Satèl·lit
Per tal de proveir mapes reals d'Arma 3 a l'aplicació, s'ha implementat un pipeline híbrid de processament d'imatges.

### Extracció Topogràfica (estat actual)
El flux principal actual usa extracció nativa des d'arxius del joc (PBO/PAA) per generar el mapa final de forma consistent.
La via d'exportació in-game amb captures de pantalla s'ha retirat del flux estàndard per reduir complexitat i evitar inconsistències segons focus/finestra del motor.

### Fallback Automàtic: Satèl·lit (PBO Extraction)
En cas que l'exportació in-game falli o es prefereixi dependre exclusivament del disc d'Arma, l'eina `map-extractor.js` ara conté una rutina directa que:
1. Actua instintivament analitzant les carpetes d'Arma si no troba tiles pre-exportats.
2. Identifica directament la imatge base del terreny (`pictureMap_ca.paa`) buscant pel pbo principal de mapa (`map_<world>_data.pbo`) gràcies a l'utilitat *PBO Manager (`pboc.exe`)*.
3. El converteix de format natiu d'Arma (PAa) a PNG sota demanda abans que l'App el demani (Pla A).
4. S'han suprimit les "PBO layers" residuals que causaven artefactes estranys (`_lco.paa`), per garantir que el producte processat sigui exclusivament cartografia vàlida per a navegació.
