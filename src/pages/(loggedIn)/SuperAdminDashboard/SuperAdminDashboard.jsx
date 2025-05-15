import React, { useEffect, useState } from "react";
import "./SuperAdminDashboard.scss";
import CommonButton from "../../../components/ui/Button";
import Graph from "../../../components/ui/graph/Graph";
import StatusItem from "../../../components/ui/graph/StatusItem";
import ProgressBar from "../../../components/ui/progressBar/ProgressBar";
import { useNavigate } from "react-router-dom";
import { fetchBlocksWithRooms } from "../../../../services/src/services/blockService";
import { fetchBookingRequestsStatus } from "../../../../services/src/services/bookingRequestService";
import { fetchAllGuestDetails } from "../../../../services/src/services/guestDetailsService";
import { fetchDonations } from "../../../../services/src/services/donationsService";
import { useAuthStore } from "../../../../store/authStore";
import DashboardCard from "./components/DashboardCard";
import DateRangeSelector from "./components/DateRangeSelector";

const SuperAdminDashboard = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    guestHouse: {
      totalApplications: 0,
      currentGuestCount: 0,
      statuses: {
        awaiting: 0,
        approved: 0,
        on_hold: 0,
        rejected: 0,
        rescheduled: 0,
      },
      checkIns: 0,
      checkOuts: 0,
      blockRoomStats: [],
      roomOccupancyRate: 0,
    },
    donations: {
      totalAmount: 0,
      monthlyAmount: 0,
      donationCount: 0,
      recentDonations: [],
      yearlyTrend: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    },
    deeksha: {
      totalApplications: 0,
      pendingApplications: 0,
      approvedApplications: 0,
      rejectedApplications: 0,
      monthlyApplications: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    },
    coupons: {
      totalCoupons: 0,
      activeCoupons: 0,
      redeemedCoupons: 0,
      expiredCoupons: 0,
      usageByType: {},
    },
  });
  const [selectedPeriod, setSelectedPeriod] = useState("weekly");
  const [dateRange, setDateRange] = useState({
    startDate: (() => {
      const date = new Date();
      date.setDate(date.getDate() - 30);
      return date.toISOString().split('T')[0];
    })(),
    endDate: new Date().toISOString().split('T')[0]
  });
  const user = useAuthStore((state) => state.user);

  // Initial data fetch on component mount only
  useEffect(() => {
    fetchDashboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      
      // Fetch guest house data
      const [bookingStatus, guestDetails, blocksWithRooms] = await Promise.all([
        fetchBookingRequestsStatus(),
        fetchAllGuestDetails(),
        fetchBlocksWithRooms()
      ]);
      
      console.log("Filtering data by date range:", dateRange);
      
      // Process guest house data
      const currentGuestCount = guestDetails.data.filter(
        (guest) => guest.attributes.status === "Arrived"
      ).length;
      
      // Calculate room statistics for each block
      const blockStats = blocksWithRooms.data.map((block) => {
        const stats = {
          available: 0,
          occupied: 0,
          blocked: 0,
          cleaning: 0,
        };

        block.attributes.rooms.data.forEach((room) => {
          const hasActiveBlocking = room.attributes.room_blockings.data.some(
            (blocking) => blocking.attributes.room_block_status === "blocked"
          );
          const isOccupied = room.attributes.room_allocations.data.some(
            (allocation) => allocation.attributes.room_status === "allocated"
          );

          if (hasActiveBlocking) {
            stats.blocked++;
          } else if (isOccupied) {
            stats.occupied++;
          } else {
            stats.available++;
          }
        });

        return {
          blockName: block.attributes.block_name,
          stats
        };
      });
      
      // Calculate room occupancy rate
      const totalRooms = blockStats.reduce((total, block) => {
        return total + block.stats.available + block.stats.occupied + block.stats.blocked + block.stats.cleaning;
      }, 0);
      
      const occupiedRooms = blockStats.reduce((total, block) => {
        return total + block.stats.occupied;
      }, 0);
      
      const roomOccupancyRate = totalRooms > 0 ? (occupiedRooms / totalRooms) * 100 : 0;
      
      // Fetch donation data
      const donationResponse = await fetchDonations();
      const donations = donationResponse.data || [];
      
      // Filter donations by date range
      const filteredDonations = donations.filter(donation => {
        const donationDate = new Date(donation.attributes.date);
        const rangeStart = new Date(dateRange.startDate);
        const rangeEnd = new Date(dateRange.endDate);
        rangeEnd.setHours(23, 59, 59, 999); // Include the full end date
        
        return donationDate >= rangeStart && donationDate <= rangeEnd;
      });
      
      // Calculate total donation amount for filtered donations
      const totalAmount = filteredDonations.reduce((sum, donation) => {
        return sum + (parseFloat(donation.attributes.amount) || 0);
      }, 0);
      
      // Calculate monthly amount (donations in the current month)
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth();
      const currentYear = currentDate.getFullYear();
      
      const monthlyDonations = filteredDonations.filter(donation => {
        const donationDate = new Date(donation.attributes.date);
        return donationDate.getMonth() === currentMonth && donationDate.getFullYear() === currentYear;
      });
      
      const monthlyAmount = monthlyDonations.reduce((sum, donation) => {
        return sum + (parseFloat(donation.attributes.amount) || 0);
      }, 0);
      
      // Get recent donations (last 5)
      const recentDonations = [...filteredDonations]
        .sort((a, b) => new Date(b.attributes.date) - new Date(a.attributes.date))
        .slice(0, 5);
      
      // Calculate yearly trend (monthly donations for the last 12 months)
      const yearlyTrend = Array(12).fill(0);
      filteredDonations.forEach(donation => {
        const donationDate = new Date(donation.attributes.date);
        const month = donationDate.getMonth();
        const year = donationDate.getFullYear();
        
        if (year === currentYear || (year === currentYear - 1 && month > currentMonth)) {
          const index = (month - currentMonth + 12) % 12;
          yearlyTrend[index] += parseFloat(donation.attributes.amount) || 0;
        }
      });
      
      // Update dashboard data
      setDashboardData({
        guestHouse: {
          totalApplications: bookingStatus.totalRequests || 0,
          currentGuestCount,
          statuses: {
            awaiting: bookingStatus.awaitingCount || 0,
            approved: bookingStatus.approvedCount || 0,
            on_hold: bookingStatus.onHoldCount || 0,
            rejected: bookingStatus.rejectedCount || 0,
            rescheduled: bookingStatus.rescheduledCount || 0,
          },
          checkIns: bookingStatus.todayCheckIns || 0,
          checkOuts: bookingStatus.todayCheckOuts || 0,
          blockRoomStats: blockStats,
          roomOccupancyRate,
        },
        donations: {
          totalAmount,
          monthlyAmount,
          donationCount: filteredDonations.length,
          recentDonations,
          yearlyTrend,
        },
        deeksha: {
          // We would implement actual data fetching here
          totalApplications: 125,
          pendingApplications: 15,
          approvedApplications: 100,
          rejectedApplications: 10,
          monthlyApplications: [12, 10, 15, 8, 14, 20, 16, 18, 22, 15, 10, 12],
        },
        coupons: {
          // We would implement actual data fetching here
          totalCoupons: 250,
          activeCoupons: 180,
          redeemedCoupons: 50,
          expiredCoupons: 20,
          usageByType: {
            "Meal": 30,
            "Room": 15,
            "Special": 5
          },
        },
      });
      
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setIsLoading(false);
    }
  };

  const navigateToSection = (path) => {
    navigate(path);
  };

  const handlePeriodChange = (period) => {
    setSelectedPeriod(period);
    // In a real implementation, you might want to refresh data based on the selected period
  };
  
  const handleDateRangeChange = (newDateRange) => {
    console.log("Date range changed:", newDateRange);
    setDateRange(newDateRange);
  };

  return (
    <div className="super-admin-dashboard">
      <div className="dashboard-header">
        <h1>Super Admin Dashboard</h1>
        <div className="user-welcome">
          <p>Welcome back, {user?.username || "Administrator"}!</p>
          <p className="date-display">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
      </div>
      
      {isLoading ? (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading dashboard data...</p>
        </div>
      ) : (
        <>
          <div className="dashboard-controls">
            <div className="controls-left">
              <div className="period-selector">
                <button 
                  className={selectedPeriod === "daily" ? "active" : ""} 
                  onClick={() => handlePeriodChange("daily")}
                >
                  Daily
                </button>
                <button 
                  className={selectedPeriod === "weekly" ? "active" : ""} 
                  onClick={() => handlePeriodChange("weekly")}
                >
                  Weekly
                </button>
                <button 
                  className={selectedPeriod === "monthly" ? "active" : ""} 
                  onClick={() => handlePeriodChange("monthly")}
                >
                  Monthly
                </button>
                <button 
                  className={selectedPeriod === "yearly" ? "active" : ""} 
                  onClick={() => handlePeriodChange("yearly")}
                >
                  Yearly
                </button>
              </div>
            </div>
            
            <div className="controls-right">
              <DateRangeSelector onDateRangeChange={handleDateRangeChange} />
              <button className="refresh-button" onClick={fetchDashboardData}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M14 8.00016C14 4.68732 11.3137 2.00016 8.00001 2.00016C4.68629 2.00016 2.00001 4.68644 2.00001 8.00016C2.00001 11.3139 4.68629 14.0002 8.00001 14.0002" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  <path d="M14 4.00016V8.00016H10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Refresh
              </button>
            </div>
          </div>

          <div className="dashboard-grid">
            {/* Guest House Metrics */}
            <DashboardCard 
              title="Guest House" 
              icon="home"
              primaryMetric={{
                label: "Current Occupancy", 
                value: `${dashboardData.guestHouse.roomOccupancyRate.toFixed(1)}%`
              }}
              metrics={[
                { label: "Current Guests", value: dashboardData.guestHouse.currentGuestCount },
                { label: "Today's Check-ins", value: dashboardData.guestHouse.checkIns },
                { label: "Today's Check-outs", value: dashboardData.guestHouse.checkOuts },
              ]}
              chart={{
                type: "doughnut",
                labels: ["Available", "Occupied", "Blocked", "Cleaning"],
                data: [
                  dashboardData.guestHouse.blockRoomStats.reduce((sum, block) => sum + block.stats.available, 0),
                  dashboardData.guestHouse.blockRoomStats.reduce((sum, block) => sum + block.stats.occupied, 0),
                  dashboardData.guestHouse.blockRoomStats.reduce((sum, block) => sum + block.stats.blocked, 0),
                  dashboardData.guestHouse.blockRoomStats.reduce((sum, block) => sum + block.stats.cleaning, 0),
                ]
              }}
              footer={{
                label: "View Guest House Dashboard",
                action: () => navigateToSection("/dashboard")
              }}
            />

            {/* Donation Metrics */}
            <DashboardCard 
              title="Donations" 
              icon="donation"
              primaryMetric={{
                label: "Total Donations", 
                value: `₹${dashboardData.donations.totalAmount.toLocaleString()}`
              }}
              metrics={[
                { label: "This Month", value: `₹${dashboardData.donations.monthlyAmount.toLocaleString()}` },
                { label: "Total Count", value: dashboardData.donations.donationCount },
              ]}
              chart={{
                type: "line",
                labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].slice(-6),
                data: dashboardData.donations.yearlyTrend.slice(-6)
              }}
              footer={{
                label: "View Donation Dashboard",
                action: () => navigateToSection("/newDonation")
              }}
            />

            {/* Deeksha Metrics */}
            <DashboardCard 
              title="Deeksha" 
              icon="deeksha"
              primaryMetric={{
                label: "Total Applications", 
                value: dashboardData.deeksha.totalApplications
              }}
              metrics={[
                { label: "Pending", value: dashboardData.deeksha.pendingApplications },
                { label: "Approved", value: dashboardData.deeksha.approvedApplications },
                { label: "Rejected", value: dashboardData.deeksha.rejectedApplications },
              ]}
              chart={{
                type: "bar",
                labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"].slice(-6),
                data: dashboardData.deeksha.monthlyApplications.slice(-6)
              }}
              footer={{
                label: "View Deeksha Dashboard",
                action: () => navigateToSection("/deeksha")
              }}
            />

            {/* Coupon Metrics */}
            <DashboardCard 
              title="Coupons" 
              icon="coupon"
              primaryMetric={{
                label: "Total Coupons", 
                value: dashboardData.coupons.totalCoupons
              }}
              metrics={[
                { label: "Active", value: dashboardData.coupons.activeCoupons },
                { label: "Redeemed", value: dashboardData.coupons.redeemedCoupons },
                { label: "Expired", value: dashboardData.coupons.expiredCoupons },
              ]}
              chart={{
                type: "pie",
                labels: Object.keys(dashboardData.coupons.usageByType),
                data: Object.values(dashboardData.coupons.usageByType)
              }}
              footer={{
                label: "View Coupon Dashboard",
                action: () => navigateToSection("/coupons")
              }}
            />

            {/* Room Status by Block */}
            <DashboardCard 
              title="Room Status by Block" 
              icon="room"
              fullWidth={true}
              table={{
                headers: ["Block Name", "Available", "Occupied", "Blocked", "Cleaning", "Occupancy Rate"],
                rows: dashboardData.guestHouse.blockRoomStats.map(block => {
                  const total = block.stats.available + block.stats.occupied + block.stats.blocked + block.stats.cleaning;
                  const occupancyRate = total > 0 ? (block.stats.occupied / total * 100).toFixed(1) + "%" : "0%";
                  
                  return [
                    block.blockName,
                    block.stats.available,
                    block.stats.occupied,
                    block.stats.blocked,
                    block.stats.cleaning,
                    occupancyRate
                  ];
                })
              }}
              footer={{
                label: "View Room Management",
                action: () => navigateToSection("/book-room-management")
              }}
            />

            {/* Recent Donations */}
            <DashboardCard 
              title="Recent Donations" 
              icon="recent"
              fullWidth={true}
              table={{
                headers: ["Date", "Name", "Amount", "Mode", "Status"],
                rows: dashboardData.donations.recentDonations.map(donation => [
                  new Date(donation.attributes.date).toLocaleDateString(),
                  donation.attributes.name || "Anonymous",
                  `₹${parseFloat(donation.attributes.amount).toLocaleString()}`,
                  donation.attributes.payment_mode || "N/A",
                  donation.attributes.status || "Completed"
                ])
              }}
              footer={{
                label: "View All Donations",
                action: () => navigateToSection("/allDonation")
              }}
            />
          </div>

          <div className="action-buttons">
            <CommonButton
              buttonName="Generate Reports"
              onClick={() => navigate("/donation-audit-dashboard")}
              style={{
                backgroundColor: "#ea7704",
                fontSize: "14px",
                borderRadius: "8px",
                borderWidth: 0,
                padding: "8px 16px",
              }}
            />
            <CommonButton
              buttonName="User Management"
              onClick={() => navigate("/user-management")}
              style={{
                backgroundColor: "#ea7704",
                fontSize: "14px",
                borderRadius: "8px",
                borderWidth: 0,
                padding: "8px 16px",
                marginLeft: "16px"
              }}
            />
            <CommonButton
              buttonName="View Notifications"
              onClick={() => navigate("/notifications")}
              style={{
                backgroundColor: "#ea7704",
                fontSize: "14px",
                borderRadius: "8px",
                borderWidth: 0,
                padding: "8px 16px",
                marginLeft: "16px"
              }}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default SuperAdminDashboard;
