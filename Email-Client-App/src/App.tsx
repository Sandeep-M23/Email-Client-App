import { useState } from 'react'
import classes from './App.module.css';
import Card from './components/Card/Card';

function App() {
  return (
    <div className={classes.app}>
      <Card/>
      <Card/>
      <Card/>
    </div>
  )
}

export default App
