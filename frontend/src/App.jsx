import { useState } from 'react'

import './App.css'

import { Outlet } from 'react-router-dom'
import Header from './components/utils/Header'
import Footer from './components/utils/Footer'


function App() {

  return (
   <>
   <Header />
    <main>
      <Outlet />
    </main>
    <div  className=''><Footer /></div>
   </>
)
}

export default App
