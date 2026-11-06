import { Link } from 'react-router-dom';
import { CheckCircle2, Package, Bike, Home } from 'lucide-react';

const TRACK_STEPS = [
  { icon: CheckCircle2, label: 'Order Placed', time: '27 Oct, 10:24 AM', done: true },
  { icon: Package, label: 'Packed', time: '27 Oct, 12:10 PM', done: true },
  { icon: Bike, label: 'Out for Delivery', time: '27 Oct, 04:30 PM', done: true },
  { icon: Home, label: 'Delivered', time: 'Expected by 27 Oct, 07:00 PM', done: false },
];

export function OrderTrackingPage() {
  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-[#252525] mb-2">Track Order</h1>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-5">
        <div className="flex items-center justify-between mb-1">
          <p className="text-sm text-gray-500">Order #SS842910</p>
          <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-0.5 rounded-full">
            In Transit
          </span>
        </div>
        <p className="text-xs text-gray-400">Placed on 27 Oct 2026</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <div className="space-y-5">
          {TRACK_STEPS.map(({ icon: Icon, label, time, done }, i) => (
            <div key={i} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center ${
                    done ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                {i < TRACK_STEPS.length - 1 && (
                  <div
                    className={`w-0.5 h-8 mt-1 ${done ? 'bg-green-200' : 'bg-gray-100'}`}
                  />
                )}
              </div>
              <div className="pt-1.5">
                <p className={`text-sm font-semibold ${done ? 'text-gray-800' : 'text-gray-400'}`}>
                  {label}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">{time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Link
        to="/"
        className="block w-full text-center bg-[#8F1028] text-white py-3 rounded-xl font-semibold mt-5 hover:bg-[#690D20] transition-colors"
      >
        Continue Shopping
      </Link>
    </div>
  );
}
