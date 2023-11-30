import React from "react";
import Modal from "../Modal";

export default function ModalArticle({
  children,
  visible = false,
  onCloseModal,
}) {
  return (
    <Modal closeModal={onCloseModal} isOpen={visible}>
      <div className="w-screen h-screen max-w-5xl max-h-[90vh] flex flex-col items-center">
        <div className="w-full py-4 text-xl font-light text-center font-medium">
          KOVi
        </div>
        <div className="w-full h-full px-10 text-black-800 overflow-auto pb-6">
          {children}
        </div>
      </div>
    </Modal>
  );
}
