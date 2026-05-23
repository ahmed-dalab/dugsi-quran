import type { Request, Response } from "express";
import { User, UserRole } from "../users/user.model";
import bcrypt from "bcryptjs";
import { hashToken, signAccessToken, signRefreshToken, verifyRefreshToken } from "../../utils/auth.token";
import RefreshToken from "./refresh-token.model";
import { clearRefreshTokenCookie, setRefreshTokenCookie } from "../../utils/auth.cookies";
import { loginValidationSchema } from "./auth.validations";
import { AppError } from "../../shared/errors/AppError";
import { asyncHandler } from "../../utils/asyncHandler";

interface IUser {
  _id: string;
  name: string;
  email: string;
  role: string;
  password: string;
  isActive: boolean;
}

export const login = asyncHandler(async (req: Request, res: Response) => {
  const result = loginValidationSchema.safeParse(req.body);

  if (!result.success) {
    const errors = result.error.issues.map((err) => ({
      field: err.path.join("."),
      message: err.message,
    }));

    throw new AppError(400, "Validation failed", { errors });
  }

  const { email, password } = req.body;

  const user: IUser | null = await User.findOne({ email }).select("+password");

  if (!user) {
    throw new AppError(401, "Invalid credentials");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new AppError(401, "Invalid credentials");
  }

  const accessToken = signAccessToken({ _id: user._id, role: user.role as UserRole });
  const refreshToken = signRefreshToken({ _id: user._id });
  const tokenHash = hashToken(refreshToken);

  await RefreshToken.create({
    userId: user._id,
    tokenHash,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    userAgent: req.get("user-agent") || null,
    ipAddress: req.ip || null,
  });

  setRefreshTokenCookie(res, refreshToken);

  res.status(200).json({
    status: "success",
    accessToken,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

export const refreshToken = asyncHandler(async (req: Request, res: Response) => {
  const refreshTokenFromCookie = req.cookies?.refreshToken;

  if (!refreshTokenFromCookie) {
    throw new AppError(401, "Refresh token missing");
  }

  const decoded = verifyRefreshToken(refreshTokenFromCookie);
  const oldTokenHash = hashToken(refreshTokenFromCookie);

  const existingToken = await RefreshToken.findOne({
    tokenHash: oldTokenHash,
    revokedAt: null,
  });

  if (!existingToken) {
    throw new AppError(401, "Refresh token not recognized");
  }

  if (existingToken.expiresAt < new Date()) {
    throw new AppError(401, "Refresh token expired");
  }

  const user: IUser | null = await User.findById(decoded.sub);
  if (!user) {
    throw new AppError(404, "User not found");
  }

  const newAccessToken = signAccessToken({ _id: user._id, role: user.role as UserRole });
  const newRefreshToken = signRefreshToken(user);
  const newTokenHash = hashToken(newRefreshToken);

  existingToken.revokedAt = new Date();
  existingToken.replacedByTokenHash = newTokenHash;
  await existingToken.save();

  await RefreshToken.create({
    userId: user._id,
    tokenHash: newTokenHash,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    userAgent: req.get("user-agent") || null,
    ipAddress: req.ip || null,
  });

  setRefreshTokenCookie(res, newRefreshToken);

  res.status(200).json({
    status: "success",
    accessToken: newAccessToken,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

export const logout = asyncHandler(async (req: Request, res: Response) => {
  const refreshTokenFromCookie = req.cookies.refreshToken;

  if (refreshTokenFromCookie) {
    const tokenHash = hashToken(refreshTokenFromCookie);

    await RefreshToken.findOneAndUpdate(
      { tokenHash, revokedAt: null },
      { revokedAt: new Date() }
    );
  }

  clearRefreshTokenCookie(res);

  res.status(200).json({
    status: "success",
    message: "Logged out successfully",
  });
});

export const me = asyncHandler(async (req: Request, res: Response) => {
  res.status(200).json({
    status: "success",
    user: req.user,
  });
});
