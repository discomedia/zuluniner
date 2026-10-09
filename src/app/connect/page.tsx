'use client';

import { createClient } from '@supabase/supabase-js';
import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import type { Database } from '@/api/schema';
import MainLayout from '@/components/layouts/MainLayout';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Alert from '@/components/ui/Alert';

const auth = createClient<Database>(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

function Connect() {
  const params = useSearchParams();
  const requestId = params.get('request_id');
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [clientName, setClientName] = useState('your agent');
  const [scope, setScope] = useState('');
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    auth.auth.getSession().then(({ data }) => { setToken(data.session?.access_token || ''); setEmail(data.session?.user.email || ''); });
    const { data: listener } = auth.auth.onAuthStateChange((_event, session) => { setToken(session?.access_token || ''); setEmail(session?.user.email || ''); });
    if (requestId) fetch(`/api/oauth/request?request_id=${encodeURIComponent(requestId)}`).then(response => response.json()).then(result => {
      if (result.error) setError(result.error); else { setClientName(result.client_name); setScope(result.scope); }
    }).catch(() => setError('Could not load the connection request.'));
    return () => listener.subscription.unsubscribe();
  }, [requestId]);

  async function signIn(event: React.FormEvent) {
    event.preventDefault(); setBusy(true); setError('');
    const { error } = await auth.auth.signInWithOtp({ email, options: { shouldCreateUser: false, emailRedirectTo: `${window.location.origin}/connect?request_id=${encodeURIComponent(requestId || '')}` } });
    if (error) setError(error.message); else setSent(true);
    setBusy(false);
  }

  async function decide(approved: boolean) {
    setBusy(true); setError('');
    try {
      const response = await fetch('/api/oauth/request', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ request_id: requestId, approved }) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
      window.location.assign(result.redirect_url);
    } catch (error) { setError(error instanceof Error ? error.message : 'Could not connect.'); setBusy(false); }
  }

  return <MainLayout><section className="max-w-lg mx-auto px-6 py-20">
    <h1 className="text-3xl font-bold mb-4">Connect ZuluNiner</h1>
    {!requestId ? <p>Add <code>https://zuluniner.com/api/mcp</code> to your agent using OAuth, then return here to approve access.</p> : <>
      <p className="mb-4">Connect <strong>{clientName}</strong> to manage ZuluNiner content.</p>
      {error && <Alert variant="error" className="mb-4">{error}</Alert>}
      {!token ? <form onSubmit={signIn} className="space-y-4">
        <p>Sign in with the existing site owner account. Public registration is disabled.</p>
        <Input label="Owner email" type="email" required value={email} onChange={event => setEmail(event.target.value)} />
        <Button type="submit" disabled={busy}>Email a sign-in link</Button>
        {sent && <p>Check your email and open the sign-in link in this browser.</p>}
      </form> : <>
        <p className="mb-4">Signed in as {email}.</p>
        <ul className="list-disc pl-6 mb-6">
          <li>Read published content and drafts.</li>
          {scope.includes('content:write') && <li>Create, edit, publish and delete posts, aircraft and their images, including batches.</li>}
        </ul>
        <div className="flex gap-3"><Button disabled={busy || !scope} onClick={() => decide(true)}>Connect agent</Button><Button variant="secondary" disabled={busy} onClick={() => decide(false)}>Deny</Button></div>
        <button className="block mt-6 text-sm underline" onClick={() => auth.auth.signOut()}>Sign out</button>
      </>}
    </>}
  </section></MainLayout>;
}

export default function ConnectPage() {
  return <Suspense fallback={<p>Loading connection…</p>}><Connect /></Suspense>;
}
