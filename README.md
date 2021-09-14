# BA-Projekt

## Architektur



### Azure Functions

Innerhalb des Azure Functions Ordners liegen die verschiedenen Azure Functions für das Projekt. Diese sind in Typescript geschrieben und werden nachgehend weiter erläutert.

##### ConnectionStateToTwins
Event Grid Trigger: Trigger kann innerhalb des IoT Hubs erstellt werden, sofern Verbindungsänderungen des einzelnen Gerätes aufkommen. Function nimmt die Daten auf und setzt den entsprechenden Wert für "State" innerhalb des Digital Twins.

##### DigitalTwinsService
Http Trigger: Function wird von der Angular App verwendet. Die FUnction stellt der Angular App, die Daten der Digital Twins Ressource zur Verfügung.

##### DigitalTwinsServiceDevice
HttpTrigger: Function stellt dem Gerät im DigiZ die Daten des Digital Twins Service zur Verfügung.

##### IoTHubDirectMethods
Http Trigger: Die Function wird von der Angular App aufgerufen und stellt einen Request an die Geräte im DigiZ, um die Co2 Ampel anzupassen.

##### IoTHubToDigitalTwins
Event Hub Trigger: (Standard Event Hub Event integriert in das IoT Hub): Function nimmt die Daten auf und setzt die entsprechenden Values innerhalb von Digital Twins.

##### TwinToMaps
Event Grid Trigger: (konfiguriert innerhalb der Digital Twins Ressource): Function setzt entsprechende Values innerhalb von Azure Maps Creator, wodurch die Karte interaktiv in Farben dargestellt wird.


### Client 
Die ANgular Applikation, welche die interaktive Karte etc. darstellt. Als Css-Framework wird Bulma verwendet. Alles ist in der pages/index Komponente.
Was muss potentiell angepasst werden?: Innerhalb der index.component.ts der SubscriptionKey, die tilesetId und die StatesetId auf die passenden Werte der Azure Maps Creator Ressource.
Die Urls der einzeln aufgerufenen Services im _services Ordner

### digital-twins-explorer
Ein Projekt von Microsoft, um die Relationen des Digitalen Zwillings visuell darzustellen.

### Edge -> modules
config/deployment.json: Die deployment.json Datei für die Geräte: (Was muss noch angepasst werden?)

