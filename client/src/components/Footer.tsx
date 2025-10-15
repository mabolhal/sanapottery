import { useTranslation } from 'react-i18next';
import { Link } from 'wouter';
import { Instagram } from 'lucide-react';
import { SiPinterest } from 'react-icons/si';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export function Footer() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [email, setEmail] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      toast({
        title: 'Success!',
        description: 'Thank you for subscribing to our newsletter.',
      });
      setEmail('');
    }
  };

  return (
    <footer className="bg-card border-t mt-20 md:mt-32">
      <div className="max-w-7xl mx-auto px-6 md:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <h3 className="font-serif text-2xl font-light mb-4">{t('footer.about')}</h3>
            <p className="text-muted-foreground leading-relaxed">
              {t('footer.aboutText')}
            </p>
            <div className="flex gap-4 mt-6">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover-elevate p-2 rounded-md"
                data-testid="link-instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://pinterest.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover-elevate p-2 rounded-md"
                data-testid="link-pinterest"
              >
                <SiPinterest className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-serif text-2xl font-light mb-4">{t('footer.quickLinks')}</h3>
            <nav className="flex flex-col gap-3">
              <Link href="/">
                <span className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer" data-testid="link-footer-home">
                  {t('nav.home')}
                </span>
              </Link>
              <Link href="/shop">
                <span className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer" data-testid="link-footer-shop">
                  {t('nav.shop')}
                </span>
              </Link>
              <Link href="/about">
                <span className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer" data-testid="link-footer-about">
                  {t('nav.about')}
                </span>
              </Link>
            </nav>
          </div>

          <div>
            <h3 className="font-serif text-2xl font-light mb-4">{t('footer.newsletter')}</h3>
            <p className="text-muted-foreground mb-4">{t('footer.newsletterText')}</p>
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <Input
                type="email"
                placeholder={t('footer.emailPlaceholder')}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1"
                data-testid="input-newsletter-email"
              />
              <Button type="submit" data-testid="button-newsletter-subscribe">
                {t('footer.subscribe')}
              </Button>
            </form>
          </div>
        </div>

        <div className="border-t mt-12 pt-8 text-center text-sm text-muted-foreground">
          {t('footer.copyright')}
        </div>
      </div>
    </footer>
  );
}
