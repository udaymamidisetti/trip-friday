import React, { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { Avatar, Button, Textarea, useDisclosure } from "@chakra-ui/react";
import { MdDelete } from "react-icons/md";
import { TbEdit } from "react-icons/tb";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  AlertDialogCloseButton,
} from "@chakra-ui/react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
const UserDetails = () => {
  const { id } = useParams();
  const deleteModal = useDisclosure();
  const updateModal = useDisclosure();
  const cancelRef = React.useRef();
  const [userPosts, setUserPosts] = useState([]);
  const [userAlbums, setUserAlbums] = useState([]);
  const userDetails = useContext(UserContext);
  const [isPostsCollapsed, setIsPostsCollapsed] = useState(true);
  const [isAlbumsCollapsed, setIsAlbumsCollapsed] = useState(true);
  const [comments, setComments] = useState({});
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [newCommentText, setNewCommentText] = useState("");
  const [modalPostData, setModalPostData] = useState({
    title: "",
    body: "",
    id: null,
  });
  const [modalDelete, setModalDelete] = useState();
  const handleCreateComment = async (postId) => {
    const newComment = {
      postId: postId,
      id: comments[postId] ? comments[postId].length + 1 : 1, // Generate a unique ID for the new comment
      name: "John Doe", // Assuming user's name is John Doe
      email: "johndoe@example.com", // Assuming user's email is johndoe@example.com
      body: newCommentText,
    };
    setComments({
      ...comments,
      [postId]: comments[postId]
        ? [...comments[postId], newComment]
        : [newComment],
    });
    setNewCommentText("");

    // Post the new comment to the API (optional)
    await fetch("https://jsonplaceholder.typicode.com/comments", {
      method: "POST",
      body: JSON.stringify(newComment),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
      .then((response) => response.json())
      .then((data) => console.log("Successfully posted comment:", data))
      .catch((error) => console.error("Error posting comment:", error));
  };
  const handleDeletePost = (postId) => {
    fetch(`https://jsonplaceholder.typicode.com/posts/${postId}`, {
      method: "DELETE",
    })
      .then((response) => {
        console.log("Post deleted successfully:", postId);

        setUserPosts((prevPosts) =>
          prevPosts.filter((post) => post.id !== postId)
        );
        deleteModal.onClose();
      })
      .catch((error) => console.error("Error deleting post:", error));
  };
  const handleUpdatePost = async () => {
    try {
      const updatedPost = {
        // ...post, // Assuming `post` contains the ID of the post being updated
        title: modalPostData.title,
        body: modalPostData.body,
        id: modalPostData.id,
      };
      console.log(updatedPost);

      const response = await fetch(
        `https://jsonplaceholder.typicode.com/posts/${updatedPost.id}`,
        {
          method: "PUT",
          body: JSON.stringify(updatedPost),
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update post.");
      }

      console.log("Post updated successfully:", updatedPost);
      // Update the local state or perform any other actions upon successful update
      // For example, close the modal
      updateModal.onClose();
    } catch (error) {
      console.error("Error updating post:", error);
      // Handle error (e.g., display an error message)
    }
  };

  useEffect(() => {
    fetch(`https://jsonplaceholder.typicode.com/posts?userId=${id}`)
      .then((response) => response.json())
      .then((data) => {
        setUserPosts(data);
        console.log(data);
      })
      .catch((error) => console.error("Error fetching user posts:", error));

    fetch(`https://jsonplaceholder.typicode.com/albums?userId=${id}`)
      .then((response) => response.json())
      .then((data) => {
        setUserAlbums(data);
        console.log(data);
      })
      .catch((error) => console.error("Error fetching user albums:", error));
  }, [id]);

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-4">
        {userDetails ? userDetails.name : "Loading..."}
      </h2>
      {userDetails && (
        <>
          <section className="mb-6 m-auto flex flex-col items-center">
            <Avatar src="https://bit.ly/broken-link" size="2xl" />
            <h3 className="text-lg font-semibold mb-2">
              {userDetails.selectedUser.name}
            </h3>
            <p className="text-gray-600">
              Email: {userDetails.selectedUser.email}
            </p>
          </section>

          <section className="mb-6">
            <div className="flex items-center justify-between w-[400px] m-auto">
              <h3 className="text-lg font-semibold">User Posts</h3>
              <button
                className="text-blue-500 hover:underline focus:outline-none"
                onClick={() => setIsPostsCollapsed(!isPostsCollapsed)}
              >
                {isPostsCollapsed ? "All Posts" : "See Less"}
              </button>
            </div>
            {!isPostsCollapsed && (
              <>
                <input
                  placeholder="Search"
                  className="p-1 pl-2 border border-solid rounded-md focus:outline-none w-[400px] my-3 mx-auto block"
                />
                <ul className="flex flex-col items-center">
                  {userPosts.map((post) => (
                    <div className="flex gap-2">
                      <li key={post.id} className="mb-4 w-[400px]">
                        <h4 className="text-lg font-semibold">{post.title}</h4>
                        <p className="text-gray-600">{post.body}</p>

                        {comments[post.id] && (
                          <ul>
                            {comments[post.id].map((comment) => (
                              <li key={comment.id} className="mb-2">
                                <span className="font-semibold">
                                  {comment.name}:
                                </span>{" "}
                                {comment.body}
                              </li>
                            ))}
                          </ul>
                        )}
                        {selectedPostId === post.id ? (
                          <div className="mt-4">
                            <textarea
                              value={newCommentText}
                              onChange={(e) =>
                                setNewCommentText(e.target.value)
                              }
                              className="w-full border rounded py-2 px-3 focus:outline-none focus:ring focus:border-blue-300 mb-2"
                              rows="2"
                              placeholder="Add a comment..."
                            ></textarea>
                            <button
                              type="submit"
                              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-1 px-2 rounded text-[14px] my-2"
                              onClick={() => handleCreateComment(post.id)}
                            >
                              Post Comment
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setSelectedPostId(post.id)}
                            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-1 px-2 rounded text-[14px] my-2"
                          >
                            Add Comment
                          </button>
                        )}
                      </li>
                      <Modal
                        isOpen={updateModal.isOpen}
                        onClose={updateModal.onClose}
                      >
                        <ModalOverlay />
                        <ModalContent>
                          <ModalHeader>Update Post</ModalHeader>
                          <ModalCloseButton />
                          <ModalBody>
                            <Textarea
                              placeholder={"Enter Title"}
                              value={modalPostData.title}
                              onChange={(e) =>
                                setModalPostData({
                                  ...modalPostData,
                                  title: e.target.value,
                                })
                              }
                            ></Textarea>
                            <Textarea
                              placeholder={"Enter Body"}
                              onChange={(e) =>
                                setModalPostData({
                                  ...modalPostData,
                                  body: e.target.value,
                                })
                              }
                              value={modalPostData.body}
                            ></Textarea>
                          </ModalBody>
                          <ModalFooter>
                            <Button
                              colorScheme="blue"
                              mr={3}
                              onClick={updateModal.onClose}
                            >
                              No
                            </Button>
                            <Button
                              variant="ghost"
                              onClick={() => handleUpdatePost(post.id)}
                            >
                              Update
                            </Button>
                          </ModalFooter>
                        </ModalContent>
                      </Modal>
                      <div className="flex gap-1 self-start mt-2">
                        <MdDelete
                          size={20}
                          onClick={() => {
                            deleteModal.onOpen();
                            setModalDelete(post.id);
                          }}
                          className="cursor-pointer"
                        />
                        <TbEdit
                          size={20}
                          className="cursor-pointer"
                          onClick={() => {
                            setModalPostData({
                              title: post.title,
                              body: post.body,
                              id: post.id,
                            });
                            updateModal.onOpen();
                          }}
                        />
                      </div>
                      <AlertDialog
                        motionPreset="slideInBottom"
                        onClose={deleteModal.onClose}
                        isOpen={deleteModal.isOpen}
                        isCentered
                      >
                        <AlertDialogOverlay />

                        <AlertDialogContent>
                          <AlertDialogHeader>Delete Post?</AlertDialogHeader>
                          <AlertDialogCloseButton />
                          <AlertDialogBody>
                            Are you sure you want to delete the post?
                          </AlertDialogBody>
                          <AlertDialogFooter>
                            <Button
                              ref={cancelRef}
                              onClick={deleteModal.onClose}
                            >
                              No
                            </Button>
                            <Button
                              colorScheme="red"
                              ml={3}
                              onClick={() => handleDeletePost(modalDelete)}
                            >
                              Yes
                            </Button>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  ))}
                </ul>
              </>
            )}
          </section>

          <section>
            <div className="flex items-center justify-between w-[400px] m-auto">
              <h3 className="text-lg font-semibold">User Albums</h3>
              <button
                className="text-blue-500 hover:underline focus:outline-none"
                onClick={() => setIsAlbumsCollapsed(!isAlbumsCollapsed)}
              >
                {isAlbumsCollapsed ? "All Albums" : "See Less"}
              </button>
            </div>
            {!isAlbumsCollapsed && (
              <div className="w-[400px] m-auto mt-4">
                <ul>
                  {userAlbums.map((album) => (
                    <Link to={`/albums/${album.id}`} key={album.id}>
                      <li className="mb-4">
                        <h4 className="text-lg font-semibold">{album.title}</h4>
                      </li>
                    </Link>
                  ))}
                </ul>
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
};

export default UserDetails;
