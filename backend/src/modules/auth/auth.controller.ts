import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { hashToken, signAccessToken, signRefreshToken, verifyRefreshToken } from "../../utils/auth.token";
import { clearRefreshTokenCookie, setRefreshTokenCookie } from "../../utils/auth.cookies";
import { loginValidationSchema } from "./auth.validations";
import { AppError } from "../../shared/errors/AppError";
import { asyncHandler } from "../../utils/asyncHandler";
import type { UserRole } from "../users/user.model";
import { userRepository } from "../users/user.repository";
import { authRepository } from "./auth.repository";

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
  const user = await userRepository.findByEmailWithPassword(email);

  if (!user) {
    throw new AppError(401, "Invalid credentials");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new AppError(401, "Invalid credentials");
  }

  const accessToken = signAccessToken({ _id: user.id, role: user.role as UserRole });
  const refreshToken = signRefreshToken({ _id: user.id });
  const tokenHash = hashToken(refreshToken);

  await authRepository.createRefreshToken({
    userId: user.id,
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
      id: user.id,
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

  const existingToken = await authRepository.findActiveByTokenHash(oldTokenHash);

  if (!existingToken) {
    throw new AppError(401, "Refresh token not recognized");
  }

  if (existingToken.expiresAt < new Date()) {
    throw new AppError(401, "Refresh token expired");
  }

  const user = await userRepository.findById(decoded.sub as string);
  if (!user) {
    throw new AppError(404, "User not found");
  }

  const newAccessToken = signAccessToken({ _id: user.id, role: user.role as UserRole });
  const newRefreshToken = signRefreshToken({ _id: user.id });
  const newTokenHash = hashToken(newRefreshToken);

  await authRepository.revokeAndReplace(existingToken.id, newTokenHash);

  await authRepository.createRefreshToken({
    userId: user.id,
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
      id: user.id,
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
    await authRepository.revokeByTokenHash(tokenHash);
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
