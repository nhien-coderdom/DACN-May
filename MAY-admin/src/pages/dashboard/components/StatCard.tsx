import clsx from 'clsx';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: 'blue' | 'green' | 'purple' | 'orange';
  loading?: boolean;
}

export function StatCard({
  title,
  value,
  icon,
  color,
  loading = false,
}: StatCardProps) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600',
    orange: 'bg-orange-50 text-[#086136]',
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">
            {loading ? '...' : value}
          </p>
        </div>
        <div className={clsx('p-3 rounded-lg', colorClasses[color])}>
          {icon}
        </div>
      </div>
    </div>
  );
}
