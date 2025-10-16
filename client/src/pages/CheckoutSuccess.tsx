import { Button } from '@/components/ui/button';
import { Link } from 'wouter';

export default function CheckoutSuccess() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
      <h1 className="font-serif text-4xl font-light mb-4">Thank you for your payment!</h1>
      <p className="mb-8">Your order has been received and is being processed.</p>
      <Button asChild>
        <Link href="/shop">Continue Shopping</Link>
      </Button>
    </div>
  );
}
