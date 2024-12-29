import './App.css'
import React from 'react'
import { Routes, Route } from 'react-router-dom'
import ContractPage from './components/ContractPage'
import { Image, Header, Container, Menu } from 'semantic-ui-react'
import Home from './components/Home'
import NotFound from './components/NotFound'

import {
  useNavigate,
} from 'react-router-dom'

function App() {
  let navigate = useNavigate()
  const style = {
    imgTop: {
      marginTop: '.5em',
    },
    h2: {
      margin: '4em 0em 2em',
    },
    h3: {
      marginTop: '1em',
      padding: '1em 0em',
    },
    last: {
      marginBottom: '300px',
    },
  }
  return (
    <div>
    <Image size='large' src="./IITP-Long-Logo.png"  style={style.imgTop} centered />
    <Header as='h3' textAlign='center' style={style.h3} content='Blockchain for Food Traceability and Safety' />
    <Container>
      <Menu secondary>
        <Menu.Item
          name='home'
          active='true'
          onClick={() => navigate('/')}
        />
      </Menu>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/contracts/:address' element={<ContractPage />} />
        <Route
          path='*'
          element={<NotFound />}
        />
      </Routes>
    </Container>
    </div>
  )
}

export default App
