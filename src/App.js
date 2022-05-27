import {BrowserRouter, Route, Routes} from 'react-router-dom'

import './App.css';
import Simplex_method from './components/Simplex_method';

function App() {
  return(
    <BrowserRouter>
      <Routes>
        <Route path='/' element={ <Simplex_method/> }/>
      </Routes>
      

    </BrowserRouter>

  )
}

export default App;
