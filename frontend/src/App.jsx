import React from 'react'
import { Routes, Route } from "react-router";
import Login from './pages/Login';
import HomePage from './pages/HomePage';
import RouteGuard from './navigation/RouteGaurd';
import BaseLayout from './layout/BaseLayout'
const App = () => {
  return (
    <Routes>
      <Route element={<BaseLayout />}>
      <Route index element={<HomePage />} />
      <Route path="login" element={<Login />} />
        <RouteGuard allowedRoles={['admin']}>
          <Route path="admin" >
            <Route index element={<HomePage />} />
          </Route>
        </RouteGuard>
        <RouteGuard allowedRoles={['user']}>

          <Route index element={<HomePage />} />

        </RouteGuard>

      </Route>

    </Routes>
  )
}

export default App