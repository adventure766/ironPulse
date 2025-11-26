
import { AdminUser, SystemLog, AppStats } from '../types';

// Mock Data Generators for "Firebase"

export const fetchAppStats = async (): Promise<AppStats> => {
    // Simulate network delay
    await new Promise(r => setTimeout(r, 800));
    return {
        totalUsers: 14250,
        activeUsers: 3840,
        premiumUsers: 1250,
        revenue: 28400,
        churnRate: 2.1
    };
};

export const fetchAdminUsers = async (): Promise<AdminUser[]> => {
    await new Promise(r => setTimeout(r, 600));
    return [
        { id: '1', name: 'Alex Fitness', email: 'alex@example.com', role: 'User', status: 'Active', lastActive: '2 mins ago', subscription: 'Pro', avatar: 'https://i.pravatar.cc/150?u=a048581f4e29026701d' },
        { id: '2', name: 'Sarah Connor', email: 'sarah@skynet.com', role: 'Coach', status: 'Active', lastActive: '1 hr ago', subscription: 'Elite', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026024d' },
        { id: '3', name: 'Mike Tyson', email: 'iron@mike.com', role: 'Admin', status: 'Active', lastActive: '5 mins ago', subscription: 'Elite', avatar: 'https://i.pravatar.cc/150?u=a04258a2462d826712d' },
        { id: '4', name: 'John Doe', email: 'john@doe.com', role: 'User', status: 'Banned', lastActive: '30 days ago', subscription: 'Free', avatar: 'https://i.pravatar.cc/150?u=a04258114e29026302d' },
        { id: '5', name: 'Jane Smith', email: 'jane@smith.com', role: 'User', status: 'Pending', lastActive: '1 day ago', subscription: 'Free', avatar: 'https://i.pravatar.cc/150?u=a04258114e29026702d' },
    ];
};

export const fetchSystemLogs = async (): Promise<SystemLog[]> => {
    await new Promise(r => setTimeout(r, 400));
    const now = new Date();
    return [
        { id: '1', timestamp: now.toISOString(), level: 'INFO', message: 'Daily database backup completed successfully.', module: 'Database' },
        { id: '2', timestamp: new Date(now.getTime() - 1000 * 60 * 5).toISOString(), level: 'INFO', message: 'New user registration: user_8821', module: 'Auth' },
        { id: '3', timestamp: new Date(now.getTime() - 1000 * 60 * 15).toISOString(), level: 'WARN', message: 'High latency detected on API endpoint /v1/ai/generate', module: 'API Gateway' },
        { id: '4', timestamp: new Date(now.getTime() - 1000 * 60 * 45).toISOString(), level: 'ERROR', message: 'Payment gateway timeout: tx_9921', module: 'Billing' },
        { id: '5', timestamp: new Date(now.getTime() - 1000 * 60 * 60).toISOString(), level: 'INFO', message: 'AI Model updated to gemini-2.5-flash', module: 'AI Service' },
    ];
};

export const fetchRevenueHistory = async () => {
    // Mock 6 months data
    return [
        { name: 'May', revenue: 18000, expenses: 12000 },
        { name: 'Jun', revenue: 21000, expenses: 13500 },
        { name: 'Jul', revenue: 20500, expenses: 12800 },
        { name: 'Aug', revenue: 24000, expenses: 14000 },
        { name: 'Sep', revenue: 26500, expenses: 15500 },
        { name: 'Oct', revenue: 28400, expenses: 16000 },
    ];
};
