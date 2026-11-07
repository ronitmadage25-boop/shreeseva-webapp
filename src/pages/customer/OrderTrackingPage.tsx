import { Link, useParams } from 'react-router-dom';
import { CheckCircle2, Package, Bike, Home, MapPin, Phone } from 'lucide-react';
import { useTrackOrderQuery } from '../../services/queries';

interface Step {
  icon: typeof CheckCircle2;
  label: string;
  time: string;
  done: boolean;
}

export function OrderTrackingPage() {
  const { orderNumber: paramOrderNumber } = useParams<{ orderNumber?: string }>();
  const activeOrderNumber = paramOrderNumber || 'SS-842910';

  const { data: dbOrder } = useTrackOrderQuery(activeOrderNumber);

  // Default steps matching reference image UI
  const defaultSteps: Step[] = [
    { icon: CheckCircle2, label: 'Order Placed', time: '27 Oct, 10:24 AM', done: true },
    { icon: Package, label: 'Packed', time: '27 Oct, 12:10 PM', done: true },
    { icon: Bike, label: 'Out for Delivery', time: '27 Oct, 04:30 PM', done: true },
    { icon: Home, label: 'Delivered', time: 'Expected by 27 Oct, 07:00 PM', done: false },
  ];

  // Dynamic steps if database order is found
  const getDynamicSteps = (): Step[] => {
    if (!dbOrder) return defaultSteps;

    const statusHistory = dbOrder.statusHistory || [];
    const isOutForDelivery = dbOrder.orderStatus === 'out_for_delivery' || dbOrder.orderStatus === 'delivered';
    const isDelivered = dbOrder.orderStatus === 'delivered';
    const isPacked = isOutForDelivery || dbOrder.orderStatus === 'packed';

    return [
      {
        icon: CheckCircle2,
        label: 'Order Placed',
        time: dbOrder.placedAt ? new Date(dbOrder.placedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '10:24 AM',
        done: true,
      },
      {
        icon: Package,
        label: 'Packed',
        time: statusHistory.find((h: any) => h.status === 'Packed')?.createdAt
          ? new Date(statusHistory.find((h: any) => h.status === 'Packed').createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          : 'Ready at counter',
        done: isPacked,
      },
      {
        icon: Bike,
        label: 'Out for Delivery',
        time: dbOrder.delivery?.personnel?.fullName
          ? `With ${dbOrder.delivery.personnel.fullName}`
          : 'Assigned to delivery agent',
        done: isOutForDelivery,
      },
      {
        icon: Home,
        label: 'Delivered',
        time: isDelivered ? 'Delivered' : (dbOrder.delivery?.estimatedTime || 'Expected within 2-4 hours'),
        done: isDelivered,
      },
    ];
  };

  const steps = getDynamicSteps();
  const orderTitle = dbOrder ? dbOrder.orderNumber : activeOrderNumber;
  const statusLabel = dbOrder
    ? (dbOrder.orderStatus === 'out_for_delivery' ? 'In Transit' : dbOrder.orderStatus.replace('_', ' ').toUpperCase())
    : 'In Transit';

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      {/* Page Title */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-black text-[#252525]">Track Order</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Real-time delivery updates from Shree Seva store, Pachora
          </p>
        </div>
        <span className="bg-[#FFF0F3] text-[#8F1028] text-xs font-bold px-3 py-1 rounded-full border border-[#8F1028]/20">
          Local Delivery
        </span>
      </div>

      {/* Order Summary Card Matching Reference Mockup */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-xs p-5 mb-5 relative overflow-hidden">
        <div className="flex items-center justify-between mb-2">
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Order Reference</p>
            <p className="text-lg font-black text-[#252525] mt-0.5">#{orderTitle.replace('#', '')}</p>
          </div>
          <span className="bg-emerald-50 text-emerald-700 border border-emerald-200/80 text-xs font-black px-3 py-1 rounded-full shadow-2xs">
            {statusLabel}
          </span>
        </div>
        <div className="flex items-center justify-between text-xs text-gray-500 border-t border-gray-100 pt-3 mt-1">
          <span>Placed: 27 Oct 2026, 10:24 AM</span>
          <span className="font-bold text-gray-800">Total: ₹{dbOrder ? dbOrder.totalAmount : '439'}</span>
        </div>
      </div>

      {/* Progress Timeline Tracker */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-xs p-6 mb-5">
        <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-5">
          Delivery Status
        </h2>
        <div className="space-y-6">
          {steps.map(({ icon: Icon, label, time, done }, i) => (
            <div key={label} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all ${
                    done
                      ? 'bg-emerald-500 text-white shadow-xs'
                      : 'bg-gray-100 text-gray-400'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                {i < steps.length - 1 && (
                  <div
                    className={`w-0.5 h-9 mt-2 transition-colors ${
                      done ? 'bg-emerald-400' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
              <div className="pt-1 min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <p className={`text-sm font-bold ${done ? 'text-gray-900' : 'text-gray-400'}`}>
                    {label}
                  </p>
                  {done && i === 2 && (
                    <span className="text-[10px] font-black bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                      Active
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-0.5 font-medium">{time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Delivery Details Card (Pachora Address & Delivery Guy) */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-xs p-5 mb-5 space-y-4">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center shrink-0">
            <MapPin className="w-4 h-4 text-[#8F1028]" />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-700">Delivery Address</p>
            <p className="text-xs text-gray-500 mt-0.5">
              {dbOrder?.deliveryAddress || 'Station Road, Deshmukh Colony, Pachora, Maharashtra 424201'}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 border-t border-gray-100 pt-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0">
            <Bike className="w-4 h-4 text-emerald-700" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-gray-700">Delivery Partner</p>
            <p className="text-xs text-gray-500 mt-0.5">
              Ganesh Patil • Hero Splendor (MH 19 BY 4412)
            </p>
          </div>
          <a
            href="tel:+919822012345"
            className="flex items-center gap-1 bg-gray-50 hover:bg-gray-100 px-3 py-1.5 rounded-xl text-xs font-bold text-gray-700 border border-gray-200 transition-colors"
          >
            <Phone className="w-3.5 h-3.5 text-[#8F1028]" />
            Call
          </a>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        <Link
          to="/"
          className="block w-full text-center bg-[#8F1028] hover:bg-[#690D20] text-white py-3.5 rounded-2xl font-bold transition-colors shadow-sm"
        >
          Continue Shopping
        </Link>
        <Link
          to="/account"
          className="block w-full text-center bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 py-3 rounded-2xl font-bold text-xs transition-colors"
        >
          Back to My Account
        </Link>
      </div>
    </div>
  );
}
