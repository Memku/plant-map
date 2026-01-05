import { create } from 'zustand';
import type { MapMode } from '../types/map.types';

interface UIState {
  mapMode: MapMode;
  selectedPlantId: string | null;
  isModalOpen: boolean;
  modalContent: 'add-plant' | 'edit-plant' | 'plant-details' | null;

  setMapMode: (mode: MapMode) => void;
  selectPlant: (id: string | null) => void;
  openModal: (content: UIState['modalContent']) => void;
  closeModal: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  mapMode: 'view',
  selectedPlantId: null,
  isModalOpen: false,
  modalContent: null,

  setMapMode: (mode) => set({ mapMode: mode }),
  selectPlant: (id) => set({ selectedPlantId: id }),
  openModal: (content) => set({ isModalOpen: true, modalContent: content }),
  closeModal: () => set({ isModalOpen: false, modalContent: null, mapMode: 'view' }),
}));
