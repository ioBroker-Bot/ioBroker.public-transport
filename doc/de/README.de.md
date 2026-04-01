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

## Datenstruktur

Der Adapter erstellt für jede konfigurierte Station einen Objektbaum in ioBroker:

```
public-transport.0
├── <Station-Name oder ID>
│   ├── 0
│   │   ├── delay                    // Verspätung in Minuten
│   │   ├── departure                // Geplante Abfahrtszeit
│   │   ├── departureTime            // Tatsächliche Abfahrtszeit (mit Verspätung)
│   │   ├── direction                // Fahrtrichtung/Endhaltestelle
│   │   ├── line                     // Linienbezeichnung
│   │   ├── platform                 // Gleis/Steig
│   │   ├── type                     // Verkehrsmitteltyp
│   │   └── cancelled                // Ausfall (true/false)
│   ├── 1
│   │   └── ...
│   ├── ...
│   └── json                         // JSON-String aller Abfahrten
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
