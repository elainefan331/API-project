const router = require('express').Router();

// D4 phase3: test restoreUser middleware
// GET /api/restore-user
const { restoreUser } = require('../../utils/auth.js');
router.use(restoreUser);
// router.get(
//   '/restore-user',
//   (req, res) => {
//     return res.json(req.user);
//   }
// );
// D3 test route
// router.post('/test', function(req, res) {
//     res.json({ requestBody: req.body });
// });


// D4 phase3: test setTokenCookie middleware
// GET /api/set-token-cookie
// const { setTokenCookie } = require('../../utils/auth.js');
// const { User } = require('../../db/models');
// router.get('/set-token-cookie', async (_req, res) => {
//   const user = await User.findOne({
//     where: {
//       username: 'Demo-lition'
//     }
//   });
//   setTokenCookie(res, user);
//   return res.json({ user: user });
// });

// D4 phase3: test requireAuth middleware
// GET /api/require-auth
// const { requireAuth } = require('../../utils/auth.js');
// router.get(
//   '/require-auth',
//   requireAuth,
//   (req, res) => {
//     return res.json(req.user);
//   }
// );

module.exports = router;