import React from 'react';
import Header from '../components/Header';
import DashboardComponent from '../components/Dashboard/Dashboard';
import { useAuth } from '../hooks/useAuth';

const Dashboard = () => {
  const { isSubscribed } = useAuth();
  
  return (
    <div className="min-h-screen">
      <Header isSubscribed={isSubscribed} />
      <DashboardComponent />
    </div>
  );
};

export default Dashboard;

