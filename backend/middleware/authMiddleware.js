const { supabase } = require('../supabaseClient');

const authMiddleware = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const { data, error } = await supabase.auth.getUser(token);

        if (error || !data.user) {
            return res.status(401).json({ error: 'Unauthorized: Invalid Supabase token' });
        }

        req.user = data.user;
        next();
    } catch (err) {
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = authMiddleware;
