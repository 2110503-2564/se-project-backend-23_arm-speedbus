const User = require("../models/UserModel");
const AuditLog = require("../models/AuditLogModel");

//@desc     Register User
//@route    POST /api/v1/auth/register
//@access   Public
exports.register = async (req, res, next) => {
  try {
    const { name, tel, email, password, role } = req.body;
    //Check if duplicate email address exists
    const existedUser = await User.findOne({ email });
    if (existedUser) {
      return res
        .status(400)
        .json({ success: false, message: "This email is already registered" });
    }
    //Create user
    const user = await User.create({
      name,
      tel,
      email,
      password,
      role,
    });
    await AuditLog.create({
      action: "Register",
      user_id: user._id,
      target: "users",
      target_id: user._id,
      description: `Registered user id ${user._id} as ${user.role}.`,
    });
    sendTokenResponse(user, 200, res);
  } catch (err) {
    res.status(400).json({ success: false });
    console.log(err.stack);
  }
};

//@desc     Login User
//@route    POST /api/v1/auth/login
//@access   Public
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    //Validate email & password
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, msg: "Please provide an email and password" });
    }

    //Check for user
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res
        .status(401)
        .json({ success: false, msg: "Invalid credentials" });
    }

    //Check if password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, msg: "Invalid credentials" });
    }

    //Create token
    // const token = user.getSignedJwtToken();
    // res.status(200).json({success:true,token});
    await AuditLog.create({
      action: "Login",
      user_id: user._id,
      target: "users",
      target_id: user._id,
      description: `User id ${user._id} logged in as ${user.role}.`,
    });
    sendTokenResponse(user, 200, res);
  } catch (err) {
    return res.status(401).json({
      success: false,
      msg: "Cannot convert email or password to string",
    });
  }
};

//@desc     Log out
//@route    GET /api/v1/auth/logout
//@access   Private
exports.logout = async (req, res, next) => {
  try {
    res.cookie("token", "none", {
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: true,
    });
    await AuditLog.create({
      action: "Logout",
      user_id: req.user._id,
      target: "users",
      target_id: req.user._id,
      description: `User id ${req.user._id} logged out.`,
    });
    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    res.status(400).json({ success: false, message: "cannot log out" });
  }
};

//Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  //Create token
  const token = user.getSignedJwtToken();

  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === "production") {
    options.secure = true;
  }
  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    User_info: user,
    token,
  });
};

//@desc     Get current Logged in user
//@route    POST /api/v1/auth/me
//@access   Private
exports.getMe = async (req, res, next) => {
  const user = await User.findById(req.user.id);
  res.status(200).json({ success: true, data: user });
};

//@desc     Update user details
//@route    PUT /api/v1/auth/updatedetails
//@access   Private
exports.updateDetails = async (req, res, next) => {
  const fieldsToUpdate = {
    name: req.body.name,
    tel: req.body.tel,
    redeemCouponStatus: req.body.redeemCouponStatus,
  };

  const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
    new: true,
    runValidators: true,
  });

  await AuditLog.create({
    action: "Update",
    user_id: req.user._id,
    target: "users",
    target_id: req.user._id,
    description: `User id ${req.user._id} updated their details.`,
  });
  res.status(200).json({ success: true, data: user });
};
