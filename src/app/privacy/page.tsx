import React from 'react';

export const metadata = {
  title: 'Privacy Policy | ZuluNiner',
  description: 'Read the Privacy Policy for ZuluNiner, operated by Disco Media Pty Ltd. Learn how we collect, use, and protect your data.'
};

export default function PrivacyPage() {
  return (
    <main className="max-w-3xl mx-auto py-12 px-4 prose prose-neutral">
      <h1>Privacy Policy</h1>
      <h2>Data Collection</h2>
      <ul>
        <li>Some cookies may be used for user convenience</li>
        <li>We use Google Analytics to understand site usage</li>
        <li>We only send transactional or account-related emails, or alerts that users specifically opt into</li>
      </ul>
      <h2>Data Storage</h2>
      <ul>
        <li>All data is stored securely in Supabase in US/EU regions</li>
        <li>We do not sell or share your personal data with third parties except as required by law</li>
      </ul>
      <h2>User Rights</h2>
      <ul>
        <li>You may request deletion of your account and data at any time by contacting ninjas@zuluniner.com</li>
        <li>We will comply with all applicable privacy laws and regulations</li>
      </ul>
      <h2>Security</h2>
      <ul>
        <li>We use industry-standard security measures to protect your data</li>
        <li>Access to your data is restricted to authorized personnel only</li>
      </ul>
      <h2>Contact</h2>
      <ul>
        <li>For privacy-related questions, contact ninjas@zuluniner.com</li>
        <li>Business address: PO Box 4040, Melbourne 3000 Victoria, Australia</li>
      </ul>
      <p>By using ZuluNiner, you consent to this privacy policy. We may update this policy from time to time. Continued use of the platform constitutes acceptance of any changes.</p>
    </main>
  );
}
