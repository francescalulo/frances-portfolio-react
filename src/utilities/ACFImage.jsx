// Description: ACFImage component will display images from ACFs.
// acfImageObject (Required): The ACF image array from the REST API.
// acfImageSize (Optional): Add if you want a specific size. For example: 'medium', 'medium_large', 'large'.

const ACFImage = ({ acfImageObject, acfImageSize }) => {

    let imgWidth = acfImageObject.width;
    let imgHeight = acfImageObject.height;
    let imgURL = acfImageObject.url;
    let size = acfImageSize;

    return (
        <>
            {acfImageObject.sizes[size] ?
                <figure className="acf-image">
                    <img
                        src={acfImageObject.sizes[size]}
                        width={acfImageObject.sizes[`${size}-width`]}
                        height={acfImageObject.sizes[`${size}-height`]}
                        alt={acfImageObject.alt}
                    />
                </figure>
                :
                <figure className="acf-image">
                    <img
                        src={imgURL}
                        width={imgWidth}
                        height={imgHeight}
                        alt={acfImageObject.alt}
                        srcSet={`
                            ${imgURL} ${imgWidth}w,
                            ${acfImageObject.sizes.large ? acfImageObject.sizes.large + ' ' + acfImageObject.sizes['large-width'] + 'w,' : ''}
                            ${acfImageObject.sizes.medium_large ? acfImageObject.sizes.medium_large + ' ' + acfImageObject.sizes['medium_large-width'] + 'w,' : ''}
                        `}
                    />
                </figure>
            }
        </>
    );
};

export default ACFImage;
