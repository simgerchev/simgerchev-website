import bcrypt from 'bcryptjs';
import User from '../models/User.js';

export const initializeAdmin = async () => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@simgerchev.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'changeme123';

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: adminEmail });
    
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      
      const admin = new User({
        email: adminEmail,
        password: hashedPassword,
        role: 'admin'
      });

      await admin.save();
      console.log('Admin user created successfully');
      console.log(`Email: ${adminEmail}`);
      console.log(`Password: ${adminPassword}`);
      console.log('Please change the password after first login!');
    } else {
      console.log('Admin user already exists');
    }
  } catch (error) {
    console.error('Error initializing admin:', error);
  }
};
