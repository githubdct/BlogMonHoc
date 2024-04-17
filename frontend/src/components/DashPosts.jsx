import { Button, Modal, Table } from "flowbite-react";
import { useEffect, useState } from "react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
const DashPosts = () => {
	const { currentUser } = useSelector((state) => state.user);

	const [posts, setPosts] = useState([]);
	const [showMore, setShowMore] = useState(true);
	const [showModal, setShowModal] = useState(false);
	const [postIdToDelete, setPostIdToDelete] = useState("");

	useEffect(() => {
		const fetchPosts = async () => {
			try {
				const res = await fetch(
					`/api/post/get-posts?userId=${currentUser._id}`
				);
				const data = await res.json();

				if (res.ok) {
					setPosts(data.posts);
					if (data.posts.length < 9) {
						setShowMore(false);
					}
				}
			} catch (error) {
				console.log(error.message);
			}
		};

		if (currentUser.isAdmin) {
			fetchPosts();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currentUser._id]);

	const handleShowMore = async () => {
		const startIndex = posts.length;

		try {
			const res = await fetch(
				`/api/post/get-posts?userId=${currentUser._id}&startIndex=${startIndex}`
			);

			const data = await res.json();

			if (res.ok) {
				setPosts((prev) => [...prev, ...data.posts]);
				if (data.posts.length < 9) {
					setShowMore(false);
				}
			}
		} catch (error) {
			console.log(error.message);
		}
	};

	const handleDeletePost = async () => {
		setShowModal(false);

		try {
			const res = await fetch(
				`/api/post/delete/${postIdToDelete}/${currentUser._id}`,
				{
					method: "DELETE",
				}
			);

			const data = await res.json();

			if (!res.ok) {
				console.log(data.message);
			} else {
				setPosts((prev) => prev.filter((post) => post._id !== postIdToDelete));
				setPostIdToDelete("");
			}
		} catch (error) {
			console.log(error.message);
		}
	};

	return (
		<div className="w-full max-w-[1200px] md:mx-auto table-auto overflow-x-scroll p-3 scrollbar scrollbar-track-slate-300 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-500 dark:scrollbar-thumb-slate-700">
			{currentUser.isAdmin && posts.length > 0 ? (
				<>
					<Table hoverable className="shadow-md">
						<Table.Head>
							<Table.HeadCell>Date update</Table.HeadCell>
							<Table.HeadCell>Post image</Table.HeadCell>
							<Table.HeadCell>Post title</Table.HeadCell>
							<Table.HeadCell>Category</Table.HeadCell>
							<Table.HeadCell>
								<span>Edit</span>
							</Table.HeadCell>
							<Table.HeadCell>Delete</Table.HeadCell>
						</Table.Head>
						<Table.Body className="divide-y">
							{posts.map((post) => (
								<Table.Row
									key={post._id}
									className="bg-white dark:border-gray-700 dark:bg-gray-800">
									<Table.Cell>
										{new Date(post.updatedAt).toLocaleDateString()}
									</Table.Cell>
									<Table.Cell>
										<Link to={"/post/" + post.slug}>
											<img
												src={post.image}
												alt={post.title}
												className="h-[100px] max-w-32 object-cover bg-gray-500"
											/>
										</Link>
									</Table.Cell>
									<Table.Cell>
										<Link
											className="font-medium text-gray-900 dark:text-white"
											to={"/post/" + post.slug}>
											{post.title}
										</Link>
									</Table.Cell>
									<Table.Cell>{post.category}</Table.Cell>
									<Table.Cell>
										<Link to={"/update-post/" + post._id}>
											<span className="hover:underline text-teal-500">
												Edit
											</span>
										</Link>
									</Table.Cell>
									<Table.Cell>
										<span
											onClick={() => {
												setShowModal(true);
												setPostIdToDelete(post._id);
											}}
											className="hover:underline cursor-pointer font-medium text-red-500">
											Delete
										</span>
									</Table.Cell>
								</Table.Row>
							))}
						</Table.Body>
					</Table>
					{showMore && (
						<button
							onClick={handleShowMore}
							className="w-full text-teal-500 self-center text-sm py-7">
							Show more
						</button>
					)}
				</>
			) : (
				<p>You have no Post</p>
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
							Are you sure want to delete post?
						</h3>
						<div className="flex items-center justify-center gap-10">
							<Button color="failure" onClick={handleDeletePost}>
								Yes, Delete Post
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

export default DashPosts;
