import { withSSRContext } from 'aws-amplify';
import Amplify from 'aws-amplify';
import config from '../../../aws-exports';
Amplify.configure({ ...config, ssr: true });

export default async (req, res) => {
    const { Auth } = withSSRContext({ req });
    try {
        const user = await Auth.currentAuthenticatedUser();
        res.json({ user });
    } catch (err) {
        res.json({ user: null });
    }
}