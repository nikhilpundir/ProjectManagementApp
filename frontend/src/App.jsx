import React from 'react'
import { Routes, Route } from "react-router";
import LoginPage from './pages/LoginPage';
import RouteGuard from './navigation/RouteGaurd';
import BaseLayout from './layout/BaseLayout'
import WelcomePage from './pages/Welcome/WelcomePage';
import ProjectPage from './pages/Project/ProjectPage';
import TaskPage from './pages/Task/TaskPage';
import UserPage from './pages/User/UserPage';
import HomePage from './pages/HomePage';
import RolePage from './pages/Role/RolePage';


const App = () => {

  return (
    <Routes>
     
      <Route index element={<WelcomePage />} />
      <Route path="login" element={<LoginPage />} />
      <Route element={<RouteGuard allowedRoles={['ADMIN']} />}>
        <Route element={<BaseLayout userRole={"ADMIN"}/>}>
            <Route path="home" element={<HomePage role={"admin"}/>} />
            <Route path="projects" element={<ProjectPage />} />
            <Route path="tasks" element={<TaskPage />} />
            <Route path="users" element={<UserPage />} />
            <Route path="roles" element={<RolePage />} />
          <Route path="moderator">
          </Route>
        </Route>
      </Route>
    </Routes>
  )
}

export default App