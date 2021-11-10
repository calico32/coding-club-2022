let isDark: boolean | null;

const theme = {
  get dark(): boolean | null {
    if (typeof window === 'undefined') return null;
    isDark ??= window.localStorage.getItem('dark') === 'true' ? true : false;
    return isDark;
  },

  set dark(dark: boolean | null) {
    isDark = dark;
    window.localStorage.setItem('dark', isDark ? 'true' : 'false');
  },
};

export default theme;
