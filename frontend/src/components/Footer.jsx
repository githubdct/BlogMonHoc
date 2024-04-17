import { Footer } from "flowbite-react";
import { Link } from "react-router-dom";
import {
	BsDribbble,
	BsFacebook,
	BsGithub,
	BsInstagram,
	BsTwitter,
} from "react-icons/bs";

const FooterCom = () => {
	return (
		<Footer container className="border border-t-8 border-teal-500">
			<div className="w-full max-w-7xl mx-auto">
				<div className="grid w-full justify-between sm:flex md:grid-cols-1">
					<div className="flex md:items-center md:justify-center">
						<Link
							to="/"
							className="self-center whitespace-nowrap text-lg sm:text-xl font-semibold dark:text-white">
							<span className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white">
							ChiaSeKienThuc&apos;s
							</span>
							Blogs
						</Link>
					</div>
					<div className="grid mt-4 sm:mt-0 grid-cols-2 gap-3 sm:mt-4 sm:grid-cols-3 sm:gap-6">
						<div>
							<Footer.Title title="ABOUT" />
							<Footer.LinkGroup col>
								<Footer.Link href="#" target="_blank" rel="noopener noreferrer">
									Projects
								</Footer.Link>
							</Footer.LinkGroup>
							<Footer.LinkGroup col>
								<Footer.Link
									href="/"
									className="mt-2"
									rel="noopener noreferrer">
									ChiaSeKienThuc&apos;s Blog
								</Footer.Link>
							</Footer.LinkGroup>
						</div>
						<div>
							<Footer.Title title="FOLLOW US" />
							<Footer.LinkGroup col>
								<Footer.Link
									href="https://github.com/locan1106"
									target="_blank"
									rel="noopener noreferrer">
									Github
								</Footer.Link>
							</Footer.LinkGroup>
							<Footer.LinkGroup col>
								<Footer.Link
									href="#"
									className="mt-2"
									rel="noopener noreferrer">
									Facebook
								</Footer.Link>
							</Footer.LinkGroup>
						</div>
						<div>
							<Footer.Title title="LEGAL" />
							<Footer.LinkGroup col>
								<Footer.Link href="#" rel="noopener noreferrer">
									Privacy Policy
								</Footer.Link>
							</Footer.LinkGroup>
							<Footer.LinkGroup col>
								<Footer.Link
									href="#"
									className="mt-2"
									rel="noopener noreferrer">
									Terms & Conditions
								</Footer.Link>
							</Footer.LinkGroup>
						</div>
					</div>
				</div>
				<Footer.Divider />
				<div className="w-full flex items-center justify-between">
					<Footer.Copyright
						href="#"
						by="ChiaSeKienThuc"
						year={new Date().getFullYear()}
					/>
					<div className="flex gap-6 sm:mt-0 mt-4 sm:justify-center">
						<div className="transition-transform duration-300 hover:translate-y-[-8px] ease-in-out">
							<Footer.Icon href="#" icon={BsFacebook} />
						</div>
						<div className="transition-transform duration-300 hover:translate-y-[-8px] ease-in-out">
							<Footer.Icon href="#" icon={BsInstagram} />
						</div>
						<div className="transition-transform duration-300 hover:translate-y-[-8px] ease-in-out">
							<Footer.Icon href="#" icon={BsTwitter} />
						</div>
						<div className="transition-transform duration-300 hover:translate-y-[-8px] ease-in-out">
							<Footer.Icon href="#" icon={BsGithub} />
						</div>
						<div className="transition-transform duration-300 hover:translate-y-[-8px] ease-in-out">
							<Footer.Icon href="#" icon={BsDribbble} />
						</div>
					</div>
				</div>
			</div>
		</Footer>
	);
};

export default FooterCom;
