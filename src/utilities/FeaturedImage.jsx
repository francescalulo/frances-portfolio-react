// Description: FeaturedImage component to display the featured image of a post or page.
// featuredImageObject: The featured image object from the REST API.

const FeaturedImage = ( {featuredImageObject} ) => {

    let imgWidth = featuredImageObject.media_details.sizes.full.width;
    let imgHeight = featuredImageObject.media_details.sizes.full.height;
    let imgURL = featuredImageObject.source_url;
    
    return (
        <figure className="featured-image">
            <img 
                src={imgURL} 
                width={imgWidth}
                height={imgHeight}
                alt={featuredImageObject.alt_text}
                srcSet={`${imgURL} ${imgWidth}w,
                ${featuredImageObject.media_details.sizes.large ? featuredImageObject.media_details.sizes.large.source_url + ' 1024w,' : ''}
                ${featuredImageObject.media_details.sizes.medium_large ? featuredImageObject.media_details.sizes.medium_large.source_url + ' 768w,' : ''}
                ${featuredImageObject.media_details.sizes.medium ? featuredImageObject.media_details.sizes.medium.source_url + ' 300w' : ''}`}
                sizes={`(max-width: ${imgWidth}) 100vw, ${imgWidth}px`}
                />
        </figure>
    )

}

export default FeaturedImage
