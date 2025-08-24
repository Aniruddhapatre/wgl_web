import React, { useState } from "react";
import { Trees, Droplets, School, Mountain, Sprout } from "lucide-react";

// --- ICONS --- //
const CheckIcon = ({ className }) => (
  <svg
    className={`w-6 h-6 text-sky-300 ${className}`}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
    ></path>
  </svg>
);

const LeafIcon = ({ className }) => (
  <svg
    className={`w-8 h-8 text-blue-500 ${className}`}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M17.61,3.43a1,1,0,0,0-1.13.34,9.2,9.2,0,0,1-3.6,3.6,1,1,0,0,0-.34,1.13,10.74,10.74,0,0,1,1,3.55,1,1,0,0,0,1,.95h.1A1,1,0,0,0,16,12a1,1,0,0,0,.13-1,8.33,8.33,0,0,0-1-3.17,7.2,7.2,0,0,0,3.17,1A1,1,0,0,0,19,9a1,1,0,0,0,.95-1,10.74,10.74,0,0,1-3.55-1,1,1,0,0,0-1.13.34,9.2,9.2,0,0,1-3.6,3.6,1,1,0,0,0-.34,1.13,10.74,10.74,0,0,1,1,3.55,1,1,0,0,0,1,.95h.1A1,1,0,0,0,14,17a1,1,0,0,0,.13-1,8.33,8.33,0,0,0-1-3.17,7.2,7.2,0,0,0,3.17,1A1,1,0,0,0,17,14a1,1,0,0,0,.95-1,10.74,10.74,0,0,1-3.55-1,1,1,0,0,0-1.13.34A9.2,9.2,0,0,1,9.67,16a1,1,0,0,0-.34,1.13,10.74,10.74,0,0,1,1,3.55,1,1,0,0,0,1,.95h.1a1,1,0,0,0,1.12-1.13,8.79,8.79,0,0,0-4.52-4.52,1,1,0,0,0-1.13,1.12h.1a1,1,0,0,0,1,.95,10.74,10.74,0,0,1,3.55,1,1,1,0,0,0,.95.95h.1a1,1,0,0,0,1.13-1.13,8.79,8.79,0,0,0-4.52-4.52,1,1,0,0,0-1.13,1.12h.1a1,1,0,0,0,1,.95,10.74,10.74,0,0,1,3.55,1,1,1,0,0,0,1.12-.87,1,1,0,0,0-.87-1.12,8.79,8.79,0,0,0-4.52,4.52,1,1,0,0,0,1.12,1.13h.1a1,1,0,0,0,.95-1,10.74,10.74,0,0,1,1-3.55,1,1,0,0,0-1.13-.34,9.2,9.2,0,0,1-3.6-3.6,1,1,0,0,0-1.13.34,10.74,10.74,0,0,1-3.55,1,1,1,0,0,0-1,.95v.1a1,1,0,0,0,1.13,1.12,8.79,8.79,0,0,0,4.52,4.52,1,1,0,0,0,1.13-1.12v-.1a1,1,0,0,0-.95-1,10.74,10.74,0,0,1-1-3.55,1,1,0,0,0,.34-1.13,9.2,9.2,0,0,1,3.6-3.6,1,1,0,0,0,.34-1.13A10.74,10.74,0,0,1,4.4,8.05a1,1,0,0,0-1,.95v.1a1,1,0,0,0,1.13,1.12,8.79,8.79,0,0,0,4.52,4.52,1,1,0,0,0,1.13-1.12v-.1a1,1,0,0,0-.95-1,10.74,10.74,0,0,1-1-3.55,1,1,0,0,0,.34-1.13A9.2,9.2,0,0,1,12.2,4.11a1,1,0,0,0,1.13-.34A10.74,10.74,0,0,1,17,3.12a1,1,0,0,0,1.12-.87A1,1,0,0,0,17.61,3.43Z" />
  </svg>
);

