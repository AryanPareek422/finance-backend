function permit(...allowedRoles) {
  return (req, res, next) => {
    const user = req.user;
    if (!user) return res.status(401).json({ error: 'Not authenticated' });
    if (allowedRoles.includes(user.role)) return next();
    return res.status(403).json({ error: 'Forbidden: insufficient role' });
  };
}

module.exports = { permit };
