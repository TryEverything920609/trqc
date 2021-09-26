---
id: mutations
title: Mutations
sidebar_label: useMutation
slug: /react-mutations
---

> The hooks provided by `@trpc/react` are a thin wrapper around React Query. For in-depth information about options and usage patterns, refer to their docs on [Mutations](https://react-query.tanstack.com/guides/mutations).

Works like react-query's mutations - [see their docs](https://react-query.tanstack.com/guides/mutations).

### Example

<details><summary>Backend code</summary>

```tsx
import * as trpc from '@trpc/server';
import { z } from 'zod';

trpc.router()
  // Create procedure at path 'login'
  // The syntax is identical to creating queries
  .mutation('login', {
    // using zod schema to validate and infer input values
    input: z
      .object({
        name: z.string(),
      })
    async resolve({ input }) {
      // Here some login stuff would happen

      return {
        user: {
          name: input.name,
          role: 'ADMIN'
        },
      };
    },
  })
```

</details>

```tsx
import { trpc } from '../utils/trpc';

export function MyComponent() {
  // Note! This is not a tuple ['login', ...] but a string 'login'
  const login = trpc.useMutation('login');

  const handleLogin = async () => {
    const name = 'John Doe';

    await login.mutateAsync({ name });
  };

  return (
    <div>
      <h1>Login Form</h1>
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}
```