const UpiIcon = () => (
  <img
    src="https://upload.wikimedia.org/wikipedia/commons/e/e1/UPI-Logo-vector.svg"
    alt="UPI"
    className="h-7"
  />
);
const VisaIcon = () => (
  <img
    src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg"
    alt="Visa"
    className="h-8"
  />
);
const MastercardIcon = () => (
  <img
    src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg"
    alt="Mastercard"
    className="h-9"
  />
);
const RupayIcon = () => (
  <svg
    width="80"
    height="24"
    viewBox="0 0 105 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="h-9"
  >
    <path
      d="M19.991 1.773h-4.24l-7.98 21.84v7.92h4.8v-7.92h.72l3.6 7.92h4.08l-4.08-9.3L25.231.773h-4.8l-4.44 11.04L19.991 1.773z"
      fill="#F79839"
    />
    <path d="M10.151 21.093l4.32-10.56 4.32 10.56h-8.64z" fill="#3563A9" />
    <path
      d="M37.351 16.533v17.16h4.8v-17.16h6.08v-4.64h-16.96v4.64h6.08z"
      fill="#F79839"
    />
    <path d="M54.631.773h-4.8v33.6h4.8v-33.6z" fill="#F79839" />
    <path
      d="M74.551 17.733c0-10.32-5.28-17.52-14.4-17.52s-14.4 7.2-14.4 17.52c0 10.32 5.28 17.52 14.4 17.52s14.4-7.2 14.4-17.52zm-4.8 0c0 7.68-4.24 13.68-9.6 13.68s-9.6-6-9.6-13.68c0-7.68 4.24-13.68 9.6-13.68s9.6 6 9.6 13.68z"
      fill="#3563A9"
    />
    <path d="M88.551.773h-4.8v33.6h14.52v-4.64h-9.72v-28.96z" fill="#3563A9" />
    <path
      d="M104.231 17.733c0-10.32-5.28-17.52-14.4-17.52s-14.4 7.2-14.4 17.52c0 10.32 5.28 17.52 14.4 17.52s14.4-7.2 14.4-17.52zm-4.8 0c0 7.68-4.24 13.68-9.6 13.68s-9.6-6-9.6-13.68c0-7.68 4.24-13.68 9.6-13.68s9.6 6 9.6 13.68z"
      fill="#F79839"
    />
  </svg>
);

// --- CONFIGURATION DATA --- //
const whyDonateItems = [
  "Plant trees to fight climate change and improve air quality.",
  "Restore clean water sources in rural communities.",
  "Educate future generations on sustainability.",
  "Create eco-friendly jobs and livelihoods.",
  "Protect wildlife and biodiversity.",
];

const impactItems = [
  { amount: 500, 
    text: "Plants 5 trees", 
    icon: <Sprout className="w-6 h-6" /> },
  {
    amount: 1000,
    text: "Clean water for a family",
    icon: <Droplets className="w-6 h-6" />,
  },
  {
    amount: 5000,
    text: "Funds a school program",
    icon: <School className="w-6 h-6" />,
  },
  {
    amount: 10000,
    text: "Restores 1 acre of forest",
    icon: <Trees className="w-6 h-6" />,
  },
];

// --- RAZORPAY INTEGRATION --- //
const loadRazorpay = async () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(window.Razorpay);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => {
      resolve(window.Razorpay);
    };
    document.body.appendChild(script);
  });
};

