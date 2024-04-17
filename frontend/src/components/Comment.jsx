import moment from "moment";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { FaThumbsUp } from "react-icons/fa";
import { Button, Textarea } from "flowbite-react";

// eslint-disable-next-line react/prop-types
const Comment = ({ comment, onLike, onEdit, onDelete }) => {
	const { currentUser } = useSelector((state) => state.user);

	const [user, setUser] = useState({});
	const [isEditing, setIsEditing] = useState(false);
	// eslint-disable-next-line react/prop-types
	const [editedContent, setEditedContent] = useState(comment.content);

	useEffect(() => {
		const getUser = async () => {
			try {
				// eslint-disable-next-line react/prop-types
				const res = await fetch(`/api/user/${comment.userId}`);
				const data = await res.json();
				if (res.ok) {
					setUser(data);
				}
			} catch (error) {
				console.log(error.message);
			}
		};
		getUser();
	}, [comment]);

	const handleEdit = () => {
		setIsEditing(true);
		// eslint-disable-next-line react/prop-types
		setEditedContent(comment.content);
	};

	const handleSave = async () => {
		try {
			// eslint-disable-next-line react/prop-types
			const res = await fetch(`/api/comment/edit-comment/${comment._id}`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					content: editedContent,
				}),
			});

			if (res.ok) {
				setIsEditing(false);
				onEdit(comment, editedContent);
			}
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<div className="flex p-4 border-b dark:border-gray-600 text-sm">
			<div className="flex-shrink-0 mr-3">
				<img
					className="w-10 h-10 rounded-full bg-gray-200"
					src={user.profilePicture}
					alt={user.username}
				/>
			</div>
			<div className="flex-1">
				<div className="flex items-center mb-1">
					<span className="font-bold mr-1 text-xs truncate">
						{user ? `@${user.username}` : "anonymous user"}
					</span>
					<span className="text-gray-500 text-xs">
						{/* eslint-disable-next-line react/prop-types */}
						{moment(comment.createdAt).fromNow()}
					</span>
				</div>

				{isEditing ? (
					<>
						<Textarea
							className="mb-2"
							value={editedContent}
							onChange={(e) => setEditedContent(e.target.value)}
						/>
						<div className="flex items-center justify-end gap-3 mt-2 text-sm">
							<Button
								type="button"
								size="sm"
								gradientDuoTone="purpleToBlue"
								onClick={handleSave}>
								Save
							</Button>
							<Button
								type="button"
								size="sm"
								gradientDuoTone="purpleToBlue"
								outline
								onClick={() => setIsEditing(false)}>
								Cancel
							</Button>
						</div>
					</>
				) : (
					<>
						{/* eslint-disable-next-line react/prop-types */}
						<p className="text-gray-500 pb-2">{comment.content}</p>

						<div className="flex items-center pt-2 text-xs border-t dark:border-gray-700 max-w-fit gap-2">
							<button
								type="button"
								// eslint-disable-next-line react/prop-types
								onClick={() => onLike(comment._id)}
								className={`text-gray-400 hover:text-blue-500 ${
									currentUser &&
									// eslint-disable-next-line react/prop-types
									comment.likes.includes(currentUser._id) &&
									"!text-blue-500"
								}`}>
								<FaThumbsUp className="text-sm" />
							</button>
							<p className="text-gray-400">
								{/* eslint-disable-next-line react/prop-types */}
								{comment.numberOfLikes > 0 &&
									// eslint-disable-next-line react/prop-types
									comment.numberOfLikes +
										" " +
										// eslint-disable-next-line react/prop-types
										(comment.numberOfLikes === 1 ? "like" : "likes")}
							</p>

							{currentUser &&
								// eslint-disable-next-line react/prop-types
								(currentUser._id === comment.userId || currentUser.isAdmin) && (
									<div className="flex items-center gap-2">
										<button
											type="button"
											className="text-gray-400 hover:text-blue-500"
											onClick={handleEdit}>
											Edit
										</button>

										<button
											type="button"
											className="text-gray-400 hover:text-red-500"
											// eslint-disable-next-line react/prop-types
											onClick={() => onDelete(comment._id)}>
											Delete
										</button>
									</div>
								)}
						</div>
					</>
				)}
			</div>
		</div>
	);
};

export default Comment;
