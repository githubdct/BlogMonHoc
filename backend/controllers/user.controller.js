import User from "../models/user.model.js";
import { errorHandler } from "../utils/errorHandler.js";
import bcryptjs from "bcryptjs";

export const updateUser = async (req, res, next) => {
	if (req.user.id !== req.params.id) {
		return next(errorHandler(403, "You are not allowed to update"));
	}

	if (req.body.password) {
		if (req.body.password.length < 6) {
			return next(errorHandler(400, "Password must be at least 6 characters!"));
		}
		req.body.password = bcryptjs.hashSync(req.body.password, 10);
	}

	if (req.body.username) {
		if (req.body.username.length < 7 || req.body.username > 20) {
			return next(
				errorHandler(400, "Username must be between 7 and 20 characters!")
			);
		}

		if (req.body.username.includes(" ")) {
			return next(
				errorHandler(400, "Username cannot contain spaces character!")
			);
		}

		if (req.body.username !== req.body.username.toLowerCase()) {
			return next(errorHandler(400, "Username must be lowercase!"));
		}

		if (!req.body.username.match(/^[a-zA-Z0-9]+$/)) {
			return next(
				errorHandler(400, "Username can only contain letters and numbers")
			);
		}
	}

	try {
		const updateUser = await User.findByIdAndUpdate(
			req.params.id,
			{
				$set: {
					username: req.body.username,
					email: req.body.email,
					password: req.body.password,
				},
			},
			{ new: true }
		);

		const { password, ...rest } = updateUser._doc;
		res.status(200).json(rest);
	} catch (error) {
		next(error);
	}
};

export const deleteUser = async (req, res, next) => {
	const userIdParams = req.params.userId;

	if (!req.user.isAdmin && req.user.id !== userIdParams) {
		return next(errorHandler(403, "You are not allowed to delete this user!"));
	}

	try {
		await User.findByIdAndDelete(userIdParams);
		res.status(200).json("User has been deleted!");
	} catch (error) {
		next(error);
	}
};

export const signOut = (req, res, next) => {
	try {
		res.clearCookie("access_token").status(200).json("User has been sign out");
	} catch (error) {
		next(error);
	}
};

export const getUsers = async (req, res, next) => {
	if (!req.user.isAdmin) {
		return next(errorHandler(403, "You are not allowed to get users"));
	}

	try {
		const startIndex = parseInt(req.query.startIndex) || 0;
		const limit = parseInt(req.query.limit) || 9;
		const sortDirection = req.query.sort === "asc" ? 1 : -1;

		const allUsers = await User.find()
			.sort({ createdAt: sortDirection })
			.skip(startIndex)
			.limit(limit);

		const usersWithoutPass = allUsers.map((user) => {
			const { password, ...rest } = user._doc;
			return rest;
		});

		const totalUsers = await User.countDocuments();

		const now = new Date();
		const oneMonthAgo = new Date(
			now.getFullYear(),
			now.getMonth() - 1,
			now.getDate()
		);
		const lastMonthUsers = await User.countDocuments({
			createdAt: { $gte: oneMonthAgo },
		});

		res
			.status(200)
			.json({ users: usersWithoutPass, totalUsers, lastMonthUsers });
	} catch (error) {
		next(error);
	}
};

export const getUser = async (req, res, next) => {
	try {
		const user = await User.findById(req.params.userId);
		const { password, ...rest } = user._doc;

		res.status(200).json(rest);
	} catch (error) {
		next(error);
	}
};