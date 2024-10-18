// DOM Elements
const terminal = document.getElementById("terminal");
const output = document.getElementById("output");
const userInput = document.getElementById("user-input");

// Theme Configurations
const themes = {
  default: {
    nord0: "#2E3440" /* Dark slate gray (background) */,
    nord1: "#3B4252" /* Lighter slate gray (lighter background) */,
    nord4: "#D8DEE9" /* Steel blue (foreground) */,
    nord6: "#ECEFF4" /* White blue (bright foreground) */,
    nord7: "#8FBCBB" /* Frosty green (variables) */,
    nord8: "#88C0D0" /* Arctic blue (primary) */,
    nord9: "#81A1C1" /* Glacier blue (secondary) */,
    nord11: "#BF616A" /* Aurora red (errors) */,
    nord13: "#EBCB8B" /* Aurora yellow (warnings/modifications) */,
    nord14: "#A3BE8C",
  },
  dracula: {
    background: "#282a36",
    backgroundLight: "#44475a",
    foreground: "#f8f8f2",
    cyan: "#8be9fd",
    green: "#50fa7b",
    orange: "#ffb86c",
    pink: "#ff79c6",
    purple: "#bd93f9",
    yellow: "#f1fa8c",
  },
  catppuccin: {
    base: "#1e1e2e",
    mantle: "#181825",
    text: "#cdd6f4",
    sky: "#89dceb",
        green: "#a6e3a1",
    peach: "#fab387",
    red: "#f38ba8",
    yellow: "#f9e2af",
    mauve: "#cba6f7",
  },
  nord: {
    background: "#2E3440",
    backgroundLight: "#3B4252",
    foreground: "#D8DEE9",
    foregroundBright: "#ECEFF4",
    cyan: "#88C0D0",
    green: "#A3BE8C",
    orange: "#D08770",
    red: "#BF616A",
    yellow: "#EBCB8B",
    purple: "#B48EAD",
  },
  darkmodern: {
    background: "#1E1E1E",
    backgroundLight: "#252526",
    foreground: "#D4D4D4",
    foregroundBright: "#FFFFFF",
    teal: "#4EC9B0",
    orange: "#CE9178",
    red: "#F44747",
    yellow: "#DCDCAA",
    purple: "#C586C0",
  },
};

// Helper Functions
const loadSection = async (section) => {
  try {
    const response = await fetch(`${section}.txt`);
    return await response.text();
  } catch (error) {
    return "Error loading section";
  }
};

const setTheme = (themeName) => {
  const theme = themes[themeName];
  if (!theme) return "Unknown theme";

  const themeMapping = {
    nord0: theme.background || theme.base,
    nord1: theme.backgroundLight || theme.mantle,
    nord4: theme.foreground || theme.text,
    nord6: theme.foregroundBright || "#ffffff",
    nord7: theme.cyan || theme.sky || theme.teal,
    nord8: theme.green,
    nord9: theme.orange || theme.peach,
    nord11: theme.red,
    nord13: theme.yellow,
    nord14: theme.purple || theme.mauve,
  };

  Object.entries(themeMapping).forEach(([variable, color]) => {
    document.documentElement.style.setProperty(`--${variable}`, color);
  });

  // Save the theme to localStorage
  localStorage.setItem("theme", themeName);

  return `Theme set to ${themeName}`;
};

const clearTerminal = () => {
  output.innerHTML = "";
  printWelcomeMessage();
};

const printWelcomeMessage = () => {
  output.innerHTML +=
    "Welcome to my portfolio!\nType 'help' for available commands.\n";
};

const appendToTerminal = (text) => {
  if (text !== null) {
    output.innerHTML += text + "\n";
  }
  terminal.scrollTop = terminal.scrollHeight;
};

// Command Processing
const processCommand = async (cmd) => {
  cmd = cmd.trim().toLowerCase();
  const [command, ...args] = cmd.split(" ");

  switch (command) {
    case "about":
    case "projects":
    case "help":
      return await loadSection(command);
    case "clear":
      clearTerminal();
      return null;
    case "theme":
      return args.length === 1 ? setTheme(args[0]) : "Usage: theme [theme-name]";
    default:
      return "Unknown command. Type 'help' for available commands.";
  }
};

// Event Listeners
userInput.addEventListener("keyup", async (event) => {
  if (event.key === "Enter") {
    const cmd = userInput.value;
    appendToTerminal(
      `<span class="highlight">frantisekhromek@portfolio:~$</span> ${cmd}`
    );
    const result = await processCommand(cmd);
    appendToTerminal(result);
    userInput.value = "";
  }
});

// Initial setup
const savedTheme = localStorage.getItem("theme");
if (savedTheme) {
  setTheme(savedTheme);
}
clearTerminal();
