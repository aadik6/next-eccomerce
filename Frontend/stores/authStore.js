const { authlogin, authsignup, googleLogin, authlogout } = require("@/apis/auth");
const { create } = require("zustand");

export const useAuthStore = create((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  token: null,
  setToken: (token) => set({ token }),
  loading: false,
  error: null,
  login: async (username, password) => {
    set({ loading: true, error: null });
    try {
      const res = await authlogin(username, password);
      if (res.status === 200) {
        set({
          user: res.data.user,
          token: res.data.accessToken,
          loading: false,
        });
      } else {
        set({ error: res.data.message, loading: false });
      }
      return res;
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },
  //   handleGoogleSignIn: async (credentialResponse) => {
  //     set({ loading: true, error: null });
  //     try {
  //       const res = await googleLogin(credentialResponse.credential);
  //       set({
  //         user: res.data.user,
  //         token: res.data.accessToken,
  //       });
  //       if (res.status !== 200) {
  //         set({ error: res.data.message, loading: false });
  //         return;
  //       }
  //       return res;
  //     } catch (err) {
  //       console.error("Google login error:", err);
  //       set({ loading: false });
  //       set({
  //         error:
  //           err.response?.data?.message ||
  //           "Google login failed. Please try again.",
  //       });
  //     }
  //   },

  signup: async (email, name, password) => {
    set({ loading: true, error: null });
    try {
      const res = await authsignup(email, name, password);
      if (res.status === 201) {
        set({
          user: res.data.user,
          token: res.data.accessToken,
          loading: false,
        });
      } else {
        set({ error: res.data.message, loading: false });
      }
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },
  logout: async () => {
    set({ loading: true, error: null });
    try {
      const res = await authlogout();
      if (res.status === 200) {
        set({ user: null, token: null, loading: false });
        console.log("Logout successful");
      } else {
        set({ error: res.data.message, loading: false });
        console.error("Logout failed:", res.data.message);
      }
      return res;
    } catch (error) {
      console.error("Logout error:", error);
    }
  },
}));
