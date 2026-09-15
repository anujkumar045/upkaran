// Comprehensive mock database for UPKARAN Agricultural Platform

export const CATEGORIES = [
  { id: 'cat-1', name: 'Tractors & Power Tillers', icon: '🚜', count: 145, image: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=600&q=80' },
  { id: 'cat-2', name: 'Harvesting & Threshing', icon: '🌾', count: 82, image: 'https://images.unsplash.com/photo-1530507629858-e4977d30e9e0?auto=format&fit=crop&w=600&q=80' },
  { id: 'cat-3', name: 'Tillage & Land Prep', icon: '🌱', count: 110, image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=600&q=80' },
  { id: 'cat-4', name: 'Planting & Sowing', icon: '🌽', count: 64, image: 'https://images.unsplash.com/photo-1586771107445-d3ca888129ff?auto=format&fit=crop&w=600&q=80' },
  { id: 'cat-5', name: 'Irrigation & Solar Pumps', icon: '💧', count: 95, image: 'https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?auto=format&fit=crop&w=600&q=80' },
  { id: 'cat-6', name: 'Agri Drones & Tech', icon: '🚁', count: 38, image: 'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?auto=format&fit=crop&w=600&q=80' },
  { id: 'cat-7', name: 'Spraying & Crop Protection', icon: '🧴', count: 0, image: 'https://images.unsplash.com/photo-1586771107445-d3ca888129ff?auto=format&fit=crop&w=600&q=80' },
];

export const MOCK_EQUIPMENT = [
  {
    id: 'eq-101',
    name: 'Mahindra 575 DI SP Plus 47 HP Tractor',
    category: 'Tractors & Power Tillers',
    type: 'Rental & Sale',
    condition: 'Excellent',
    location: 'Ludhiana, Punjab',
    state: 'Punjab',
    dailyRate: 1500,
    hourlyRate: 250,
    purchasePrice: 680000,
    rating: 4.9,
    reviewCount: 34,
    images: [
      'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1530507629858-e4977d30e9e0?auto=format&fit=crop&w=900&q=80'
    ],
    specs: {
      power: '47 HP',
      fuelType: 'Diesel',
      cylinder: '4 Cylinder',
      liftingCapacity: '1500 Kg',
      brakes: 'Oil Immersed Brakes',
      year: '2023'
    },
    description: 'High performance Mahindra 47 HP tractor equipped with power steering and oil-immersed brakes. Ideal for deep plowing, rotavator operations, and heavy hauling. Includes free operator if booked for 3+ days.',
    owner: {
      id: 'owner-1',
      name: 'Equipment Owner',
      phone: '+91 98765 43210',
      rating: 4.95,
      totalListings: 6,
      joined: 'Jan 2022',
      upiId: '',
      qrCodeUrl: 'https://www.image2url.com/r2/default/files/1787605354243-c2db4a9a-c0c8-446b-9aa7-a3fa37915177.jpeg'
    },
    availability: ['2026-08-05', '2026-08-06', '2026-08-07', '2026-08-10', '2026-08-11'],
    featured: true,
  },
  {
    id: 'eq-102',
    name: 'CLAAS CROP TIGER 40 Combine Harvester',
    category: 'Harvesting & Threshing',
    type: 'Rental',
    condition: 'Like New',
    location: 'Karnal, Haryana',
    state: 'Haryana',
    dailyRate: 4500,
    hourlyRate: 800,
    purchasePrice: 2400000,
    rating: 4.8,
    reviewCount: 22,
    images: [
      'https://images.unsplash.com/photo-1530507629858-e4977d30e9e0?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=900&q=80'
    ],
    specs: {
      power: '76 HP',
      cutterBarWidth: '2.1 Meter',
      grainTankCapacity: '1200 Litres',
      year: '2024'
    },
    description: 'Compact rubber track combine harvester suitable for paddy and wheat harvesting even in muddy soil conditions. High cleaning efficiency with minimal grain loss.',
    owner: {
      id: 'owner-2',
      name: 'Equipment Owner',
      phone: '+91 98123 76543',
      rating: 4.85,
      totalListings: 4,
      joined: 'Mar 2021',
      upiId: '',
      qrCodeUrl: ''
    },
    availability: ['2026-08-08', '2026-08-09', '2026-08-12', '2026-08-13'],
    featured: true,
  },
  {
    id: 'eq-103',
    name: 'Shaktiman 7-Feet Heavy Duty Rotavator',
    category: 'Tillage & Land Prep',
    type: 'Rental & Sale',
    condition: 'Good',
    location: 'Nashik, Maharashtra',
    state: 'Maharashtra',
    dailyRate: 900,
    hourlyRate: 150,
    purchasePrice: 125000,
    rating: 4.7,
    reviewCount: 19,
    images: [
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=900&q=80'
    ],
    specs: {
      bladesCount: 48,
      gearboxType: 'Multi Speed',
      workingWidth: '2.1 Mtr',
      year: '2022'
    },
    description: 'Heavy duty rotavator for fine soil seedbed preparation. Compatible with 45+ HP tractors. Comes with extra set of L-type high carbon steel blades.',
    owner: {
      id: 'owner-3',
      name: 'Sanjay Patil',
      phone: '+91 94222 11009',
      rating: 4.78,
      totalListings: 3,
      joined: 'Jun 2023',
      upiId: 'sanjay.patil@paytm',
      qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=upi://pay?pa=sanjay.patil@paytm&pn=Sanjay%20Patil&cu=INR'
    },
    availability: ['2026-08-05', '2026-08-06', '2026-08-07', '2026-08-08'],
    featured: false,
  },
  {
    id: 'eq-104',
    name: 'Garuda AG-10L Smart Spraying Agriculture Drone',
    category: 'Agri Drones & Tech',
    type: 'Rental',
    condition: 'Like New',
    location: 'Coimbatore, Tamil Nadu',
    state: 'Tamil Nadu',
    dailyRate: 3200,
    hourlyRate: 600,
    purchasePrice: 480000,
    rating: 4.95,
    reviewCount: 41,
    images: [
      'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?auto=format&fit=crop&w=900&q=80'
    ],
    specs: {
      payloadTank: '10 Litres',
      flightTime: '20 Mins/Battery',
      coverage: '30 Acres/Day',
      sprayWidth: '4.5 Mtr'
    },
    description: 'Precision spraying drone with radar obstacle avoidance and RTK GPS mapping. Autonomous flight mode included along with certified pilot support.',
    owner: {
      id: 'owner-4',
      name: 'Karthik Raman',
      phone: '+91 97900 88776',
      rating: 4.98,
      totalListings: 2,
      joined: 'Nov 2023',
      upiId: 'karthik.drone@ibl',
      qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=upi://pay?pa=karthik.drone@ibl&pn=Karthik%20Raman&cu=INR'
    },
    availability: ['2026-08-05', '2026-08-06', '2026-08-09', '2026-08-10'],
    featured: true,
  },
  {
    id: 'eq-105',
    name: 'Kirloskar 5 HP Solar Submersible Pump Set',
    category: 'Irrigation & Solar Pumps',
    type: 'Sale',
    condition: 'Brand New',
    location: 'Indore, Madhya Pradesh',
    state: 'Madhya Pradesh',
    dailyRate: 0,
    hourlyRate: 0,
    purchasePrice: 185000,
    rating: 4.88,
    reviewCount: 15,
    images: [
      'https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?auto=format&fit=crop&w=900&q=80'
    ],
    specs: {
      power: '5 HP DC Solar',
      dischargeHead: '100 Meters',
      waterFlow: '1,20,000 LPD',
      solarPanels: '16x 330W Mono-PERC'
    },
    description: 'Government subsidy eligible solar pump set with MPPT controller and automatic grid switch. 5 Years manufacturer warranty.',
    owner: {
      id: 'owner-mfg-1',
      name: 'AgriTech Solutions Ltd.',
      phone: '+91 731 400 9988',
      rating: 4.92,
      totalListings: 12,
      joined: 'Jan 2021',
      upiId: 'agritech@icici',
      qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=upi://pay?pa=agritech@icici&pn=AgriTech%20Solutions&cu=INR'
    },
    availability: ['Always Available'],
    featured: true,
  }
];

export const MOCK_USER_PROFILE = {
  id: 'usr-901',
  name: 'Farmer',
  email: '',
  phone: '+91 98980 12345',
  role: 'farmer', // 'farmer', 'owner', 'manufacturer', 'admin'
  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
  location: 'Anand, Gujarat',
  address: 'Farm No. 42, Vithal Udyognagar, Anand - 388121',
  landSize: '18 Acres',
  cropTypes: ['Cotton', 'Groundnut', 'Wheat'],
  upiId: '',
  qrCodeUrl: '',
  isOwnerEnabled: true,
  verified: true,
};

export const MOCK_BOOKINGS = [
  {
    id: 'BK-2026-8801',
    equipmentId: 'eq-101',
    equipmentName: 'Mahindra 575 DI SP Plus 47 HP Tractor',
    ownerName: 'Equipment Owner',
    ownerPhone: '+91 98765 43210',
    startDate: '2026-08-06',
    endDate: '2026-08-08',
    totalDays: 3,
    dailyRate: 1500,
    subtotal: 4500,
    tax: 810,
    platformFee: 150,
    totalAmount: 5460,
    status: 'Confirmed',
    paymentStatus: 'Paid',
    transactionId: 'TXN9988112233',
    bookedAt: '2026-08-04T10:30:00Z',
  },
  {
    id: 'BK-2026-8802',
    equipmentId: 'eq-104',
    equipmentName: 'Garuda AG-10L Smart Spraying Drone',
    ownerName: 'Karthik Raman',
    ownerPhone: '+91 97900 88776',
    startDate: '2026-08-10',
    endDate: '2026-08-10',
    totalDays: 1,
    dailyRate: 3200,
    subtotal: 3200,
    tax: 576,
    platformFee: 100,
    totalAmount: 3876,
    status: 'Pending',
    paymentStatus: 'Pending Verification',
    transactionId: 'TXN7766554411',
    bookedAt: '2026-08-04T14:15:00Z',
  }
];

export const MOCK_COMMUNITY_POSTS = [
  {
    id: 'post-1',
    author: {
      name: 'Dr. S. K. Swaminathan',
      role: 'Agri Scientist & Consultant',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    },
    timestamp: '2 hours ago',
    content: 'Tractor Maintenance Tip for Monsoon Season 🌧️: Ensure your air filter is cleaned every 50 hours of operation. Water vapor build-up can lower fuel efficiency by up to 15%. Also check oil-immersed brake seals!',
    image: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=800&q=80',
    likes: 84,
    commentsCount: 16,
    comments: [
      { id: 'c-1', user: 'Harpreet Gill', text: 'Very useful advice sir! How often should gearbox oil be changed?', time: '1 hour ago' },
      { id: 'c-2', user: 'Dr. S. K. Swaminathan', text: '@Harpreet Every 600 hours or once a year, whichever comes first.', time: '45 mins ago' }
    ]
  },
  {
    id: 'post-2',
    author: {
      name: 'Vikram Singh',
      role: 'Progressive Farmer (Punjab)',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    },
    timestamp: '5 hours ago',
    content: 'Just used the Garuda Spraying Drone rented via UPKARAN. Managed 25 acres of cotton crop spraying in under 4 hours! Highly recommend drone spraying over manual pumps.',
    image: 'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?auto=format&fit=crop&w=800&q=80',
    likes: 129,
    commentsCount: 24,
    comments: []
  }
];

export const MOCK_NOTIFICATIONS = [
  { id: 'n-1', title: 'Booking Confirmed!', message: 'Your equipment owner confirmed the Mahindra 575 Tractor booking for Aug 6 - Aug 8.', time: '10 mins ago', read: false },
  { id: 'n-2', title: 'Payment Receipt Ready', message: 'Invoice for transaction TXN9988112233 has been generated.', time: '1 hour ago', read: false },
  { id: 'n-3', title: 'New Rental Request', message: 'Farmer Baldev Singh requested your Shaktiman Rotavator for Aug 12.', time: '3 hours ago', read: true },
];

export const MOCK_ADMIN_STATS = {
  totalUsers: 14250,
  activeRentals: 842,
  totalEquipments: 3190,
  monthlyRevenue: 1845000,
  pendingListings: 14,
  reportsCount: 3,
};
