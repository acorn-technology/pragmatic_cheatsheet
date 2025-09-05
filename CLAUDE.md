# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview
The Pragmatic Cheatsheet is a static GitHub Pages website that provides an interactive overview of 70 tips from the Pragmatic Quick Reference Guide. The site displays tips as cards with titles, summaries, and expandable sections containing developer stories.

## Architecture
- **Static website**: HTML, CSS, JavaScript only - no build tools or dependencies
- **Content structure**: Each tip has a corresponding markdown file in the `stories/` directory (e.g., `45.md` for tip 45)
- **Story format**: Stories are separated by `---` and can reference multiple tips using tag system `[34,45]`
- **Deployment**: GitHub Actions builds and deploys to `gh-pages` branch

## Development Workflow
- **Main branch**: Development work
- **gh-pages branch**: Deployment target (auto-generated)
- **Style consistency**: Follow Acorn website design patterns (https://www.acorntechnology.se/)

## Content Format
Stories in markdown files follow this structure:
```markdown
# Tip Title
## Description

---
Story content here
---
[related,tip,numbers]
Another story
---
```

## Key Principles
- Keep it simple, lightweight, and maintainable
- Minimal code and zero dependencies
- Modern but convenient static web development
- Single-page application with expandable tip cards