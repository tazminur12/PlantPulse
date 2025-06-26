import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import Home from "../pages/Home";
// import AddPlant from "../pages/AddPlant";
import ErrorPage from "../pages/ErrorPage";
import Login from "../pages/Login";
import Register from "../pages/Register";
import AllPlants from "../pages/AllPlants";
import PlantDetails from "../pages/PlantDetails";
import UpdatePlant from "../pages/Dashboard/UpdatePlant";
import PrivateRoute from "./PrivateRoute";
import DashboardLayout from "../layouts/DashboardLayout";
import DashboardHome from "../pages/Dashboard/DashboardHome";
import AllItems from "../pages/Dashboard/AllItems";
import MyItems from "../pages/Dashboard/MyItems";
import AddItems from "../pages/Dashboard/AddItem"; // ✅ Add this
import Support from "../pages/Support";
import PlantCarePage from "../pages/PlantCarePage";
import RemindersPage from "../pages/RemindersPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Home /> },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
      { path: "all-plants", element: <AllPlants /> },
      { path: "support" , element: <Support></Support>},
      { path: "reminder",  element: <RemindersPage></RemindersPage>},
      { path: "plant-care" , element: <PrivateRoute><PlantCarePage></PlantCarePage></PrivateRoute>},
      { path: "plants/:id", element: <PrivateRoute><PlantDetails /></PrivateRoute> },
      
    ]
  },
  {
    path: "/dashboard",
    element: <PrivateRoute><DashboardLayout /></PrivateRoute>,
    children: [
      {
        index: true, // ✅ default: /dashboard
        element: <DashboardHome />
      },
      {
        path: "all", // /dashboard/all
        element: <AllItems />
      },
      {
        path: "my", // /dashboard/my
        element: <MyItems />
      },
      {
        path: "add", // /dashboard/add
        element: <AddItems />
      },
      { path: "update-plants/:id", element: <UpdatePlant /> } 
    ]
  }
]);

export default router;
