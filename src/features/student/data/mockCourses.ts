import { CoursItem } from '../types';

export const COURS_DATA_DASHBOARD: CoursItem[] = [
  {
    id: 'c1',
    jour: 'LUN',
    nom: 'Algorithmique Avancée',
    heure: '08:00 - 10:00',
    salle: 'Amphi A',
    professeur: 'Dr. Aly Diatta',
    description: 'Analyse de complexité théorique, structures de données avancées, algorithmes gloutons, théorie des graphes et programmation dynamique.',
    type: 'CM'
  },
  {
    id: 'c2',
    jour: 'MAR',
    nom: 'Projet Web Framework',
    heure: '09:00 - 12:00',
    salle: 'Labo 3',
    professeur: 'M. Malick Teuw',
    description: 'Conception et développement d\'une application web monopage complète en React, TypeScript & Node.js sous architecture propre.',
    type: 'TP'
  },
  {
    id: 'c3',
    jour: 'MER',
    nom: 'Machine Learning Basics',
    heure: '12:00 - 14:00',
    salle: 'Visioconférence (En Ligne)',
    professeur: 'Dr. Cheikh Anta',
    description: 'Régression linéaire, classification supervisée, arbres de décision et introduction aux concepts fondamentaux des réseaux neuronaux artificiels.',
    type: 'CM',
    enCours: true
  },
  {
    id: 'c4',
    jour: 'JEU',
    nom: "Systèmes d'Information",
    heure: '14:00 - 16:00',
    salle: 'Salle 102',
    professeur: 'Mme. Seynabou',
    description: 'Modélisation conceptuelle de données, diagrammes UML, architecture n-tiers, sécurité logique et gouvernance IT.',
    type: 'TD'
  },
  {
    id: 'c5',
    jour: 'VEN',
    nom: 'Anglais Technique',
    heure: '10:00 - 12:00',
    salle: 'Salle 204',
    professeur: 'Mr. John Mitchell',
    description: 'Vocabulaire informatique professionnel, rédaction de documentation technique et présentation de projets en anglais scientifique.',
    type: 'TD'
  }
];
