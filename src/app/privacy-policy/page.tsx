
'use client';

import { useRouter } from 'next/navigation';
import Header from '@/components/layout/header';
import type { View } from '@/app/page';
import type { Category } from '@/lib/products';
import { useUser } from '@/hooks/use-user';

export default function PrivacyPolicyPage() {
  const router = useRouter();
  const { logout } = useUser();

  // Navigation functions
  const handleNavigate = (view: View, category?: Category) => {
    if (view === 'home') {
      router.push('/');
    } else if (view === 'shop' && category) {
      window.location.href = `${window.location.origin}/#shop/${category}`;
    } else {
      window.location.href = `${window.location.origin}/#${view}`;
    }
  };

  const handleSelectCategory = (category: Category) => {
    window.location.href = `${window.location.origin}/#shop/${category}`;
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#18181b]">
      <Header
        onNavigate={handleNavigate}
        onLogout={handleLogout}
        onNavigateToCategory={handleSelectCategory}
        showBackButton={true}
      />
      <main className="flex-grow pt-24 sm:pt-32 pb-16 sm:pb-24">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="space-y-10">
            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-primary mb-4 text-center">
              Privacy Policy
            </h1>
            <div className="space-y-8 text-base text-muted-foreground leading-relaxed">
              <section>
                <h2 className="text-xl font-bold text-foreground mt-4 mb-2 text-left">Introduction</h2>
                <p className="text-justify">
                  We value the trust you place in us and recognize the importance of secure transactions and information privacy. This Privacy Policy describes how ReTag Marketplace and its affiliates (collectively "ReTag, we, our, us") collect, use, share, protect or otherwise process your personal data through the ReTag website. By visiting this Platform, providing your information or availing any product/service offered on the Platform, you expressly agree to be bound by the terms and conditions of this Privacy Policy, the Terms of Use and the applicable service/product terms and conditions, and agree to be governed by the laws of India including but not limited to the laws applicable to data protection and privacy. If you do not agree please do not use or access our Platform.
                </p>
              </section>
              <section>
                <h2 className="text-xl font-bold text-foreground mt-4 mb-2 text-left">Collection</h2>
                <p className="text-justify">
                  We collect your personal data relating to your identity, demographics when you use our Platform, services or otherwise interact with us during the course of our relationship and related information provided from time to time. Some of the information that we may collect includes but is not limited to information provided to us during sign-up/registering or using our Platform such as name, date of birth, address, telephone/mobile number, email ID and any such information shared as proof of identity or address. Some of the sensitive personal data may be collected with your consent, such as your bank account or credit or debit card or other payment instrument information or biometric information such as your facial features or physiological information (in order to enable use of certain features when opted for, available on the Platform to assist you with your shopping experience) etc all of the above being in accordance with applicable law. Our primary goal in doing so is to provide you a safe, efficient, smooth, and customised experience. This allows us to provide services and features that most likely meet your needs, and to customise our Platform to make your experience safer and easier. In general, you can browse the Platform without telling us who you are or revealing any personal data about yourself. Once you give us your personal data, you are not anonymous to us. Where possible, we indicate which fields are required and which fields are optional. You always have the option to not provide information, by choosing not to use a particular service or feature on the Platform. We may track your buying behaviour, preferences, and other information that you choose to provide on our Platform. We use this information to do research on our users' demographics, interests, and behaviour to better understand and serve our users. This information is compiled and analysed on an aggregated basis. This information may include the URL that you just came from (whether this URL is on our Platform or not), which URL you next go to (whether this URL is on our Platform or not), your computer browser information, and your IP address. If you enrol into our loyalty program or participate in third party loyalty program offered by us, we will collect and store your personal data such as name, contact number, email address, communication address, date of birth, gender, zip code, lifestyle information, demographic and work details which is provided by you to us or a third-party business partner that operates platforms where you can earn loyalty points for purchase of goods and services, and/or also redeem them. We will also collect your information related to your transactions on Platform and such third-party business partner platforms. When such a third-party business partner collects your personal data directly from you, you will be governed by their privacy policies. We shall not be responsible for the third-party business partner’s privacy practices or the content of their privacy policies, and we request you to read their privacy policies prior to disclosing any information. If you set up an account or transact with us, we may seek some additional information, such as billing address, and/ or other payment instrument details and tracking information from cheques or money orders to provide services, enable transactions or to refund for cancelled transactions. If you choose to post messages on our message boards, personalised messages, images, photos, gift card message box, chat rooms or other message areas or leave feedback/product review or if you use voice commands to shop on the Platform, we will collect that information you provide to us. Furthermore we may use the images shared by you. Please note such messages posted by you will be in public domain and can be read by others as well, please exercise caution while posting such messages, personal details, photos and reviews. We retain this information as necessary to resolve disputes, provide customer support, internal research and troubleshoot problems as permitted by law. If you send us personal correspondence, such as emails or letters, or if other users or third parties send us correspondence about your activities or postings on the Platform, we may collect such information into a file specific to you. While you can browse some sections of our Platform without being a registered member, certain activities (such as placing an order or consuming our online content or services or participating in any event) requires registration. We may use your contact information to send you offers based on your previous orders or preferences and your interests. If you receive an email, a call from a person/association claiming to be from ReTag seeking any personal data like debit/credit card PIN, net-banking or mobile banking password, we request you to never provide such information. We at ReTag or our affiliate logistics partner do not at any time connect with you requesting for such information. If you have already revealed such information, report it immediately to an appropriate law enforcement agency.
                </p>
              </section>
              <section>
                <h2 className="text-xl font-bold text-foreground mt-4 mb-2 text-left">Use</h2>
                <p className="text-justify">
                  We use personal data to provide the services you request. To the extent we use your personal data to market to you, we will provide you the ability to opt-out of such uses. We use your personal data to assist sellers and business partners in handling and fulfilling orders; enhancing customer experience; to resolve disputes; troubleshoot problems; help promote a safe service; collect money; measure consumer interest in our products and services, inform you about online and offline offers, products, services, and updates; customise your experience; detect and protect us against error, fraud and other criminal activity; enforce our terms and conditions; conduct marketing research, analysis and surveys; and as otherwise described to you at the time of collection of information. We will ask for your permission to allow us access to your text messages (SMS), instant messages, contacts in your directory, camera, photo gallery, location and device information: (i) to send commercial communication regarding your orders or other products and services (ii) enhance your experience on the platform and provide you access to the products and services offered on the Platform by sellers, affiliates, partners or lending partners. You understand that your access to these products/services may be affected in the event permission is not provided to us. In our efforts to continually improve our product and service offerings, we collect and analyse demographic and profile data about users' activity on our Platform. We identify and use your IP address to help diagnose problems with our server, and to administer our Platform. Your IP address is also used to help identify you and to gather broad demographic information. We will occasionally ask you to complete surveys conducted either by us or through a third- party market research agency. These surveys may ask you for personal data, contact information, gender, date of birth, demographic information (like pin code, age or income level) attributes such as your interests, household or lifestyle information, your purchasing behaviour or history preference and other such information that you may choose to provide. The survey may involve collection of voice data or video recordings. Participation in these surveys are purely voluntary in nature. We use this data to tailor your experience at our Platform, providing you with content that we think you might be interested in and to display content according to your preferences.
                </p>
              </section>
              <section>
                <h2 className="text-xl font-bold text-foreground mt-4 mb-2 text-left">Cookies</h2>
                <p className="text-justify">
                  We use data collection devices such as "cookies" on certain pages of the Platform to help analyse our web page flow, measure promotional effectiveness, and promote trust and safety. "Cookies" are small files placed on your hard drive that assist us in providing our services. Cookies do not contain any of your personal data. We offer certain features that are only available through the use of a "cookie". We also use cookies to allow you to enter your password less frequently during a session. Cookies can also help us provide information that is targeted to your interests. Most cookies are "session cookies," meaning that they are automatically deleted from your hard drive at the end of a session. You are always free to decline/delete our cookies if your browser permits, although in that case you may not be able to use certain features on the Platform and you may be required to re-enter your password more frequently during a session. Additionally, you may encounter "cookies" or other similar devices on certain pages of the Platform that are placed by third parties. We do not control the use of cookies by third parties. We use cookies from third-party partners such as Google Analytics for marketing and analytical purposes. Google Analytics helps us understand how our customers use the site. You can read more about how Google uses your personal data here. You can also opt-out of Google Analytics here.
                </p>
              </section>
              {/* Add more sections as needed for the rest of your privacy policy... */}
            </div>
          </div>
        </div>
      </main>
      {/* Divider above footer */}
      <div className="border-t border-border w-full" />
    </div>
  );
}
