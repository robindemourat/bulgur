import React from 'react';
import Modal from 'react-modal';

import AsideViewLayout from './AsideViewLayout';
import MainViewLayout from './MainViewLayout';
import NewStoryDialog from '../../NewStoryDialog/components/NewStoryDialogContainer.js';

const InterfaceManagerLayout = ({
  id,
  className,
  isNewStoryModalOpen,
  actions: {
    openNewStoryModal,
    closeNewStoryModal,
    resetNewStorySettings
  }
}) => (
  <div id={id} className={className}>
    <AsideViewLayout openNewStoryModal={openNewStoryModal}/>
    <MainViewLayout/>
    <Modal 
      onRequestClose={()=> closeNewStoryModal() && resetNewStorySettings()}
      isOpen={isNewStoryModalOpen}
    >
      <NewStoryDialog/>
    </Modal>
  </div>
);

export default InterfaceManagerLayout;