import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Truck, 
  Store, 
  ChevronRight, 
  CheckCircle2, 
  ArrowLeft, 
  ShieldCheck, 
  CreditCard, 
  Banknote, 
  QrCode, 
  MapPin, 
  ShoppingBag, 
  Info 
} from 'lucide-react';
import { useCartStore } from '../../store/cartStore';
import { formatPrice } from '../../utils';
import { api } from '../../services/api/client';

type Step = 'address' | 'delivery' | 'payment';

interface AddressData {
  fullName: string;
  phone: string;
  addressLine: string;
  landmark: string;
  city: string;
  pincode: string;
}

export function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCartStore();

  const [step, setStep] = useState<Step>('address');
  const [deliveryType, setDeliveryType] = useState<'home' | 'pickup'>('home');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'upi' | 'card'>('upi');
  
  const [address, setAddress] = useState<AddressData>({
    fullName: 'Ronit Madage',
    phone: '9876543210',
    addressLine: 'Station Road, Near Gandhi Chowk',
    landmark: 'Opposite State Bank of India',
    city: 'Pachora',
    pincode: '424201',
  });

  const [addressErrors, setAddressErrors] = useState<Partial<Record<keyof AddressData, string>>>({});
  const [isOrderPlaced, setIsOrderPlaced] = useState(false);
  const [placedOrderNumber, setPlacedOrderNumber] = useState('');

  const steps: Step[] = ['address', 'delivery', 'payment'];
  const stepLabels: Record<Step, string> = { 
    address: '1. Address', 
    delivery: '2. Delivery', 
    payment: '3. Payment' 
  };

  if (items.length === 0 && !isOrderPlaced) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 bg-[#FFF0F3] text-[#8F1028] rounded-full flex items-center justify-center mx-auto mb-4 border border-red-100">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-gray-800 mb-2">No Items to Checkout</h2>
        <p className="text-xs text-gray-500 mb-6">
          Your cart is currently empty. Please add items to proceed with local checkout.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 bg-[#8F1028] text-white px-6 py-2.5 rounded-xl text-xs font-bold hover:bg-[#690D20] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Start Shopping
        </Link>
      </div>
    );
  }

  const validateAddress = () => {
    const errs: Partial<Record<keyof AddressData, string>> = {};
    if (!address.fullName.trim()) errs.fullName = 'Full name is required';
    if (!address.phone.trim() || address.phone.replace(/\D/g, '').length < 10) {
      errs.phone = 'Valid 10-digit mobile number is required';
    }
    if (!address.addressLine.trim()) errs.addressLine = 'Street address is required';
    if (!address.city.trim()) errs.city = 'City is required';
    if (!address.pincode.trim()) errs.pincode = 'Pincode is required';

    setAddressErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateAddress()) {
      setStep('delivery');
    }
  };

  const handlePlaceOrder = async () => {
    const orderNum = `SS-${Math.floor(100000 + Math.random() * 900000)}`;
    setPlacedOrderNumber(orderNum);
    setIsOrderPlaced(true);

    // Sync order to Neon PostgreSQL database via API if backend is running
    try {
      await api.createOrder({
        customerName: address.fullName,
        customerPhone: address.phone,
        deliveryType: deliveryType === 'home' ? 'home_delivery' : 'store_pickup',
        deliveryAddress: `${address.addressLine}, ${address.landmark ? address.landmark + ', ' : ''}${address.city} ${address.pincode}`,
        paymentMethod: paymentMethod === 'cod' ? 'cod' : (paymentMethod === 'upi' ? 'upi' : 'card'),
        subtotal: totalPrice(),
        deliveryFee: 0,
        discount: 0,
        totalAmount: totalPrice(),
        notes: 'Placed via Shree Seva customer web app',
        items: items.map((item) => ({
          productId: item.product.id,
          productName: item.product.name,
          unitPrice: item.selectedVariant?.price ?? item.product.price,
          quantity: item.quantity,
          totalPrice: (item.selectedVariant?.price ?? item.product.price) * item.quantity,
          productImage: item.product.images[0],
          unitValue: item.selectedVariant?.label ?? item.product.unit,
        })),
      });
    } catch (e) {
      console.warn('Backend order sync omitted (offline mode):', e);
    }

    clearCart();
  };

  // ── Render Placed Order Confirmation ─────────────────────────────────────────
  if (isOrderPlaced) {
    return (
      <div className="max-w-lg mx-auto px-4 py-12 text-center">
        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-5 shadow-sm">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        
        <span className="inline-block bg-green-50 text-green-700 text-xs font-black px-3 py-1 rounded-full border border-green-200 mb-2">
          Demo Order Received
        </span>

        <h1 className="text-2xl font-black text-gray-900 mb-1">Order Confirmed!</h1>
        <p className="text-sm text-gray-500 mb-6">
          Order <strong className="text-[#8F1028]">#{placedOrderNumber}</strong> has been received by Shree Seva Enterprises & Readymade.
        </p>

        {/* Order Details Card */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5 text-left mb-6 space-y-3">
          <div className="flex justify-between items-center pb-3 border-b border-gray-100 text-xs">
            <span className="text-gray-500">Fulfilment Type</span>
            <span className="font-bold text-gray-800 flex items-center gap-1">
              {deliveryType === 'home' ? (
                <><Truck className="w-3.5 h-3.5 text-[#8F1028]" /> Home Delivery (Pachora)</>
              ) : (
                <><Store className="w-3.5 h-3.5 text-[#8F1028]" /> Store Counter Pickup</>
              )}
            </span>
          </div>

          <div className="flex justify-between items-center pb-3 border-b border-gray-100 text-xs">
            <span className="text-gray-500">Delivery Address / Pickup Point</span>
            <span className="font-semibold text-gray-800 text-right max-w-[200px] truncate">
              {deliveryType === 'home'
                ? `${address.addressLine}, ${address.city}`
                : 'Shree Seva Counter, Pachora'}
            </span>
          </div>

          <div className="flex justify-between items-center pb-3 border-b border-gray-100 text-xs">
            <span className="text-gray-500">Payment Option</span>
            <span className="font-bold text-gray-800 uppercase">
              {paymentMethod === 'cod' ? 'Cash on Delivery' : paymentMethod === 'upi' ? 'UPI (PhonePe / GPay)' : 'Card'}
            </span>
          </div>

          <div className="flex justify-between items-center text-sm pt-1">
            <span className="font-bold text-gray-700">Total Payable</span>
            <span className="font-black text-lg text-[#8F1028]">{formatPrice(totalPrice())}</span>
          </div>
        </div>

        {/* Demo Notice Banner */}
        <div className="bg-[#FFF9EF] border border-[#FFC83D]/40 rounded-2xl p-3.5 mb-6 text-xs text-amber-900 flex items-start gap-2.5 text-left">
          <Info className="w-4 h-4 text-[#8F1028] shrink-0 mt-0.5" />
          <p>
            <strong>Prototype Demo Notice:</strong> This is a frontend demonstration order. No actual charge was made and store inventory was simulated.
          </p>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <Link
            to={`/orders/${placedOrderNumber}`}
            className="block w-full bg-[#8F1028] text-white py-3.5 rounded-2xl font-black text-xs sm:text-sm hover:bg-[#690D20] transition-colors shadow-md"
          >
            Track Order Status →
          </Link>
          <Link
            to="/"
            className="block w-full py-3 rounded-2xl text-xs font-bold text-gray-600 hover:bg-gray-100 transition-colors"
          >
            Return to Store
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 md:py-8">
      {/* Back button */}
      <div className="flex items-center justify-between mb-5">
        <Link
          to="/cart"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-[#8F1028] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Cart
        </Link>
        <div className="flex items-center gap-1.5 text-xs text-gray-400">
          <ShieldCheck className="w-4 h-4 text-green-600" />
          <span>Secure Checkout</span>
        </div>
      </div>

      {/* Step Indicator */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-xs mb-6 overflow-hidden">
        <div className="flex">
          {steps.map((s, i) => {
            const isActive = s === step;
            const isPast = steps.indexOf(step) > i;
            return (
              <button
                key={s}
                type="button"
                onClick={() => {
                  if (isPast) setStep(s);
                }}
                disabled={!isPast && !isActive}
                className={`flex-1 flex items-center justify-center gap-2 py-3 text-xs sm:text-sm font-bold transition-colors ${
                  isActive
                    ? 'bg-[#8F1028] text-white shadow-xs'
                    : isPast
                    ? 'bg-[#8F1028]/10 text-[#8F1028] hover:bg-[#8F1028]/20 cursor-pointer'
                    : 'text-gray-400 cursor-not-allowed'
                }`}
              >
                {isPast ? <CheckCircle2 className="w-4 h-4" /> : null}
                {stepLabels[s]}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Form Content */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-7">
        
        {/* ── STEP 1: DELIVERY ADDRESS ── */}
        {step === 'address' && (
          <form onSubmit={handleAddressSubmit}>
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-100">
              <MapPin className="w-4 h-4 text-[#8F1028]" />
              <h2 className="font-black text-gray-800 text-base">Delivery Address</h2>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-700 mb-1 block">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={address.fullName}
                    onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                    placeholder="Recipient's Name"
                    className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm outline-none focus:border-[#8F1028] focus:ring-1 focus:ring-[#8F1028]"
                  />
                  {addressErrors.fullName && (
                    <p className="text-[10px] text-red-500 font-semibold mt-1">{addressErrors.fullName}</p>
                  )}
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 mb-1 block">
                    Mobile Number *
                  </label>
                  <input
                    type="tel"
                    value={address.phone}
                    onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                    placeholder="10-digit phone number"
                    className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm outline-none focus:border-[#8F1028] focus:ring-1 focus:ring-[#8F1028]"
                  />
                  {addressErrors.phone && (
                    <p className="text-[10px] text-red-500 font-semibold mt-1">{addressErrors.phone}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 mb-1 block">
                  House / Street Address *
                </label>
                <input
                  type="text"
                  value={address.addressLine}
                  onChange={(e) => setAddress({ ...address, addressLine: e.target.value })}
                  placeholder="e.g. 12, Station Road, Near Railway Overbridge"
                  className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm outline-none focus:border-[#8F1028] focus:ring-1 focus:ring-[#8F1028]"
                />
                {addressErrors.addressLine && (
                  <p className="text-[10px] text-red-500 font-semibold mt-1">{addressErrors.addressLine}</p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-700 mb-1 block">
                    Landmark
                  </label>
                  <input
                    type="text"
                    value={address.landmark}
                    onChange={(e) => setAddress({ ...address, landmark: e.target.value })}
                    placeholder="e.g. Opposite State Bank"
                    className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm outline-none focus:border-[#8F1028] focus:ring-1 focus:ring-[#8F1028]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 mb-1 block">
                    City / Town *
                  </label>
                  <input
                    type="text"
                    value={address.city}
                    onChange={(e) => setAddress({ ...address, city: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm outline-none focus:border-[#8F1028] focus:ring-1 focus:ring-[#8F1028]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 mb-1 block">
                    Pincode *
                  </label>
                  <input
                    type="text"
                    value={address.pincode}
                    onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm outline-none focus:border-[#8F1028] focus:ring-1 focus:ring-[#8F1028]"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[#8F1028] hover:bg-[#690D20] text-white py-3.5 rounded-2xl font-black text-xs sm:text-sm mt-6 transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              Continue to Delivery Method <ChevronRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* ── STEP 2: FULFILMENT TYPE ── */}
        {step === 'delivery' && (
          <div>
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-100">
              <Truck className="w-4 h-4 text-[#8F1028]" />
              <h2 className="font-black text-gray-800 text-base">Select Fulfilment Method</h2>
            </div>

            <div className="space-y-3.5">
              {[
                {
                  id: 'home',
                  icon: Truck,
                  title: 'Home Delivery',
                  desc: `Deliver to ${address.addressLine}, Pachora`,
                  fee: 'FREE',
                  time: 'Expected within 45-60 mins',
                },
                {
                  id: 'pickup',
                  icon: Store,
                  title: 'Store Pickup',
                  desc: 'Pick up in person from Shree Seva Counter, Pachora',
                  fee: 'FREE',
                  time: 'Ready for pickup in 20 mins',
                },
              ].map(({ id, icon: Icon, title, desc, fee, time }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setDeliveryType(id as 'home' | 'pickup')}
                  className={`w-full flex items-start gap-4 p-4 sm:p-5 rounded-2xl border-2 transition-all text-left ${
                    deliveryType === id
                      ? 'border-[#8F1028] bg-[#FFF0F3]'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <div
                    className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${
                      deliveryType === id
                        ? 'bg-[#8F1028] text-white shadow-xs'
                        : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-bold text-sm text-gray-900">{title}</p>
                      <span className="text-xs font-black text-green-700 bg-green-50 border border-green-200 px-2 py-0.5 rounded-md">
                        {fee}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">{desc}</p>
                    <p className="text-[11px] font-semibold text-[#8F1028] mt-1">{time}</p>
                  </div>
                </button>
              ))}
            </div>

            <div className="flex gap-3 mt-6">
              <button
                type="button"
                onClick={() => setStep('address')}
                className="py-3 px-5 rounded-2xl border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50"
              >
                ← Back
              </button>
              <button
                type="button"
                onClick={() => setStep('payment')}
                className="flex-1 bg-[#8F1028] hover:bg-[#690D20] text-white py-3.5 rounded-2xl font-black text-xs sm:text-sm transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                Continue to Payment <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 3: PAYMENT & CONFIRMATION ── */}
        {step === 'payment' && (
          <div>
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-100">
              <Banknote className="w-4 h-4 text-[#8F1028]" />
              <h2 className="font-black text-gray-800 text-base">Payment Method</h2>
            </div>

            {/* Order Items Preview */}
            <div className="bg-gray-50 rounded-2xl p-4 mb-5 border border-gray-100">
              <p className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Order Items ({items.length})
              </p>
              <div className="divide-y divide-gray-200/60 max-h-40 overflow-y-auto pr-1">
                {items.map((item) => {
                  const p = item.selectedVariant?.price ?? item.product.price;
                  return (
                    <div key={item.product.id} className="py-1.5 flex justify-between items-center text-xs">
                      <span className="text-gray-700 truncate max-w-[200px]">
                        {item.quantity} × {item.product.name}
                      </span>
                      <span className="font-black text-gray-900">{formatPrice(p * item.quantity)}</span>
                    </div>
                  );
                })}
              </div>

              <div className="border-t border-gray-200 pt-2 mt-2 flex justify-between items-center text-sm font-black text-[#8F1028]">
                <span>Total Amount</span>
                <span>{formatPrice(totalPrice())}</span>
              </div>
            </div>

            {/* Payment Options */}
            <div className="space-y-3 mb-6">
              {[
                {
                  id: 'upi',
                  icon: QrCode,
                  title: 'UPI (PhonePe, Google Pay, Paytm)',
                  desc: 'Scan QR or pay with your favourite UPI app upon delivery or at the store counter.',
                },
                {
                  id: 'cod',
                  icon: Banknote,
                  title: deliveryType === 'home' ? 'Cash on Delivery (COD)' : 'Pay at Counter on Pickup',
                  desc: 'Pay cash directly when receiving your grocery package in Pachora.',
                },
                {
                  id: 'card',
                  icon: CreditCard,
                  title: 'Debit / Credit Card & Netbanking',
                  desc: 'Card swiping available via portable PoS terminal on delivery.',
                },
              ].map(({ id, icon: Icon, title, desc }) => (
                <label
                  key={id}
                  onClick={() => setPaymentMethod(id as any)}
                  className={`flex items-start gap-3.5 p-3.5 sm:p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                    paymentMethod === id
                      ? 'border-[#8F1028] bg-[#FFF0F3]'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === id}
                    onChange={() => setPaymentMethod(id as any)}
                    className="accent-[#8F1028] mt-1 shrink-0"
                  />
                  <div className="flex-1">
                    <p className="text-xs sm:text-sm font-bold text-gray-900 flex items-center gap-1.5">
                      <Icon className="w-4 h-4 text-[#8F1028]" /> {title}
                    </p>
                    <p className="text-[11px] text-gray-500 mt-0.5">{desc}</p>
                  </div>
                </label>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setStep('delivery')}
                className="py-3 px-5 rounded-2xl border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50"
              >
                ← Back
              </button>
              <button
                type="button"
                onClick={handlePlaceOrder}
                className="flex-1 bg-[#8F1028] hover:bg-[#690D20] text-white py-3.5 rounded-2xl font-black text-xs sm:text-sm transition-colors shadow-md active:scale-98"
              >
                Place Demo Order — {formatPrice(totalPrice())}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
