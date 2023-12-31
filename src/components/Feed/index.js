import axios from "axios";
import { useContext, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import {
  GlobalContext,
  GlobalDispatchContext,
} from "../../state/context/GlobalContext";
import Header from "../Header";
import Modal from "../Modal";
import Post from "../Post";
import { db, auth } from "../../lib/firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { uuidv4 } from "@firebase/util";
import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import Friend from "../Friend";
import ModalArticle from "../ModalArticle";
import { handlePromise } from "../../utils/handlePromise";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";

const Feed = () => {
  const { isUploadPostModalOpen } = useContext(GlobalContext);
  const dispatch = useContext(GlobalDispatchContext);

  const closeModal = () => {
    dispatch({
      type: "SET_IS_UPLOAD_POST_MODAL_OPEN",
      payload: {
        isUploadPostModalOpen: false,
      },
    });
  };

  const [file, setFile] = useState("");

  const [media, setMedia] = useState({
    src: "",
    isUploading: false,
    caption: "",
  });

  useEffect(() => {
    const reader = new FileReader();

    const handleEvent = (e) => {
      switch (e.type) {
        case "load":
          return setMedia((prev) => ({
            ...prev,
            src: reader.result,
          }));
        case "error":
          console.log(e);
          return toast.error("something not working");
        default:
          return;
      }
    };

    if (file) {
      reader.addEventListener("load", handleEvent);
      reader.addEventListener("error", handleEvent);
      reader.readAsDataURL(file);
    }

    return () => {
      reader.removeEventListener("load", handleEvent);
      reader.removeEventListener("error", handleEvent);
    };
  }, [file]);

  const currentImage = useRef(null);

  const { user } = useContext(GlobalContext);

  const handlePostMedia = async (url) => {
    const postId = uuidv4();
    const post = {
      id: postId,
      image: url,
      userUrl: user.url,
      caption: media.caption,
      username: user.username,
      createdAt: new Date().toISOString(),
    };
    try {
      await axios.put("/api/posts/", post);
      handleRemovePost();
      closeModal();
      getPosts();
    } catch (error) {
      console.error(error);
      toast.error("error posting the image");
    }
  };

  const handleUploadFile = async (e) => {
    const file = e.target.files[0];
    setFile(file);
  };

  const handleUploadPost = async () => {
    try {
      const token = `eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJjbGllbnRJZCI6IjA1NTBjZjMyLTlkMzYtNGUxNy05NTJjLThkYTk4ZDllYmU1OCIsImZhbWlseVRva2VuIjoiMzA1YTk1YzQtY2VlNi00MDEwLTlkNTQtYjdhNWM2NDczM2IzIiwiaWF0IjoxNjk2NTc4ODQwLCJleHAiOjE3MjgxMzY0NDB9.WkvnEf6YkKE_3F2vMGPgfUE6z2BUwUkcRwDUxwV_uELVUN3oYeQOzHVfMqDJ-HXEQ047m-3egax4FNGW_a3S5mUUkYVNcb8dM1jamYDR7bVW1xrrfc_5symeaRQsRULyZfrqs2QZRF_-4vaHprcFohm8yg_BQFQOLu1tYtU8sZlsDKAcXQVd8Qoi0kvC1sV_ZB4fGzdGrdyNqc135XpgS66foBptNM2BInT7MlDwpjyvcrEQKtenO3my2s80lZ4VCdRHKhMcjCuebXBbzAYw42qKPnBp_FcBIuUqLmCGbrN_F3WiqeWJPcGo3QML9KJztZPe3g7PoRy3UQuc614wxg`;
      const formData = new FormData();
      formData.append("file", file);
      const { data } = await axios.post(
        "https://bestone-api-dev.approach.vn/file",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (data) {
        await handlePostMedia(data.url);
        toast.success("image has uploaded");
      }
    } catch (error) {
      toast.error("failed to upload the image");
    } finally {
    }
  };

  const handleRemovePost = () => {
    setFile("");
    currentImage.current.src = "";
  };

  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const postsCollection = collection(db, "users");
    const q = query(postsCollection, orderBy("createdAt", "desc"));
    onSnapshot(q, (snapshot) => {
      const users = snapshot.docs.map((doc) => doc.data());
      console.log(users);
      setUsers(users);
      setLoading(false);
    });
  }, []);

  const getPosts = async () => {
    setLoading(true);
    const { data } = await axios.get("/api/posts");
    setLoading(false);
    if (data) {
      setPosts(data);
    }
  };

  useEffect(() => {
    getPosts();
  }, []);

  return (
    <div className="w-full h-full bg-[#FAFAFA]">
      <Header />
      <Modal closeModal={closeModal} isOpen={isUploadPostModalOpen}>
        <div className="w-screen h-screen max-w-3xl max-h-[90vh] flex flex-col items-center">
          <div className="w-full py-4 text-xl font-light text-center border-b border-black">
            Create new post
          </div>
          <div className="flex items-center justify-center w-full h-full">
            {!file ? (
              <>
                <label
                  htmlFor="post"
                  className="bg-[#0095F6] py-2 px-4 text-white active:scale-95 transform transition  disabled:bg-opacity-50 select-none cursor-pointer disabled:scale-100 rounded text-sm font-semibold"
                >
                  Select from computer
                </label>

                <input
                  onChange={handleUploadFile}
                  value={file.name}
                  type="file"
                  name="post"
                  id="post"
                  className="hidden"
                  multiple={false}
                  accept="image/jpeg,image/png"
                />
              </>
            ) : (
              <div className="flex flex-col p-5 gap-y-4">
                <input
                  type="image"
                  src={media.src}
                  className="w-80 h-80"
                  ref={currentImage}
                />
                <input
                  type="text"
                  name="caption"
                  id="caption"
                  placeholder="Type your caption (optional...)"
                  onChange={(e) =>
                    setMedia((prev) => ({ ...prev, caption: e.target.value }))
                  }
                  value={media.caption}
                  className="w-full px-2 py-4 bg-gray-100 border rounded outline-none hover:bg-transparent focus:bg-transparent focus:border-gray-400"
                />
                <div className="flex items-center justify-center w-full gap-x-6">
                  <button
                    className="bg-[#0095F6] py-2 px-4 text-white active:scale-95 transform transition  disabled:bg-opacity-50 select-none cursor-pointer disabled:scale-100 rounded text-xl font-semibold"
                    onClick={handleRemovePost}
                  >
                    Remove
                  </button>
                  <button
                    className="bg-[#0095F6] py-2 px-4 text-white active:scale-95 transform transition  disabled:bg-opacity-50 select-none cursor-pointer disabled:scale-100 rounded text-xl font-semibold"
                    onClick={handleUploadPost}
                  >
                    Upload
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </Modal>

      <div className="grid w-full mx-auto mt-20 bg-white">
        <div className="flex flex-col w-full col-span-2 space-y-5 border-t-2 border-pink-500">
          <section className="col-span-4 w-screen flex items-center">
            <ul className="w-full flex items-start space-x-3 overflow-x-scroll stories bg-white p-4 rounded">
              <li className="flex flex-none flex-col items-center space-y-1">
                <div className="bg-gradient-to-tr from-yellow-400 to-fuchsia-600 p-1 rounded-full">
                  <a
                    href="#"
                    className="block bg-white p-1 rounded-full relative"
                  >
                    <img
                      src="https://images.unsplash.com/photo-1579105728744-9d6b14a45389?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=683&q=80"
                      alt="Omid Armin"
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="absolute bottom-0 right-1 border border-white border-2 rounded-full"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M8.125 16C12.4742 16 16 12.4742 16 8.125C16 3.77576 12.4742 0.25 8.125 0.25C3.77576 0.25 0.25 3.77576 0.25 8.125C0.25 12.4742 3.77576 16 8.125 16Z"
                        fill="#0074cc"
                      />
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M8.61719 4.67969C8.61719 4.40786 8.39683 4.1875 8.125 4.1875C7.85317 4.1875 7.63281 4.40786 7.63281 4.67969V7.63281H4.67969C4.40786 7.63281 4.1875 7.85317 4.1875 8.125C4.1875 8.39683 4.40786 8.61719 4.67969 8.61719H7.63281V11.5703C7.63281 11.8421 7.85317 12.0625 8.125 12.0625C8.39683 12.0625 8.61719 11.8421 8.61719 11.5703V8.61719H11.5703C11.8421 8.61719 12.0625 8.39683 12.0625 8.125C12.0625 7.85317 11.8421 7.63281 11.5703 7.63281H8.61719V4.67969Z"
                        fill="#FFFFFF"
                      />
                    </svg>
                  </a>
                </div>
                <a href="#" className="text-xs text-slate-800 font-semibold">
                  Your story
                </a>
              </li>
              {users.map((user) => {
                return (
                  <li
                    className="flex flex-none flex-col items-center space-y-1"
                    key={user.id}
                  >
                    <div
                      className={`${
                        user.isUpdate
                          ? "bg-gradient-to-tr from-yellow-400 to-fuchsia-600"
                          : "border border-gray-300 bg-white border-1"
                      } p-1 rounded-full`}
                    >
                      <a
                        href="#"
                        className="block bg-white p-1 rounded-full relative"
                      >
                        <img
                          src={user.url}
                          alt={user.fullName}
                          className="w-16 h-16 rounded-full object-cover"
                        />
                      </a>
                    </div>
                    <a href="#" className="text-xs text-slate-800">
                      {user.username}
                    </a>
                  </li>
                );
              })}
            </ul>
          </section>

          <ModalArticle>
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
          </ModalArticle>

          <div className="grid grid-cols-4 gap-4 w-full w-[1200px] mx-auto">
            <div className="col-span-3 ">
              {posts.map((post) => (
                <Post key={post.id} {...post} />
              ))}
            </div>
            <div>
              <div className="mb-4">
                <span>Friends</span>
              </div>
              {users.map((item) => {
                return (
                  <Friend key={item.id} img={item.url} name={item.fullName} />
                );
              })}
            </div>
          </div>

          {/* posts section */}
          {/* <section
            className="grid grid-cols-4 gap-4 bg-red-500"
            style={{
              height: 500,
            }}
          >
            <div>

            {posts.map((post) => (
              <Post key={post.id} {...post} />
            ))}
            </div>
          </section>{" "} */}
        </div>

        {/* this is our sidebar */}
        {/* <div className="fixed right-[15%] max-w-sm">
          <div className="flex">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptates,
            optio? Eius quia quis iste ipsa in impedit eligendi voluptatibus
            tenetur praesentium iure! Soluta nemo doloremque quod est quisquam
            explicabo placeat, amet deleniti ex saepe, officiis quaerat
            asperiores aliquid molestias rem iure perspiciatis quam! Quidem quo
            laudantium cumque, dolore mollitia illo ullam. Perspiciatis cumque
            in, recusandae reprehenderit asperiores, optio explicabo a adipisci
            fuga ad facilis ipsum, ullam dicta ipsa dignissimos placeat
            deleniti. Mollitia aliquid dolor odit, ullam laboriosam corrupti et.
            Id atque dolor repellendus porro, laboriosam rem odio ex quaerat
            unde tenetur consectetur vero! Veniam sequi et a illo consectetur
            repellat.
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default Feed;
