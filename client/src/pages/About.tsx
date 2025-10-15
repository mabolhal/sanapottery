import { useTranslation } from 'react-i18next';
import artistImage from '@assets/generated_images/Artist_crafting_pottery_photo_335aa065.png';

export default function About() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen py-12 md:py-20">
      <div className="max-w-5xl mx-auto px-6 md:px-8">
        <h1 className="font-serif text-5xl md:text-6xl font-light text-center mb-12" data-testid="text-about-title">
          {t('artist.title')}
        </h1>

        <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-start mb-16">
          <div className="aspect-[3/4] overflow-hidden rounded-lg sticky top-24">
            <img
              src={artistImage}
              alt="Artist at work"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="space-y-6">
            <div className="prose prose-lg max-w-none">
              <p className="text-lg text-muted-foreground leading-relaxed" data-testid="text-about-description">
                {t('artist.description')}
              </p>
              
              <p className="text-lg text-muted-foreground leading-relaxed mt-6">
                Each piece of pottery is created with intention and care, from the initial shaping on the wheel to the final glaze application. The process is both meditative and challenging, requiring patience, skill, and an eye for detail.
              </p>

              <p className="text-lg text-muted-foreground leading-relaxed mt-6">
                Using traditional techniques passed down through generations, combined with contemporary design sensibilities, we create functional art that brings warmth and character to everyday life. Every bowl, vase, and mug carries the unique marks of the handmade process.
              </p>

              <p className="text-lg text-muted-foreground leading-relaxed mt-6">
                Our studio is a place of creativity and craftsmanship, where clay transforms into beautiful, lasting pieces that tell their own stories. We believe in slow, mindful creation and the beauty of imperfection that makes each piece truly one-of-a-kind.
              </p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-20">
          <div className="text-center">
            <h3 className="font-serif text-2xl font-light mb-3">Handcrafted</h3>
            <p className="text-muted-foreground">Every piece is shaped by hand with care and attention to detail</p>
          </div>
          <div className="text-center">
            <h3 className="font-serif text-2xl font-light mb-3">Sustainable</h3>
            <p className="text-muted-foreground">We use eco-friendly materials and traditional firing techniques</p>
          </div>
          <div className="text-center">
            <h3 className="font-serif text-2xl font-light mb-3">Unique</h3>
            <p className="text-muted-foreground">No two pieces are exactly alike, celebrating natural variation</p>
          </div>
        </div>
      </div>
    </div>
  );
}
