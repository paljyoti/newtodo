import React, { useEffect, useState } from "react";
import "./App.css";
import { FaTrash, FaCheck, FaTimes } from "react-icons/fa";
import { FiEdit } from "react-icons/fi";
import { BsSearch } from "react-icons/bs";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { AiOutlineLogout } from "react-icons/ai";

function App() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [todoData, setTodoData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [updateModel, setUpdateModel] = useState(false);
  const [updatetodoId, setUpdatetodoId] = useState("");
  const [keyword, setKeyword] = useState("");

  const checkAuth = async () => {
    try {
      const response = await axios({
        method: "get",
        url: "https://newtodobackend-production.up.railway.app/checkAuth",
        withCredentials: true,
      });

      console.log(response);
    } catch (error) {
      navigate("/login");
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    try {
      const response = await axios({
        method: "post",
        url: "https://newtodobackend-production.up.railway.app/api/createtodo",
        data: {
          title: title,
          description: description,
        },
        withCredentials: true,
      });

      if (response && response.status === 201) {
        toast.success(response.data.message);
        setShowModal(false);
        setLoading(false);
      }
    } catch (error) {
      toast.error(error.response.data.message);
      setShowModal(false);
      setLoading(false);
    }
  };

  const handleDelete = async (e, id) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios({
        method: "delete",
        url: `https://newtodobackend-production.up.railway.app/api/deleteTodo/${id}`,
        withCredentials: true,
      });

      if (response && response.status === 200) {
        toast.success(response.data.message);
        setLoading(false);
      }
    } catch (error) {
      toast.error(error.response.data.message);
      setLoading(false);
    }
  };

  const handleUpdate = async (e, id) => {
    try {
      const singleData = todoData.filter((curr) => {
        return curr._id === id;
      });

      if (singleData) {
        setTitle(singleData[0].title);
        setDescription(singleData[0].description);
        setUpdatetodoId(id);
        setUpdateModel(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getTodo = async () => {
    try {
      const response = await axios({
        method: "get",
        url: "https://newtodobackend-production.up.railway.app/api/getTodo",
        withCredentials: true,
      });

      if (response && response.status === 200) {
        setTodoData(response.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleFinalUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios({
        method: "put",
        url: `https://newtodobackend-production.up.railway.app/api/updateTodo?id=${updatetodoId}`,
        data: {
          title: title,
          description: description,
        },
        withCredentials: true,
      });

      if (response && response.status === 201) {
        toast.success(response.data.message);
        setLoading(false);
        setUpdateModel(false);
        setTitle("");
        setDescription("");
      }
    } catch (error) {
      toast.error(error.response.data.message);
      setLoading(false);
      setUpdateModel(false);
      setTitle("");
      setDescription("");
    }
  };

  const handleStatus = async (e, id, status) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios({
        method: "patch",
        url: `https://newtodobackend-production.up.railway.app/api/changestatus/${id}`,
        data: {
          status: status,
        },
        withCredentials: true,
      });

      if (response && response.status === 201) {
        toast.success(response.data.message);
        setLoading(false);
      }
    } catch (error) {
      toast.error(error.response.data.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("this is running");
    if (!keyword) {
      getTodo();
    } else {
      // If keyword is not empty, fetch todo data based on keyword
      axios({
        method: "get",
        url: `https://newtodobackend-production.up.railway.app/api/searchTodo?keyword=${keyword}`,
        withCredentials: true,
      })
        .then((res) => {
          console.log(res);
          setTodoData(res.data.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [loading, keyword]);

  const handleLogout = async (e) => {
    e.preventDefault()
    try {
      const response = await axios({
        method: "post",
        url: "https://newtodobackend-production.up.railway.app/api/logout",
        withCredentials: true,
      });

      if (response && response.status === 201) {
        toast.success(response.data.message);
        navigate("/login");
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  // };

  return (
    <div className="bg-green-50  ">
      <div className="max-w-4xl mx-auto sm:mt-8 p-4 bg-gray-100 rounded">
        <h2 className="mt-3 mb-6 text-2xl font-bold text-center uppercase">
          Personal TODO APP
        </h2>
        <div className="flex justify-end m-4">
          <button
            className=""
            onClick={(e) => {
              handleLogout(e);
            }}
          >
            <AiOutlineLogout size={25} />
          </button>
        </div>

        <div className="flex items-center mb-4">
          <button
            className="ml-4 p-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none w-full"
            onClick={() => {
              setShowModal(true);
            }}
          >
            Add To do
          </button>
        </div>
        {showModal ? (
          <>
            <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
              <div className="relative w-auto my-6 mx-auto max-w-3xl">
                {/*content*/}
                <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                  {/*header*/}
                  <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
                    <h3 className="text-3xl font-semibold">Add Your To do's</h3>
                    <button
                      className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                      onClick={() => setShowModal(false)}
                    >
                      <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                        ×
                      </span>
                    </button>
                  </div>
                  {/*body*/}
                  <div className="relative p-6 flex-auto">
                    <div className="max-w-lg">
                      <label className="block text-sm font-medium mb-2 dark:text-white">
                        Title
                      </label>
                      <input
                        type="text"
                        id="input-label"
                        className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                        placeholder="Title"
                        onChange={(e) => {
                          setTitle(e.target.value);
                        }}
                        value={title}
                      />
                    </div>
                    <div className="max-w-lg">
                      <label className="block text-sm font-medium mb-2 dark:text-white">
                        Description
                      </label>
                      <textarea
                        type="text"
                        id="input-label"
                        className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                        placeholder="Enter Description"
                        onChange={(e) => {
                          setDescription(e.target.value);
                        }}
                        value={description}
                      />
                    </div>
                  </div>
                  {/*footer*/}
                  <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
                    <button
                      className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                      type="button"
                      onClick={() => setShowModal(false)}
                    >
                      Close
                    </button>
                    <button
                      className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                      type="button"
                      onClick={(e) => {
                        handleSubmit(e);
                      }}
                    >
                      Submit
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
          </>
        ) : null}
        {updateModel ? (
          <>
            <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
              <div className="relative w-auto my-6 mx-auto max-w-3xl">
                {/*content*/}
                <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                  {/*header*/}
                  <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
                    <h3 className="text-3xl font-semibold">Add Your To do's</h3>
                    <button
                      className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                      onClick={() => setUpdateModel(false)}
                    >
                      <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                        ×
                      </span>
                    </button>
                  </div>
                  {/*body*/}
                  <div className="relative p-6 flex-auto">
                    <div className="max-w-lg">
                      <label className="block text-sm font-medium mb-2 dark:text-white">
                        Title
                      </label>
                      <input
                        type="text"
                        id="input-label"
                        className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                        placeholder="Title"
                        onChange={(e) => {
                          setTitle(e.target.value);
                        }}
                        value={title}
                      />
                    </div>
                    <div className="max-w-lg">
                      <label className="block text-sm font-medium mb-2 dark:text-white">
                        Description
                      </label>
                      <textarea
                        type="text"
                        id="input-label"
                        className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                        placeholder="Enter Description"
                        onChange={(e) => {
                          setDescription(e.target.value);
                        }}
                        value={description}
                      />
                    </div>
                  </div>
                  {/*footer*/}
                  <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
                    <button
                      className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                      type="button"
                      onClick={() => {
                        setUpdateModel(false);
                        setTitle("");
                        setDescription("");
                      }}
                    >
                      Close
                    </button>
                    <button
                      className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                      type="button"
                      onClick={(e) => {
                        handleFinalUpdate(e);
                      }}
                    >
                      Submit
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
          </>
        ) : null}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center mb-4">
            <input
              className="flex-grow p-2 border-b-2 border-gray-300 focus:outline-none focus:border-blue-500"
              type="text"
              placeholder="Search Todos"
              value={keyword}
              onChange={(e) => {
                setKeyword(e.target.value);
              }}
            />
            <button className="ml-4 p-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none">
              <BsSearch size={20} />
            </button>
          </div>
        </div>

        <ul>
          <li className="my-2 text-sm italic">All Your Notes Here...</li>
          {todoData &&
            todoData.map((todo, index) => (
              <React.Fragment key={todo._id}>
                <li className="flex flex-col sm:flex-row sm:items-center justify-between border-b-2 py-2 gap-4">
                  <div className="">
                    <span className="mr-4 text-gray-500">{index + 1}.</span>
                    <span
                      className={`mr-4 ${
                        todo.status ? "line-through text-gray-500" : ""
                      }`}
                    >
                      {todo.title}
                    </span>
                    <p
                      className={`mr-4 ${
                        todo.status ? "line-through text-gray-500" : ""
                      }`}
                    >
                      {todo.description}
                    </p>
                  </div>
                  <div className="space-x-3 ml-8">
                    <button
                      className="mr-2 text-sm bg-red-500 text-white sm:px-2 px-1 py-1 rounded"
                      onClick={(e) => {
                        handleDelete(e, todo._id);
                      }}
                    >
                      <FaTrash />
                    </button>

                    <button
                      className="text-sm bg-green-500 text-white sm:px-2 px-1 py-1 rounded"
                      onClick={(e) => {
                        handleUpdate(e, todo._id);
                      }}
                    >
                      <FiEdit />
                    </button>
                    {!todo.status ? (
                      <button
                        className="text-sm bg-green-500 text-white sm:px-2 px-1 py-1 rounded"
                        onClick={(e) => {
                          handleStatus(e, todo._id, true);
                        }}
                      >
                        <FaCheck />
                      </button>
                    ) : (
                      <button
                        className="text-sm bg-yellow-500 text-white sm:px-2 px-1 py-1 rounded"
                        onClick={(e) => {
                          handleStatus(e, todo._id, false);
                        }}
                      >
                        <FaTimes />
                      </button>
                    )}
                  </div>
                </li>
              </React.Fragment>
            ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
