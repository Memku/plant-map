import Dexie, { type Table } from 'dexie';
import type { Plant } from '../../types/plant.types';

export class PlantDatabase extends Dexie {
  plants!: Table<Plant, string>;

  constructor() {
    super('PlantMapDB');

    // Version 1: Initial schema
    this.version(1).stores({
      plants: 'id, timestamp, *tags, [location.latitude+location.longitude]'
    });

    // Version 2: Add AI identification support
    // Note: aiIdentification is an optional field that doesn't need indexing
    // Dexie automatically stores complex objects
    this.version(2).stores({
      plants: 'id, timestamp, *tags, [location.latitude+location.longitude]'
    });
  }
}

export const db = new PlantDatabase();
