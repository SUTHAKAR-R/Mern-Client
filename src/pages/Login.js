import React, { useState, useContext } from 'react'
import { Form, Button } from 'semantic-ui-react'
import { useMutation, gql } from "@apollo/client"

import { AuthContext } from '../context/auth.js'

export default function Login(props) {

    const context = useContext(AuthContext)

    const [errors, setErrors] = useState({})
    
    const [values, setValues] = useState({
        username: '',
        password: ''
    })
    
    const onChange = (event) => {
        
        setValues({
            ...values,
            [event.target.name]: event.target.value 
        })
    }
    
    const [loginUser, { loading }] = useMutation(LOGIN_USER_MUTATION, {
        
        update(_, { data: { login: userData } = {} }) {
            
            context.login(userData)
            props.history.push('/')
        },
        onError(error){
            setErrors(error.graphQLErrors[0].extensions.exception.errors)
        },
        variables: values
    })

    const onSubmit = (event) => {
        event.preventDefault()
        loginUser()
    }

    
    return (
        <div className="form-container">
            <Form onSubmit={onSubmit} className={ loading ? 'loading' : ''}>
                <h1>Wuddup cuz..Get this shit poppin'...</h1>
                
                <Form.Input 
                    label="Username"
                    placeholder="Enter a sick username"
                    type="text"
                    error={errors.username ? true: false}
                    name="username"
                    value={values.username}
                    onChange={onChange}
                />

                <Form.Input 
                    label="Password"
                    placeholder="Enter a valid password"
                    type="password"
                    error={errors.password ? true: false}
                    name="password"
                    value={values.password}
                    onChange={onChange}
                />

                <Button type="submit" primary>
                    Log My Ass In
                </Button>

            </Form>
            
            { Object.keys(errors).length > 0 && (
                <div className="ui error message">
                    <ul className="list">
                        { Object.values(errors).map(value => (
                            <li key={value}>{value}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    )
}

const LOGIN_USER_MUTATION = gql`

    mutation login(
        $username: String!
        $password: String!    
    ) 
    
    { 
        login(
            username: $username
            password: $password
        ) 
        
        {
            id
            username
            email
            date
            token
        }
    }


`