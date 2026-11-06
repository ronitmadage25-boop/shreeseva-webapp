import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Truck, Store, ChevronRight, CheckCircle2 } from 'lucide-react';
import { useCartStore } from '../../store/cartStore';
import { formatPrice } from '../../utils';

type Step = 'address' | 'delivery' | 'payment';

export function CheckoutPage() {
  const [step, setStep] = useState<Step>('address');
  const [deliveryType, setDeliveryType] = useState<'home' | 'pickup'>('home');
  const { items, totalPrice } = useCartStore();

  const steps: Step[] = ['address', 'delivery', 'payment'];
  const stepLabels: Record<Step, string> = { address: 'Address', delivery: 'Delivery', payment: 'Payment' };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Step Indicator */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm mb-6 overflow-hidden">
        <div className="flex">
          {steps.map((s, i) => {
            const isActive = s === step;
            const isPast = steps.indexOf(step) > i;
            return (
              <div
                key={s}
                className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-semibold transition-colors ${
                  isActive
                    ? 'bg-[#8F1028] text-white'
                    : isPast
                    ? 'bg-[#8F1028]/10 text-[#8F1028]'
                    : 'text-gray-400'
                }`}
              >
                {isPast && <CheckCircle2 className="w-4 h-4" />}
                {stepLabels[s]}
              </div>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        {step === 'address' && (
          <div>
            <h2 className="font-bold text-gray-800 mb-4">Delivery Address</h2>
            <div className="space-y-3">
              {[
                { label: 'Full Name', placeholder: 'Your name', type: 'text' },
                { label: 'Phone Number', placeholder: '+91 XXXXX XXXXX', type: 'tel' },
                { label: 'Address Line 1', placeholder: 'House / Street', type: 'text' },
                { label: 'City', placeholder: 'Pachora', type: 'text' },
                { label: 'Pincode', placeholder: '424201', type: 'text' },
              ].map(({ label, placeholder, type }) => (
                <div key={label}>
                  <label className="text-xs font-medium text-gray-500 mb-1 block">{label}</label>
                  <input
                    type={type}
                    placeholder={placeholder}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#8F1028] focus:ring-1 focus:ring-[#8F1028]"
                  />
                </div>
              ))}
            </div>
            <button
              onClick={() => setStep('delivery')}
              className="w-full bg-[#8F1028] text-white py-3 rounded-xl font-semibold mt-5 hover:bg-[#690D20] transition-colors flex items-center justify-center gap-2"
            >
              Continue <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {step === 'delivery' && (
          <div>
            <h2 className="font-bold text-gray-800 mb-4">Select Delivery Type</h2>
            <div className="space-y-3">
              {[
                {
                  id: 'home',
                  icon: Truck,
                  title: 'Home Delivery',
                  desc: 'Get it delivered to your address',
                  fee: 'Free',
                },
                {
                  id: 'pickup',
                  icon: Store,
                  title: 'Store Pickup',
                  desc: 'Pick up from Shree Seva store, Pachora, Maharashtra',
                  fee: 'No delivery fee',
                },
              ].map(({ id, icon: Icon, title, desc, fee }) => (
                <button
                  key={id}
                  onClick={() => setDeliveryType(id as 'home' | 'pickup')}
                  className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left ${
                    deliveryType === id
                      ? 'border-[#8F1028] bg-[#FFF0F3]'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      deliveryType === id ? 'bg-[#8F1028] text-white' : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-sm text-gray-800">{title}</p>
                    <p className="text-xs text-gray-500">{desc}</p>
                  </div>
                  <span className="text-xs font-semibold text-green-600">{fee}</span>
                </button>
              ))}
            </div>
            <button
              onClick={() => setStep('payment')}
              className="w-full bg-[#8F1028] text-white py-3 rounded-xl font-semibold mt-5 hover:bg-[#690D20] transition-colors flex items-center justify-center gap-2"
            >
              Continue to Payment <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {step === 'payment' && (
          <div>
            <h2 className="font-bold text-gray-800 mb-4">Payment</h2>
            <div className="bg-[#FFF9EF] rounded-xl p-4 mb-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Items ({items.length})</span>
                <span className="font-semibold">{formatPrice(totalPrice())}</span>
              </div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Delivery</span>
                <span className="text-green-600 font-semibold">Free</span>
              </div>
              <div className="flex justify-between font-bold text-[#8F1028] text-base border-t border-[#FFC83D]/30 pt-2 mt-2">
                <span>Total</span>
                <span>{formatPrice(totalPrice())}</span>
              </div>
            </div>

            <div className="space-y-2">
              {['UPI (PhonePe, GPay, Paytm)', 'Credit / Debit Card', 'Cash on Delivery'].map((method) => (
                <label
                  key={method}
                  className="flex items-center gap-3 p-3 border border-gray-200 rounded-xl cursor-pointer hover:border-[#8F1028] transition-colors"
                >
                  <input type="radio" name="payment" className="accent-[#8F1028]" />
                  <span className="text-sm font-medium text-gray-700">{method}</span>
                </label>
              ))}
            </div>

            <Link
              to="/order-confirmation"
              className="block w-full text-center bg-[#8F1028] text-white py-3 rounded-xl font-semibold mt-5 hover:bg-[#690D20] transition-colors"
            >
              Place Order — {formatPrice(totalPrice())}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

