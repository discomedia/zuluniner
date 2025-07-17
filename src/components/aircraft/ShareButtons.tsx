'use client';

import { useState } from 'react';
import { Share2, Copy, Check, Facebook, Twitter, Linkedin, Mail } from 'lucide-react';
import Button from '@/components/ui/Button';

interface ShareButtonsProps {
  aircraft: {
    title: string;
    slug: string;
    price: number;
    year: number;
    make: string;
    model: string;
  };
}

export default function ShareButtons({ aircraft }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);

  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareText = `Check out this ${aircraft.year} ${aircraft.make} ${aircraft.model} for sale on ZuluNiner`;
  const shareTitle = aircraft.title;

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API failed
    }
  };

  const shareViaEmail = () => {
    const subject = encodeURIComponent(shareTitle);
    const body = encodeURIComponent(
      `${shareText}\n\nPrice: ${formatPrice(aircraft.price)}\n\n${currentUrl}`
    );
    window.open(`mailto:?subject=${subject}&body=${body}`);
  };

  const shareViaFacebook = () => {
    const url = encodeURIComponent(currentUrl);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
  };

  const shareViaTwitter = () => {
    const text = encodeURIComponent(`${shareText} ${formatPrice(aircraft.price)}`);
    const url = encodeURIComponent(currentUrl);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
  };

  const shareViaLinkedIn = () => {
    const url = encodeURIComponent(currentUrl);
    const title = encodeURIComponent(shareTitle);
    const summary = encodeURIComponent(`${shareText} - ${formatPrice(aircraft.price)}`);
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}&title=${title}&summary=${summary}`, '_blank');
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: currentUrl,
        });
      } catch {
        // User cancelled or error occurred, fall back to custom share menu
        setShowShareMenu(true);
      }
    } else {
      setShowShareMenu(true);
    }
  };

  return (
    <div className="relative">
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-gray-700">Share:</span>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={handleNativeShare}
          className="flex items-center gap-2"
        >
          <Share2 className="h-4 w-4" />
          Share
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={copyToClipboard}
          className="flex items-center gap-2"
        >
          {copied ? (
            <>
              <Check className="h-4 w-4 text-green-600" />
              <span className="text-green-600">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="h-4 w-4" />
              Copy Link
            </>
          )}
        </Button>
      </div>

      {/* Custom Share Menu */}
      {showShareMenu && (
        <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-10 min-w-64">
          <div className="space-y-2">
            <h4 className="font-medium text-gray-900 mb-3">Share this aircraft</h4>
            
            <button
              onClick={shareViaEmail}
              className="flex items-center gap-3 w-full px-3 py-2 text-left hover:bg-gray-50 rounded-md transition-colors"
            >
              <Mail className="h-5 w-5 text-gray-600" />
              <span>Email</span>
            </button>

            <button
              onClick={shareViaFacebook}
              className="flex items-center gap-3 w-full px-3 py-2 text-left hover:bg-gray-50 rounded-md transition-colors"
            >
              <Facebook className="h-5 w-5 text-blue-600" />
              <span>Facebook</span>
            </button>

            <button
              onClick={shareViaTwitter}
              className="flex items-center gap-3 w-full px-3 py-2 text-left hover:bg-gray-50 rounded-md transition-colors"
            >
              <Twitter className="h-5 w-5 text-blue-400" />
              <span>Twitter</span>
            </button>

            <button
              onClick={shareViaLinkedIn}
              className="flex items-center gap-3 w-full px-3 py-2 text-left hover:bg-gray-50 rounded-md transition-colors"
            >
              <Linkedin className="h-5 w-5 text-blue-700" />
              <span>LinkedIn</span>
            </button>

            <hr className="my-2" />

            <button
              onClick={copyToClipboard}
              className="flex items-center gap-3 w-full px-3 py-2 text-left hover:bg-gray-50 rounded-md transition-colors"
            >
              {copied ? (
                <>
                  <Check className="h-5 w-5 text-green-600" />
                  <span className="text-green-600">Link copied!</span>
                </>
              ) : (
                <>
                  <Copy className="h-5 w-5 text-gray-600" />
                  <span>Copy link</span>
                </>
              )}
            </button>
          </div>

          <div className="mt-3 pt-3 border-t">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowShareMenu(false)}
              className="w-full"
            >
              Close
            </Button>
          </div>
        </div>
      )}

      {/* Backdrop to close share menu */}
      {showShareMenu && (
        <div
          className="fixed inset-0 bg-transparent z-0"
          onClick={() => setShowShareMenu(false)}
        />
      )}
    </div>
  );
}