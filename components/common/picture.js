import { useState, useEffect } from 'react';
import { Storage } from 'aws-amplify';
import { AmplifyS3Image } from "@aws-amplify/ui-react";

function Picture({ path }) {
    const [picture, setPicture] = useState(null);
    useEffect(() => {
        getPicture();
    }, []);

    async function getPicture() {
        const data = await Storage.get(path);
        Storage.get("profilePicture.png")
            .then(url => {
                var myRequest = new Request(url);
                fetch(myRequest).then(function (response) {
                    if (response.status === 200) {
                        setImage(url);
                    }
                });
            })
            .catch(err => console.log(err));

        if (data) {
            setPicture(data);
        }
        console.log(data)
    }

    if (picture) {
        return <AmplifyS3Image imgKey={picture} />
    }

    return (
        <></>
    )
}

export default Picture;