import { Link } from "react-router-dom";
import CallToAction from "../components/CallToAction";
import { useEffect, useState } from "react";
import PostCard from "../components/PostCard";

const Home = () => {
	const [posts, setPosts] = useState([]);

	useEffect(() => {
		const fetchPosts = async () => {
			const res = await fetch("/api/post/get-posts");
			const data = await res.json();
			setPosts(data.posts);
		};
		fetchPosts();
	}, []);

	return (
		<div>
			<div className="flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto ">
				<h1 className="text-3xl font-bold lg:text-6xl">Welcome to ChiaSeKienThuc</h1>
				<p className="text-gray-500 text-xs sm:text-sm">
					Here you&apos;ll find a variety of articles and tutorials on topics
					such as web development, software engineering, and programming
					languages.
				</p>
				<Link
					to="/search"
					className="text-xs sm:text-sm text-teal-500 font-bold hover:underline">
					View all posts
				</Link>
			</div>
			<div className="p-3 bg-amber-100 dark:bg-slate-700">
				<CallToAction />
			</div>

			<div className="max-w-7xl mx-auto p-3 flex flex-col gap-8 py-7">
				{posts && posts.length > 0 && (
					<div className="flex flex-col">
						<h2 className="text-2xl font-semibold text-center">Recent Posts</h2>
						<div className="flex flex-wrap">
							{posts.map((post) => (
								<div className="w-full md:w-1/2 xl:w-1/3 p-2" key={post._id}>
									<PostCard post={post} />
								</div>
							))}
						</div>
						<Link
							to={"/search"}
							className="text-lg text-teal-500 hover:underline text-center">
							View all posts
						</Link>
					</div>
				)}
			</div>
		</div>
	);
};

export default Home;
