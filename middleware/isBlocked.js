import User from "../models/User.js";

const isBlocked = async (req, res, next) => {
  const user = await User.findById(req.userAuth);
  //   console.log(user);
  if (!user.isBlocked) {
    next();
  } else {
    next(new Error("access denied"));
  }
};

export default isBlocked;