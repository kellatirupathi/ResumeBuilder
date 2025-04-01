// In src/App.jsx
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import Header from "./components/custom/Header";
import { Toaster } from "./components/ui/sonner";
import { useDispatch, useSelector } from "react-redux"; // Added useSelector import
import { useEffect } from "react";
import { addUserData } from "./features/user/userFeatures";
import { startUser } from "./Services/login";
import { resumeStore } from "./store/store";
import { Provider } from "react-redux";

function App() {
  const navigate = useNavigate();
  const location = useLocation(); // Get current location
  const user = useSelector((state) => state.editUser.userData);
  const dispatch = useDispatch();

  // Check if current path includes edit-resume
  const isEditResumePage = location.pathname.includes('/dashboard/edit-resume');

  useEffect(() => {
    const fetchResponse = async () => {
      try {
        const response = await startUser();
        if (response.statusCode == 200) {
          dispatch(addUserData(response.data));
        } else {
          dispatch(addUserData(""));
        }
      } catch (error) {
        console.log("Got Error while fetching user from app", error.message);
        dispatch(addUserData(""));
      }
    };
    fetchResponse();
  }, []);

  if (!user) {
    navigate("/");
  }

  return (
    <>
      <Provider store={resumeStore}>
        {!isEditResumePage && <Header user={user} />}
        <Outlet />
        <Toaster />
      </Provider>
    </>
  );
}

export default App;