import User from "../models/User.js";

const isAdmin = async (req, res, next) => {
  const user = await User.findById(req.userAuth);
  //   console.log(user);
  if (user.isAdmin) {
    next();
  } else {
    next(new Error("access denied"));
  }
};

export default isAdmin;
