import { Tooltip } from "@chakra-ui/react";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";

const Users = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const { setSelectedUser } = useContext(UserContext);
  useEffect(() => {
    try {
      fetch("https://jsonplaceholder.typicode.com/users")
        .then((response) => response.json())
        .then((data) => setUsers(data));
    } catch (error) {
      console.log(error);
    }
  }, []);
  return (
    <div className="flex items-center justify-center h-screen">
      <div>
        <h2 className="font-bold text-center text-[20px]">Users</h2>
        <ul className="flex flex-col gap-2 items-center">
          {users.map((user) => (
            <Tooltip
              label={`Name: ${user.name}, Email: ${user.email}`}
              key={user.id}
            >
              <li
                className="text-[18px] cursor-pointer"
                onClick={() => {
                  setSelectedUser(user);
                  navigate(`/user/${user.id}`);
                }}
              >
                {user.name}
              </li>
            </Tooltip>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Users;
