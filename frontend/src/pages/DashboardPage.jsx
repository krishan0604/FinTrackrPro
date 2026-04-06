import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getSummary, getCategoryTotals, getMonthlyTrends, getRecentActivity } from '../api/dashboardApi';
import SummaryCard from '../components/SummaryCard';
import Spinner from '../components/Spinner';
import EmptyState from '../components/EmptyState';
import Badge from '../components/Badge';
import { Link } from 'react-router-dom';
import { TrendingUp, TrendingDown, Scale, List as ListIcon, FileText } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer } from 'recharts';

const DashboardPage = () => {
  const { user } = useAuth();
  const [data, setData] = useState({
    summary: null,
    categories: [],
    trends: [],
    recent: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sumRes, catRes, trendsRes, recentRes] = await Promise.all([
          getSummary(),
          getCategoryTotals(),
          getMonthlyTrends(),
          getRecentActivity()
        ]);
        setData({
          summary: sumRes,
          categories: catRes,
          trends: trendsRes,
          recent: recentRes
        });
      } catch (error) {
        console.error("Dashboard fetch error", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <Spinner />;

  const formatCurrency = (val) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(val);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-display font-bold">Good morning, <span className="text-gradient">{user?.name}</span></h2>
        <p className="text-gray-400 mt-1">Here's your financial overview</p>
      </div>

      {/* Row 1: Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard 
          title="Total Income" 
          value={formatCurrency(data.summary?.totalIncome || 0)} 
          icon={TrendingUp} 
          colorClass="text-green-500" 
        />
        <SummaryCard 
          title="Total Expenses" 
          value={formatCurrency(data.summary?.totalExpenses || 0)} 
          icon={TrendingDown} 
          colorClass="text-red-500" 
        />
        <SummaryCard 
          title="Net Balance" 
          value={formatCurrency(data.summary?.netBalance || 0)} 
          icon={Scale} 
          colorClass="text-orange-500" 
        />
        <SummaryCard 
          title="Total Records" 
          value={data.summary?.totalRecords || 0} 
          icon={ListIcon} 
          colorClass="text-blue-500" 
        />
      </div>

      {/* Row 2: Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        
        {/* Monthly Trends */}
        <div className="lg:col-span-3 bg-[#111111] rounded-2xl border border-[#2a2a2a] p-6">
          <h3 className="font-display font-bold text-lg mb-6">Monthly Trends</h3>
          {data.trends.length > 0 ? (
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.trends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" vertical={false} />
                  <XAxis dataKey="month" stroke="#a3a3a3" tick={{fill: '#a3a3a3', fontSize: 12}} tickLine={false} axisLine={false} />
                  <YAxis stroke="#a3a3a3" tick={{fill: '#a3a3a3', fontSize: 12}} tickLine={false} axisLine={false} tickFormatter={(val) => `₹${val/1000}k`} />
                  <RechartsTooltip 
                    cursor={{fill: '#1a1a1a'}}
                    contentStyle={{ backgroundColor: '#111111', borderColor: '#2a2a2a', borderRadius: '12px', color: '#fff' }}
                  />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                  <Bar dataKey="income" name="Income" fill="#f97316" radius={[4, 4, 0, 0]} maxBarSize={40} />
                  <Bar dataKey="expenses" name="Expense" fill="#fbbf24" radius={[4, 4, 0, 0]} maxBarSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : <EmptyState message="Not enough data for current trends." />}
        </div>

        {/* Category Totals */}
        <div className="lg:col-span-2 bg-[#111111] rounded-2xl border border-[#2a2a2a] p-6">
          <h3 className="font-display font-bold text-lg mb-6">Category Totals</h3>
          {data.categories.length > 0 ? (
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.categories} layout="vertical" margin={{ top: 0, right: 20, left: 10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" horizontal={false} />
                  <XAxis type="number" hide />
                  <YAxis dataKey="category" type="category" stroke="#a3a3a3" tick={{fill: '#a3a3a3', fontSize: 12}} tickLine={false} axisLine={false} />
                  <RechartsTooltip 
                    cursor={{fill: '#1a1a1a'}}
                    contentStyle={{ backgroundColor: '#111111', borderColor: '#2a2a2a', borderRadius: '12px', color: '#fff' }}
                  />
                  <Bar dataKey="total" name="Total Spend" fill="#f97316" radius={[0, 4, 4, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : <EmptyState message="No categorization data." />}
        </div>

      </div>

      {/* Row 3: Recent Activity */}
      <div className="bg-[#111111] rounded-2xl border border-[#2a2a2a] overflow-hidden">
        <div className="p-6 border-b border-[#2a2a2a] flex justify-between items-center">
          <h3 className="font-display font-bold text-lg">Recent Activity</h3>
          <Link to="/records" className="text-orange-400 hover:text-orange-300 text-sm font-medium flex items-center gap-1">
            View all &rarr;
          </Link>
        </div>
        
        {data.recent.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#0a0a0a] text-gray-400 uppercase font-medium text-xs">
                <tr>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2a2a2a]">
                {data.recent.map(record => (
                  <tr key={record.id} className="hover:bg-[#1a1a1a] transition-colors">
                    <td className="px-6 py-4 text-gray-300">{record.date}</td>
                    <td className="px-6 py-4 text-gray-300">{record.category}</td>
                    <td className="px-6 py-4"><Badge type={record.type} /></td>
                    <td className={`px-6 py-4 font-semibold ${record.type === 'INCOME' ? 'text-green-400' : 'text-red-400'}`}>
                      {record.type === 'INCOME' ? '+' : '-'}{formatCurrency(record.amount)}
                    </td>
                    <td className="px-6 py-4 text-gray-400 max-w-xs truncate">{record.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-6"><EmptyState message="No recent transactions." /></div>
        )}
      </div>

    </div>
  );
};

export default DashboardPage;
