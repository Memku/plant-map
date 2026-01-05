import { MainLayout } from './components/layout/MainLayout/MainLayout';
import { Header } from './components/layout/Header/Header';
import { MapContainer } from './components/map/MapContainer/MapContainer';
import { Modal } from './components/common/Modal/Modal';
import { PlantForm } from './components/plant/PlantForm/PlantForm';
import { usePlants } from './hooks/useDatabase/usePlants';
import { usePlantMutations } from './hooks/useDatabase/usePlantMutations';
import { useUIStore } from './store/uiStore';
import './App.css';

function App() {
  const { plants, loading } = usePlants();
  const { createPlant } = usePlantMutations();
  const { isModalOpen, modalContent, openModal, closeModal } = useUIStore();

  const handleAddPlant = () => {
    openModal('add-plant');
  };

  const handleSubmitPlant = async (input: Parameters<typeof createPlant>[0]) => {
    await createPlant(input);
    closeModal();
  };

  return (
    <div className="app">
      <MainLayout header={<Header onAddPlant={handleAddPlant} />}>
        {loading ? (
          <div className="app-loading">Loading plants...</div>
        ) : (
          <MapContainer plants={plants} />
        )}
      </MainLayout>

      <Modal
        isOpen={isModalOpen && modalContent === 'add-plant'}
        onClose={closeModal}
        title="Add New Plant"
      >
        <PlantForm onSubmit={handleSubmitPlant} onCancel={closeModal} />
      </Modal>
    </div>
  );
}

export default App;
