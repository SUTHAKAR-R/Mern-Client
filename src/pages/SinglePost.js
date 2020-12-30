import React, { useContext, useState, useRef } from 'react'
import { gql, useMutation, useQuery } from '@apollo/client'
import { Card, Grid, Button, Label, Icon, Image, Form, Popup } from 'semantic-ui-react';
import moment from 'moment'

import { AuthContext } from '../context/auth.js'
import LikeButton from '../components/LikeSwitch.js';
import DeleteButton from '../components/DeleteButton.js'

export default function SinglePost(props) {

    const postId = props.match.params.postId

    const { user } = useContext(AuthContext)

    const commentInputRef = useRef(null)

    const [comment, setComment] = useState('')

    const { loading, data: { getPost } = {} } = useQuery(GET_POST_QUERY, {
        variables: { postId }
    })

    const [createComment] = useMutation(CREATE_COMMENT_MUTATION, {

        update() {
            setComment('')
            commentInputRef.current.blur()
        },
        variables: {postId, body: comment}
    })
    const deletePostCallback = () => {

        props.history.push('/')
    }

    let postMarkup;

    if (loading) {
        postMarkup = <p>Loading Post...</p>
    } else {
        const { id, username, body, date, likes, comments, likeCount, commentCount} = getPost

        postMarkup = (
            <Grid>
                <Grid.Row>
                    <Grid.Column width={2}>
                        <Image
                            src='https://react.semantic-ui.com/images/avatar/large/molly.png'
                            size='small'
                            float='right'
                        />
                    </Grid.Column>
                    <Grid.Column width={10}>
                        <Card fluid>
                            <Card.Content>
                                <Card.Header>{username}</Card.Header>
                                <Card.Meta>{moment(date).fromNow(true)}</Card.Meta>
                                <Card.Description>{body}</Card.Description>
                            </Card.Content>
                            <hr />  
                            <Card.Content>
                                <LikeButton user={user} post={{ id, likes, likeCount }}/>
                                
                                <Popup 
                                    content='Comment on post'
                                    inverted
                                    trigger={
                                        <Button  labelPosition='right' as='div' onClick={() => console.log('commented')}>
                                        <Button color='blue' basic>
                                            <Icon name='comments' />
                                        </Button>
                                        <Label basic color='blue' pointing='left'>
                                            {commentCount}
                                        </Label>
                                    </Button>
                                    }
                                />

                                { user && user.username === username && <DeleteButton postId={id} callback={deletePostCallback} />}
                            </Card.Content>
                        </Card>
                        
                        {/* Create Post Section */}
                        {user && (
                            <Card fluid>
                                <Card.Content>
                                    <p>Post a comment</p>
                                    <Form>
                                        <div className='ui action input fluid'>
                                            <input 
                                                type='text'
                                                placeholder='share your thots'
                                                name='comment'
                                                value={comment}
                                                onChange={e => setComment(e.target.value)}
                                                ref={commentInputRef}
                                            />
                                            <button 
                                                type='submit' 
                                                className='ui button teal'
                                                disabled={comment.trim() === ''}
                                                onClick={createComment}>
                                                Comment
                                            </button>
                                        </div>
                                    </Form>
                                </Card.Content>
                            </Card>
                        )}

                        {/* Comments */}
                        {comments.map(comment => (
                            <Card fluid key={comment.id}>
                                <Card.Content>
                                    {user && user.username === comment.username && (
                                        <DeleteButton postId={id} commentId={comment.id} />
                                    )}
                                    <Card.Header>{comment.username}</Card.Header>
                                    <Card.Meta>{moment(comment.date).fromNow(true)}</Card.Meta>
                                    <Card.Description>{comment.body}</Card.Description>
                                </Card.Content>
                            </Card>
                        ))}

                    </Grid.Column>
                </Grid.Row>
            </Grid>
        )
    }

    return postMarkup
}


const GET_POST_QUERY = gql`

    query getPost($postId: String!) {
    
    getPost(postId: $postId) {
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

const CREATE_COMMENT_MUTATION = gql`

        mutation createComment($postId: String!, $body: String!) {
            createComment(postId: $postId, body: $body) {
                id  
                body
                comments{
                    id
                    username
                    body
                    date
                }
                commentCount
            }
        }

`