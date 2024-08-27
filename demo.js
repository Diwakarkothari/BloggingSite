const jwt = require('jsonwebtoken');
const key = 'supersercretkey@123';

const testPayload = { _id: '123', email: 'test@example.com', role: 'user', profileimage: 'test.png' };
const token = jwt.sign(testPayload, key);
console.log('Generated Token:', token);

try {
    const decoded = jwt.verify(token, key);
    console.log('Decoded Payload:', decoded); // Should print testPayload
} catch (error) {
    console.error('Token verification failed:', error.message);
}
