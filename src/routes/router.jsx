import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import Home from "../pages/Home";
import AddPlant from "../pages/AddPlant";
import ErrorPage from "../pages/ErrorPage";
import Login from "../pages/Login";
import Register from "../pages/Register";
import AllPlants from "../pages/AllPlants";
import PlantDetails from "../pages/PlantDetails";
import UpdatePlant from "../pages/UpdatePlant"; // <-- This is probably what you meant
import PrivateRoute from "./PrivateRoute";
import MyPlants from "../pages/MyPlants";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <ErrorPage />, // Better error handling
    children: [
      { index: true, element: <Home /> },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
      { path: "all-plants", element: <AllPlants /> },
      { path: "add-plant", element: <PrivateRoute><AddPlant /></PrivateRoute> },
      { path: "my-plants", element: <PrivateRoute><MyPlants /></PrivateRoute> },
      { path: "plants/:id", element: <PrivateRoute><PlantDetails /></PrivateRoute> },
      { path: "/update-plant/:id", element: <PrivateRoute><UpdatePlant /></PrivateRoute> }
    ]
  }
]);

export default router;
