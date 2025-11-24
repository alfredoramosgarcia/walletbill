import Header from "../components/header/Header";
import { Outlet } from "react-router-dom";

export default function MainLayout() {
	return (
		<div className="min-h-screen bg-[#D9ECEA]">
			<Header />
			<Outlet />
		</div>
	);
}
