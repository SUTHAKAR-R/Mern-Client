import React, { useState } from 'react'
import { Button, Form } from 'semantic-ui-react'
import { useMutation, gql } from "@apollo/client"

import { FETCH_POSTS_QUERY } from '../pages/Home.js'

const PostForm = (props) => {

    const [values, setValues] = useState({
        body: ''
    })
    
    const onChange = (event) => {
        setValues({
            [event.target.name]: event.target.value 
        })
    } 

    const [createPost, {error}] = useMutation(CREATE_POST_MUTATION, {
        
        update(proxy, result) { //to update the proxy manually after the mutation occurs
            
            var data = proxy.readQuery({
                
                query : FETCH_POSTS_QUERY
            })


            data = { getPosts: [result.data.createPost, ...data.getPosts] }
            
            proxy.writeQuery({
                query: FETCH_POSTS_QUERY,
                data
            })
            
            values.body = ''
        },    
        
        variables: values // values = object
    })

    const onSubmit = (event) => {
        event.preventDefault()
        createPost()
    } 
    
    return (
        <>
            <Form onSubmit={onSubmit}>
                <h2>Create New Post</h2>
                <Form.Field>
                    <Form.Input 
                        placeholder='Type your content here'
                        name='body'
                        onChange={onChange}
                        value={values.body}
                        error={error ? true : false}
                    />
                    <Button type='submit' color='teal'>
                        Post
                    </Button>
                </Form.Field>
            </Form>
            { error && (
                <div className='ui error message'>
                    <ul className='list'>
                        <li>{error.graphQLErrors[0].message}</li>
                    </ul>
                </div>
            )}
        </>
    )
}

const CREATE_POST_MUTATION = gql`

        mutation createPost( $body: String! ) {
            
            createPost(body:$body) {
                id
                username
                body
                date
                likes {
                    id
                    username
                    date
                }
                comments {
                    id
                    username
                    body
                    date
                }
                likeCount
                commentCount
            }
        }


`

export default PostForm