'use client';

import { useState } from 'react';
import { Phone, Mail, MessageCircle } from 'lucide-react';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Alert from '@/components/ui/Alert';

interface ContactSellerProps {
  aircraft: {
    id: string;
    title: string;
    user: {
      name: string;
      email: string;
      phone?: string;
    };
  };
}

export default function ContactSeller({ aircraft }: ContactSellerProps) {
  const [showContactForm, setShowContactForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: `Hi, I'm interested in your ${aircraft.title}. Could you please provide more information?`,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // Create email subject and body
      const subject = `Inquiry about ${aircraft.title}`;
      const emailBody = `
Name: ${formData.name}
Email: ${formData.email}
Phone: ${formData.phone || 'Not provided'}

Message:
${formData.message}

Aircraft: ${aircraft.title}
Listing URL: ${window.location.href}
      `.trim();

      // Create mailto link
      const mailtoLink = `mailto:${aircraft.user.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailBody)}`;
      
      // Open email client
      window.location.href = mailtoLink;
      
      setSubmitStatus('success');
      setTimeout(() => {
        setShowContactForm(false);
        setSubmitStatus('idle');
      }, 2000);
    } catch (error) {
      console.error('Error sending message:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePhoneCall = () => {
    if (aircraft.user.phone) {
      window.location.href = `tel:${aircraft.user.phone}`;
    }
  };

  const handleDirectEmail = () => {
    const subject = `Inquiry about ${aircraft.title}`;
    const body = `Hi,\n\nI'm interested in your ${aircraft.title}. Could you please provide more information?\n\nBest regards`;
    window.location.href = `mailto:${aircraft.user.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <>
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-gray-900">Contact Seller</h3>
        
        <div className="flex flex-wrap gap-3">
          {aircraft.user.phone && (
            <Button
              variant="primary"
              onClick={handlePhoneCall}
              className="flex items-center gap-2"
            >
              <Phone className="h-4 w-4" />
              Call Now
            </Button>
          )}
          
          <Button
            variant="secondary"
            onClick={handleDirectEmail}
            className="flex items-center gap-2"
          >
            <Mail className="h-4 w-4" />
            Send Email
          </Button>
          
          <Button
            variant="ghost"
            onClick={() => setShowContactForm(true)}
            className="flex items-center gap-2"
          >
            <MessageCircle className="h-4 w-4" />
            Message
          </Button>
        </div>
      </div>

      {/* Contact Form Modal */}
      <Modal
        isOpen={showContactForm}
        onClose={() => setShowContactForm(false)}
        title="Contact Seller"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">
              Sending inquiry to <strong>{aircraft.user.name}</strong> about:
            </p>
            <p className="font-medium text-gray-900">{aircraft.title}</p>
          </div>

          {submitStatus === 'success' && (
            <Alert variant="success">
              Your email client should open shortly with the message pre-filled.
            </Alert>
          )}

          {submitStatus === 'error' && (
            <Alert variant="error">
              There was an error preparing your message. Please try calling or emailing directly.
            </Alert>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Your Name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
            
            <Input
              label="Your Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>

          <Input
            label="Your Phone (Optional)"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleInputChange}
          />

          <Textarea
            label="Message"
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            rows={5}
            required
          />

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setShowContactForm(false)}
            >
              Cancel
            </Button>
            
            <Button
              type="submit"
              variant="primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Preparing...' : 'Send Message'}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}