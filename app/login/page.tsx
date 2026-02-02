"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import { login } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Loader2, Lock, Mail, Shield } from "lucide-react";

// ============================================
// SUBMIT BUTTON COMPONENT (with loading state)
// ============================================

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      className="w-full h-12 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold rounded-xl shadow-lg shadow-emerald-500/25 transition-all duration-300"
      disabled={pending}
    >
      {pending ? (
        <>
          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
          Anmelden...
        </>
      ) : (
        "Anmelden"
      )}
    </Button>
  );
}

// ============================================
// LOGIN PAGE COMPONENT
// ============================================

type LoginState = {
  error: string | null;
};

export default function LoginPage() {
  const [state, formAction] = useActionState<LoginState, FormData>(
    async (_prevState, formData) => {
      const result = await login(formData);
      return result || { error: null };
    },
    { error: null }
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-teal-500/5 rounded-full blur-[100px]" />
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                             linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <Card className="relative w-full max-w-md bg-white/95 backdrop-blur-sm border-0 shadow-2xl">
        <CardHeader className="text-center pb-2">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Shield className="w-8 h-8 text-white" />
            </div>
          </div>

          {/* Brand Name */}
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="text-2xl font-bold text-slate-900">DMF</span>
            <span className="text-2xl font-light text-slate-600">Vietnam</span>
          </div>

          <CardTitle className="text-xl font-semibold text-slate-800">Admin Portal</CardTitle>
          <CardDescription className="text-slate-500">
            Melden Sie sich an, um auf das Dashboard zuzugreifen
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-4">
          <form action={formAction} className="space-y-5">
            {/* Error Message */}
            {state?.error && (
              <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <p className="text-sm font-medium">{state.error}</p>
              </div>
            )}

            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-700 font-medium">
                E-Mail Adresse
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="admin@dmf-vietnam.de"
                  className="pl-11 h-12 bg-slate-50 border-slate-200 focus:border-emerald-500 focus:ring-emerald-500/20 rounded-xl"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-slate-700 font-medium">
                Passwort
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  className="pl-11 h-12 bg-slate-50 border-slate-200 focus:border-emerald-500 focus:ring-emerald-500/20 rounded-xl"
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <SubmitButton />
          </form>

          {/* Back to Homepage Link */}
          <div className="mt-6 text-center">
            <Link
              href="/"
              className="text-sm text-slate-500 hover:text-emerald-600 transition-colors"
            >
              ← Zurück zur Startseite
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Footer */}
      <div className="absolute bottom-6 text-center text-slate-500 text-sm">
        <p>© 2026 DMF Vietnam. Alle Rechte vorbehalten.</p>
      </div>
    </div>
  );
}
