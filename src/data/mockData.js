// Shared mock data for the application
// In a real application, this would come from API calls

export const dashboardStats = {
  totalUsers: 3782,
  totalLogs: 15420,
  platformPerformance: 98.5,
  propertiesSold: 145,
  revenue: 2850000,
  agentPerformance: 87.3
};

export const agents = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john.doe@realestate.com',
    phone: '9876543210',
    licenseNumber: 'RE123456789',
    agency: 'Premium Properties',
    experience: '5 years',
    specialization: 'Residential',
    status: 'active',
    joinDate: '2023-01-15',
    propertiesSold: 45,
    totalSales: 2850000,
    rating: 4.8,
    monthlyData: [
      { month: 'Jan', properties: 12, revenue: 240000 },
      { month: 'Feb', properties: 8, revenue: 160000 },
      { month: 'Mar', properties: 10, revenue: 200000 },
      { month: 'Apr', properties: 15, revenue: 300000 }
    ]
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane.smith@realestate.com',
    phone: '8765432109',
    licenseNumber: 'RE987654321',
    agency: 'Elite Realty',
    experience: '8 years',
    specialization: 'Commercial',
    status: 'active',
    joinDate: '2022-03-20',
    propertiesSold: 67,
    totalSales: 4200000,
    rating: 4.9,
    monthlyData: [
      { month: 'Jan', properties: 8, revenue: 320000 },
      { month: 'Feb', properties: 18, revenue: 360000 },
      { month: 'Mar', properties: 12, revenue: 240000 },
      { month: 'Apr', properties: 16, revenue: 320000 }
    ]
  },
  {
    id: 3,
    name: 'Mike Johnson',
    email: 'mike.johnson@realestate.com',
    phone: '7654321098',
    licenseNumber: 'RE555666777',
    agency: 'City Properties',
    experience: '3 years',
    specialization: 'Luxury',
    status: 'active',
    joinDate: '2023-06-10',
    propertiesSold: 23,
    totalSales: 1650000,
    rating: 4.6,
    monthlyData: [
      { month: 'Jan', properties: 5, revenue: 250000 },
      { month: 'Feb', properties: 7, revenue: 350000 },
      { month: 'Mar', properties: 15, revenue: 300000 },
      { month: 'Apr', properties: 8, revenue: 160000 }
    ]
  },
  {
    id: 4,
    name: 'Sarah Wilson',
    email: 'sarah.wilson@realestate.com',
    phone: '9123456789',
    licenseNumber: 'RE111222333',
    agency: 'Metro Realty',
    experience: '6 years',
    specialization: 'Residential',
    status: 'active',
    joinDate: '2022-11-05',
    propertiesSold: 52,
    totalSales: 3100000,
    rating: 4.7,
    monthlyData: [
      { month: 'Jan', properties: 10, revenue: 200000 },
      { month: 'Feb', properties: 12, revenue: 240000 },
      { month: 'Mar', properties: 8, revenue: 160000 },
      { month: 'Apr', properties: 22, revenue: 440000 }
    ]
  },
  {
    id: 5,
    name: 'David Brown',
    email: 'david.brown@realestate.com',
    phone: '8123456789',
    licenseNumber: 'RE444555666',
    agency: 'Prestige Homes',
    experience: '4 years',
    specialization: 'Commercial',
    status: 'active',
    joinDate: '2023-02-12',
    propertiesSold: 38,
    totalSales: 2400000,
    rating: 4.5,
    monthlyData: [
      { month: 'Jan', properties: 6, revenue: 180000 },
      { month: 'Feb', properties: 9, revenue: 270000 },
      { month: 'Mar', properties: 11, revenue: 330000 },
      { month: 'Apr', properties: 12, revenue: 360000 },
      { month: 'May', properties: 28, revenue: 560000 }
    ]
  },
  {
    id: 6,
    name: 'Lisa Davis',
    email: 'lisa.davis@realestate.com',
    phone: '7123456789',
    licenseNumber: 'RE777888999',
    agency: 'Golden Gate Realty',
    experience: '7 years',
    specialization: 'Luxury',
    status: 'inactive',
    joinDate: '2022-08-18',
    propertiesSold: 41,
    totalSales: 2900000,
    rating: 4.4,
    monthlyData: [
      { month: 'Jan', properties: 7, revenue: 210000 },
      { month: 'Feb', properties: 10, revenue: 300000 },
      { month: 'Mar', properties: 9, revenue: 270000 },
      { month: 'Apr', properties: 15, revenue: 450000 },
      { month: 'May', properties: 20, revenue: 400000 },
      { month: 'Jun', properties: 25, revenue: 500000 }
    ]
  }
];

// Generate sales data from agents
export const salesData = [
  { month: 'Jan', properties: 12, revenue: 240000, agent: 'John Doe' },
  { month: 'Feb', properties: 18, revenue: 360000, agent: 'Jane Smith' },
  { month: 'Mar', properties: 15, revenue: 300000, agent: 'Mike Johnson' },
  { month: 'Apr', properties: 22, revenue: 440000, agent: 'Sarah Wilson' },
  { month: 'May', properties: 28, revenue: 560000, agent: 'David Brown' },
  { month: 'Jun', properties: 25, revenue: 500000, agent: 'Lisa Davis' }
];

export const alerts = [
  { id: 1, type: 'high', title: 'System Performance Alert', message: 'Server response time increased by 15%', time: '5 min ago', read: false },
  { id: 2, type: 'medium', title: 'New Agent Registration', message: '3 new agents pending approval', time: '1 hour ago', read: false },
  { id: 3, type: 'low', title: 'Monthly Report Ready', message: 'June performance report is available', time: '2 hours ago', read: true },
  { id: 4, type: 'high', title: 'Security Alert', message: 'Multiple failed login attempts detected', time: '3 hours ago', read: false }
];

export const purchaseRequests = [
  { id: 1, property: 'Luxury Villa - Downtown', investor: 'Robert Johnson', amount: 850000, status: 'pending', date: '2024-01-15' },
  { id: 2, property: 'Modern Apartment - City Center', investor: 'Emily Davis', amount: 420000, status: 'pending', date: '2024-01-14' },
  { id: 3, property: 'Family House - Suburbs', investor: 'Michael Brown', amount: 320000, status: 'approved', date: '2024-01-13' },
  { id: 4, property: 'Commercial Space - Business District', investor: 'Sarah Wilson', amount: 1200000, status: 'pending', date: '2024-01-12' }
];

export const marketNews = [
  { id: 1, title: 'Real Estate Market Shows Strong Growth in Q1', status: 'approved', date: '2024-01-15', author: 'Market Analyst' },
  { id: 2, title: 'New Housing Development Announced Downtown', status: 'pending', date: '2024-01-14', author: 'City Reporter' },
  { id: 3, title: 'Interest Rates Expected to Stabilize', status: 'approved', date: '2024-01-13', author: 'Financial Expert' },
  { id: 4, title: 'Luxury Property Sales Surge 25%', status: 'pending', date: '2024-01-12', author: 'Real Estate News' }
];