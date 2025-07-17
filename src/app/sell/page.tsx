import { Metadata } from 'next';
import MainLayout from '@/components/layouts/MainLayout';
import ContainerLayout from '@/components/layouts/ContainerLayout';
import Button from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';

export const metadata: Metadata = {
  title: 'Sell Your Aircraft - ZuluNiner',
  description: 'List your aircraft for sale on ZuluNiner marketplace. Reach thousands of qualified buyers and sell your aircraft quickly and securely.',
  keywords: 'sell aircraft, list aircraft, aircraft marketplace, aviation sales',
  openGraph: {
    title: 'Sell Your Aircraft - ZuluNiner',
    description: 'List your aircraft for sale on ZuluNiner marketplace. Reach thousands of qualified buyers.',
    type: 'website',
    siteName: 'ZuluNiner',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sell Your Aircraft - ZuluNiner',
    description: 'List your aircraft for sale on ZuluNiner marketplace. Reach thousands of qualified buyers.',
  },
  alternates: {
    canonical: '/sell',
  },
};

export default function SellPage() {
  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-700 text-white">
        <ContainerLayout className="py-20 lg:py-28">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Sell Your Aircraft
            </h1>
            <p className="mt-6 text-xl text-primary-100 max-w-3xl mx-auto">
              Connect with thousands of qualified buyers on the premier aircraft marketplace. 
              List your aircraft today and reach pilots, dealers, and aviation enthusiasts worldwide.
            </p>
            <div className="mt-10">
              <Button size="lg" variant="secondary" className="bg-white text-primary-700 hover:bg-neutral-100">
                Start Your Listing
              </Button>
            </div>
          </div>
        </ContainerLayout>
      </section>

      {/* Features Section */}
      <section className="bg-white">
        <ContainerLayout className="py-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-neutral-900 sm:text-4xl">
              Why Sell on ZuluNiner?
            </h2>
            <p className="mt-4 text-lg text-neutral-600 max-w-2xl mx-auto">
              Join thousands of successful sellers who trust ZuluNiner to connect them with serious buyers
            </p>
          </div>
          
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <Card className="text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <CardTitle>Qualified Buyers</CardTitle>
                <CardDescription>
                  Connect with verified buyers who are serious about purchasing aircraft
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <CardTitle>Maximum Exposure</CardTitle>
                <CardDescription>
                  Your listing reaches thousands of potential buyers across our platform
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <CardTitle>Secure Transactions</CardTitle>
                <CardDescription>
                  Safe and secure listing process with fraud protection and verification
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </ContainerLayout>
      </section>

      {/* How It Works Section */}
      <section className="bg-neutral-50">
        <ContainerLayout className="py-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-neutral-900 sm:text-4xl">
              How It Works
            </h2>
            <p className="mt-4 text-lg text-neutral-600">
              Get your aircraft listed in just a few simple steps
            </p>
          </div>
          
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-600 text-white rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
                1
              </div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-2">Create Your Account</h3>
              <p className="text-neutral-600">
                Sign up for a seller account and verify your identity for trust and security
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary-600 text-white rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
                2
              </div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-2">List Your Aircraft</h3>
              <p className="text-neutral-600">
                Add photos, specifications, and details about your aircraft using our easy listing tool
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary-600 text-white rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
                3
              </div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-2">Connect with Buyers</h3>
              <p className="text-neutral-600">
                Receive inquiries from qualified buyers and manage communications through our platform
              </p>
            </div>
          </div>
        </ContainerLayout>
      </section>

      {/* Pricing Section */}
      <section className="bg-white">
        <ContainerLayout className="py-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-neutral-900 sm:text-4xl">
              Simple, Transparent Pricing
            </h2>
            <p className="mt-4 text-lg text-neutral-600">
              No hidden fees, no surprises. Only pay when you sell.
            </p>
          </div>
          
          <div className="max-w-md mx-auto">
            <Card className="text-center">
              <CardHeader>
                <CardTitle className="text-2xl">Success Fee</CardTitle>
                <div className="text-4xl font-bold text-primary-600 my-4">3%</div>
                <CardDescription>
                  Only charged when your aircraft sells successfully
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-left space-y-3 text-neutral-600">
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Professional photography assistance
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Marketing across all platforms
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Buyer verification and screening
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Transaction support and escrow
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </ContainerLayout>
      </section>

      {/* CTA Section */}
      <section className="bg-primary-600">
        <ContainerLayout className="py-20">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">
              Ready to Sell Your Aircraft?
            </h2>
            <p className="mt-4 text-xl text-primary-100 max-w-2xl mx-auto">
              Join thousands of successful sellers on ZuluNiner. Create your listing today and connect with qualified buyers.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="bg-white text-primary-700 hover:bg-neutral-100">
                Create Account & List Aircraft
              </Button>
              <Button size="lg" variant="ghost" className="text-white border-white hover:bg-primary-500">
                Contact Sales Team
              </Button>
            </div>
            <p className="mt-4 text-sm text-primary-200">
              Questions? Call us at (555) 123-4567 or email hello@zuluniner.com
            </p>
          </div>
        </ContainerLayout>
      </section>
    </MainLayout>
  );
}