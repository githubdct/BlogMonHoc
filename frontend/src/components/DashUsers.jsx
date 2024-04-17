import { Button, Modal, Table } from "flowbite-react";
import { useEffect, useState } from "react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { FaCheck, FaTimes } from "react-icons/fa";
import { useSelector } from "react-redux";

const DashUsers = () => {
	const { currentUser } = useSelector((state) => state.user);

	const [users, setUsers] = useState([]);
	const [showMore, setShowMore] = useState(true);
	const [showModal, setShowModal] = useState(false);
	const [userIdToDelete, setUserIdToDelete] = useState("");

	useEffect(() => {
		const fetchUsers = async () => {
			try {
				const res = await fetch(`/api/user/get-users`);
				const data = await res.json();

				if (res.ok) {
					setUsers(data.users);
					if (data.users.length < 9) {
						setShowMore(false);
					}
				}
			} catch (error) {
				console.log(error.message);
			}
		};

		if (currentUser.isAdmin) {
			fetchUsers();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currentUser._id]);

	const handleShowMore = async () => {
		const startIndex = users.length;

		try {
			const res = await fetch(`/api/user/get-user?startIndex=${startIndex}`);

			const data = await res.json();

			if (res.ok) {
				setUsers((prev) => [...prev, ...data.users]);
				if (data.users.length < 9) {
					setShowMore(false);
				}
			}
		} catch (error) {
			console.log(error.message);
		}
	};

	const handleDeleteUser = async () => {
		setShowModal(false);

		try {
			const res = await fetch(`/api/user/delete/${userIdToDelete}`, {
				method: "DELETE",
			});

			const data = await res.json();

			if (res.ok) {
				setUsers((prev) => prev.filter((user) => user._id != userIdToDelete));
				setUserIdToDelete("");
			} else {
				console.log(data.message);
			}
		} catch (error) {
			console.log(error.message);
		}
	};

	return (
		<div className="w-full max-w-[1200px] md:mx-auto table-auto overflow-x-scroll p-3 scrollbar scrollbar-track-slate-300 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-500 dark:scrollbar-thumb-slate-700">
			{currentUser.isAdmin && users.length > 0 ? (
				<>
					<Table hoverable className="shadow-md">
						<Table.Head>
							<Table.HeadCell>Date created</Table.HeadCell>
							<Table.HeadCell>User image</Table.HeadCell>
							<Table.HeadCell>Username</Table.HeadCell>
							<Table.HeadCell>Email</Table.HeadCell>
							<Table.HeadCell>Admin</Table.HeadCell>
							<Table.HeadCell>Delete</Table.HeadCell>
						</Table.Head>
						<Table.Body className="divide-y">
							{users.map((user) => (
								<Table.Row
									key={user._id}
									className="bg-white dark:border-gray-700 dark:bg-gray-800">
									<Table.Cell>
										{new Date(user.createdAt).toLocaleDateString()}
									</Table.Cell>
									<Table.Cell>
										<img
											src={user.profilePicture}
											alt={user.username}
											className="h-[40px] w-[40px] object-cover bg-gray-500 rounded-full"
										/>
									</Table.Cell>
									<Table.Cell>{user.username}</Table.Cell>
									<Table.Cell>{user.email}</Table.Cell>
									<Table.Cell>
										{user.isAdmin ? (
											<FaCheck className="text-green-500" />
										) : (
											<FaTimes className="text-red-500" />
										)}
									</Table.Cell>
									<Table.Cell>
										<span
											onClick={() => {
												setShowModal(true);
												setUserIdToDelete(user._id);
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
				<p>You have no User</p>
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
							Are you sure want to delete user?
						</h3>
						<div className="flex items-center justify-center gap-10">
							<Button color="failure" onClick={handleDeleteUser}>
								Yes, Delete User
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

export default DashUsers;
