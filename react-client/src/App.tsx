import React from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css'
import {ToastContainer} from 'react-toastify';
import './App.css';
import BaseNavBar from "./Components/NavBar/BaseNavBar";
import {routes} from "./routes/routes";
import {useAppSelector} from "./hooks/useApiHooks";
import {isAdmin} from "./helpers/isAdmin";

function App() {
  const {roles} = useAppSelector(state => state.profile.user)
  const adminPanel = roles && isAdmin(roles)
  return (
    <Router>
      <ToastContainer />
      <BaseNavBar isAdmin={adminPanel} />
      <Routes>
        {
          routes!.map((route, idx) => (
            <Route key={idx} element={route.element}>
              {route.children.map((child, idx) => (
                <Route key={idx} path={child.path} element={child.element}/>
              ))}
            </Route>
          ))
        }
      </Routes>
    </Router>
  );
}

export default App;
