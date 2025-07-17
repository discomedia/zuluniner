'use client';

import { useState } from 'react';
import MainLayout from '@/components/layouts/MainLayout';
import ContainerLayout from '@/components/layouts/ContainerLayout';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Select from '@/components/ui/Select';
import { Card, CardContent } from '@/components/ui/Card';
import Alert from '@/components/ui/Alert';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    category: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      // TODO: Implement actual form submission logic
      // For now, just simulate a delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSubmitted(true);
    } catch {
      setError('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <MainLayout>
        <ContainerLayout className="py-20">
          <div className="max-w-2xl mx-auto text-center">
            <div className="text-6xl mb-6">✅</div>
            <h1 className="text-3xl font-bold text-neutral-900 mb-4">Message Sent!</h1>
            <p className="text-lg text-neutral-600 mb-8">
              Thank you for contacting us. We&apos;ll get back to you within 24 hours.
            </p>
            <Button onClick={() => {
              setSubmitted(false);
              setFormData({
                name: '',
                email: '',
                phone: '',
                subject: '',
                category: '',
                message: ''
              });
            }}>
              Send Another Message
            </Button>
          </div>
        </ContainerLayout>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-700 text-white">
        <ContainerLayout className="py-20">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Contact Us
            </h1>
            <p className="mt-6 text-xl text-primary-100 max-w-3xl mx-auto">
              Have questions about buying or selling aircraft? Need support with your listing? 
              We&apos;re here to help connect you with the right solutions.
            </p>
          </div>
        </ContainerLayout>
      </section>

      {/* Contact Information */}
      <section className="bg-white border-b border-neutral-200">
        <ContainerLayout className="py-16">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-neutral-900 mb-2">Phone</h3>
              <p className="text-neutral-600">(555) 123-4567</p>
              <p className="text-sm text-neutral-500">Mon-Fri 8AM-6PM EST</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-neutral-900 mb-2">Email</h3>
              <p className="text-neutral-600">hello@zuluniner.com</p>
              <p className="text-sm text-neutral-500">Response within 24 hours</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-neutral-900 mb-2">Office</h3>
              <p className="text-neutral-600">123 Aviation Blvd</p>
              <p className="text-neutral-600">Dallas, TX 75201</p>
            </div>
          </div>
        </ContainerLayout>
      </section>

      {/* Contact Form */}
      <section className="bg-neutral-50">
        <ContainerLayout className="py-20">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-neutral-900 mb-4">
                Send Us a Message
              </h2>
              <p className="text-lg text-neutral-600">
                Fill out the form below and we&apos;ll get back to you as soon as possible
              </p>
            </div>

            <Card>
              <CardContent className="p-8">
                {error && (
                  <Alert variant="error" className="mb-6">
                    {error}
                  </Alert>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-neutral-700 mb-2">
                        Full Name *
                      </label>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Your full name"
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-2">
                        Email Address *
                      </label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="your.email@example.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-neutral-700 mb-2">
                        Phone Number
                      </label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="(555) 123-4567"
                      />
                    </div>

                    <div>
                      <label htmlFor="category" className="block text-sm font-medium text-neutral-700 mb-2">
                        Category *
                      </label>
                      <Select
                        id="category"
                        name="category"
                        required
                        value={formData.category}
                        onChange={handleInputChange}
                      >
                        <option value="">Select a category</option>
                        <option value="buying">Buying an Aircraft</option>
                        <option value="selling">Selling an Aircraft</option>
                        <option value="listing">Listing Support</option>
                        <option value="technical">Technical Support</option>
                        <option value="partnership">Partnership Inquiry</option>
                        <option value="media">Media Inquiry</option>
                        <option value="other">Other</option>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-neutral-700 mb-2">
                      Subject *
                    </label>
                    <Input
                      id="subject"
                      name="subject"
                      type="text"
                      required
                      value={formData.subject}
                      onChange={handleInputChange}
                      placeholder="Brief description of your inquiry"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-neutral-700 mb-2">
                      Message *
                    </label>
                    <Textarea
                      id="message"
                      name="message"
                      required
                      rows={6}
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Please provide details about your inquiry..."
                    />
                  </div>

                  <div className="pt-4">
                    <Button
                      type="submit"
                      size="lg"
                      className="w-full"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Sending...' : 'Send Message'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </ContainerLayout>
      </section>

      {/* FAQ Section */}
      <section className="bg-white">
        <ContainerLayout className="py-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-neutral-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-neutral-600">
              Quick answers to common questions
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <div>
              <h3 className="text-lg font-semibold text-neutral-900 mb-3">
                How do I list my aircraft for sale?
              </h3>
              <p className="text-neutral-600 mb-6">
                Create a seller account, verify your identity, and use our listing wizard to add photos, specifications, and details about your aircraft. Our team reviews all listings before they go live.
              </p>

              <h3 className="text-lg font-semibold text-neutral-900 mb-3">
                What are your fees for selling?
              </h3>
              <p className="text-neutral-600 mb-6">
                We charge a 3% success fee only when your aircraft sells. There are no upfront listing fees or monthly charges. You only pay when we successfully connect you with a buyer.
              </p>

              <h3 className="text-lg font-semibold text-neutral-900 mb-3">
                How do you verify buyers?
              </h3>
              <p className="text-neutral-600">
                All buyers go through our verification process including identity confirmation and financial qualification. We also provide secure messaging and transaction support throughout the sales process.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-neutral-900 mb-3">
                Can I edit my listing after it&apos;s published?
              </h3>
              <p className="text-neutral-600 mb-6">
                Yes, you can update your listing anytime through your seller dashboard. Changes like price updates and new photos are processed immediately, while specification changes may require review.
              </p>

              <h3 className="text-lg font-semibold text-neutral-900 mb-3">
                How long does it take to sell an aircraft?
              </h3>
              <p className="text-neutral-600 mb-6">
                Sales timelines vary based on aircraft type, condition, and market demand. On average, properly priced aircraft with quality photos sell within 90-120 days on our platform.
              </p>

              <h3 className="text-lg font-semibold text-neutral-900 mb-3">
                Do you provide escrow services?
              </h3>
              <p className="text-neutral-600">
                Yes, we partner with licensed escrow companies to provide secure transaction services for high-value aircraft sales, ensuring both buyer and seller protection throughout the process.
              </p>
            </div>
          </div>
        </ContainerLayout>
      </section>
    </MainLayout>
  );
}