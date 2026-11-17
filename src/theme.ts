import { defineTheme, token } from "@hyper-elements/react";

export const receiptTheme = defineTheme({
  colors: {
    background: "#F4F6F2",
    surface: "#FFFFFF",
    foreground: "#1C302D",
    muted: "#52645F",
    border: "#DCE4DE",
    soft: "#EDF3EF",
    primary: "#176B60",
    primaryForeground: "#FFFFFF",
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 40,
  },
  fontSizes: {
    body: 14,
    section: 20,
    title: 30,
  },
  lineHeights: {
    body: 1.55,
    heading: 1.2,
  },
  fonts: {
    body: "Arial, 'Nirmala UI', Helvetica, sans-serif",
    heading: "Georgia, 'Times New Roman', serif",
  },
  radii: {
    small: 4,
    medium: 8,
    large: 14,
    pill: 999,
  },
  elements: {
    Heading: {
      by: {
        level: {
          1: { fontSize: "{fontSizes.title}", fontFamily: "{fonts.heading}", lineHeight: "{lineHeights.heading}" },
          2: { fontSize: "{fontSizes.section}", fontFamily: "{fonts.heading}", lineHeight: "{lineHeights.heading}" },
        },
      },
    },
    Button: {
      backgroundColor: "{colors.primary}",
      color: "{colors.primaryForeground}",
      borderRadius: "{radii.medium}",
      padding: [14, 20],
      fontSize: "{fontSizes.body}",
      fontWeight: 700,
    },
  },
});

export const color = {
  background: token("colors.background"),
  surface: token("colors.surface"),
  foreground: token("colors.foreground"),
  muted: token("colors.muted"),
  border: token("colors.border"),
  soft: token("colors.soft"),
  primary: token("colors.primary"),
  primaryForeground: token("colors.primaryForeground"),
};

export const space = {
  xs: token("spacing.xs"),
  sm: token("spacing.sm"),
  md: token("spacing.md"),
  lg: token("spacing.lg"),
  xl: token("spacing.xl"),
  xxl: token("spacing.xxl"),
};

export const type = {
  body: token("fontSizes.body"),
  section: token("fontSizes.section"),
  title: token("fontSizes.title"),
  bodyFont: token("fonts.body"),
  headingFont: token("fonts.heading"),
  bodyLineHeight: token("lineHeights.body"),
  headingLineHeight: token("lineHeights.heading"),
};

export const radius = {
  small: token("radii.small"),
  medium: token("radii.medium"),
  large: token("radii.large"),
  pill: token("radii.pill"),
};
