import React, { useContext } from "react";
import Modal from "../Modal";
import {
  GlobalContext,
  GlobalDispatchContext,
} from "../../state/context/GlobalContext";

export default function ModalArticle() {
  const { isDetailPostModalOpen } = useContext(GlobalContext);
  const dispatch = useContext(GlobalDispatchContext);

  const closeModal = () => {
    dispatch({
      type: "SET_IS_DETAIL_POST_MODAL_OPEN",
      payload: {
        isDetailPostModalOpen: false,
      },
    });
  };

  return (
    <>
      <button
        type="button"
        onClick={() =>
          dispatch({
            type: "SET_IS_DETAIL_POST_MODAL_OPEN",
            payload: {
              isDetailPostModalOpen: true,
            },
          })
        }
      >
        Click Me{" "}
      </button>
      <Modal closeModal={closeModal} isOpen={isDetailPostModalOpen}>
        <div className="w-screen h-screen max-w-5xl max-h-[90vh] flex flex-col items-center">
          <div className="w-full py-4 text-xl font-light text-center font-medium">
            Post title
          </div>
          <div className="w-full h-full px-10 text-black-800 overflow-auto pb-6">
            <p>
              Contrary to popular belief, Lorem Ipsum is not simply random text.
              It has roots in a piece of classical Latin literature from 45 BC,
              making it over 2000 years old. Richard McClintock, a Latin
              professor at Hampden-Sydney College in Virginia, looked up one of
              the more obscure Latin words, consectetur, from a Lorem Ipsum
              passage, and going through the cites of the word in classical
              literature, discovered the undoubtable source. Lorem Ipsum comes
              from sections 1.10.32 and 1.10.33 of de Finibus Bonorum et Malorum
              (The Extremes of Good and Evil) by Cicero, written in 45 BC. This
              book is a treatise on the theory of ethics, very popular during
              the Renaissance. The first line of Lorem Ipsum, Lorem ipsum dolor
              sit amet.., comes from a line in section 1.10.32.
            </p>
            <p>
              Contrary to popular belief, Lorem Ipsum is not simply random text.
              It has roots in a piece of classical Latin literature from 45 BC,
              making it over 2000 years old. Richard McClintock, a Latin
              professor at Hampden-Sydney College in Virginia, looked up one of
              the more obscure Latin words, consectetur, from a Lorem Ipsum
              passage, and going through the cites of the word in classical
              literature, discovered the undoubtable source. Lorem Ipsum comes
              from sections 1.10.32 and 1.10.33 of de Finibus Bonorum et Malorum
              (The Extremes of Good and Evil) by Cicero, written in 45 BC. This
              book is a treatise on the theory of ethics, very popular during
              the Renaissance. The first line of Lorem Ipsum, Lorem ipsum dolor
              sit amet.., comes from a line in section 1.10.32.
            </p>
          </div>
        </div>
      </Modal>
    </>
  );
}
