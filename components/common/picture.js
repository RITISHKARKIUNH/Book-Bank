import { useState, useEffect } from 'react';
import { Storage } from 'aws-amplify';

function Picture({ path, alt, className, style }) {
    const [picture, setPicture] = useState(null);
    useEffect(() => {
        updateProfileImage();
    }, []);

    async function updateProfileImage(){
        if(path){
            const imageKey = await Storage.get(path);
            setPicture(imageKey);
        }
    }

    if (picture) {
        return <img style={style} src={picture} alt={alt} className={className} />
    }

    return (
        <></>
    )
}

export default Picture;