// --- ANIMATION COMPONENT --- //
const IconRain = ({ icon, count = 20 }) => {
  if (!icon) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {Array.from({ length: count }).map((_, i) => {
        const style = {
          left: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 5}s`,
          animationDuration: `${2 + Math.random() * 3}s`,
          "--translateX-end": `${Math.random() * 80 - 40}px`,
          "--rotate-end": `${Math.random() > 0.5 ? "" : "-"}${
            Math.random() * 720
          }deg`,
        };
        return (
          <span
            key={i}
            className="absolute text-2xl animate-fall"
            style={style}
          >
            {icon}
          </span>
        );
      })}
    </div>
  );
};

// --- MAIN APP COMPONENT --- //
const App = () => {
  const [amount, setAmount] = useState(0);
  const [status, setStatus] = useState("idle"); // idle, processing, success, error
  const [hoveredIcon, setHoveredIcon] = useState(null);

  return (
    <div className="min-h-screen  text-gray-800 font-sans p-4 sm:p-6 lg:p-8">
      {/* <style>{`
        @keyframes fall {
          0% { 
            transform: translateY(-10vh) translateX(0) rotate(0deg); 
            opacity: 0; 
          }
          20% {
            opacity: 1;
          }
          100% { 
            transform: translateY(100vh) translateX(var(--translateX-end)) rotate(var(--rotate-end)); 
            opacity: 0; 
          }
        }
        .animate-fall {
          animation-name: fall;
          animation-timing-function: ease-in;
          animation-fill-mode: forwards;
        }
      `}</style> */}
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="text-center mb-8">
          <div className="flex justify-center items-center gap-3 mb-2">
            {/* <LeafIcon className="w-10 h-10" /> */}
            <h1 className="text-4xl md:text-5xl font-bold text-lime-300 tracking-tight">
              World Green Line
            </h1>
          </div>
         <p className="text-gray-300 max-w-xl mx-auto">
           Your donation fuels our mission to build a greener, healthier planet.
        </p>
        <div className="w-20 h-1 bg-lime-300 mt-4 mx-auto rounded-full" />
        </header>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Panel: Information */}
          <div className="bg-gradient-to-br from-blue-600 to-sky-800 text-white p-8 rounded-2xl shadow-lg flex flex-col">
            <div>
              <h2 className="text-3xl font-bold mb-4">Why Your Help Matters</h2>
              <ul className="space-y-4 mb-8">
                {whyDonateItems.map((item, index) => (
                  <li key={index} className="flex items-start">
                    <CheckIcon className="mr-3 mt-1 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-auto">
              <h2 className="text-3xl font-bold mb-4">See Your Impact</h2>
              <div className="space-y-3">
                {impactItems.map((item) => (
                  <div
                    key={item.amount}
                    onMouseEnter={() => setHoveredIcon(item.icon)}
                    onMouseLeave={() => setHoveredIcon(null)}
                    className={`relative overflow-hidden flex items-center justify-between p-4 rounded-lg transition-all duration-300 ease-in-out cursor-pointer ${
                      hoveredIcon === item.icon
                        ? "bg-white/25 scale-105 shadow-xl"
                        : "bg-white/10 opacity-80"
                    }`}
                  >
                    <div className="flex items-center z-10">
                      <span className="text-2xl mr-4">{item.icon}</span>
                      <span className="font-semibold">
                        ₹{item.amount.toLocaleString("en-IN")}
                      </span>
                    </div>
                    <span className="text-sky-200 text-right z-10">
                      {item.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Panel: Donation Form */}
          <div className="bg-white p-8 rounded-2xl shadow-lg relative">
            {status === "success" ? (
              <SuccessOverlay />
            ) : status === "error" ? (
              <ErrorOverlay onRetry={() => setStatus("idle")} />
            ) : (
              <DonationForm
                amount={amount}
                status={status}
                onAmountChange={(newAmount) => setAmount(newAmount)}
                onStatusChange={(newStatus) => setStatus(newStatus)}
              />
            )}
          </div>
        </div>

        
        <footer className="text-center mt-12 text-gray-500 text-sm">
          <p>
            A registered non-profit organization. Donations are tax-deductible
            under Section 80G.
          </p>
        </footer>
      </div>
    </div>
  );
};

// --- SUB-COMPONENTS --- //
const DonationForm = ({ amount, status, onAmountChange, onStatusChange }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const handleAmountInputChange = (e) => {
    const value = e.target.value;
    onAmountChange(value === "" ? 0 : parseInt(value, 10));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (status !== "processing" && amount > 0) {
      onStatusChange("processing");

      try {
        const backendUrl =
          import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

        // Create order
        const orderResponse = await fetch(`${backendUrl}/create-order`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: amount,
            receipt: `donation_${Date.now()}`,
            currency: "INR",
          }),
        });

        if (!orderResponse.ok) {
          throw new Error("Failed to create order");
        }

        const orderData = await orderResponse.json();
        const Razorpay = await loadRazorpay();

        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY_ID,
          amount: orderData.amount,
          currency: orderData.currency,
          name: "World Green Line",
          description: "Donation for Environmental Causes",
          image: "https://example.com/logo.png", // Add your logo URL
          order_id: orderData.id,
          handler: async (response) => {
            try {
              const verificationResponse = await fetch(
                `${backendUrl}/verify-payment`,
                {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    razorpay_payment_id: response.razorpay_payment_id,
                    razorpay_order_id: response.razorpay_order_id,
                    razorpay_signature: response.razorpay_signature,
                    donationData: { amount, name, email, phone, address },
                  }),
                }
              );

              if (!verificationResponse.ok) {
                throw new Error("Verification failed");
              }

              const verificationData = await verificationResponse.json();
              if (verificationData.success) {
                onStatusChange("success");
              } else {
                throw new Error("Payment verification failed");
              }
            } catch (error) {
              console.error("Payment verification error:", error);
              onStatusChange("error");
            }
          },
          prefill: {
            name: name,
            email: email,
            contact: phone,
          },
          notes: {
            address: address,
          },
          theme: {
            color: "#10B981",
          },
          modal: {
            ondismiss: () => {
              if (status === "processing") {
                onStatusChange("idle");
              }
            },
          },
        };

        const rzp = new Razorpay(options);
        rzp.on("payment.failed", (response) => {
          console.error("Payment failed:", response.error);
          onStatusChange("error");
        });
        rzp.open();
      } catch (error) {
        console.error("Payment error:", error);
        onStatusChange("error");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 flex flex-col h-full">
      <div>
        <h2 className="text-2xl font-bold mb-1">Payment Details</h2>
        <div className="w-16 h-1 bg-emerald-500 rounded-full"></div>
      </div>

      <FormField
        label="Amount"
        type="number"
        value={amount || ""}
        onChange={handleAmountInputChange}
        placeholder="Enter Amount"
        required
        isCurrency
        min="10"
      />
      <FormField
        label="Name"
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter your full name"
        required
      />
      <FormField
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="your.email@example.com"
        required
      />
      <FormField
        label="Phone"
        type="tel"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        placeholder="10-digit mobile number"
        required
        pattern="[0-9]{10}"
      />
      <FormField
        label="Full Address"
        type="text"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        placeholder="Enter your full address"
        required
      />

      <div className="flex-grow"></div>

      {/* Payment Methods Display */}
      <div className="pt-3 pb-1 border-t border-gray-200">
        <div className="flex items-center justify-around gap-4">
          <UpiIcon />
          <VisaIcon />
          <MastercardIcon />
          <RupayIcon />
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={status === "processing" || amount < 10}
        className={`w-full py-4 text-xl font-bold text-white rounded-lg transition-all duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-emerald-500/50 disabled:opacity-50 disabled:cursor-not-allowed ${
          status === "processing"
            ? "bg-amber-500 cursor-wait"
            : "bg-gradient-to-r from-emerald-500 to-green-600 hover:shadow-xl"
        }`}
      >
        {status === "processing" ? (
          <span className="animate-pulse">Processing...</span>
        ) : (
          `Pay ₹${amount.toLocaleString("en-IN")}`
        )}
      </button>
    </form>
  );
};

const FormField = ({
  label,
  type,
  value,
  onChange,
  required,
  placeholder,
  isCurrency,
  min,
  pattern,
}) => (
  <div>
    <label className="block mb-1 text-sm font-semibold text-gray-600">
      {label}
    </label>
    <div className="relative">
      {isCurrency && (
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold">
          ₹
        </span>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        min={min}
        pattern={pattern}
        className={`w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all ${
          isCurrency ? "pl-8" : ""
        }`}
      />
    </div>
  </div>
);

const SuccessOverlay = () => (
  <div className="absolute inset-0 bg-white flex flex-col items-center justify-center text-center p-8 rounded-2xl z-10">
    <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
      <LeafIcon className="w-16 h-16 text-emerald-500 animate-pulse" />
    </div>
    <h2 className="text-3xl font-bold text-emerald-700 mb-2">Thank You!</h2>
    <p className="text-gray-600 max-w-sm mb-4">
      Your generous donation is a huge step towards a greener future. A receipt
      has been sent to your email.
    </p>
    <p className="text-emerald-600 font-medium">
      Your contribution will make a real difference!
    </p>
  </div>
);

const ErrorOverlay = ({ onRetry }) => (
  <div className="absolute inset-0 bg-white flex flex-col items-center justify-center text-center p-8 rounded-2xl z-10">
    <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-6">
      <svg
        className="w-16 h-16 text-red-500"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        ></path>
      </svg>
    </div>
    <h2 className="text-3xl font-bold text-red-600 mb-2">Payment Failed</h2>
    <p className="text-gray-600 max-w-sm mb-6">
      We couldn't process your donation. Please check your details and try
      again.
    </p>
    <button
      onClick={onRetry}
      className="px-6 py-3 bg-emerald-500 text-white rounded-lg font-medium hover:bg-emerald-600 transition-colors"
    >
      Try Again
    </button>
  </div>
);

export default App;
