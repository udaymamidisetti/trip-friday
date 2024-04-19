import logo from "./logo.svg";
import "./App.css";
import Users from "./components/Users";
import { Route, Routes } from "react-router-dom";
import UserDetails from "./components/UserDetails";
import ShowAlbums from "./components/ShowAlbums";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Users />} />
      <Route path="/user/:id" element={<UserDetails />} />
      <Route path="/albums/:id" element={<ShowAlbums />} />
    </Routes>
  );
}

export default App;
