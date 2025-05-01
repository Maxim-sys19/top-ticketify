import React from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css'
import {ToastContainer} from 'react-toastify';
import './App.css';
import BaseNavBar from "./Components/NavBar/BaseNavBar";
import {routes} from "./routes/routes";
import { useAuthInit } from './hooks/useAuthInit';

function App() {
  useAuthInit()
  return (
    <Router>
      <ToastContainer />
      <BaseNavBar />
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
