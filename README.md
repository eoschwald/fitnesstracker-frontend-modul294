# Fitness Tracker Frontend

Angular-Frontend für die Verwaltung von Workouts, Übungen und Benutzern.

## Funktionen

- Login über Keycloak
- Dashboard mit Übersicht
- Workout-Verwaltung
- Übungsverwaltung
- Benutzerverwaltung
- Rollenbasierte Anzeige von Bereichen
- REST-Anbindung an das Backend

## Enthaltene Seiten

- Login
- Forbidden
- Not Found
- Dashboard
- Workouts-Liste
- Workout-Detail
- Workout-Formular
- Benutzer-Liste
- Benutzer-Formular
- Übungsformular als wiederverwendbare Komponente

## Rollen

- `READ` für das Anzeigen von Inhalten
- `UPDATE` für das Erstellen und Bearbeiten von Daten

## Start

1. Abhängigkeiten installieren
2. Backend und Keycloak starten
3. Frontend mit `ng serve` starten

## Projektstruktur

- `src/app/core` für Guards, Services, Interceptors und Modelle
- `src/app/features` für Seiten und Fachbereiche
- `src/app/shared` für wiederverwendbare Komponenten und Direktiven