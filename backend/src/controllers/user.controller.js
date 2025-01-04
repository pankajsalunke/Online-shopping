import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { v2 as cloudinary } from "cloudinary";
import { sendOTPEmail } from "../utils/otpService.js";
import crypto from "crypto";
import jwt from "jsonwebtoken"

const generateAccessAndRefereshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    // console.log("accessToken",accessToken);

    const refreshToken = user.generateRefreshToken();
    // console.log("refreshToken",refreshToken);

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "SomeThing went wrong while generating refresh token and access token "
    );
  }
};

const registerUser = asyncHandler(async (req, res) => {
  const { username, fullname, email, password, address, role, Mnumber } =
    req.body;
  // console.log("the body content: ", req.body);

  if (
    [username, fullname, email, password, address, role, Mnumber].some(
      (field) => field?.trim() === ""
    )
  ) {
    throw new ApiError(400, "All field are required");
  }
  // Validate the role
  if (!["user", "admin"].includes(role)) {
    return res.status(400).json({ error: "Invalid role" });
  }

  //   validate mobile number
  const regex = /^[0-9]{10}$/;
  if (!regex.test(Mnumber)) {
    throw new ApiError(400, "Invalid mobile number");
  }
  const existingUser = await User.findOne({ $or: [{ Mnumber }, { email }] });

  if (existingUser) {
    throw new ApiError(409, " User with email or mobile number Already Exists");
  }

  // console.log("check req.file",req.file.path)

  const avatarLocalPath = req.file?.path;

  // console.log(req.file,"!!!the!!!",avatarLocalPath);

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is Required");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);

  // console.log("Avatar image uploaded successfully", avatar,"Avatar url",avatar.url);

  if (!avatar) {
    throw new ApiError(400, "Avatar file is required");
  }
  const user = await User.create({
    username: username.toLowerCase(),
    fullname,
    email,
    password,
    Mnumber,
    address,
    role,
    avatar: avatar.url,
  });

  // console.log("created user:::", user);

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  if (!createdUser) {
    throw new ApiError(500, "Some thing went wrong while creating user");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, createdUser, "User Registered successfully"));
});

const logInUser = asyncHandler(async (req, res) => {
  const { Mnumber, email, password } = req.body;

  // if( !Mnumber && !email ) {
  if (!(Mnumber || email)) {
    throw new ApiError(400, "Mobile number or email is required");
  }

  const user = await User.findOne({
    $or: [{ Mnumber }, { email }],
  });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Please enter correct password ");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(
    user._id
  );

  // console.log("AccessToken From login Method::", accessToken);

  // console.log("refreshToken From login Method::", refreshToken);

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: true,
  };
  // console.log("Setting cookies:", { accessToken, refreshToken });
  // console.log(user);

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "user loggedIn successfully"
      )
    );
});

const checkUserLoggedIn = asyncHandler(async (req,res) => {
  
  const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")

  const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRATE)
  const user = await User.findById(decodedToken?._id).select("-password -refreshToken")
    if (user) {
      return res.json({  isLoggedIn: true });
    }else {
      return res.json({ message:"unauthorized request",isLoggedIn: false });
    }
  
})

const logoutUser = asyncHandler(async (req, res) => {
  // console.log("user",req.user);
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: {
        refreshToken: 1, // this removes the field from document
      },
    },
    {
      new: true,
    }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged Out"));
});

const changeCurrentPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  const user = await User.findById(req.user?._id);
  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

  if (!isPasswordCorrect) {
    throw new ApiError(400, "Invalid old password");
  }

  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password changed successfully"));
});

const getCurrentUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "user fetched successfully"));
});

const updateUserAvatar = asyncHandler(async (req, res) => {
  const avatarLocalPath = req.file.path;
  // console.log(avatarLocalPath);

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is missing");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  if (!avatar.url) {
    throw new ApiError(400, "Error while uploading on avatar file");
  }
  // Retrieve the current user's data to get the old avatar's public_id
  const currentUser = await User.findById(req.user?._id);
  //  console.log("Current USER::",currentUser);

  const oldAvatarUrl = currentUser.avatar;
  //  console.log("Current OLDAVTAR URL::",oldAvatarUrl);
  let oldAvatarPublicId = null;
  //  extractpublic_id from old avatar URL if it exists
  if (oldAvatarUrl) {
    const urlParts = oldAvatarUrl.split("/");
    // console.log("Current OLDAVTAR URL PARTS::",urlParts);

    oldAvatarPublicId = urlParts[urlParts.length - 1].split(".")[0];
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        avatar: avatar.url,
      },
    },
    { new: true }
  ).select("-password");

  // If the profile is successfully updated and an old avatar exists, remove it from Cloudinary
  // console.log("Current oldAvatarPublicId::",oldAvatarPublicId);

  if (oldAvatarPublicId) {
    cloudinary.uploader.destroy(oldAvatarPublicId, function (err, result) {
      if (err) {
        console.error("Error removing old avatar from Cloudinary:", err);
      } else {
        console.log("Old avatar removed from Cloudinary:", result);
      }
    });
  }

  return res
    .status(200)
    .json(new ApiResponse(200, user, "avatar image updated successfully"));
});

const updateUserProfile = asyncHandler(async (req, res) => {
  const { fullname, email, Mnumber } = req.body;
  // console.log( fullname, email, Mnumber);

  if (!fullname || !email || !Mnumber) {
    throw new ApiError(400, "All fields are required");
  }
  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        fullname: fullname,
        email: email,
        Mnumber: Mnumber,
      },
    },
    { new: true }
  ).select("-password");

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Account details updated successfully"));
});

const forgotPassword = asyncHandler(async (req, res) => {
  try {
    const { Mnumber, email } = req.body;
    // console.log(email);
    

    const user = await User.findOne({ $or: [{ Mnumber }, { email }] });

    if (!user) {
      res.status(404).json({message:  "User not found with email or mobile"});
    }
    // Generate OTP
    const otp = crypto.randomInt(100000, 999999).toString();
    const otpExpires = Date.now() + 10 * 60 * 1000;

    user.otp = otp;
    user.otpExpires = otpExpires;

    await user.save();

    // Send otp to mobile number or email
    if (email) {
      await sendOTPEmail(email, otp);
    }
    //  else if (Mnumber) {
    //   await sendOTPSMS(Mnumber, otp);
    // }

    return res
      .status(200)
      .json(
        new ApiResponse(200, {}, "OTP sent to your email or mobile number")
      );
  } catch (error) {
    return res.status(500).json( 
      error?.message || {message:"somethig went wrong"});
  }
});

const resetPassword = asyncHandler(async (req, res) => {
  try {
    // const { otp, newPassword, email, Mnumber } = req.body;
    const { otp, newPassword, email, Mnumber } = req.body;

    const user = await User.findOne({
      $or: [{ email }, { Mnumber } ],
     
      otpExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({message:"check Email"});
    }
    // console.log(user.otp,otp);
    
    if (user.otp !== otp) {
      return res.status(401).json({message:"incorrect otp!Please try again"})
    }
    // set new password
    user.password = newPassword;

    // clear otp and otp expiration
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Password reset successfully"));
  } catch (error) {
    throw new ApiError(500, "something went wrong");
  }
});

export {
  registerUser,
  logInUser,
  logoutUser,
  changeCurrentPassword,
  getCurrentUser,
  updateUserAvatar,
  updateUserProfile,
  forgotPassword,
  resetPassword,
  checkUserLoggedIn
};
