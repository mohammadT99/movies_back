const User = require("../../model/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const RegisterController = async (req, res) => {
  const { username, password, email } = req.body;
  try {
    // Check if the user already exists
    const findUser = await User.findOne({ username });
    if (findUser) {
      return res.status(400).json({
        message: "کاربر وجود دارد  لطفا در بخش ورود دوباره سعی نمایید",
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const addUser = new User({
      username,
      password: hashedPassword,
      email,
    });

    // Save the user to the database
    const saveUser = await addUser.save();

    // Generate a token
    const token = jwt.sign({ id: saveUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    return res.status(200).json({
      message: "کاربر با موفقیت ثبت شد",
      token, // Send the token back to the client
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "خطا در ثبت کاربر",
    });
  }
};

const LoginController = async (req, res) => {
  const { username, password } = req.body;
  try {
    // Find the user by username
    const findUser = await User.findOne({ username });
    if (!findUser) {
      return res.status(400).json({
        message: "کاربر وجود ندارد",
        username: username,
      });
    }

    // Compare the password with the hashed password
    const isValidPassword = await bcrypt.compare(password, findUser.password);
    if (!isValidPassword) {
      return res.status(400).json({
        message: "رمز عبور اشتباه است",
      });
    }

    // Generate a token
    const token = jwt.sign({ id: findUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    return res.status(200).json({
      message: "ورود با موفقیت انجام شد",
      data: {
        token,
        user: findUser, // Return the user data
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "خطا در ورود کاربر",
      username,
      password,
    });
  }
};

module.exports = { RegisterController, LoginController };
