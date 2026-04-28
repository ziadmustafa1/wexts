'use client';

import { useState } from 'react';
import { useWexts } from '../lib/wexts-provider';

export default function Page() {
  const wexts = useWexts();
  const [message, setMessage] = useState('Not called yet');

  return (
    <main>
      <h1>Wexts Hello RPC</h1>
      <button
        type="button"
        onClick={async () => {
          setMessage(await wexts.hello.sayHello('Bob'));
        }}
      >
        Call RPC
      </button>
      <p>{message}</p>
    </main>
  );
}
