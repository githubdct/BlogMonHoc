import { Alert, Button, Modal, Spinner, TextInput } from "flowbite-react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
	getDownloadURL,
	getStorage,
	ref,
	uploadBytesResumable,
} from "firebase/storage";
import { Link } from "react-router-dom";

import {
	updateStart,
	updateSuccess,
	updateFailure,
	deleteUserFailure,
	deleteUserStart,
	deleteUserSuccess,
	signOutSuccess,
} from "../redux/user/userSlice";

import { app } from "../firebase";

import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const DashProfile = () => {
	const dispatch = useDispatch();
	// const { loading } = useSelector((state) => state.user);

	const { currentUser, loading, error } = useSelector((state) => state.user);

	// Upload image
	const [imageFile, setImageFile] = useState(null);
	const [imageFileUrl, setImageFileUrl] = useState(null);
	const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null);
	const [imageFileUploadError, setImageFileUploadError] = useState(null);
	const [imageFileUploading, setImageFileUploading] = useState(false);

	// update user
	const [updateUserSuccess, setUpdateUserSuccess] = useState(null);
	const [updateUserError, setUpdateUserError] = useState();

	// confirm delete account
	const [showModal, setShowModal] = useState(false);

	const fileImageRef = useRef();

	const [formData, setFormData] = useState({});

	const handleChangeImage = (e) => {
		const file = e.target.files[0];

		if (file) {
			setImageFile(file);
			setImageFileUrl(URL.createObjectURL(file));
		}
	};

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.id]: e.target.value });
	};

	const uploadImage = async () => {
		setImageFileUploading(true);
		setImageFileUploadError(null);
		const storage = getStorage(app);
		const fileName = new Date().getTime() + imageFile.name;
		const storageRef = ref(storage, fileName);
		const uploadTask = uploadBytesResumable(storageRef, imageFile);
		uploadTask.on(
			"state_changed",
			(snapshot) => {
				const progress =
					(snapshot.bytesTransferred / snapshot.totalBytes) * 100;

				setImageFileUploadProgress(progress.toFixed(0));
			},
			// eslint-disable-next-line no-unused-vars
			(error) => {
				setImageFileUploadError(
					"Could not upload image (File must be less than 2MB)"
				);
				setImageFileUploadProgress(null);
				setImageFile(null);
				setImageFileUrl(null);
			},
			() => {
				getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
					setImageFileUrl(downloadURL);
					setFormData({ ...formData, profilePicture: downloadURL });
					setImageFileUploading(false);
				});
			}
		);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setUpdateUserError(null);
		setUpdateUserSuccess(null);

		if (Object.keys(formData).length === 0) {
			setUpdateUserError("No changes made");
			return;
		}

		if (imageFileUploading) {
			setUpdateUserError("Please wait for image to upload");
			return;
		}

		try {
			dispatch(updateStart());
			const res = await fetch("/api/user/update/" + currentUser._id, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(formData),
			});

			const data = await res.json();

			if (!res.ok) {
				dispatch(updateFailure(data.message));
				setUpdateUserError(data.message);
			} else {
				dispatch(updateSuccess(data));
				setUpdateUserSuccess("User's profile updated successfully!");
			}
		} catch (error) {
			dispatch(updateFailure(error.message));
			setUpdateUserError(error.message);
		}
	};

	useEffect(() => {
		if (imageFile) {
			uploadImage();
		}
	}, [imageFile]);

	const handleDeleteUser = async () => {
		setShowModal(false);

		try {
			dispatch(deleteUserStart());
			const res = await fetch("/api/user/delete/" + currentUser._id, {
				method: "DELETE",
			});

			const data = await res.json();

			if (!res.ok) {
				dispatch(deleteUserFailure(data.message));
			} else {
				dispatch(deleteUserSuccess(data));
			}
		} catch (error) {
			dispatch(deleteUserFailure(error.message));
		}
	};

	const handleSignOut = async () => {
		try {
			const res = await fetch("/api/user/sign-out", {
				method: "POST",
			});

			const data = await res.json();

			if (!res.ok) {
				console.log(data.message);
			} else {
				dispatch(signOutSuccess());
			}
		} catch (error) {
			console.log(error.message);
		}
	};

	return (
		<div className="max-w-lg mx-auto p-3 w-full">
			<h1 className="my-7 text-center font-semibold text-3xl">Profile</h1>
			<form className="flex flex-col gap-4" onSubmit={handleSubmit}>
				<input
					type="file"
					accept="image/*"
					onChange={handleChangeImage}
					ref={fileImageRef}
					hidden
				/>
				<div
					className="relative w-32 h-32 self-center cursor-pointer shadow-md rounded-full"
					onClick={() => fileImageRef.current.click()}>
					{imageFileUploadProgress && (
						<CircularProgressbar
							value={imageFileUploadProgress || 0}
							text={`${imageFileUploadProgress}%`}
							strokeWidth={5}
							styles={{
								root: {
									width: "100%",
									height: "100%",
									position: "absolute",
									top: 0,
									left: 0,
								},
								path: {
									stroke: `rgba(62,152,199, ${imageFileUploadProgress / 100})`,
								},
							}}
						/>
					)}
					<img
						src={imageFileUrl || currentUser.profilePicture}
						alt="user picture"
						className={`rounded-full w-full h-full border-8 border-[lightgray] object-cover ${
							imageFileUploadProgress &&
							imageFileUploadProgress < 100 &&
							"opacity-60"
						}`}
					/>
				</div>
				{imageFileUploadError && (
					<Alert color={"failure"}>{imageFileUploadError}</Alert>
				)}
				<TextInput
					type="text"
					id="username"
					placeholder="Username"
					defaultValue={currentUser.username}
					onChange={handleChange}
				/>
				<TextInput
					type="email"
					id="email"
					placeholder="Email"
					defaultValue={currentUser.email}
					onChange={handleChange}
				/>
				<TextInput
					type="password"
					id="password"
					placeholder="Password"
					defaultValue={currentUser.password}
					onChange={handleChange}
				/>

				<Button
					type="submit"
					gradientDuoTone={"purpleToBlue"}
					outline
					disabled={loading || imageFileUploading}>
					{loading ? (
						<>
							<Spinner size={"sm"} />
							<span className="pl-3">Updating...</span>
						</>
					) : (
						"Update"
					)}
				</Button>

				{currentUser.isAdmin && (
					<Link to="/create-post">
						<Button
							type="button"
							gradientDuoTone="purpleToPink"
							className="w-full">
							Create a post
						</Button>
					</Link>
				)}
			</form>
			<div className="text-red-500 flex justify-between mt-3">
				<span
					className="cursor-pointer hover:underline"
					onClick={() => setShowModal(true)}>
					Delete Account
				</span>
				<span
					className="cursor-pointer hover:underline"
					onClick={handleSignOut}>
					Sign Out
				</span>
			</div>

			{updateUserSuccess && (
				<Alert color={"success"} className="mt-5">
					{updateUserSuccess}
				</Alert>
			)}

			{updateUserError && (
				<Alert color={"failure"} className="mt-5">
					{updateUserError}
				</Alert>
			)}

			{error && (
				<Alert color={"failure"} className="mt-5">
					{error}
				</Alert>
			)}

			<Modal
				show={showModal}
				onClose={() => setShowModal(false)}
				popup
				size="md">
				<Modal.Header />
				<Modal.Body>
					<div className="text-center">
						<HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
						<h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
							Are you sure want to delete account?
						</h3>
						<div className="flex items-center justify-center gap-10">
							<Button color="failure" onClick={handleDeleteUser}>
								Yes, Delete Account
							</Button>
							<Button color="gray" onClick={() => setShowModal(false)}>
								No, Cancel
							</Button>
						</div>
					</div>
				</Modal.Body>
			</Modal>
		</div>
	);
};

export default DashProfile;