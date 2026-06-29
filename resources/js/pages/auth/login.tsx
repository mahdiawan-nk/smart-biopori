import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle, ShieldCheck, Cpu } from 'lucide-react';
import { FormEventHandler } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';

interface LoginForm {
    email: string;
    password: string;
    remember: boolean;
}

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
}

export default function Login({ status, canResetPassword }: LoginProps) {
    const { data, setData, post, processing, errors, reset } = useForm<LoginForm>({
        email: '',
        password: '',
        remember: false,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <AuthLayout 
            title="Gerbang Kendali IoT" 
            description="Masuk menggunakan akun premium Anda untuk mengakses visualisasi data real-time perangkat biopori."
        >
            <Head title="Log In - Smart Biopori" />

            {/* Premium Badge / Icon Header */}
            

            <form className="flex flex-col gap-6" onSubmit={submit}>
                <div className="grid gap-5">
                    {/* Input Email */}
                    <div className="grid gap-2">
                        <Label htmlFor="email" className="text-slate-300 font-medium text-xs tracking-wider uppercase">
                            Alamat Email
                        </Label>
                        <Input
                            id="email"
                            type="email"
                            required
                            autoFocus
                            tabIndex={1}
                            autoComplete="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            placeholder="nama@perusahaan.com"
                            className="bg-slate-900/50 border-slate-700/60 text-slate-200 placeholder:text-slate-500 focus-visible:ring-emerald-500 focus-visible:border-emerald-500 rounded-xl"
                        />
                        <InputError message={errors.email} />
                    </div>

                    {/* Input Password */}
                    <div className="grid gap-2">
                        <div className="flex items-center">
                            <Label htmlFor="password" className="text-slate-300 font-medium text-xs tracking-wider uppercase">
                                Kata Sandi
                            </Label>
                            {canResetPassword && (
                                <TextLink 
                                    href={route('password.request')} 
                                    className="ml-auto text-xs text-emerald-400 hover:text-emerald-300 transition-colors" 
                                    tabIndex={5}
                                >
                                    Lupa sandi?
                                </TextLink>
                            )}
                        </div>
                        <Input
                            id="password"
                            type="password"
                            required
                            tabIndex={2}
                            autoComplete="current-password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            placeholder="••••••••"
                            className="bg-slate-900/50 border-slate-700/60 text-slate-200 placeholder:text-slate-500 focus-visible:ring-emerald-500 focus-visible:border-emerald-500 rounded-xl"
                        />
                        <InputError message={errors.password} />
                    </div>

                    {/* Remember Me */}
                    <div className="flex items-center space-x-3 py-1">
                        <Checkbox 
                            id="remember" 
                            name="remember" 
                            tabIndex={3}
                            checked={data.remember}
                            onCheckedChange={(checked) => setData('remember', !!checked)}
                            className="border-slate-600 data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500 rounded"
                        />
                        <Label htmlFor="remember" className="text-sm text-slate-400 font-normal cursor-pointer select-none">
                            Ingat perangkat ini
                        </Label>
                    </div>

                    {/* Button Submit Premium */}
                    <Button 
                        type="submit" 
                        className="mt-2 w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-6 rounded-xl transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 gap-2" 
                        tabIndex={4} 
                        disabled={processing}
                    >
                        {processing ? (
                            <LoaderCircle className="h-5 w-5 animate-spin text-slate-950" />
                        ) : (
                            <ShieldCheck className="h-5 w-5 text-slate-950" />
                        )}
                        Masuk ke Dashboard
                    </Button>
                </div>

                {/* Footer Link */}
                {/* <div className="text-slate-500 text-center text-xs border-t border-slate-800/60 pt-4 mt-2">
                    Belum memiliki lisensi perangkat?{' '}
                    <TextLink 
                        href={route('register')} 
                        className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
                        tabIndex={5}
                    >
                        Hubungi Admin
                    </TextLink>
                </div> */}
            </form>

            {status && (
                <div className="mt-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center text-sm font-medium text-emerald-400">
                    {status}
                </div>
            )}
        </AuthLayout>
    );
}