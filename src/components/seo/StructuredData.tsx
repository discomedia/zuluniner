import Script from 'next/script';
import type { Aircraft, AircraftPhoto } from '@/types';

interface AircraftStructuredDataProps {
  aircraft: Aircraft & {
    photos?: AircraftPhoto[];
    user?: {
      name: string;
      company?: string;
      phone?: string;
      email: string;
    };
  };
  primaryPhotoUrl?: string;
}

export function AircraftStructuredData({ aircraft, primaryPhotoUrl }: AircraftStructuredDataProps) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: aircraft.title,
    description: aircraft.description,
    image: primaryPhotoUrl ? [primaryPhotoUrl] : [],
    sku: aircraft.id,
    mpn: aircraft.id,
    brand: {
      '@type': 'Brand',
      name: aircraft.make,
    },
    model: aircraft.model,
    offers: {
      '@type': 'Offer',
      url: `https://zuluniner.com/aircraft/${aircraft.slug}`,
      priceCurrency: 'USD',
      price: aircraft.price,
      priceValidUntil: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 90 days from now
      itemCondition: 'https://schema.org/UsedCondition',
      availability: aircraft.status === 'active' ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      seller: {
        '@type': aircraft.user?.company ? 'Organization' : 'Person',
        name: aircraft.user?.company || aircraft.user?.name || 'Private Seller',
        ...(aircraft.user?.phone && { telephone: aircraft.user.phone }),
        ...(aircraft.user?.email && { email: aircraft.user.email }),
      },
    },
    additionalProperty: [
      {
        '@type': 'PropertyValue',
        name: 'Year',
        value: aircraft.year.toString(),
      },
      {
        '@type': 'PropertyValue',
        name: 'Make',
        value: aircraft.make,
      },
      {
        '@type': 'PropertyValue',
        name: 'Model',
        value: aircraft.model,
      },
      ...(aircraft.hours ? [{
        '@type': 'PropertyValue',
        name: 'Total Time',
        value: `${aircraft.hours} hours`,
      }] : []),
      ...(aircraft.engine_type ? [{
        '@type': 'PropertyValue',
        name: 'Engine Type',
        value: aircraft.engine_type,
      }] : []),
      ...(aircraft.avionics ? [{
        '@type': 'PropertyValue',
        name: 'Avionics',
        value: aircraft.avionics,
      }] : []),
      ...(aircraft.airport_code ? [{
        '@type': 'PropertyValue',
        name: 'Airport Code',
        value: aircraft.airport_code,
      }] : []),
    ],
    ...(aircraft.city && aircraft.country && {
      location: {
        '@type': 'Place',
        name: `${aircraft.city}, ${aircraft.country}`,
        address: {
          '@type': 'PostalAddress',
          addressLocality: aircraft.city,
          addressCountry: aircraft.country,
        },
        ...(aircraft.latitude && aircraft.longitude && {
          geo: {
            '@type': 'GeoCoordinates',
            latitude: aircraft.latitude,
            longitude: aircraft.longitude,
          },
        }),
      },
    }),
    category: 'Aircraft',
    manufacturer: {
      '@type': 'Organization',
      name: aircraft.make,
    },
    dateCreated: aircraft.created_at,
    dateModified: aircraft.updated_at,
  };

  return (
    <Script
      id="aircraft-structured-data"
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData),
      }}
    />
  );
}

interface AircraftListingPageStructuredDataProps {
  totalAircraft: number;
  currentPage: number;
  itemsPerPage: number;
}

export function AircraftListingPageStructuredData({ 
  totalAircraft, 
  currentPage, 
  itemsPerPage 
}: AircraftListingPageStructuredDataProps) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Aircraft for Sale',
    description: 'Browse our extensive collection of quality aircraft for sale from trusted sellers.',
    url: 'https://zuluniner.com/aircraft',
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: totalAircraft,
      itemListOrder: 'https://schema.org/ItemListOrderDescending',
    },
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: 'https://zuluniner.com',
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Aircraft for Sale',
          item: 'https://zuluniner.com/aircraft',
        },
      ],
    },
    ...(currentPage > 1 && {
      pagination: {
        '@type': 'Pagination',
        currentPage: currentPage,
        totalPages: Math.ceil(totalAircraft / itemsPerPage),
      },
    }),
  };

  return (
    <Script
      id="aircraft-listing-structured-data"
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData),
      }}
    />
  );
}

export function OrganizationStructuredData() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'ZuluNiner',
    alternateName: 'Zulu Niner',
    url: 'https://zuluniner.com',
    logo: 'https://zuluniner.com/logo.png',
    description: 'Premium aircraft marketplace connecting buyers and sellers of quality aircraft.',
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      url: 'https://zuluniner.com/contact',
    },
    sameAs: [
      // Add social media URLs when available
    ],
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://zuluniner.com/aircraft?q={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <Script
      id="organization-structured-data"
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData),
      }}
    />
  );
}

export function WebsiteStructuredData() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'ZuluNiner',
    alternateName: 'Zulu Niner Aircraft Marketplace',
    url: 'https://zuluniner.com',
    description: 'Premium aircraft marketplace for buying and selling quality aircraft.',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://zuluniner.com/aircraft?q={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
    publisher: {
      '@type': 'Organization',
      name: 'ZuluNiner',
      url: 'https://zuluniner.com',
    },
  };

  return (
    <Script
      id="website-structured-data"
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData),
      }}
    />
  );
}