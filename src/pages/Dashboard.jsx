import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";
import DashboardStats from "../components/dashboard/DashboardStats";
import DashboardCoach from "../components/dashboard/DashboardCoach";
import RecentSessions from "../components/dashboard/RecentSessions";
import ContinueLearning from "../components/dashboard/ContinueLearning";
import QuickActions from "../components/dashboard/QuickActions";
import TrendingSongs from "../components/dashboard/TrendingSongs";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      <div className="flex">
        <Sidebar />

        <main className="flex-1 p-8 space-y-8">
          <DashboardStats />
          <DashboardCoach />
          <QuickActions />
          <RecentSessions />
          <ContinueLearning />
          <TrendingSongs />
        </main>
      </div>
    </div>
  );
}
