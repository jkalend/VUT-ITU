//Author: Jaroslav Streit (xstrei06)

export type Settings = {
    theme: "light" | "dark",
    days_remaining: number,
}

export let Setting: Settings = {
    theme: "light",
    days_remaining: 3,
}

export async function getSettings() {
    return { ...Setting };
}

export async function setDays(days: number) {
    Setting.days_remaining = days;
}

export async function setTheme(theme: "light" | "dark") {
    Setting.theme = theme;
}
