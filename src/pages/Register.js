import React, { useState, useContext } from 'react'
import { Form, Button } from 'semantic-ui-react'
import { useMutation, gql } from "@apollo/client";

import { AuthContext } from '../context/auth.js'

export default function Register(props) {

    const context = useContext(AuthContext)

    const [errors, setErrors] = useState({})
    
    const [values, setValues] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    })
    
    const onChange = (event) => {
        
        setValues({
            ...values,
            [event.target.name]: event.target.value 
        })
    }
    
    const [addUser, { loading }] = useMutation(REGISTER_USER_MUTATION, {
        
        update(_, { data: {register: userData} = {} }) {
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
        addUser()

    }

    
    return (
        <div className="form-container">
            <Form onSubmit={onSubmit} className={ loading ? 'loading' : ''}>
                <h1>Sign Up..Its Lit..</h1>
                
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
                    label="Email"
                    placeholder="Enter a valid email id"
                    type="email"
                    error={errors.email ? true: false}
                    name="email"
                    value={values.email}
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

                <Form.Input 
                    label="Confirm Password"
                    placeholder="Enter your password again"
                    type="password"
                    error={errors.confirmPassword ? true: false}
                    name="confirmPassword"
                    value={values.confirmPassword}
                    onChange={onChange}
                />

                <Button type="submit" primary>
                    Sign My Ass Up
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

const REGISTER_USER_MUTATION = gql`

    mutation register(
        $username: String!
        $email: String!
        $password: String!
        $confirmPassword: String!
    
    ) {
        register(registerInput:{
            username: $username
            email: $email
            password: $password
            confirmPassword: $confirmPassword
        }) {
            id
            username
            email
            date
            token
        }
    }


`