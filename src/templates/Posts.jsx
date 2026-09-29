import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Loading from '../utilities/Loading'
import { restBase } from '../utilities/Utilities'
import FeaturedImage from '../utilities/FeaturedImage'

const Posts = () => {
    const restPath = restBase + ''
    const [restData, setData] = useState([])
    const [isLoaded, setLoadStatus] = useState(false)

    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch(restPath)
            if ( response.ok ) {
                const data = await response.json()
                setData(data)
                setLoadStatus(true)
            } else {
                setLoadStatus(false)
            }
        }
        fetchData()
    }, [restPath])
    
    return (
        <>
        { isLoaded ?
            <>
                <title>Blog | Mindset Headless</title>
                <h1>Blog</h1>
                {restData.map(post => 
                    <article key={post.id} id={`post-${post.id}`}>
                        {post.featured_media !== 0 && post._embedded &&
                            <FeaturedImage featuredImageObject={post._embedded['wp:featuredmedia'][0]} />
                        }
                        <Link to={`/blog/${post.slug}`}><h2>{post.title.rendered}</h2></Link>
                        <div className="entry-content" dangerouslySetInnerHTML={{__html:post.excerpt.rendered}}></div>
                    </article>
                )}
            </>
        : 
            <Loading />
        }
        </>
    )
}

export default Posts
