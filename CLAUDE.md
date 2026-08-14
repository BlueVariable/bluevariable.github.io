# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

This is the GitHub Pages site for the Blue Variable organization, served at `bluevariable.github.io`. It is a static site with no build step, no dependencies, and no framework — plain HTML deployed directly by GitHub Pages from the `main` branch.

## Structure

- `index.html` — the landing page. Currently shows only the animated Blue Variable logo, centered on a background matching the logo's own background color (`#F3EFE8`).
- `assets/logo.gif` — the animated brand logo (540×540, "Idle" loop variant of the BVS icon).

## Conventions

- Keep the site dependency-free: no build tools, package managers, or external CDNs unless explicitly requested.
- Brand background color is `#F3EFE8`; page backgrounds should match it so the logo gif blends seamlessly.
- Static assets go in `assets/`.

## Deployment

Pushing to `main` publishes the site via GitHub Pages. There are no tests or build commands to run.
