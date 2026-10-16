export const THEME_KEY = "selfi-theme";

// Runs in <head> before the page paints, so a saved choice never flashes the wrong theme.
export const themeScript = `try{var t=localStorage.getItem("${THEME_KEY}");if(t==="light"||t==="dark")document.documentElement.dataset.theme=t}catch(e){}`;
