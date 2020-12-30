import React, { useContext } from 'react'
import { useQuery, gql } from '@apollo/client'
import { Grid, Transition } from 'semantic-ui-react'

import PostCard from '../components/PostCard.js'
import PostForm from '../components/PostForm.js'
import { AuthContext } from '../context/auth.js'

const Home = () => {

    const { user } = useContext(AuthContext)

    const { loading, data: { getPosts: posts } = {} } = useQuery(FETCH_POSTS_QUERY)

    return (
        
        <Grid columns={3}>
            <Grid.Row className="page-title">
                <h1>Recent Posts</h1>
            </Grid.Row>
            <Grid.Row>
                {
                    user && (
                        <Grid.Column>
                            <PostForm />
                        </Grid.Column>
                    )
                }
                { loading ? (
                    <h1> Loading Recent Posts</h1>
                ) : (
                        <Transition.Group>
                            {
                                posts && posts.map(post => (
                                    <Grid.Column key={post.id} style={{marginBottom:20}}>
                                        <PostCard post={post}/ >
                                    </Grid.Column>
                                    )
                                )
                            }
                        </Transition.Group>
                    )
                }
            </Grid.Row>
        </Grid>
    )
}

export const FETCH_POSTS_QUERY = gql`

        {
            getPosts {
                id
                username
                body
                date
                likes{
                    id
                    username
                    date
                }
                comments{
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

export default Home