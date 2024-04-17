import mongoose from "mongoose";

const connectMongoDB = async () => {
	try {
		await mongoose.connect(process.env.MONGODB);
		console.log("Connect MongoDB Atlas successfully!");
	} catch (err) {
		console.log(err.message);
	}
};

export default connectMongoDB;
