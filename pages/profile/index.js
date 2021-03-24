import { useState, useEffect } from 'react';
import AddUserDetail from '../../components/profile/adduserdetail';
import WithProfileLayout from '../../hoc/withprofilelayout';

function Profile({ user }) {
    if(!user) return null;
    const [selectedTab, setSelectedTab] = useState(0);
    if (user.profile) {
        return (
            <div className="page-content">
                <div className="page-title">
                    <h1 className="text-3xl font-semibold tracking-wide mt-2 mb-3 text-white">Hi {user.profile.firstName} {user.profile.lastName}</h1>
                </div>
            </div>
        )
    }

    return (
        <AddUserDetail user={user} />
    )
}


export default WithProfileLayout(Profile);