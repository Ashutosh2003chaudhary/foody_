"use client";

import { loadScript } from '@/utils/loadScript';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useCartStore } from '@/utils/store'; // Import the cart store
import { toast } from 'react-toastify';

const CheckoutButton = ({ amount }: { amount: number }) => {
  const router = useRouter();
  const { data: session } = useSession();
  const { removeFromCart, products } = useCartStore(); 
  
  const handlePayment = async () => {
    
    try {
      // Load Razorpay SDK
      if (products.length === 0) {
        toast.warning("Please add food to your cart first!");
        return;
      }
      const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js');
      
      if (!res) {
        alert('Razorpay SDK failed to load');
        return;
      }

      // Create order
      const response = await fetch('/api/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: amount,
        }),
      });

      const order = await response.json();

      // Initialize payment
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: "INR",
        name: "Foody",
        description: "Food Order Payment",
        order_id: order.id,
        handler: async function (response: any) {
          
          try {
            // Verify payment
            const verifyResponse = await fetch('/api/verify-payment', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            if (verifyResponse.ok) {
              // Clear cart after successful payment
              products.forEach(item => {
                removeFromCart(item);
              });

              // Create order in database
              const orderResponse = await fetch('/api/orders', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  price: amount,
                  products,
                  status: "Paid",
                  userEmail: session?.user?.email,
                }),
              });

              if (orderResponse.ok) {
                router.push('/menu');
                router.refresh(); 
                toast("Order placed successfully");
              }
            }
          } catch (err) {
            console.error(err);
            toast('Payment verification failed');
          }
        },
        prefill: {
          email: session?.user?.email || '',
        },
        theme: {
          color: "#F7B614",
        },
      };

      const paymentObject = new (window as any).Razorpay(options);
      paymentObject.open();
    } catch (error) {
      console.error('Payment initialization failed:', error);
      toast('Payment initialization failed');
    }
  };

  return (
    <button 
      onClick={handlePayment}
      className="bg-red-500 text-white p-3 rounded-md w-1/2 self-end"
    >
      Checkout Now
    </button>
  );
};

export default CheckoutButton;
