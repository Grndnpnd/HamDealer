# HAM DEALER Game Deployment Guide

This guide provides step-by-step instructions for deploying the HAM DEALER game to public hosting platforms. We'll cover two popular free options: Netlify and GitHub Pages.

## Option 1: Netlify Deployment (Recommended)

Netlify offers an easy deployment process with excellent performance for static websites like our HAM DEALER game.

### Method 1: Netlify UI (Easiest)

1. **Prepare Your Repository**
   - Push your game files to a GitHub, GitLab, or Bitbucket repository
   - Ensure all file paths are relative

2. **Sign Up/Login to Netlify**
   - Go to [Netlify](https://app.netlify.com/)
   - Sign up or log in (you can use your GitHub account)

3. **Create a New Site**
   - Click "New site from Git"
   - Select your Git provider (GitHub, GitLab, or Bitbucket)
   - Authorize Netlify to access your repositories
   - Select the repository containing the HAM DEALER game

4. **Configure Build Settings**
   - Build command: (leave blank for static site)
   - Publish directory: `game` (or the directory containing your index.html)
   - Click "Deploy site"

5. **Access Your Deployed Game**
   - Netlify will provide a random subdomain (e.g., random-name-123456.netlify.app)
   - You can change this to a custom subdomain in site settings

### Method 2: Netlify CLI (For Developers)

1. **Install Netlify CLI**
   ```bash
   npm install netlify-cli -g
   ```

2. **Login to Netlify**
   ```bash
   netlify login
   ```

3. **Navigate to Your Game Directory**
   ```bash
   cd path/to/project/game
   ```

4. **Initialize and Deploy**
   ```bash
   netlify init
   netlify deploy --prod
   ```

5. **Follow the CLI Prompts**
   - Select "Create & configure a new site"
   - Choose your team
   - Set a custom site name if desired
   - Specify the publish directory (usually `.` if you're already in the game directory)

## Option 2: GitHub Pages Deployment

GitHub Pages is another excellent free option for hosting static websites.

1. **Create a GitHub Repository**
   - Go to [GitHub](https://github.com)
   - Create a new repository (e.g., ham-dealer)
   - Push your game files to this repository

2. **Configure GitHub Pages**
   - Go to your repository settings
   - Scroll down to the "GitHub Pages" section
   - Under "Source", select "main" branch (or your preferred branch)
   - Select the root folder or `/docs` folder depending on your repository structure
   - Click "Save"

3. **Access Your Deployed Game**
   - Your game will be available at `https://yourusername.github.io/repository-name/`
   - It may take a few minutes for the site to be published

## Post-Deployment Testing

After deploying to either platform, perform these tests:

1. **Functionality Testing**
   - Verify all game features work correctly
   - Test buying and selling ham
   - Confirm travel between locations works
   - Test loan system and debt deadline feature
   - Verify random events trigger correctly

2. **Compatibility Testing**
   - Test on multiple browsers (Chrome, Firefox, Safari, Edge)
   - Verify mobile responsiveness

## Troubleshooting

### Common Issues with Netlify:
- **404 Errors**: Check file paths and netlify.toml redirects
- **Build Failures**: Check the build logs for specific errors
- **CSS/JS Not Loading**: Verify file paths are relative, not absolute

### Common Issues with GitHub Pages:
- **404 Errors**: Ensure repository settings are correct
- **Assets Not Loading**: Check that file paths include the repository name if needed
- **Delayed Updates**: GitHub Pages may take a few minutes to reflect changes

## Updating Your Deployed Game

### Netlify:
- Push changes to your connected Git repository
- Netlify will automatically rebuild and deploy

### GitHub Pages:
- Push changes to your GitHub repository
- GitHub Pages will automatically rebuild and deploy

## Documentation

Remember to update the README.md with:
- Game instructions
- Game features and objectives
- The public URL where the game can be played