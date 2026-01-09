"use client";

import React, { useState } from 'react';
import { useLanguage } from '@/components/providers/LanguageProvider';
import { Mail, Phone, MapPin, Send, Building2, User, Globe, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { sendEmail } from '@/lib/actions';

interface FormData {
  name: string;
  email: string;
  company: string;
  message: string;
}

export function ContactSection() {
  const { t } = useLanguage();
  
  // State Management
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    company: '',
    message: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<'success' | 'error' | null>(null);
  const [statusMessage, setStatusMessage] = useState<string>('');

  // Handler: Update form data
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear status when user starts typing again
    if (status) {
      setStatus(null);
      setStatusMessage('');
    }
  };

  // Handler: Submit form
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Reset status
    setStatus(null);
    setStatusMessage('');
    setIsSubmitting(true);

    try {
      // Create FormData object
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('company', formData.company);
      formDataToSend.append('message', formData.message);

      // Call server action
      const result = await sendEmail(formDataToSend);

      if (result.success) {
        setStatus('success');
        setStatusMessage(result.message || t.contact.success_message);
        // Reset form
        setFormData({
          name: '',
          email: '',
          company: '',
          message: ''
        });
      } else {
        setStatus('error');
        setStatusMessage(result.message || t.contact.error_message);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setStatus('error');
      setStatusMessage(t.contact.error_message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-20 md:py-32 bg-slate-50" id="contact">
      <div className="container mx-auto px-4 max-w-7xl">
        
        {/* HEADER SECTION */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-block px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-semibold mb-6">
            {t.contact.badge}
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            {t.contact.title}
          </h2>
          <p className="text-lg text-slate-600">
            {t.contact.subtitle}
          </p>
        </div>

        {/* TWO COLUMN LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 max-w-6xl mx-auto">
          
          {/* LEFT COLUMN - FORM (60% = 3/5 columns) */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8 md:p-10">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name Field */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    {t.contact.label_name}
                  </label>
                  <input 
                    type="text" 
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder={t.contact.placeholder_name}
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-slate-900"
                    required
                    disabled={isSubmitting}
                  />
                </div>
                
                {/* Email Field */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    {t.contact.label_email}
                  </label>
                  <input 
                    type="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder={t.contact.placeholder_email}
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-slate-900"
                    required
                    disabled={isSubmitting}
                  />
                </div>

                {/* Company Field */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    {t.contact.label_company}
                  </label>
                  <input 
                    type="text" 
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    placeholder={t.contact.placeholder_company}
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-slate-900"
                    disabled={isSubmitting}
                  />
              </div>

                {/* Message Field */}
              <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    {t.contact.label_message}
                  </label>
                  <textarea 
                    rows={6} 
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder={t.contact.placeholder_message}
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition resize-none text-slate-900"
                    required
                    disabled={isSubmitting}
                  ></textarea>
                </div>

                {/* Status Message */}
                {status && (
                  <div className={`p-4 rounded-lg flex items-start gap-3 ${
                    status === 'success' 
                      ? 'bg-green-50 border border-green-200' 
                      : 'bg-red-50 border border-red-200'
                  }`}>
                    {status === 'success' ? (
                      <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    )}
                    <p className={`text-sm ${
                      status === 'success' ? 'text-green-800' : 'text-red-800'
                    }`}>
                      {statusMessage}
                    </p>
              </div>
                )}

                {/* Submit Button */}
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-6 rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-5 h-5" />
                  {isSubmitting ? t.contact.btn_submitting : t.contact.btn_submit}
                </Button>
              </form>
            </div>
          </div>

          {/* RIGHT COLUMN - INFO (40% = 2/5 columns) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Vietnam Office Block */}
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">
                  {t.contact.vn_office}
                </h3>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-slate-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-slate-500 mb-0.5">{t.contact.label_hotline}</p>
                    <p className="text-slate-900 font-semibold">+84 251 6609 500</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-slate-500 mt-0.5 flex-shrink-0" />
              <div>
                    <p className="text-sm text-slate-500 mb-0.5">{t.contact.info_email}</p>
                    <p className="text-slate-900 font-semibold">contact@dmf.edu.vn</p>
              </div>
            </div>

                <div className="flex items-start gap-3">
                  <Globe className="w-5 h-5 text-slate-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-slate-500 mb-0.5">Website</p>
                    <p className="text-slate-900 font-semibold">dmf.edu.vn</p>
                  </div>
              </div>
                
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-slate-500 mt-0.5 flex-shrink-0" />
              <div>
                    <p className="text-sm text-slate-500 mb-0.5">{t.contact.info_address}</p>
                    <p className="text-slate-900 font-semibold">{t.contact.vn_address}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Germany Office Block */}
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
          </div>
                <h3 className="text-lg font-bold text-slate-900">
                  {t.contact.de_office}
                </h3>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <User className="w-5 h-5 text-slate-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-slate-500 mb-0.5">Name</p>
                    <p className="text-slate-900 font-semibold">{t.contact.de_name}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-slate-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-slate-500 mb-0.5">{t.contact.label_hotline}</p>
                    <p className="text-slate-900 font-semibold">+84 85 507 0773</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-slate-500 mt-0.5 flex-shrink-0" />
              <div>
                    <p className="text-sm text-slate-500 mb-0.5">{t.contact.info_email}</p>
                    <p className="text-slate-900 font-semibold">achim@betticher.de</p>
                  </div>
              </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-slate-500 mt-0.5 flex-shrink-0" />
              <div>
                    <p className="text-sm text-slate-500 mb-0.5">{t.contact.info_address}</p>
                    <p className="text-slate-900 font-semibold">{t.contact.de_location}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Optional Banner */}
            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl shadow-lg p-6 text-white">
              <h4 className="font-bold text-lg mb-2">{t.contact.banner_title}</h4>
              <p className="text-sm text-blue-100">
                {t.contact.banner_text}
              </p>
              </div>

          </div>

        </div>
      </div>
    </section>
  );
}
