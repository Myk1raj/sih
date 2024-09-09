import React from 'react'
import {  Routes, Route, useLocation } from 'react-router-dom';
import Main from '../Components/Main/Main';
const AppContent = () => {

  return (
    <div>
    <Routes>
      {/* <Route path='/' element={<Shop />} /> */}
      <Route path='/' element={<Main />} />

    </Routes>
    
  </div>
  )
}

export default AppContent
