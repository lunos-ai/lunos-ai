'use server';

/**
 * WARNING: This file connects this app to Anythings's internal auth system. Do
 * not attempt to edit it. Modifying it will have no effect on your project as it is controlled by our system.
 * Do not import @auth/create or @auth/create anywhere else or it may break. This is an internal package.
 */
import CreateAuth from "@auth/create"
import Credentials from "@auth/core/providers/credentials"
import { createClient } from '@supabase/supabase-js'
import bcrypt from 'bcryptjs'

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY
)

function Adapter(supabaseClient) {
  return {
    async createVerificationToken(verificationToken) {
      const { identifier, expires, token } = verificationToken;
      const { error } = await supabaseClient
        .from('auth_verification_token')
        .insert({ identifier, expires, token });
      if (error) throw error;
      return verificationToken;
    },
    async useVerificationToken({ identifier, token }) {
      const { data, error } = await supabaseClient
        .from('auth_verification_token')
        .delete()
        .eq('identifier', identifier)
        .eq('token', token)
        .select();
      if (error) throw error;
      return data?.[0] || null;
    },
    async createUser(user) {
      const { name, email, emailVerified, image } = user;
      const { data, error } = await supabaseClient
        .from('auth_users')
        .insert({ name, email, emailVerified, image })
        .select();
      if (error) throw error;
      return data?.[0];
    },
    async getUser(id) {
      try {
        const { data, error } = await supabaseClient
          .from('auth_users')
          .select()
          .eq('id', id)
          .maybeSingle();
        if (error) throw error;
        return data;
      } catch {
        return null;
      }
    },
    async getUserByEmail(email) {
      const { data: userData, error: userError } = await supabaseClient
        .from('auth_users')
        .select()
        .eq('email', email)
        .maybeSingle();
      if (userError) throw userError;
      if (!userData) return null;

      const { data: accountsData, error: accountsError } = await supabaseClient
        .from('auth_accounts')
        .select()
        .eq('userId', userData.id);
      if (accountsError) throw accountsError;

      return {
        ...userData,
        accounts: accountsData || [],
      };
    },
    async getUserByAccount({ providerAccountId, provider }) {
      const { data, error } = await supabaseClient
        .from('auth_users')
        .select()
        .eq('accounts.provider', provider)
        .eq('accounts.providerAccountId', providerAccountId)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    async updateUser(user) {
      const { data: oldUserData } = await supabaseClient
        .from('auth_users')
        .select()
        .eq('id', user.id)
        .maybeSingle();

      const newUser = {
        ...oldUserData,
        ...user,
      };
      const { id, name, email, emailVerified, image } = newUser;
      const { data, error } = await supabaseClient
        .from('auth_users')
        .update({ name, email, emailVerified, image })
        .eq('id', id)
        .select();
      if (error) throw error;
      return data?.[0];
    },
    async linkAccount(account) {
      const { data, error } = await supabaseClient
        .from('auth_accounts')
        .insert({
          userId: account.userId,
          provider: account.provider,
          type: account.type,
          providerAccountId: account.providerAccountId,
          access_token: account.access_token,
          expires_at: account.expires_at,
          refresh_token: account.refresh_token,
          id_token: account.id_token,
          scope: account.scope,
          session_state: account.session_state,
          token_type: account.token_type,
          password: account.extraData?.password,
        })
        .select();
      if (error) throw error;
      return data?.[0];
    },
    async createSession({ sessionToken, userId, expires }) {
      if (userId === undefined) {
        throw Error('userId is undef in createSession');
      }
      const { data, error } = await supabaseClient
        .from('auth_sessions')
        .insert({ userId, sessionToken, expires })
        .select();
      if (error) throw error;
      return data?.[0];
    },
    async getSessionAndUser(sessionToken) {
      if (sessionToken === undefined) {
        return null;
      }
      const { data: sessionData, error: sessionError } = await supabaseClient
        .from('auth_sessions')
        .select()
        .eq('sessionToken', sessionToken)
        .maybeSingle();
      if (sessionError) throw sessionError;
      if (!sessionData) return null;

      const { data: userData, error: userError } = await supabaseClient
        .from('auth_users')
        .select()
        .eq('id', sessionData.userId)
        .maybeSingle();
      if (userError) throw userError;
      if (!userData) return null;

      return {
        session: sessionData,
        user: userData,
      };
    },
    async updateSession(session) {
      const { sessionToken } = session;
      const { data: sessionData, error: selectError } = await supabaseClient
        .from('auth_sessions')
        .select()
        .eq('sessionToken', sessionToken)
        .maybeSingle();
      if (selectError) throw selectError;
      if (!sessionData) return null;

      const { data, error } = await supabaseClient
        .from('auth_sessions')
        .update({ expires: session.expires })
        .eq('sessionToken', sessionToken)
        .select();
      if (error) throw error;
      return data?.[0];
    },
    async deleteSession(sessionToken) {
      const { error } = await supabaseClient
        .from('auth_sessions')
        .delete()
        .eq('sessionToken', sessionToken);
      if (error) throw error;
    },
    async unlinkAccount(partialAccount) {
      const { provider, providerAccountId } = partialAccount;
      const { error } = await supabaseClient
        .from('auth_accounts')
        .delete()
        .eq('provider', provider)
        .eq('providerAccountId', providerAccountId);
      if (error) throw error;
    },
    async deleteUser(userId) {
      const { error } = await supabaseClient
        .from('auth_users')
        .delete()
        .eq('id', userId);
      if (error) throw error;
    },
  };
}
const adapter = Adapter(supabase);

export const { auth } = CreateAuth({
  providers: [Credentials({
  id: 'credentials-signin',
  name: 'Credentials Sign in',
  credentials: {
    email: {
      label: 'Email',
      type: 'email',
    },
    password: {
      label: 'Password',
      type: 'password',
    },
  },
  authorize: async (credentials) => {
    const { email, password } = credentials;
    if (!email || !password) {
      return null;
    }
    if (typeof email !== 'string' || typeof password !== 'string') {
      return null;
    }

    // logic to verify if user exists
    const user = await adapter.getUserByEmail(email);
    if (!user) {
      return null;
    }
    const matchingAccount = user.accounts.find(
      (account) => account.provider === 'credentials'
    );
    const accountPassword = matchingAccount?.password;
    if (!accountPassword) {
      return null;
    }

    const isValid = await bcrypt.compare(password, accountPassword);
    if (!isValid) {
      return null;
    }

    // return user object with the their profile data
    return user;
  },
}),
  Credentials({
  id: 'credentials-signup',
  name: 'Credentials Sign up',
  credentials: {
    email: {
      label: 'Email',
      type: 'email',
    },
    password: {
      label: 'Password',
      type: 'password',
    },
    name: { label: 'Name', type: 'text', required: false },
    image: { label: 'Image', type: 'text', required: false },
  },
  authorize: async (credentials) => {
    const { email, password } = credentials;
    if (!email || !password) {
      return null;
    }
    if (typeof email !== 'string' || typeof password !== 'string') {
      return null;
    }

    // logic to verify if user exists
    const user = await adapter.getUserByEmail(email);
    if (!user) {
      const newUser = await adapter.createUser({
        id: crypto.randomUUID(),
        emailVerified: null,
        email,
        name:
          typeof credentials.name === 'string' &&
          credentials.name.trim().length > 0
            ? credentials.name
            : undefined,
        image:
          typeof credentials.image === 'string'
            ? credentials.image
            : undefined,
      });
      await adapter.linkAccount({
        extraData: {
          password: await bcrypt.hash(password, 10),
        },
        type: 'credentials',
        userId: newUser.id,
        providerAccountId: newUser.id,
        provider: 'credentials',
      });
      return newUser;
    }
    return null;
  },
})],
  pages: {
    signIn: '/account/signin',
    signOut: '/account/logout',
  },
})