import ContactSection from '../../../components/Contact';

export const metadata = {
  title: 'Contact — MYRA Society',
  description: 'On vous garde une place. Écrivez-nous.',
};

export default function ContactPage() {
  return (
    <main className="bg-[#F3F2EF] min-h-screen">
      <div className="pt-20">
        <ContactSection />
      </div>
    </main>
  );
}