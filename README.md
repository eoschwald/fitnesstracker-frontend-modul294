# Fitness Tracker Frontend

Angular Frontend zur Verwaltung von Workouts, Übungen und Benutzern.

Die Anwendung kommuniziert über eine REST API mit dem Spring Boot Backend und verwendet Keycloak für Authentifizierung und Autorisierung.

---

## Funktionen

### Authentifizierung

* Login über Keycloak
* OAuth2 / OpenID Connect
* Rollenbasierte Autorisierung
* Geschützte Routen mit Angular Guards

### Dashboard

* Übersicht über Workouts
* Übersicht über Übungen
* Übersicht über Benutzer
* Schnellzugriff auf häufig verwendete Funktionen

### Workout-Verwaltung

* Workouts anzeigen
* Workouts erstellen
* Workouts bearbeiten
* Workouts löschen
* Workout-Details anzeigen

### Übungsverwaltung

* Übungen zu einem Workout hinzufügen
* Übungen entfernen
* Übungsdaten verwalten

### Benutzerverwaltung

* Benutzer anzeigen
* Benutzer erstellen
* Benutzer bearbeiten
* Benutzer löschen

---

## Verwendete Technologien

* Angular 21
* TypeScript
* Angular Router
* Angular Forms
* Angular HttpClient
* OAuth2 / OpenID Connect
* Keycloak
* Vitest
* ESLint
* Git / GitHub

---

## Rollenmodell

### READ

Berechtigt zum Anzeigen von Daten.

### UPDATE

Berechtigt zum:

* Erstellen
* Bearbeiten
* Löschen

von Daten.

---

## Enthaltene Seiten

### System

* Login
* Forbidden
* Not Found

### Dashboard

* Dashboard

### Workouts

* Workout-Liste
* Workout-Detail
* Workout-Formular

### Benutzer

* Benutzer-Liste
* Benutzer-Formular

### Wiederverwendbare Komponenten

* Exercise Form
* Page Header
* Stat Card
* Shell Component

---

## Projektstruktur

```text
src/
│
├── app/
│   ├── core/
│   │   ├── guards/
│   │   ├── interceptors/
│   │   ├── models/
│   │   └── services/
│   │
│   ├── features/
│   │   ├── dashboard/
│   │   ├── system/
│   │   ├── users/
│   │   └── workouts/
│   │
│   └── shared/
│       ├── components/
│       └── directives/
│
├── environments/
└── assets/
```

### Core

Enthält:

* Services
* Guards
* Interceptors
* Modelle

### Features

Enthält die einzelnen Seiten der Anwendung.

### Shared

Enthält wiederverwendbare Komponenten und Direktiven.

---

## Konfiguration

### Frontend

```text
URL:
http://localhost:4200
```

### Backend

```text
URL:
http://localhost:8081

API:
http://localhost:8081/api
```

### PostgreSQL

```text
Datenbank:
fitness_tracker

Port:
5433
```

### Keycloak

```text
Server:
http://localhost:8080

Realm:
fitness-tracker

Client:
fitness-tracker-client
```

---

## Installation

Abhängigkeiten installieren:

```bash
npm install
```

Frontend starten:

```bash
ng serve
```

Anwendung öffnen:

```text
http://localhost:4200
```

---

## Tests

### Unit Tests

```bash
npm test
```

### Linting

```bash
ng lint
```

### Produktions-Build

```bash
ng build
```

---

## Voraussetzungen

Folgende Systeme müssen vor dem Start verfügbar sein:

### PostgreSQL

* Datenbank: fitness_tracker
* Port: 5433

### Keycloak

* Realm: fitness-tracker
* Client: fitness-tracker-client

### Backend

* Spring Boot Backend auf Port 8081

---

## Entwickler

Elias Oschwald

Modul 294 – Fitness Tracker
