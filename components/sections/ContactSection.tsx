'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { contactFormSchema, type ContactFormData } from '@/lib/validations/schemas';
import { Loader2, Send, MapPin, Phone, Mail, Globe, User } from 'lucide-react';

export default function ContactSection() {
  const [isSuccess, setIsSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: { name: '', email: '', phone: '', company: '', message: '' }
  });

  const onSubmit = async (data: ContactFormData) => {
    // 1. Honeypot check (Spam protection)
    if ((data as any).bot_check) return;
    
    setSubmitError(null);
    
    try {
      // 2. REAL API CALL (Restoring email functionality)
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || 'Fehler beim Senden');
      }

      // 3. Success State
      setIsSuccess(true);
      reset(); // Clear form
      
    } catch (err) {
      console.error('Contact form error:', err);
      setSubmitError("Fehler beim Senden. Bitte versuchen Sie es später noch einmal.");
    }
  };

  return (
    <section id="contact" className="py-24 bg-slate-50 relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 max-w-6xl mx-auto">
          
          {/* LEFT COLUMN: THE FORM (Span 2) */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
            <h2 className="text-3xl font-bold mb-6 text-slate-900">Kontaktieren Sie uns</h2>
            
            {isSuccess ? (
              <div className="bg-emerald-50 text-emerald-700 p-8 rounded-xl text-center">
                <h3 className="text-2xl font-bold mb-2">Vielen Dank!</h3>
                <p>Ihre Nachricht wurde erfolgreich gesendet.</p>
                <button onClick={() => setIsSuccess(false)} className="mt-4 text-sm font-bold underline">
                  Neue Nachricht
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <input type="text" {...register('bot_check' as any)} className="hidden" autoComplete="off" />

                {/* Name & Email */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Name *</label>
                    <input 
                      {...register('name')} 
                      className={`w-full p-4 rounded-xl border ${errors.name ? 'border-red-500' : 'border-slate-200'} bg-slate-50 focus:bg-white transition-all outline-none focus:ring-2 focus:ring-blue-500`} 
                      placeholder="Ihr Name" 
                    />
                    {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">E-Mail *</label>
                    <input 
                      {...register('email')} 
                      type="email"
                      className={`w-full p-4 rounded-xl border ${errors.email ? 'border-red-500' : 'border-slate-200'} bg-slate-50 focus:bg-white transition-all outline-none focus:ring-2 focus:ring-blue-500`} 
                      placeholder="ihre.email@unternehmen.de" 
                    />
                    {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
                  </div>
                </div>

                {/* Phone & Company (RESTORED) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Telefon / Mobil</label>
                    <input 
                      {...register('phone')} 
                      type="tel"
                      className="w-full p-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white transition-all outline-none focus:ring-2 focus:ring-blue-500" 
                      placeholder="+49 123 45678" 
                    />
                    {errors.phone && <p className="text-red-500 text-xs">{errors.phone.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Unternehmen</label>
                    <input 
                      {...register('company')} 
                      className="w-full p-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white transition-all outline-none focus:ring-2 focus:ring-blue-500" 
                      placeholder="Ihr Unternehmen GmbH" 
                    />
                    {errors.company && <p className="text-red-500 text-xs">{errors.company.message}</p>}
                  </div>
                </div>

                {/* Message */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Nachricht *</label>
                  <textarea 
                    {...register('message')} 
                    rows={5} 
                    className={`w-full p-4 rounded-xl border ${errors.message ? 'border-red-500' : 'border-slate-200'} bg-slate-50 focus:bg-white transition-all outline-none focus:ring-2 focus:ring-blue-500`} 
                    placeholder="Wie können wir Ihnen helfen?" 
                  />
                  {errors.message && <p className="text-red-500 text-xs">{errors.message.message}</p>}
                </div>

                {submitError && (
                  <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg">
                    {submitError}
                  </div>
                )}

                <button 
                  type="submit" 
                  disabled={isSubmitting} 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg hover:shadow-xl flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? <Loader2 className="animate-spin mr-2" size={18} /> : <Send className="mr-2" size={18} />}
                  Nachricht senden
                </button>
              </form>
            )}
          </div>

          {/* RIGHT COLUMN: INFO CARDS (RESTORED) */}
          <div className="space-y-6">
            
            {/* Card 1: Vietnam */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center text-red-600">
                  <MapPin size={20} />
                </div>
                <h3 className="font-bold text-slate-900">Hauptsitz in Vietnam</h3>
              </div>
              <ul className="space-y-4 text-sm text-slate-600">
                <li className="flex gap-3">
                  <Phone size={16} className="text-slate-400 shrink-0 mt-0.5" />
                  <span>+84 251 6609 500</span>
                </li>
                <li className="flex gap-3">
                  <Mail size={16} className="text-slate-400 shrink-0 mt-0.5" />
                  <a href="mailto:contact@dmf.edu.vn" className="hover:text-blue-600 transition-colors">contact@dmf.edu.vn</a>
                </li>
                <li className="flex gap-3">
                  <Globe size={16} className="text-slate-400 shrink-0 mt-0.5" />
                  <a href="https://dmf.edu.vn" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 transition-colors">dmf.edu.vn</a>
                </li>
                <li className="flex gap-3">
                  <MapPin size={16} className="text-slate-400 shrink-0 mt-0.5" />
                  <span>Dong Nai, Vietnam</span>
                </li>
              </ul>
            </div>

            {/* Card 2: Germany */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                  <User size={20} />
                </div>
                <h3 className="font-bold text-slate-900">Ansprechpartner Deutschland</h3>
              </div>
              <div className="mb-4">
                <p className="text-xs text-slate-400 uppercase tracking-wider font-bold mb-1">Ihr Partner</p>
                <p className="font-bold text-slate-900">Herr Achim Betticher</p>
              </div>
              <ul className="space-y-4 text-sm text-slate-600">
                <li className="flex gap-3">
                  <Phone size={16} className="text-slate-400 shrink-0 mt-0.5" />
                  <span>+49 151 507 0773</span>
                </li>
                <li className="flex gap-3">
                  <Mail size={16} className="text-slate-400 shrink-0 mt-0.5" />
                  <a href="mailto:achim@betticher.de" className="hover:text-blue-600 transition-colors">achim@betticher.de</a>
                </li>
                <li className="flex gap-3">
                  <MapPin size={16} className="text-slate-400 shrink-0 mt-0.5" />
                  <span>Deutschland</span>
                </li>
              </ul>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
