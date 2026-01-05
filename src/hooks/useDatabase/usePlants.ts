import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../services/database/dexie';

export const usePlants = () => {
  const plants = useLiveQuery(
    () => db.plants.orderBy('timestamp').reverse().toArray(),
    []
  );

  return {
    plants: plants ?? [],
    loading: plants === undefined,
  };
};

export const usePlantById = (id: string | null) => {
  const plant = useLiveQuery(
    () => (id ? db.plants.get(id) : undefined),
    [id]
  );

  return {
    plant: plant ?? null,
    loading: plant === undefined && id !== null,
  };
};
