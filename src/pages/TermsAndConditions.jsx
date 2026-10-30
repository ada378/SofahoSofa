import { Link } from "react-router-dom";
import { FiHome, FiShield } from "react-icons/fi";

export default function TermsAndConditions() {
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
            <span className="text-brand-charcoal font-medium">Terms and Conditions</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
        {/* Header */}
        <div className="mb-10 pb-8 border-b border-brand-sand">
          <div className="flex items-center gap-3 mb-4">
            <FiShield className="text-3xl text-brand-terracotta" />
            <h1 className="text-3xl sm:text-4xl font-bold text-brand-charcoal">
              Terms and Conditions
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
              Welcome to Sofa Hi Sofa ("we," "our," or "us"). These Terms and Conditions govern your use of our website{" "}
              <span className="font-semibold">sofahisofa.com</span> and the purchase of our furniture products. By accessing our website or placing an order, you agree to be bound by these terms.
            </p>
            <p className="text-brand-charcoal/80 leading-relaxed">
              Sofa Hi Sofa is a direct-from-factory bespoke furniture manufacturer specializing in 100% solid hardwood furniture including sofas, sectionals, motorized recliners, beds, and dining sets.
            </p>
          </section>

          {/* Company Information */}
          <section>
            <h2 className="text-2xl font-bold text-brand-charcoal mb-4">2. Company Information</h2>
            <div className="bg-brand-sand/20 rounded-lg p-6 space-y-2">
              <p className="text-brand-charcoal/80">
                <span className="font-semibold">Business Name:</span> Sofa Hi Sofa
              </p>
              <p className="text-brand-charcoal/80">
                <span className="font-semibold">Address:</span> Khasra Number 491-492, Kisan Path, Village: Churahya, Lucknow, Uttar Pradesh 226501, India
              </p>
              <p className="text-brand-charcoal/80">
                <span className="font-semibold">Contact:</span> +91 7800001198, +91 7800001200
              </p>
              <p className="text-brand-charcoal/80">
                <span className="font-semibold">Email:</span> gautam76@mail.ru
              </p>
            </div>
          </section>

          {/* Use of Website */}
          <section>
            <h2 className="text-2xl font-bold text-brand-charcoal mb-4">3. Use of Website</h2>
            <p className="text-brand-charcoal/80 leading-relaxed mb-3">
              You agree to use our website only for lawful purposes and in a manner that does not infringe the rights of, or restrict or inhibit the use and enjoyment of, this site by any third party.
            </p>
            <ul className="list-disc list-inside space-y-2 text-brand-charcoal/80 ml-4">
              <li>You must be at least 18 years old to place orders</li>
              <li>You are responsible for maintaining the confidentiality of your account information</li>
              <li>You must provide accurate, complete, and current information</li>
              <li>You may not use our website for fraudulent purposes or in connection with criminal activity</li>
            </ul>
          </section>

          {/* Products and Pricing */}
          <section>
            <h2 className="text-2xl font-bold text-brand-charcoal mb-4">4. Products and Pricing</h2>
            <p className="text-brand-charcoal/80 leading-relaxed mb-3">
              <span className="font-semibold">4.1 Product Information:</span> We strive to display our furniture products as accurately as possible. However, actual colors may vary slightly due to screen settings and lighting during photography.
            </p>
            <p className="text-brand-charcoal/80 leading-relaxed mb-3">
              <span className="font-semibold">4.2 Custom/Bespoke Products:</span> As we manufacture custom furniture, slight variations in wood grain, texture, and color are natural characteristics of genuine hardwood and do not constitute defects.
            </p>
            <p className="text-brand-charcoal/80 leading-relaxed mb-3">
              <span className="font-semibold">4.3 Pricing:</span> All prices are listed in Indian Rupees (INR) and are inclusive of applicable taxes unless otherwise stated. We reserve the right to change prices without prior notice. The price charged will be the price displayed at the time of order confirmation.
            </p>
            <p className="text-brand-charcoal/80 leading-relaxed">
              <span className="font-semibold">4.4 Availability:</span> All products are subject to availability. In case of unavailability, we will notify you and offer alternatives or a full refund.
            </p>
          </section>

          {/* Orders and Payment */}
          <section>
            <h2 className="text-2xl font-bold text-brand-charcoal mb-4">5. Orders and Payment</h2>
            <p className="text-brand-charcoal/80 leading-relaxed mb-3">
              <span className="font-semibold">5.1 Order Acceptance:</span> Your order constitutes an offer to purchase. We reserve the right to accept or reject any order at our discretion. Order confirmation does not guarantee acceptance.
            </p>
            <p className="text-brand-charcoal/80 leading-relaxed mb-3">
              <span className="font-semibold">5.2 Payment Methods:</span> We accept UPI, Credit/Debit Cards, Net Banking, and Cash on Delivery (COD). For custom orders, we may require an advance payment.
            </p>
            <p className="text-brand-charcoal/80 leading-relaxed mb-3">
              <span className="font-semibold">5.3 EMI Options:</span> 0% No-Cost EMI options are available on select credit cards as per our banking partners' terms.
            </p>
            <p className="text-brand-charcoal/80 leading-relaxed">
              <span className="font-semibold">5.4 Order Cancellation:</span> Orders can be cancelled within 24 hours of placement for a full refund. Cancellations after manufacturing has begun may incur charges.
            </p>
          </section>

          {/* Delivery and Shipping */}
          <section>
            <h2 className="text-2xl font-bold text-brand-charcoal mb-4">6. Delivery and Shipping</h2>
            <p className="text-brand-charcoal/80 leading-relaxed mb-3">
              <span className="font-semibold">6.1 Delivery Coverage:</span> We offer free delivery across India. Delivery timelines vary based on location and product customization.
            </p>
            <p className="text-brand-charcoal/80 leading-relaxed mb-3">
              <span className="font-semibold">6.2 Manufacturing Time:</span> Custom furniture typically requires 20-45 days for manufacturing, plus delivery time. We will provide estimated delivery dates during order confirmation.
            </p>
            <p className="text-brand-charcoal/80 leading-relaxed mb-3">
              <span className="font-semibold">6.3 Delivery Inspection:</span> Please inspect your furniture upon delivery. Report any damage or discrepancies immediately to our delivery team and customer service within 24 hours.
            </p>
            <p className="text-brand-charcoal/80 leading-relaxed">
              <span className="font-semibold">6.4 Delivery Failure:</span> If delivery cannot be completed due to incorrect address, recipient unavailability, or access issues, additional delivery charges may apply.
            </p>
          </section>

          {/* Warranty and Returns */}
          <section>
            <h2 className="text-2xl font-bold text-brand-charcoal mb-4">7. Warranty and Returns</h2>
            <p className="text-brand-charcoal/80 leading-relaxed mb-3">
              <span className="font-semibold">7.1 10-Year Frame Warranty:</span> We provide a 10-year warranty on structural frames against manufacturing defects. This warranty covers frame integrity but excludes normal wear and tear, fabric, foam, or damage from misuse.
            </p>
            <p className="text-brand-charcoal/80 leading-relaxed mb-3">
              <span className="font-semibold">7.2 Return Policy:</span> Due to the custom nature of our furniture, returns are only accepted for manufacturing defects or damage during transit. Returns must be initiated within 7 days of delivery with photographic evidence.
            </p>
            <p className="text-brand-charcoal/80 leading-relaxed mb-3">
              <span className="font-semibold">7.3 Refund Process:</span> Approved returns will be refunded within 7-14 business days via the original payment method.
            </p>
            <p className="text-brand-charcoal/80 leading-relaxed">
              <span className="font-semibold">7.4 Exchange Policy:</span> Exchanges for size, color, or design changes are not possible once manufacturing has begun. Please review your order carefully before confirmation.
            </p>
          </section>

          {/* Intellectual Property */}
          <section>
            <h2 className="text-2xl font-bold text-brand-charcoal mb-4">8. Intellectual Property</h2>
            <p className="text-brand-charcoal/80 leading-relaxed">
              All content on this website, including text, graphics, logos, images, and software, is the property of Sofa Hi Sofa and is protected by Indian and international copyright laws. You may not reproduce, distribute, or create derivative works without our express written permission.
            </p>
          </section>

          {/* Limitation of Liability */}
          <section>
            <h2 className="text-2xl font-bold text-brand-charcoal mb-4">9. Limitation of Liability</h2>
            <p className="text-brand-charcoal/80 leading-relaxed mb-3">
              To the maximum extent permitted by law, Sofa Hi Sofa shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of our website or products.
            </p>
            <p className="text-brand-charcoal/80 leading-relaxed">
              Our total liability for any claim arising from or related to these terms or your purchase shall not exceed the amount paid for the product in question.
            </p>
          </section>

          {/* Dispute Resolution */}
          <section>
            <h2 className="text-2xl font-bold text-brand-charcoal mb-4">10. Dispute Resolution and Governing Law</h2>
            <p className="text-brand-charcoal/80 leading-relaxed mb-3">
              <span className="font-semibold">10.1 Governing Law:</span> These Terms and Conditions are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of courts in Lucknow, Uttar Pradesh.
            </p>
            <p className="text-brand-charcoal/80 leading-relaxed">
              <span className="font-semibold">10.2 Dispute Resolution:</span> We encourage customers to contact us first to resolve any issues. If a resolution cannot be reached, disputes may be subject to arbitration under Indian Arbitration and Conciliation Act, 1996.
            </p>
          </section>

          {/* Changes to Terms */}
          <section>
            <h2 className="text-2xl font-bold text-brand-charcoal mb-4">11. Changes to Terms</h2>
            <p className="text-brand-charcoal/80 leading-relaxed">
              We reserve the right to modify these Terms and Conditions at any time. Changes will be effective immediately upon posting on this website. Your continued use of the website after changes are posted constitutes acceptance of the modified terms.
            </p>
          </section>

          {/* Contact Information */}
          <section>
            <h2 className="text-2xl font-bold text-brand-charcoal mb-4">12. Contact Us</h2>
            <p className="text-brand-charcoal/80 leading-relaxed mb-4">
              If you have any questions about these Terms and Conditions, please contact us:
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
