const db = require('../config/database');
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
  const { mobile, fcm_id, web_fcm_id } = req.body;
  if (!mobile) {
    return res.status(400).json({ error: true, message: 'Mobile is required', data: [] });
  }

  try {
    console.log('JWT_SECRET_KEY:', process.env.JWT_SECRET_KEY);
    if (!process.env.JWT_SECRET_KEY) {
      return res.status(500).json({ error: true, message: 'JWT_SECRET_KEY is not defined', data: [] });
    }

    // Check if user exists
    const [users] = await db.query('SELECT * FROM users WHERE mobile = ?', [mobile]);
    if (users.length === 0) {
      return res.status(404).json({ error: true, message: 'User does not exist!', data: [] });
    }

    // Update FCM IDs if provided
    if (fcm_id) {
      await db.query('UPDATE users SET fcm_id = ? WHERE mobile = ?', [fcm_id, mobile]);
    }
    if (web_fcm_id) {
      await db.query('UPDATE users SET web_fcm_id = ? WHERE mobile = ?', [web_fcm_id, mobile]);
    }

    let user = users[0];
    console.log('User Data:', user);

    let token = user.apikey;

    // Generate new JWT if not present or invalid
    let newTokenNeeded = false;
    if (!token) {
      newTokenNeeded = true;
    } else {
      try {
        jwt.verify(token, process.env.JWT_SECRET_KEY);
      } catch (e) {
        console.error('Token Verification Error:', e.message);
        newTokenNeeded = true;
      }
    }

    if (newTokenNeeded) {
      token = jwt.sign(
        { mobile: user.mobile, id: user.id, company: user.company },
        process.env.JWT_SECRET_KEY,
        { expiresIn: '7d' }
      );
      console.log('Generated Token:', token);

      const result = await db.query('UPDATE users SET apikey = ? WHERE mobile = ?', [token, mobile]);
      console.log('Database Update Result:', result);
    }

    // Remove password from user object
    delete user.password;

    // Set image URL
    if (!user.image) {
      user.image = 'NO_PROFILE_IMAGE_URL'; // Replace with your default image URL
    } else {
      user.image = 'USER_IMG_PATH_URL/' + user.image; // Replace with your user image path
    }

    // Replace nulls with empty strings
    Object.keys(user).forEach(key => {
      if (user[key] === null) user[key] = '';
    });

    return res.json({
      error: false,
      token,
      message: 'User login successfully',
      data: user
    });
  } catch (err) {
    console.error('Error:', err.message);
    return res.status(500).json({ error: true, message: err.message, data: [] });
  }
};