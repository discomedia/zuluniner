

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const navigation = {
    marketplace: [
      { name: 'Browse', href: '/aircraft' },
      { name: 'Sell', href: '/sell' },
    ],
    company: [
      { name: 'About Us', href: '/about' },
      { name: 'Contact', href: '/contact' },
      { name: 'Blog', href: '/blog' },
    ],
    support: [
      { name: 'Terms of Service', href: '/terms' },
      { name: 'Privacy Policy', href: '/privacy' },
    ],

  };

  return (
    <footer className="bg-neutral-900" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="space-y-8 xl:col-span-1">
            <a href="/" className="text-2xl font-bold text-white">
              ZuluNiner
            </a>
            <p className="text-neutral-400 text-base max-w-md">
              The premier marketplace for aircraft sales and purchases. Connecting pilots, dealers, and aviation enthusiasts worldwide.
            </p>

          </div>
          <div className="mt-12 grid grid-cols-2 gap-8 xl:mt-0 xl:col-span-2">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold text-white tracking-wider uppercase">Marketplace</h3>
                <ul role="list" className="mt-4 space-y-4">
                  {navigation.marketplace.map((item) => (
                    <li key={item.name}>
                      <a href={item.href} className="text-base text-neutral-400 hover:text-neutral-300 transition-colors">
                        {item.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-12 md:mt-0">
                <h3 className="text-sm font-semibold text-white tracking-wider uppercase">Company</h3>
                <ul role="list" className="mt-4 space-y-4">
                  {navigation.company.map((item) => (
                    <li key={item.name}>
                      <a href={item.href} className="text-base text-neutral-400 hover:text-neutral-300 transition-colors">
                        {item.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="md:grid md:grid-cols-1 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold text-white tracking-wider uppercase">Support</h3>
                <ul role="list" className="mt-4 space-y-4">
                  {navigation.support.map((item) => (
                    <li key={item.name}>
                      <a href={item.href} className="text-base text-neutral-400 hover:text-neutral-300 transition-colors">
                        {item.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t border-neutral-700 pt-8">
          <div className="md:flex md:items-center md:justify-between">
            <div className="flex space-x-6 md:order-2">
              <p className="text-neutral-400 text-base">
                Need help? <a href="/contact" className="text-primary-400 hover:text-primary-300 transition-colors">Contact us</a>
              </p>
            </div>
            <p className="mt-8 text-base text-neutral-400 md:mt-0 md:order-1">
              &copy; {currentYear} ZuluNiner. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
