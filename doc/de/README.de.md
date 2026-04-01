![Logo](../../admin/iconAdapter.png)

# ioBroker.public-transport

[![NPM version](https://img.shields.io/npm/v/iobroker.public-transport.svg)](https://www.npmjs.com/package/iobroker.public-transport)
[![Downloads](https://img.shields.io/npm/dm/iobroker.public-transport.svg)](https://www.npmjs.com/package/iobroker.public-transport)
![Number of Installations](https://iobroker.live/badges/public-transport-installed.svg)
![Current version in stable repository](https://iobroker.live/badges/public-transport-stable.svg)

[![NPM](https://nodei.co/npm/iobroker.public-transport.png?downloads=true)](https://nodei.co/npm/iobroker.public-transport/)

**Tests:** ![Test and Release](https://github.com/tt-tom17/ioBroker.public-transport/workflows/Test%20and%20Release/badge.svg)

## Öffentlicher Nahverkehr Adapter für ioBroker

Der public-transport Adapter ermöglicht die Integration von Echtzeitfahrplaninformationen des öffentlichen Nahverkehrs in Ihre ioBroker-Smart-Home-Umgebung. Mit diesem Adapter können Sie Abfahrtszeiten von Haltestellen verschiedener Verkehrsbetriebe in Deutschland, Österreich und anderen Ländern abrufen und für Automatisierungen nutzen.

[🇬🇧 English Documentation](../README.md)

## Inhaltsverzeichnis

- [Hauptfunktionen](#hauptfunktionen)
- [Installation](#installation)
- [Unterstützte Verkehrsverbünde](#unterstützte-verkehrsverbünde)
- [Konfiguration](#konfiguration)
- [Datenstruktur](#datenstruktur)
- [Anwendungsbeispiele](#anwendungsbeispiele)

## Hauptfunktionen

- **Mehrere Transport-Services**: Unterstützung für HAFAS und DB Vendo APIs
- **Flexible Station-Konfiguration**: Konfiguration von beliebig viele Haltestellen
- **Echtzeitdaten**: Abruf von Live-Abfahrtszeiten mit Verspätungsinformationen
- **Automatische Aktualisierung**: Regelmäßige Abfrage der Abfahrtszeiten im frei konfigurierbaren Intervall
- **Umfangreiche Filteroptionen**: Filtern nach Verkehrsmitteln (Bus, Bahn, S-Bahn, U-Bahn, Tram, Fähre, etc.)
- **Flexibler Zeitoffset**: Zeigt Abfahrten ab einem bestimmten Zeitpunkt in der Zukunft an
- **Anpassbare Abfrageanzahl**: Bestimmt wie viele Abfahrten pro Station angezeigt werden sollen
- **Benutzerdefinierte Namen**: Individuelle Namen für Ihre Haltestellen und Verbindungen

## Installation

### Voraussetzungen

- ioBroker Installation (Node.js 20.x oder höher erforderlich)
- Internetzugang für den Abruf der Fahrplandaten

### Installation über ioBroker Admin

1. Öffnen Sie die ioBroker Admin-Oberfläche
2. Navigieren Sie zu "Adapter"
3. Suchen Sie nach "public-transport"
4. Klicken Sie auf "Installieren"

## Unterstützte Verkehrsverbünde

### HAFAS-Profile

Der Adapter nutzt die HAFAS (HaCon Fahrplan-Auskunfts-System) API und unterstützt zahlreiche Verkehrsverbünde und Verkehrsbetriebe:

#### Deutschland
- **VBB** - Verkehrsverbund Berlin-Brandenburg


#### Österreich
- **ÖBB** - Österreichische Bundesbahnen (bundesweit)

### Vendo

Vendo API für den Abruf der Daten von der Deutschen Bahn (DB)  

## Konfiguration

### Allgemeine Einstellungen

1. **Service-Typ auswählen**
   - Wählen Sie zwischen `HAFAS` und `Vendo` basierend auf Ihrem Verkehrsbetrieb

2. **Profil wählen** (nur bei HAFAS)
   - Wählen Sie das entsprechende Verkehrsverbund-Profil aus der Dropdown-Liste
   - Beispiel: "vbb" für Berlin-Brandenburg

3. **Abfrageintervall**
   - Legen Sie fest, wie oft die Daten aktualisiert werden sollen (in Minuten)
   - Empfohlen: 2-5 Minuten für Echtzeitdaten
   - Minimum: 1 Minute

### Station hinzufügen

Für jede Haltestelle können folgende Parameter konfiguriert werden:

#### Konfigurationsparameter

- **Benutzerdefinierter Name** (optional)
  - Ein individueller Name für die Station in ioBroker
  - Beispiel: "Bushaltestelle_Arbeit" statt der offiziellen Bezeichnung

- **Anzahl der Abfahrten**
  - Wie viele Abfahrten sollen abgerufen werden?
  - Standard: 5
  - Bereich: 1-20

- **Zeitoffset (Minuten)**
  - Abfahrten ab diesem Zeitpunkt in der Zukunft anzeigen
  - Standard: 0 (sofort)
  - Beispiel: 5 = nur Abfahrten in 5+ Minuten anzeigen
  - Nützlich, um Abfahrten auszublenden, die Sie nicht mehr erreichen können

- **Zeitraum (Minuten)**
  - Maximaler Zeitraum für angezeigte Abfahrten
  - Standard: 60
  - Beispiel: 30 = nur Abfahrten innerhalb der nächsten 30 Minuten

- **Verkehrsmittel-Filter**
  - Wählen Sie, welche Verkehrsmittel angezeigt werden sollen:
    - Bus
    - S-Bahn (Suburban)
    - U-Bahn (Subway)
    - Straßenbahn (Tram)
    - Regionalzug (Regional)
    - Fernzug (National)
    - Fähre (Ferry)
    - Express
    - Taxi
  - Mehrfachauswahl möglich

### Verbindung hinzufügen

Verbindungen ermöglichen die Abfrage von Routen zwischen zwei Stationen. Folgende Parameter können konfiguriert werden:

#### Verbindungskonfigurationsparameter

- **Benutzerdefinierter Name** (optional)
  - Ein individueller Name für die Verbindung in ioBroker
  - Beispiel: "Heimweg_Arbeit" zur besseren Identifikation

- **Von Station** (erforderlich)
  - Die Startstation für die Verbindung
  - Auswahl aus verfügbaren Stationen

- **Nach Station** (erforderlich)
  - Die Zielstation für die Verbindung
  - Auswahl aus verfügbaren Stationen

- **Anzahl der Ergebnisse**
  - Wie viele Verbindungsoptionen sollen abgerufen werden?
  - Standard: 3
  - Bereich: 1-10

- **Verkehrsmittel-Filter**
  - Wie bei Stationen (siehe oben)
  - Schränkt die in der Verbindung verwendeten Verkehrsmittel ein

## Datenstruktur

### Stationen-Datenstruktur

Der Adapter erstellt für jede konfigurierte Station einen Objektbaum in ioBroker:

```
public-transport.0
├── Stations
│   └── <Station-ID>                 // Stations-ID (z.B. 900350163)
│       ├── json                     // Rohdaten der Abfahrten (JSON)
│       ├── enabled                  // Station aktiviert (boolean)
│       ├── Departures_00            // Erste Abfahrt
│       │   ├── Departure            // Tatsächliche Abfahrtszeit
│       │   ├── DeparturePlanned     // Geplante Abfahrtszeit
│       │   ├── Delay                // Verspätung in Sekunden
│       │   ├── DepartureDelayed     // Ist verspätet (boolean)
│       │   ├── DepartureOnTime      // Ist pünktlich (boolean)
│       │   ├── Platform             // Gleis/Steig
│       │   ├── PlatformPlanned      // Geplantes Gleis/Steig
│       │   ├── Direction            // Richtung/Endziel
│       │   ├── Name                 // Linienname (z.B. "891")
│       │   ├── Product              // Produkttyp (z.B. "bus")
│       │   ├── Operator             // Betreibername
│       │   ├── Mode                 // Verkehrsmitteltyp (bus, train, etc.)
│       │   ├── Remarks              // Bemerkungen und Meldungen
│       │   │   ├── Hint             // Allgemeine Hinweise
│       │   │   ├── Status           // Statusmeldungen
│       │   │   └── Warning          // Warnungen
│       │   └── Stop                 // Haltestellen-Info
│       │       ├── Id               // Haltestellen-ID
│       │       ├── Name             // Haltestellenname
│       │       └── Type             // Haltestellentyp (z.B. "stop")
│       ├── Departures_01            // Zweite Abfahrt
│       │   └── ...
│       └── ...
```

### Verbindungs-Datenstruktur

Für jede konfigurierte Verbindung erstellt der Adapter folgende Struktur:

```
public-transport.0
├── Journeys
│   └── journey_<ID>                     // Verbindungskonfigurations-ID
│       ├── Journey_00                   // Erste Verbindungsoption
│       │   ├── json                     // Rohdaten der Verbindung (JSON)
│       │   ├── Arrival                  // Ankunftszeit am Ziel
│       │   ├── ArrivalPlanned           // Geplante Ankunftszeit
│       │   ├── ArrivalDelay             // Verspätung Ankunft in Sekunden
│       │   ├── ArrivalDelayed           // Verspätete Ankunft (boolean)
│       │   ├── ArrivalOnTime            // Pünktliche Ankunft (boolean)
│       │   ├── Departure                // Abfahrtszeit vom Start
│       │   ├── DeparturePlanned         // Geplante Abfahrtszeit
│       │   ├── DepartureDelay           // Verspätung Abfahrt in Sekunden
│       │   ├── DepartureDelayed         // Verspätete Abfahrt (boolean)
│       │   ├── DepartureOnTime          // Pünktliche Abfahrt (boolean)
│       │   ├── Changes                  // Anzahl der Umstiege
│       │   ├── DurationMinutes          // Reisedauer in Minuten
│       │   ├── Leg_00                   // Erste Teilstrecke
│       │   │   ├── json                 // Rohdaten der Teilstrecke (JSON)
│       │   │   ├── Arrival              // Ankunftszeit des Abschnitts
│       │   │   ├── ArrivalPlanned       // Geplante Ankunft des Abschnitts
│       │   │   ├── ArrivalDelay         // Verspätung Ankunft (Sekunden)
│       │   │   ├── ArrivalDelayed       // Verspätete Ankunft (boolean)
│       │   │   ├── ArrivalOnTime        // Pünktliche Ankunft (boolean)
│       │   │   ├── Departure            // Abfahrtszeit des Abschnitts
│       │   │   ├── DeparturePlanned     // Geplante Abfahrt des Abschnitts
│       │   │   ├── DepartureDelay       // Verspätung Abfahrt (Sekunden)
│       │   │   ├── DepartureDelayed     // Verspätete Abfahrt (boolean)
│       │   │   ├── DepartureOnTime      // Pünktliche Abfahrt (boolean)
│       │   │   ├── Distance             // Entfernung in Metern
│       │   │   ├── Reachable            // Abschnitt erreichbar (boolean)
│       │   │   ├── Line                 // Linieninformationen
│       │   │   │   ├── Direction        // Richtung/Endziel
│       │   │   │   ├── Mode             // Verkehrsmitteltyp (train, bus, etc.)
│       │   │   │   ├── Name             // Linienname (z.B. "RE3")
│       │   │   │   ├── Operator         // Verkehrsbetreiber
│       │   │   │   └── Product          // Produkttyp (z.B. "regional")
│       │   │   └── Remarks              // Hinweise und Meldungen
│       │   │       ├── Hints            // Allgemeine Hinweise
│       │   │       ├── Status           // Statusmeldungen
│       │   │       └── Warnings         // Warnungen
│       │   ├── Leg_01                   // Zweite Teilstrecke
│       │   │   └── ...
│       │   └── ...
│       ├── Journey_01                   // Zweite Verbindungsoption
│       │   └── ...
│       └── ...
```

### Datentypen und Beispielwerte

| State | Typ | Beispiel | Beschreibung |
|-------|-----|----------|--------------|
| delay | number | `3` | Verspätung in Minuten (0 = pünktlich) |
| departure | string | `2026-02-16T14:30:00.000Z` | Geplante Abfahrtszeit (ISO 8601) |
| departureTime | string | `2026-02-16T14:33:00.000Z` | Tatsächliche Abfahrtszeit inkl. Verspätung |
| direction | string | `S Potsdam Hauptbahnhof` | Endziel der Fahrt |
| line | string | `S7` | Linienbezeichnung |
| platform | string | `3` | Gleis/Steig/Bussteig |
| type | string | `suburban` | Verkehrsmitteltyp |
| cancelled | boolean | `false` | Fahrtausfall |

## Anwendungsbeispiele

### 1. Vis-Anzeige

für Vis1 gibt es ein Widget für die Abfahrten. Für die Anzeige wird das JSON genutzt.  
