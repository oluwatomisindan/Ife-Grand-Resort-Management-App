// Room Type Configuration
// This defines all available room types with their categories and fixed prices

export const ROOM_TYPES = {
  // STANDARD CATEGORY - 27,500 per room
  STANDARD: [
    { name: 'Onipopo', price: 27500, totalRooms: 14 },
    { name: 'Onisabe', price: 27500, totalRooms: 14 },
    { name: 'Awujale', price: 27500, totalRooms: 14 },
    { name: 'Olubadan', price: 27500, totalRooms: 14 }
  ],
  
  // PREMIUM CATEGORY - 40,000 per room
  PREMIUM: [
    { name: 'Moremi', price: 40000, totalRooms: 10 }
  ],
  
  // SUPER PREMIUM CATEGORY - 40,000 per room
  SUPER_PREMIUM: [
    { name: 'Olowu', price: 40000, totalRooms: 10 }
  ],
  
  // SUPER PREMIUM PLUS CATEGORY - 45,000 per room
  SUPER_PREMIUM_PLUS: [
    { name: 'KSA A', price: 45000, totalRooms: 5 },
    { name: 'KSA B', price: 45000, totalRooms: 5 },
    { name: 'Onibeju A', price: 45000, totalRooms: 5 },
    { name: 'Onibeju B', price: 45000, totalRooms: 5 }
  ],
  
  // EXECUTIVE CATEGORY - 50,000 per room
  EXECUTIVE: [
    { name: 'Oranmiyan', price: 50000, totalRooms: 7 },
    { name: 'Orangun', price: 50000, totalRooms: 6 },
    { name: 'Owa Obokun', price: 50000, totalRooms: 8 },
    { name: 'Alara', price: 50000, totalRooms: 6 }
  ],
  
  // ROYAL DIPLOMATIC CATEGORY - 55,000 per room
  ROYAL_DIPLOMATIC: [
    { name: 'Iyalaje', price: 55000, totalRooms: 8 },
    { name: 'Zulu', price: 55000, totalRooms: 5 },
    { name: 'Old Ooni', price: 55000, totalRooms: 4 }
  ],
  
  // KINGS CATEGORY - Variable pricing
  KINGS: [
    { name: 'Ajero', price: 55000, totalRooms: 10 },
    { name: '3 Bedroom Apartment', price: 165000, totalRooms: 1 },
    { name: '2 Bedroom Apartment', price: 100000, totalRooms: 1 }
  ]
};

// Helper function to get room types for a specific category
export const getRoomTypesByCategory = (category) => {
  const categoryKey = category.toUpperCase().replace(/ /g, '_');
  return ROOM_TYPES[categoryKey] || [];
};

// Helper function to get price for a specific room type
export const getPriceForRoomType = (category, roomType) => {
  const types = getRoomTypesByCategory(category);
  const type = types.find(t => t.name === roomType);
  return type ? type.price : 0;
};

// Get all room types as a flat array
export const getAllRoomTypes = () => {
  return Object.entries(ROOM_TYPES).flatMap(([category, types]) =>
    types.map(type => ({
      ...type,
      category: category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
    }))
  );
};

// Generate room number prefix from room type name
export const getRoomPrefix = (roomTypeName: string): string => {
  if (!roomTypeName) return '';
  
  // Special cases for specific room types
  const specialCases: { [key: string]: string } = {
    'Onipopo': 'ONI',
    'Onisabe': 'ONIS',
    'Awujale': 'AWU',
    'Olubadan': 'OLU',
    'Moremi': 'MOR',
    'Olowu': 'OLO',
    'KSA A': 'KSAA',
    'KSA B': 'KSAB',
    'Onibeju A': 'ONBA',
    'Onibeju B': 'ONBB',
    'Oranmiyan': 'ORAN',
    'Orangun': 'ORAG',
    'Owa Obokun': 'OWAO',
    'Alara': 'ALA',
    'Iyalaje': 'IYA',
    'Zulu': 'ZULU',
    'Old Ooni': 'OLOO',
    'Ajero': 'AJE',
    '3 Bedroom Apartment': '3BED',
    '2 Bedroom Apartment': '2BED'
  };
  
  // Check if there's a special case
  if (specialCases[roomTypeName]) {
    return specialCases[roomTypeName];
  }
  
  // Default: Take first 3 letters of the room type name
  const cleaned = roomTypeName.replace(/[^a-zA-Z]/g, '').toUpperCase();
  
  // Use first 3 characters for consistency
  return cleaned.substring(0, 3);
};
