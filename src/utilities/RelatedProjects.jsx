import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Loading from './Loading'
import { restBase } from './Utilities'
import FeaturedImage from './FeaturedImage'

const RelatedProjects = ( {ids} ) => {
    const restPath = restBase + `fwd-work?include=${ids}&_embed`
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
            <section id="related-projects" className="related-projects">
                <h2>Related Projects</h2>
                {restData.map(post => 
                    <article key={post.id} id={`post-${post.id}`}>
                        {post.featured_media !== 0 && post._embedded &&
                            <FeaturedImage featuredImageObject={post._embedded['wp:featuredmedia'][0]} />
                        }
                        <h3>{post.title.rendered}</h3>
                    </article>
                )}
                <Link to="/works" className="works-link">View All Works</Link>
            </section>
        : 
            <Loading />
        }
        </>
    )

}

export default RelatedProjects
