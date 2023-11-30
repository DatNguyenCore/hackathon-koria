import React, { useContext, useState } from "react";
import Modal from "../Modal";
import {
  GlobalContext,
  GlobalDispatchContext,
} from "../../state/context/GlobalContext";

export default function ModalArticle({ children }) {
  // const { isDetailPostModalOpen } = useContext(GlobalContext);
  // const dispatch = useContext(GlobalDispatchContext);
  const [visible, setVisible] = useState(false);

  const closeModal = () => {
    // dispatch({
    //   type: "SET_IS_DETAIL_POST_MODAL_OPEN",
    //   payload: {
    //     isDetailPostModalOpen: false,
    //   },
    // });

    setVisible(false);
  };

  function onOpenModal() {
    setVisible(true);
  }

  return (
    <>
      <button
        type="button"
        // onClick={() =>
        //   dispatch({
        //     type: "SET_IS_DETAIL_POST_MODAL_OPEN",
        //     payload: {
        //       isDetailPostModalOpen: true,
        //     },
        //   })
        // }
        onClick={onOpenModal}
      >
        Click Me{" "}
      </button>
      <Modal closeModal={closeModal} isOpen={visible}>
        <div className="w-screen h-screen max-w-5xl max-h-[90vh] flex flex-col items-center">
          <div className="w-full py-4 text-xl font-light text-center font-medium">
            Post title
          </div>
          <div className="w-full h-full px-10 text-black-800 overflow-auto pb-6">
            {children}
          </div>
        </div>
      </Modal>
    </>
  );
}
