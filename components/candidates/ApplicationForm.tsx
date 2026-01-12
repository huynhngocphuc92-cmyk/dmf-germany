'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { applicationSchema, type ApplicationFormData } from '@/lib/validations/schemas';
import { Upload, Send, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

export default function ApplicationForm() {
  const [isSuccess, setIsSuccess] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<ApplicationFormData>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      program: 'azubi', // Default selection
      message: ''
    }
  });

  const onSubmit = async (data: ApplicationFormData) => {
    setServerError(null);
    try {
      // TODO: Implement actual FormData submission to API endpoint
      console.log("Application Data:", data);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setIsSuccess(true);
      reset();
    } catch (error) {
      setServerError("Ein Fehler ist aufgetreten. Bitte versuchen Sie es später.");
    }
  };

  if (isSuccess) {
    return (
      <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-8 text-center max-w-lg mx-auto">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle size={32} />
        </div>
        <h3 className="text-2xl font-bold text-slate-900 mb-2">Bewerbung gesendet!</h3>
        <p className="text-slate-600 mb-6">
          Vielen Dank für Ihr Interesse. Unser Team wird Ihre Unterlagen prüfen und sich schnellstmöglich melden.
        </p>
        <button 
          onClick={() => setIsSuccess(false)}
          className="text-blue-600 font-medium hover:underline"
        >
          Weitere Bewerbung senden
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6 md:p-8 max-w-2xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900">Jetzt bewerben</h2>
        <p className="text-slate-500">Starten Sie Ihre Karriere in Deutschland mit DMF.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Name & Email */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-1">
            <label className="text-sm font-semibold text-slate-700">Vollständiger Name *</label>
            <input 
              {...register('fullName')} 
              className={`w-full p-3 rounded-lg border ${errors.fullName ? 'border-red-500' : 'border-slate-200'} focus:ring-2 focus:ring-blue-500 outline-none`} 
              placeholder="Nguyen Van A" 
            />
            {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName.message}</p>}
          </div>
          <div className="space-y-1">
            <label className="text-sm font-semibold text-slate-700">E-Mail Adresse *</label>
            <input 
              {...register('email')} 
              type="email"
              className={`w-full p-3 rounded-lg border ${errors.email ? 'border-red-500' : 'border-slate-200'} focus:ring-2 focus:ring-blue-500 outline-none`} 
              placeholder="email@example.com" 
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>
        </div>

        {/* Phone & Program */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-1">
            <label className="text-sm font-semibold text-slate-700">Telefonnummer *</label>
            <input 
              {...register('phone')} 
              type="tel"
              className={`w-full p-3 rounded-lg border ${errors.phone ? 'border-red-500' : 'border-slate-200'} focus:ring-2 focus:ring-blue-500 outline-none`} 
              placeholder="+84 ..." 
            />
            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
          </div>
          <div className="space-y-1">
            <label className="text-sm font-semibold text-slate-700">Interessiert an *</label>
            <select 
              {...register('program')} 
              className="w-full p-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none bg-white"
            >
              <option value="azubi">Ausbildung (Azubi)</option>
              <option value="skilled">Fachkräfte</option>
              <option value="seasonal">Saisonarbeit</option>
            </select>
            {errors.program && <p className="text-red-500 text-xs mt-1">{errors.program.message}</p>}
          </div>
        </div>

        {/* CV Upload (Visual Only for now) */}
        <div className="space-y-1">
          <label className="text-sm font-semibold text-slate-700">Lebenslauf (CV)</label>
          <div className="border-2 border-dashed border-slate-200 rounded-lg p-6 text-center hover:bg-slate-50 transition-colors cursor-pointer relative">
            <input 
              type="file" 
              accept=".pdf,.doc,.docx"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
            />
            <Upload className="mx-auto text-slate-400 mb-2" size={24} />
            <p className="text-sm text-slate-600">Datei hier ablegen oder klicken</p>
            <p className="text-xs text-slate-400 mt-1">PDF, DOCX (Max. 5MB)</p>
          </div>
        </div>

        {/* Message */}
        <div className="space-y-1">
          <label className="text-sm font-semibold text-slate-700">Nachricht (Optional)</label>
          <textarea 
            {...register('message')} 
            rows={3} 
            className="w-full p-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" 
            placeholder="Erzählen Sie uns kurz von sich..." 
          />
          {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message.message}</p>}
        </div>

        {serverError && (
          <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg flex items-center gap-2">
            <AlertCircle size={16} /> {serverError}
          </div>
        )}

        <button 
          type="submit" 
          disabled={isSubmitting}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isSubmitting ? <Loader2 className="animate-spin mr-2" size={18} /> : <Send className="mr-2" size={18} />}
          {isSubmitting ? 'Wird gesendet...' : 'Bewerbung absenden'}
        </button>
      </form>
    </div>
  );
}
