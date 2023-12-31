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
import { getAvatar } from "./data";
import axios from "axios";

const Post = ({
  id,
  username,
  image,
  caption,
  likesCount,
  desc,
  images,
  userUrl,
}) => {
  const [visible, setVisible] = useState(false);
  const [comments, setComments] = useState([]);
  const [isLiked, setIsLiked] = useState(false);

  const onCloseModal = () => {
    setVisible(false);
  };

  function onOpenModal() {
    setVisible(true);
  }

  function onLikePost() {
    setIsLiked((state) => !state);
  }

  const getComments = async () => {
    const { data } = await axios.get(`/api/${id}/comments`);
    if (data) {
      setComments(data);
    }
  };

  useEffect(() => {
    if (id) {
      getComments();
    }
  }, [id]);

  const comment = useRef(null);

  const { user } = useContext(GlobalContext);

  const handlePostComment = async (e) => {
    e.preventDefault();
    // comment functionality
    const commentData = {
      id: uuidv4(),
      userUrl: user.url,
      username: user.username,
      comment: comment.current.value,
      createdAt: new Date().toISOString(),
    };
    await axios.post(`api/${id}/comments`, commentData);
    getComments();
  };

  console;

  return (
    <>
      <div className="flex flex-col w-full border border-gray-200">
        <div className="flex items-center justify-between w-full p-2 ">
          <div className="flex items-center justify-center space-x-2">
            <Image
              alt=""
              width={40}
              height={40}
              src={userUrl ?? getAvatar()}
              className="bg-black border-2 rounded-full"
            />
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
            <div onClick={onLikePost}>
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
                <Image
                  alt=""
                  src={commentData.userUrl}
                  width={16}
                  height={16}
                />
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
        <div>
          <div className="grid grid-rows-2 grid-flow-col gap-4">
            {Array.isArray(images) &&
              images.map((item) => {
                return (
                  <div key={item}>
                    <img src={item} alt={caption} className="object-cover" />
                  </div>
                );
              })}
          </div>
          <p className="mt-2">{desc}</p>
        </div>
      </ModalArticle>
    </>
  );
};

export default Post;
