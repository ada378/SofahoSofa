import { Link } from "react-router-dom";
import { FiHome, FiLock } from "react-icons/fi";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="bg-brand-sand/30 border-b border-brand-sand">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center gap-2 text-sm text-brand-charcoal/70">
            <Link to="/" className="hover:text-brand-terracotta transition-colors flex items-center gap-1">
              <FiHome className="text-xs" />
              Home
            </Link>
            <span>/</span>
            <span className="text-brand-charcoal font-medium">Privacy Policy</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
        {/* Header */}
        <div className="mb-10 pb-8 border-b border-brand-sand">
          <div className="flex items-center gap-3 mb-4">
            <FiLock className="text-3xl text-brand-terracotta" />
            <h1 className="text-3xl sm:text-4xl font-bold text-brand-charcoal">
              Privacy Policy
            </h1>
          </div>
          <p className="text-brand-charcoal/70 text-sm">
            Last Updated: October 30, 2026
          </p>
        </div>

        {/* Content */}
        <div className="prose prose-sm sm:prose max-w-none space-y-8">
          {/* Introduction */}
          <section>
            <h2 className="text-2xl font-bold text-brand-charcoal mb-4">1. Introduction</h2>
            <p className="text-brand-charcoal/80 leading-relaxed mb-4">
              At Sofa Hi Sofa ("we," "our," or "us"), we are committed to protecting your privacy and personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website{" "}
              <span className="font-semibold">sofahisofa.com</span> and purchase our products.
            </p>
            <p className="text-brand-charcoal/80 leading-relaxed">
              By using our website, you consent to the data practices described in this policy. If you do not agree with our policies and practices, please do not use our website.
            </p>
          </section>

          {/* Information We Collect */}
          <section>
            <h2 className="text-2xl font-bold text-brand-charcoal mb-4">2. Information We Collect</h2>
            
            <h3 className="text-xl font-semibold text-brand-charcoal mb-3">2.1 Personal Information</h3>
            <p className="text-brand-charcoal/80 leading-relaxed mb-3">
              We collect personal information that you voluntarily provide to us when you:
            </p>
            <ul className="list-disc list-inside space-y-2 text-brand-charcoal/80 ml-4 mb-4">
              <li>Register for an account</li>
              <li>Place an order or make a purchase</li>
              <li>Contact us for customer support</li>
              <li>Subscribe to our newsletter or marketing communications</li>
              <li>Participate in surveys or promotions</li>
            </ul>
            <p className="text-brand-charcoal/80 leading-relaxed mb-4">
              This information may include:
            </p>
            <ul className="list-disc list-inside space-y-2 text-brand-charcoal/80 ml-4">
              <li>Full name</li>
              <li>Email address</li>
              <li>Phone number</li>
              <li>Shipping and billing address</li>
              <li>Payment information (processed securely through payment gateways)</li>
              <li>Order history and preferences</li>
            </ul>

            <h3 className="text-xl font-semibold text-brand-charcoal mb-3 mt-6">2.2 Automatically Collected Information</h3>
            <p className="text-brand-charcoal/80 leading-relaxed mb-3">
              When you visit our website, we automatically collect certain information about your device and browsing behavior, including:
            </p>
            <ul className="list-disc list-inside space-y-2 text-brand-charcoal/80 ml-4">
              <li>IP address and location data</li>
              <li>Browser type and version</li>
              <li>Operating system</li>
              <li>Pages visited and time spent on pages</li>
              <li>Referring website</li>
              <li>Device information</li>
              <li>Cookies and similar tracking technologies</li>
            </ul>

            <h3 className="text-xl font-semibold text-brand-charcoal mb-3 mt-6">2.3 Third-Party Information</h3>
            <p className="text-brand-charcoal/80 leading-relaxed">
              We may receive information about you from third-party services such as payment processors, delivery partners, and analytics providers.
            </p>
          </section>

          {/* How We Use Your Information */}
          <section>
            <h2 className="text-2xl font-bold text-brand-charcoal mb-4">3. How We Use Your Information</h2>
            <p className="text-brand-charcoal/80 leading-relaxed mb-3">
              We use the collected information for the following purposes:
            </p>
            <ul className="list-disc list-inside space-y-2 text-brand-charcoal/80 ml-4">
              <li><span className="font-semibold">Order Processing:</span> To process and fulfill your orders, including payment processing and delivery</li>
              <li><span className="font-semibold">Customer Service:</span> To respond to your inquiries, provide support, and resolve issues</li>
              <li><span className="font-semibold">Account Management:</span> To create and manage your account, including order history and preferences</li>
              <li><span className="font-semibold">Marketing Communications:</span> To send promotional emails, newsletters, and special offers (you can opt-out anytime)</li>
              <li><span className="font-semibold">Website Improvement:</span> To analyze website usage and improve user experience</li>
              <li><span className="font-semibold">Security:</span> To detect, prevent, and address fraud, security issues, and technical problems</li>
              <li><span className="font-semibold">Legal Compliance:</span> To comply with legal obligations and enforce our terms and conditions</li>
              <li><span className="font-semibold">Personalization:</span> To provide personalized product recommendations and content</li>
            </ul>
          </section>

          {/* Cookies and Tracking */}
          <section>
            <h2 className="text-2xl font-bold text-brand-charcoal mb-4">4. Cookies and Tracking Technologies</h2>
            <p className="text-brand-charcoal/80 leading-relaxed mb-4">
              We use cookies, web beacons, and similar tracking technologies to enhance your browsing experience and collect information about how you use our website.
            </p>
            
            <h3 className="text-xl font-semibold text-brand-charcoal mb-3">4.1 Types of Cookies We Use</h3>
            <ul className="list-disc list-inside space-y-2 text-brand-charcoal/80 ml-4 mb-4">
              <li><span className="font-semibold">Essential Cookies:</span> Required for website functionality, including shopping cart and checkout</li>
              <li><span className="font-semibold">Performance Cookies:</span> Help us understand how visitors interact with our website</li>
              <li><span className="font-semibold">Functionality Cookies:</span> Remember your preferences and settings</li>
              <li><span className="font-semibold">Advertising Cookies:</span> Used to deliver relevant advertisements and measure campaign effectiveness</li>
            </ul>

            <h3 className="text-xl font-semibold text-brand-charcoal mb-3">4.2 Third-Party Cookies</h3>
            <p className="text-brand-charcoal/80 leading-relaxed mb-3">
              We use third-party services that may set cookies on your device:
            </p>
            <ul className="list-disc list-inside space-y-2 text-brand-charcoal/80 ml-4 mb-4">
              <li><span className="font-semibold">Google Analytics:</span> To analyze website traffic and user behavior</li>
              <li><span className="font-semibold">Google Ads:</span> To display relevant advertisements and measure ad performance</li>
              <li><span className="font-semibold">Facebook Pixel:</span> For advertising and analytics purposes</li>
              <li><span className="font-semibold">Payment Gateways:</span> To process secure payments</li>
            </ul>

            <h3 className="text-xl font-semibold text-brand-charcoal mb-3">4.3 Managing Cookies</h3>
            <p className="text-brand-charcoal/80 leading-relaxed">
              You can control cookies through your browser settings. Note that disabling certain cookies may affect website functionality and your user experience.
            </p>
          </section>

          {/* Information Sharing */}
          <section>
            <h2 className="text-2xl font-bold text-brand-charcoal mb-4">5. How We Share Your Information</h2>
            <p className="text-brand-charcoal/80 leading-relaxed mb-3">
              We do not sell your personal information. We may share your information with:
            </p>
            <ul className="list-disc list-inside space-y-2 text-brand-charcoal/80 ml-4">
              <li><span className="font-semibold">Service Providers:</span> Third parties who help us operate our business, such as payment processors, shipping companies, and cloud hosting services</li>
              <li><span className="font-semibold">Manufacturing Partners:</span> To fulfill custom furniture orders (limited to order specifications only)</li>
              <li><span className="font-semibold">Marketing Partners:</span> For advertising purposes (anonymized data only)</li>
              <li><span className="font-semibold">Legal Authorities:</span> When required by law or to protect our rights and safety</li>
              <li><span className="font-semibold">Business Transfers:</span> In the event of a merger, acquisition, or sale of assets</li>
            </ul>
            <p className="text-brand-charcoal/80 leading-relaxed mt-4">
              All third parties are required to maintain the confidentiality and security of your information and use it only for the purposes we specify.
            </p>
          </section>

          {/* Data Security */}
          <section>
            <h2 className="text-2xl font-bold text-brand-charcoal mb-4">6. Data Security</h2>
            <p className="text-brand-charcoal/80 leading-relaxed mb-3">
              We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. These measures include:
            </p>
            <ul className="list-disc list-inside space-y-2 text-brand-charcoal/80 ml-4">
              <li>SSL/TLS encryption for data transmission</li>
              <li>Secure payment processing through PCI-DSS compliant payment gateways</li>
              <li>Regular security assessments and updates</li>
              <li>Access controls and authentication mechanisms</li>
              <li>Data backup and recovery procedures</li>
            </ul>
            <p className="text-brand-charcoal/80 leading-relaxed mt-4">
              However, no method of transmission over the Internet or electronic storage is 100% secure. While we strive to protect your information, we cannot guarantee absolute security.
            </p>
          </section>

          {/* Data Retention */}
          <section>
            <h2 className="text-2xl font-bold text-brand-charcoal mb-4">7. Data Retention</h2>
            <p className="text-brand-charcoal/80 leading-relaxed">
              We retain your personal information for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required by law. After this period, we will securely delete or anonymize your information. Order and warranty information may be retained for up to 10 years to honor our warranty commitments.
            </p>
          </section>

          {/* Your Rights */}
          <section>
            <h2 className="text-2xl font-bold text-brand-charcoal mb-4">8. Your Rights and Choices</h2>
            <p className="text-brand-charcoal/80 leading-relaxed mb-3">
              You have the following rights regarding your personal information:
            </p>
            <ul className="list-disc list-inside space-y-2 text-brand-charcoal/80 ml-4">
              <li><span className="font-semibold">Access:</span> Request a copy of the personal information we hold about you</li>
              <li><span className="font-semibold">Correction:</span> Request correction of inaccurate or incomplete information</li>
              <li><span className="font-semibold">Deletion:</span> Request deletion of your personal information (subject to legal obligations)</li>
              <li><span className="font-semibold">Opt-Out:</span> Unsubscribe from marketing communications at any time</li>
              <li><span className="font-semibold">Data Portability:</span> Request your data in a portable format</li>
              <li><span className="font-semibold">Withdraw Consent:</span> Withdraw consent for data processing where consent was the legal basis</li>
            </ul>
            <p className="text-brand-charcoal/80 leading-relaxed mt-4">
              To exercise these rights, please contact us at gautam76@mail.ru or call +91 7800001198.
            </p>
          </section>

          {/* Children's Privacy */}
          <section>
            <h2 className="text-2xl font-bold text-brand-charcoal mb-4">9. Children's Privacy</h2>
            <p className="text-brand-charcoal/80 leading-relaxed">
              Our website is not intended for children under 18 years of age. We do not knowingly collect personal information from children. If you believe we have collected information from a child, please contact us immediately so we can delete it.
            </p>
          </section>

          {/* Third-Party Links */}
          <section>
            <h2 className="text-2xl font-bold text-brand-charcoal mb-4">10. Third-Party Links</h2>
            <p className="text-brand-charcoal/80 leading-relaxed">
              Our website may contain links to third-party websites, including payment processors and social media platforms. We are not responsible for the privacy practices of these external sites. We encourage you to review their privacy policies before providing any personal information.
            </p>
          </section>

          {/* International Transfers */}
          <section>
            <h2 className="text-2xl font-bold text-brand-charcoal mb-4">11. International Data Transfers</h2>
            <p className="text-brand-charcoal/80 leading-relaxed">
              Your information may be transferred to and processed in countries other than India, including countries that may have different data protection laws. We ensure appropriate safeguards are in place to protect your information in accordance with this Privacy Policy.
            </p>
          </section>

          {/* Google Ads */}
          <section>
            <h2 className="text-2xl font-bold text-brand-charcoal mb-4">12. Google Ads and Advertising</h2>
            <p className="text-brand-charcoal/80 leading-relaxed mb-3">
              We use Google Ads to display advertisements on our website and across the internet. Google may use cookies and other tracking technologies to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-brand-charcoal/80 ml-4">
              <li>Show you personalized ads based on your interests and browsing behavior</li>
              <li>Measure ad performance and engagement</li>
              <li>Provide remarketing and retargeting services</li>
            </ul>
            <p className="text-brand-charcoal/80 leading-relaxed mt-4">
              You can opt out of personalized advertising by visiting{" "}
              <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-brand-terracotta hover:underline font-semibold">
                Google Ads Settings
              </a>{" "}
              or the{" "}
              <a href="http://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer" className="text-brand-terracotta hover:underline font-semibold">
                Network Advertising Initiative opt-out page
              </a>.
            </p>
          </section>

          {/* Changes to Policy */}
          <section>
            <h2 className="text-2xl font-bold text-brand-charcoal mb-4">13. Changes to This Privacy Policy</h2>
            <p className="text-brand-charcoal/80 leading-relaxed">
              We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. We will notify you of significant changes by posting the updated policy on this page with a new "Last Updated" date. Your continued use of our website after changes are posted constitutes acceptance of the updated policy.
            </p>
          </section>

          {/* Contact Information */}
          <section>
            <h2 className="text-2xl font-bold text-brand-charcoal mb-4">14. Contact Us</h2>
            <p className="text-brand-charcoal/80 leading-relaxed mb-4">
              If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:
            </p>
            <div className="bg-brand-sand/20 rounded-lg p-6 space-y-2">
              <p className="text-brand-charcoal/80">
                <span className="font-semibold">Email:</span> gautam76@mail.ru
              </p>
              <p className="text-brand-charcoal/80">
                <span className="font-semibold">Phone:</span> +91 7800001198, +91 7800001200
              </p>
              <p className="text-brand-charcoal/80">
                <span className="font-semibold">Address:</span> Khasra Number 491-492, Kisan Path, Village: Churahya, Lucknow, Uttar Pradesh 226501, India
              </p>
            </div>
          </section>

          {/* Consent */}
          <section className="bg-brand-terracotta/10 rounded-lg p-6 border-l-4 border-brand-terracotta">
            <h2 className="text-2xl font-bold text-brand-charcoal mb-4">Your Consent</h2>
            <p className="text-brand-charcoal/80 leading-relaxed">
              By using our website and services, you consent to the collection, use, and sharing of your information as described in this Privacy Policy. If you do not agree with this policy, please discontinue use of our website.
            </p>
          </section>
        </div>

        {/* Back to Home */}
        <div className="mt-12 pt-8 border-t border-brand-sand">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-brand-terracotta hover:text-brand-terracottaDark font-semibold transition-colors"
          >
            <FiHome />
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
