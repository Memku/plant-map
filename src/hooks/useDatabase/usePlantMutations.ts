import { useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../../services/database/dexie';
import type { CreatePlantInput, UpdatePlantInput, Plant } from '../../types/plant.types';
import { photoService } from '../../services/photo/photo.service';

export const usePlantMutations = () => {
  const createPlant = useCallback(async (input: CreatePlantInput): Promise<Plant> => {
    const now = Date.now();

    const compressed = await photoService.compressImage(input.photo, {
      maxWidth: 1200,
      maxHeight: 1200,
      quality: 0.8,
      format: 'jpeg',
    });

    const thumbnail = await photoService.generateThumbnail(compressed, 150);

    const plant: Plant = {
      id: uuidv4(),
      ...input,
      photo: compressed,
      photoThumbnail: thumbnail,
      timestamp: now,
      createdAt: now,
      updatedAt: now,
    };

    await db.plants.add(plant);
    return plant;
  }, []);

  const updatePlant = useCallback(async (input: UpdatePlantInput): Promise<void> => {
    const { id, ...updates } = input;
    await db.plants.update(id, {
      ...updates,
      updatedAt: Date.now(),
    });
  }, []);

  const deletePlant = useCallback(async (id: string): Promise<void> => {
    await db.plants.delete(id);
  }, []);

  return {
    createPlant,
    updatePlant,
    deletePlant,
  };
};
