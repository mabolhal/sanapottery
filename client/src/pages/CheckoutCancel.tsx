import { Button } from '@/components/ui/button';
import { Link } from 'wouter';

export default function CheckoutCancel() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
      <h1 className="font-serif text-4xl font-light mb-4">Payment Cancelled</h1>
      <p className="mb-8">Your payment was not completed. You can try again or continue shopping.</p>
      <Button asChild>
        <Link href="/shop">Continue Shopping</Link>
      </Button>
    </div>
  );
}
