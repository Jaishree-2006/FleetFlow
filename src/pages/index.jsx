import '../index.css';
import Navbar from '../components/Navbar';
import React from 'react';

export default function Home() {
  return (
    <div className="bg-gradient-to-b from-blue-500 to-blue-300 min-h-screen text-white">
      <Navbar menu={["Features", "About", "Contact"]} />

      {/* Hero Section */}
      <section className="text-center py-20">
        <div className="bg-blue-600 text-white py-2 px-4 inline-block rounded-full mb-4">
          <span className="text-sm font-semibold">Live Fleet Management System</span>
        </div>
        <h1 className="text-5xl font-bold mb-4">Logistics Simplified. Fleet Managed Smarter.</h1>
        <p className="text-lg mb-8 max-w-2xl mx-auto">
          A centralized rule-based system to manage vehicles, drivers, trips, maintenance, and financial performance — all in one place.
        </p>
        <div className="flex justify-center gap-4">
          <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition">
            Get Started
          </button>
          <button className="bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-800 transition">
            View Demo
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white text-gray-800 py-20">
        <h2 className="text-3xl font-bold text-center mb-8">Everything You Need</h2>
        <p className="text-center text-gray-600 mb-12">
          Powerful tools to keep your fleet running efficiently and profitably
        </p>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
          <div className="bg-blue-50 p-6 rounded-lg shadow-md text-center">
            <span className="text-4xl text-blue-600">🚚</span>
            <h3 className="font-bold text-lg mt-4 mb-2">Real-Time Fleet Tracking</h3>
            <p className="text-gray-600">Monitor vehicle status, location, and utilization live with instant updates.</p>
          </div>
          <div className="bg-yellow-50 p-6 rounded-lg shadow-md text-center">
            <span className="text-4xl text-yellow-600">🛠</span>
            <h3 className="font-bold text-lg mt-4 mb-2">Maintenance Automation</h3>
            <p className="text-gray-600">Auto-trigger maintenance alerts and remove vehicles from dispatch pool.</p>
          </div>
          <div className="bg-green-50 p-6 rounded-lg shadow-md text-center">
            <span className="text-4xl text-green-600">👤</span>
            <h3 className="font-bold text-lg mt-4 mb-2">Driver Compliance</h3>
            <p className="text-gray-600">Track license expiry, safety scores, and block non-compliant drivers automatically.</p>
          </div>
          <div className="bg-purple-50 p-6 rounded-lg shadow-md text-center">
            <span className="text-4xl text-purple-600">📊</span>
            <h3 className="font-bold text-lg mt-4 mb-2">Financial Analytics & ROI</h3>
            <p className="text-gray-600">Calculate fuel efficiency, vehicle ROI, and export detailed reports instantly.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
