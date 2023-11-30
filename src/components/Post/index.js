import { uuidv4 } from "@firebase/util";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import Image from "next/image";
import React, { useContext, useEffect, useRef, useState } from "react";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { BsBookmark, BsEmojiSmile, BsThreeDots } from "react-icons/bs";
import { FaRegComment } from "react-icons/fa";
import { IoShareOutline } from "react-icons/io5";
import { auth, db } from "../../lib/firebase";
import { GlobalContext } from "../../state/context/GlobalContext";
import ModalArticle from "../ModalArticle";

const Post = ({ id, username, image, caption, likesCount }) => {
  const [visible, setVisible] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [comments, setComments] = useState([]);

  const onCloseModal = () => {
    setVisible(false);
  };

  function onOpenModal() {
    setVisible(true);
  }

  const handleLikePost = async () => {
    const postLike = {
      postId: id,
      userId: auth.currentUser.uid,
      username,
    };

    const likeRef = doc(db, `likes/${id}_${auth.currentUser.uid}`);
    const postRef = doc(db, `posts/${id}`);

    let updatedLikesCount;

    if (isLiked) {
      await deleteDoc(likeRef);
      if (likesCount) {
        updatedLikesCount = likesCount - 1;
      } else {
        updatedLikesCount = 0;
      }
      await updateDoc(postRef, {
        likesCount: updatedLikesCount,
      });
    } else {
      await setDoc(likeRef, postLike);
      if (likesCount) {
        updatedLikesCount = likesCount + 1;
      } else {
        updatedLikesCount = 1;
      }
      await updateDoc(postRef, {
        likesCount: updatedLikesCount,
      });
    }
  };

  useEffect(() => {
    const likesRef = collection(db, "likes");
    const likesQuery = query(
      likesRef,
      where("postId", "==", id),
      where("userId", "==", auth.currentUser.uid)
    );

    const unsubscribeLike = onSnapshot(likesQuery, (snapshot) => {
      const like = snapshot.docs.map((doc) => doc.data());
      if (like.length !== 0) {
        setIsLiked(true);
      } else {
        setIsLiked(false);
      }
    });

    const commentsRef = collection(db, `posts/${id}/comments`);
    const commentsQuery = query(commentsRef, orderBy("createdAt", "desc"));

    const unsubscribeComments = onSnapshot(commentsQuery, (snapshot) => {
      const comments = snapshot.docs.map((doc) => doc.data());
      setComments(comments);
    });

    return () => {
      unsubscribeLike();
      unsubscribeComments();
    };
  }, [id]);

  const comment = useRef(null);

  const { user } = useContext(GlobalContext);

  const handlePostComment = async (e) => {
    e.preventDefault();
    // comment functionality
    const commentData = {
      id: uuidv4(),
      username: user.username,
      comment: comment.current.value,
      createdAt: serverTimestamp(),
    };
    comment.current.value = "";
    const commentRef = doc(db, `posts/${id}/comments/${commentData.id}`);
    await setDoc(commentRef, commentData);
  };

  return (
    <>
      <div className="flex flex-col w-full border border-gray-200">
        <div className="flex items-center justify-between w-full p-2 ">
          <div className="flex items-center justify-center space-x-2">
            <div className="w-10 h-10 bg-black border-2 rounded-full" />
            <div>{username}</div>
          </div>
          <div className="w-4 select-none">
            <BsThreeDots className="text-lg" />
          </div>
        </div>
        <div
          className="relative flex items-center justify-center bg-black aspect-video"
          style={{
            height: "auto",
            minHeight: "100%",
          }}
          onClick={onOpenModal}
        >
          <Image
            src={image}
            layout="fill"
            alt={caption}
            className="object-cover"
          />
        </div>
        <div className="flex justify-between p-2 text-lg">
          <div className="flex space-x-2">
            <div onClick={handleLikePost}>
              {isLiked ? (
                <AiFillHeart
                  size={25}
                  className="text-red-500 cursor-pointer hover:text-red-500/50"
                />
              ) : (
                <AiOutlineHeart
                  size={25}
                  className="text-black cursor-pointer hover:text-black/50"
                />
              )}
            </div>
            <div>
              <FaRegComment
                size={22}
                className="text-black cursor-pointer hover:text-black/50"
              />
            </div>
            <div>
              <IoShareOutline
                size={22}
                className="text-black cursor-pointer hover:text-black/50"
              />
            </div>
          </div>
          <div>
            <BsBookmark
              size={20}
              className="text-black cursor-pointer hover:text-black/50"
            />
          </div>
        </div>
        <div className="px-2">
          {likesCount ? `${likesCount} likes` : "Be the first to like"}
        </div>
        <div className="px-2">{caption}</div>
        <div className="p-2">
          <div className="flex flex-col space-y-1">
            {comments.map((commentData) => (
              <div key={commentData.id} className="flex space-x-2">
                <div className="font-medium">{commentData.username}</div>
                <div>{commentData.comment}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="px-2">3 hours ago</div>
        <div className="flex items-center px-2 py-4 mt-1 space-x-3 border-t border-gray-200">
          <div>
            <BsEmojiSmile className="text-xl" />
          </div>
          <form onSubmit={handlePostComment} className="flex w-full px-2">
            <div className="w-full">
              <input
                type="text"
                name={`comment ${id}`}
                id={`comment ${id}`}
                className="w-full bg-white outline-none"
                placeholder="Add a comment..."
                ref={comment}
              />
            </div>
            <div>
              <button className="text-sm font-semibold text-blue-600">
                Post
              </button>
            </div>
          </form>
        </div>
      </div>

      <ModalArticle
        visible={visible}
        onCloseModal={onCloseModal}
        onOpenModal={onOpenModal}
      >
        <p>
          Contrary to popular belief, Lorem Ipsum is not simply random text. It
          has roots in a piece of classical Latin literature from 45 BC, making
          it over 2000 years old. Richard McClintock, a Latin professor at
          Hampden-Sydney College in Virginia, looked up one of the more obscure
          Latin words, consectetur, from a Lorem Ipsum passage, and going
          through the cites of the word in classical literature, discovered the
          undoubtable source. Lorem Ipsum comes from sections 1.10.32 and
          1.10.33 of de Finibus Bonorum et Malorum (The Extremes of Good and
          Evil) by Cicero, written in 45 BC. This book is a treatise on the
          theory of ethics, very popular during the Renaissance. The first line
          of Lorem Ipsum, Lorem ipsum dolor sit amet.., comes from a line in
          section 1.10.32.
        </p>
        <p>
          Contrary to popular belief, Lorem Ipsum is not simply random text. It
          has roots in a piece of classical Latin literature from 45 BC, making
          it over 2000 years old. Richard McClintock, a Latin professor at
          Hampden-Sydney College in Virginia, looked up one of the more obscure
          Latin words, consectetur, from a Lorem Ipsum passage, and going
          through the cites of the word in classical literature, discovered the
          undoubtable source. Lorem Ipsum comes from sections 1.10.32 and
          1.10.33 of de Finibus Bonorum et Malorum (The Extremes of Good and
          Evil) by Cicero, written in 45 BC. This book is a treatise on the
          theory of ethics, very popular during the Renaissance. The first line
          of Lorem Ipsum, Lorem ipsum dolor sit amet.., comes from a line in
          section 1.10.32.
        </p>
      </ModalArticle>
    </>
  );
};

export default Post;
