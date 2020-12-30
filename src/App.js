import { BrowserRouter as Router, Route } from 'react-router-dom'
import 'semantic-ui-css/semantic.min.css'
import { Container } from 'semantic-ui-react'

import NaveBar from './components/NavBar.js'
import Home from './pages/Home.js'
import Register from './pages/Register.js'
import Login from './pages/Login.js'
import SinglePost from './pages/SinglePost.js'

import './App.css'

import { AuthProvider } from './context/auth.js';
import AuthRoute from './context/AuthRoute.js'

const App = () => {
    
    return (
        <AuthProvider>
            <Router>
                <Container>
                    <NaveBar />
                    <Route exact path='/' component={Home} />
                    <AuthRoute exact path='/register' component={Register} />
                    <AuthRoute exact path='/login' component={Login} />
                    <Route exact path='/posts/:postId' component={SinglePost} />
                </Container>
            </Router>
        </AuthProvider>
    )
}

export default App
