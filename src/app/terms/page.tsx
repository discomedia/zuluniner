import React from 'react';

export const metadata = {
  title: 'Terms of Service | ZuluNiner',
  description: 'Read the Terms of Service for ZuluNiner, operated by Disco Media Pty Ltd. Learn about our business model, user requirements, content guidelines, and legal framework.'
};

export default function TermsPage() {
  return (
    <main className="max-w-3xl mx-auto py-12 px-4 prose prose-neutral">
      <h1>Terms of Service</h1>
      <h2>Company Information</h2>
      <ul>
        <li><strong>Legal Entity</strong>: ZuluNiner, operating under Disco Media Pty Ltd (Australian media company)</li>
        <li><strong>Business Address</strong>: PO Box 4040, Melbourne 3000 Victoria, Australia</li>
        <li><strong>Contact Information</strong>: ninjas@zuluniner.com</li>
      </ul>
      <h2>Business Model & Fees</h2>
      <ul>
        <li><strong>Revenue Model</strong>: Revenue from listing fees only, though may implement success fees for auction listings</li>
        <li><strong>Payment Processing</strong>: Via Stripe. Any fees are those of Stripe</li>
        <li><strong>Fee Structure</strong>: Fees charged only on payment of listing fee. If an auction is successful, a fee will be charged to the buyer when payment is made via escrow</li>
      </ul>
      <h2>User Requirements & Verification</h2>
      <ul>
        <li><strong>Age Requirements</strong>: Minimum 18 years old</li>
        <li><strong>Account Verification</strong>: May be implemented for sellers if payments are to be made via the platform (not yet implemented)</li>
      </ul>
      <h2>Content Moderation Guidelines</h2>
      <ul>
        <li>Nothing illegal</li>
        <li>No pornographic content</li>
        <li>Nothing that harms anyone</li>
        <li>No hate or intolerant speech</li>
        <li>No scams</li>
        <li>No selling of unrelated services/products</li>
      </ul>
      <h2>Data & Privacy</h2>
      <ul>
        <li><strong>Data Collection</strong>: Some cookies may be used for user convenience</li>
        <li><strong>Analytics</strong>: Using Google Analytics</li>
        <li><strong>Email Communications</strong>: Only transactional or account-related emails, or alerts that users specifically opt into</li>
        <li><strong>Data Storage</strong>: Data stored in Supabase in US/EU regions</li>
      </ul>
      <h2>Legal Framework</h2>
      <ul>
        <li><strong>Governing Law</strong>: Australian law</li>
        <li><strong>Dispute Resolution</strong>: Mediation or arbitration in Melbourne, Victoria, Australia</li>
        <li><strong>Liability</strong>: ZuluNiner does not facilitate transactions, only connects buyers and sellers. We are not liable, though we do our best to verify</li>
        <li><strong>Aircraft Condition</strong>: Buyer beware. All negotiation between buyers and sellers. Users should report scam listings</li>
      </ul>
      <p>By using ZuluNiner, you agree to these terms. We reserve the right to update these terms at any time. Continued use of the platform constitutes acceptance of any changes.</p>
    </main>
  );
}
