import React, { useState } from 'react'
import { useMutation, gql } from '@apollo/client'
import { Button, Icon, Confirm, Popup } from 'semantic-ui-react'

import { FETCH_POSTS_QUERY } from '../pages/Home.js'

export default function DeleteButton({ postId, commentId, callback }) {

    const [confirm, setConfirm] = useState(false)
    
    const mutation = commentId ? DELETE_COMMENT_MUTATION : DELETE_POST_MUTATION
    
    const [deletePostOrComment] = useMutation(mutation, {

        update(proxy) {
            
            setConfirm(false)

            if (!commentId) {

                let data = proxy.readQuery({ query: FETCH_POSTS_QUERY })
                
                data = { getPosts: data.getPosts.filter(p => p.id !== postId) }
                
                proxy.writeQuery({
                    query: FETCH_POSTS_QUERY,
                    data
                })
    
                if (callback) callback()
                
            }

        },
        variables: { postId, commentId }
    })
    
    return (        
        <>
            <Popup 
                content={commentId ? 'Delete Comment' : 'Delete Post'}
                inverted
                trigger={
                    <Button as='div' color='red' floated='right' onClick={() => setConfirm(true)}>
                        <Icon name='trash' style={{ margin: 0}} />
                    </Button>
                }
            />

            <Confirm
                open={confirm}
                onCancel={() => setConfirm(false)}
                onConfirm={deletePostOrComment}
            />
        </>
    )
}


const DELETE_POST_MUTATION = gql`

        mutation deletePost($postId: String!) 
        {
            deletePost(postId: $postId) 
        }


`

const DELETE_COMMENT_MUTATION = gql`

            mutation deleteComment($postId: String!, $commentId: String!) {
                deleteComment(postId: $postId, commentId: $commentId) 
                {
                    id
                    comments {
                        id
                        username
                        body
                        date
                    }
                    commentCount
                }
            }


`