// Direct test of room creation API
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

async function testRoomCreation() {
    try {
        console.log('🧪 Testing Room Creation API...\n');
        
        // First, try to login to get a token
        console.log('Step 1: Logging in...');
        const loginResponse = await axios.post(`${API_URL}/auth/login`, {
            email: 'superadmin@ife.com',
            password: 'password123'
        });
        
        const token = loginResponse.data.token;
        console.log('✅ Login successful');
        console.log(`   User: ${loginResponse.data.user.name} (${loginResponse.data.user.role})\n`);
        
        // Test room creation
        console.log('Step 2: Creating a test room...');
        const newRoom = {
            id: `room-test-${Date.now()}`,
            number: `TEST-${Math.floor(Math.random() * 1000)}`,
            type: 'Standard',
            price: 12000,
            status: 'Clean'
        };
        
        console.log('   Room data:', JSON.stringify(newRoom, null, 2));
        
        const createResponse = await axios.post(`${API_URL}/rooms`, newRoom, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        console.log('\n✅ Room created successfully!');
        console.log('   Response:', JSON.stringify(createResponse.data, null, 2));
        
        // Verify the room was created
        console.log('\nStep 3: Verifying room creation...');
        const roomsResponse = await axios.get(`${API_URL}/rooms/status`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        const createdRoom = roomsResponse.data.find(r => r.id === newRoom.id);
        if (createdRoom) {
            console.log('✅ Room verified in database');
            console.log(`   Room ${createdRoom.number} exists with price ₦${createdRoom.price}`);
        } else {
            console.log('❌ Room not found in database');
        }
        
        console.log('\n✅ All tests passed! Room creation is working.');
        
    } catch (error) {
        console.error('\n❌ Test failed!');
        if (error.response) {
            console.error('   Status:', error.response.status);
            console.error('   Error:', error.response.data);
        } else if (error.request) {
            console.error('   No response from server');
            console.error('   Is the backend running on port 5000?');
        } else {
            console.error('   Error:', error.message);
        }
    }
}

testRoomCreation();
