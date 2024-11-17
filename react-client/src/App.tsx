import React from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css'
import {ToastContainer} from 'react-toastify';
import './App.css';
import BaseNavBar from "./Components/NavBar/BaseNavBar";
import {IRoute, routes, RoutesTypes} from "./routes/routes";

function App() {
  return (
    <Router>
      <ToastContainer />
      <BaseNavBar />
      <Routes>
        {
          routes!.map((route: RoutesTypes, idx): any => (
            <Route key={idx} element={route.element}>
              {route.children.map((child: IRoute, idx): any => (
                <Route key={idx} path={child.path} element={child.element} />
              ))}
            </Route>))
        }
      </Routes>
    </Router>
  );
}

export default App;
