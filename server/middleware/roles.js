function admin(req, res, next) {
    if (req.user?.roles.includes('admin')) {
        next();
    } else {
        return res.status(403).json({ 
            ok: false, 
            error: 'Not Authorized'
        });
    }
}

function user(req, res, next) {
    if (req.user?.roles.includes('user')) {
        next();
    } else {
        return res.status(403).json({ 
            ok: false,
            error: 'Not Authorized' 
        });
    }
}

module.exports = { admin, user };