# The Pragmatic Cheatsheet

This GitHub Pages project is a static website with an interactive overview of the 70 tips from "The Pragmatic Programmer" (Second Edition).

The tips are extracted from the [Pragmatic Quick Reference Guide](https://www.khoury.northeastern.edu/home/lieber/courses/csg110/sp08/Pragmatic%20Quick%20Reference.htm).

## The idea
The website gives the user a overview of the tips in form of cards with title, summary and a expand button to show stories from out developers that relates to that tip.

## Contribute
There will be a markdown file for each tip.   
Create a pull request with your story in the related markdown file located in the ```stories``` directory.  
Ex. ```45.md``` will be related to tip 45.

Example:
```markdown
<!-- Title -->
# Estimate the Order of Your Algorithms
<!-- Description -->
## Get a feel for how long things are likely to take before you write code.

<!-- Stories -->
---
This is a story from one developer
---
[34,45]
This is a story from another developer
---
```
### Tag system
```[34,45]``` on the second story of the example file means that this story also correlates to tip 34 and 45.  
Adding 45 in this array in optional, because the story is already in the 45.md file.   
This system makes it so you don't have to write the story several times.

## Style guide
Try to stay consistent with the style of [Acorn website](https://www.acorntechnology.se/)

## Development
This is a one page website existing of only cards of tip, with Title and Description as well as a expansion button to display all the related stories.   
We try to keep it simple, lightweight and maintainable.

### Structure
Whatever is good for a simple, easy to maintain and modern static webpages
#### Branching
```main``` branch for development   
```gh-pages``` branch for deployment

### Tech Stack
html, css, javascript.
Just keep it simple with as little code and dependencies as possible, but try to keep it modern and convenient.

## Deployment

### Manual Deployment to GitHub Pages
The repository includes a GitHub Actions workflow for manual deployment to the `gh-pages` branch.

#### Prerequisites
- Repository administrator permissions
- GitHub Actions enabled for the repository
- GitHub Pages configured to deploy from `gh-pages` branch

#### How to Deploy
1. **Navigate to the Actions tab** in your GitHub repository
2. **Select "Deploy to GitHub Pages"** workflow
3. **Click "Run workflow"** button
4. **Choose environment** (production/staging) - optional
5. **Click "Run workflow"** to start deployment

The workflow will automatically:
- Build the static site (cleanup development files)
- Create/update the `gh-pages` branch
- Deploy to GitHub Pages

#### Repository Settings
Ensure GitHub Pages is configured in repository settings:
- Go to **Settings → Pages**
- Set **Source** to "Deploy from a branch"
- Select **Branch**: `gh-pages` and **Folder**: `/ (root)`

#### Troubleshooting
If you encounter workflow permission errors:
- Ensure your GitHub token has `workflow` scope permissions
- Repository administrators may need to enable GitHub Actions
- Check that GitHub Pages is enabled in repository settings

## Local Development
To run the website locally:
1. Clone the repository
2. Open `index.html` in a web browser or use a local server:
   ```bash
   python -m http.server 8000
   # or
   npx serve .
   ```
3. Navigate to `http://localhost:8000`

## Future Improvements
The following features could enhance the user experience:

### Search and Filtering
- **Search functionality**: Allow users to search tips by title, description, or story content
- **Category filtering**: Organize tips by themes (debugging, design, testing, etc.)
- **Tag-based filtering**: Filter tips by related concepts or difficulty level

### Enhanced User Experience  
- **Dark mode toggle**: Support for dark/light theme switching
- **Bookmark system**: Let users favorite and bookmark their most relevant tips
- **Reading progress**: Track which tips users have read and expanded
- **Print-friendly view**: Optimized layout for printing individual tips or collections

### Content Management
- **Story submission form**: Web interface for contributing stories without GitHub
- **Automated Pull Requests**: Direct story submission that creates PRs in the correct tip file
- **Story moderation**: Review system for community-submitted content
- **Rich text editor**: Support for formatted text, code blocks, and links in stories
- **Story voting**: Community voting to highlight the most helpful stories

### Performance & Analytics
- **Service worker**: Offline support for browsing tips
- **Analytics**: Track most popular tips and user engagement
- **Progressive loading**: Lazy load stories to improve initial page performance