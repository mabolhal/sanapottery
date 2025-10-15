import { useTranslation } from 'react-i18next';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';
import heroImage from '@assets/generated_images/Artisan_pottery_hero_image_fdd32574.png';
import artistImage from '@assets/generated_images/Artist_crafting_pottery_photo_335aa065.png';

export default function Home() {
  const { t } = useTranslation();

  const collections = [
    { name: t('collections.bowls'), category: 'bowls', image: heroImage },
    { name: t('collections.vases'), category: 'vases', image: heroImage },
    { name: t('collections.mugs'), category: 'mugs', image: heroImage },
  ];

  return (
    <div className="min-h-screen">
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="Pottery collection"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/40" />
        </div>
        
        <div className="relative z-10 text-center px-6 md:px-8 max-w-4xl mx-auto">
          <h1 className="font-serif text-6xl md:text-7xl lg:text-8xl font-light tracking-tight text-white mb-6" data-testid="text-hero-title">
            {t('hero.title')}
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-8 leading-relaxed" data-testid="text-hero-subtitle">
            {t('hero.subtitle')}
          </p>
          <Button size="lg" className="text-lg px-8" asChild data-testid="button-explore-collection">
            <Link href="/shop">
              {t('hero.cta')}
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </Button>
        </div>
      </section>

      <section className="py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
            <div className="aspect-[4/5] overflow-hidden rounded-lg">
              <img
                src={artistImage}
                alt="Artist at work"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="space-y-6">
              <h2 className="font-serif text-4xl md:text-5xl font-light" data-testid="text-artist-title">
                {t('artist.title')}
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed" data-testid="text-artist-description">
                {t('artist.description')}
              </p>
              <Button variant="outline" size="lg" asChild data-testid="button-learn-more">
                <Link href="/about">
                  Learn More
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-32 bg-muted/30">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <h2 className="font-serif text-4xl md:text-5xl font-light text-center mb-12" data-testid="text-collections-title">
            {t('collections.title')}
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {collections.map((collection) => (
              <Link key={collection.category} href={`/shop?category=${collection.category}`}>
                <Card className="group overflow-hidden hover-elevate transition-all duration-300 cursor-pointer" data-testid={`card-collection-${collection.category}`}>
                  <div className="aspect-square overflow-hidden relative">
                    <img
                      src={collection.image}
                      alt={collection.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <h3 className="font-serif text-3xl font-light text-white" data-testid={`text-collection-name-${collection.category}`}>
                        {collection.name}
                      </h3>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
