# GitHub Setup Instructions for Soltree

## Step 1: Prepare Your Local Project

1. **Extract the ZIP file** you downloaded to a folder on your computer
2. **Open terminal/command prompt** in that folder
3. **IMPORTANT: Remove node_modules first**:
   ```bash
   # Windows
   rmdir /s node_modules
   
   # Mac/Linux  
   rm -rf node_modules
   ```

4. **Initialize Git repository**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Soltree - Solana Merkle Tree Creator"
   git branch -M main
   ```

**If you get warnings about node_modules:**
- You MUST delete the node_modules folder first
- node_modules should never be uploaded to GitHub
- It will be recreated when someone runs `npm install`

**If you get "src refspec main does not match any" error:**
```bash
git branch
# If no branches shown, you need to make first commit:
git add .
git commit -m "Initial commit: Soltree - Solana Merkle Tree Creator"
git branch -M main
```

## Step 2: Create GitHub Repository

1. **Go to GitHub.com** and sign in
2. **Click "+" in top right** → "New repository"
3. **Repository name**: `soltree` (or your preferred name)
4. **Description**: "Solana Merkle Tree Creator - Web3 application for creating compressed Merkle trees"
5. **Keep it public** (required for GitHub Pages)
6. **Don't initialize** with README, .gitignore, or license (you already have these)
7. **Click "Create repository"**

## Step 3: Connect Local to GitHub

Copy and run these commands in your project folder:

```bash
git remote add origin https://github.com/YOUR_USERNAME/soltree.git
git branch -M main
git push -u origin main
```

Replace `YOUR_USERNAME` with your actual GitHub username.

**If you get a "fetch first" error:**
```bash
git push origin main --force
```
This error happens when GitHub creates an initial README file. The force push will overwrite it with your complete project.

**Important**: If you get authentication errors, you may need to:
1. Use a Personal Access Token instead of password
2. Go to GitHub Settings → Developer settings → Personal access tokens
3. Generate a token with repo permissions
4. Use the token as your password when prompted

## Step 4: Setup GitHub Pages

1. **In your GitHub repository**, go to Settings → Pages
2. **Source**: GitHub Actions (this will use the automated workflow)
3. **The workflow will automatically**:
   - Build your project when you push changes
   - Deploy to GitHub Pages
   - Handle the static site configuration

**Note**: The first deployment may take a few minutes. Check the "Actions" tab to see the build progress.

## Step 5: Build for Production

Your project needs to be built for GitHub Pages. Add this to your `package.json` scripts:

```json
{
  "scripts": {
    "build": "vite build",
    "preview": "vite preview",
    "build:client": "vite build --outDir dist/client"
  }
}
```

## Step 6: GitHub Pages Configuration

Since this is a full-stack app, you'll need to:

1. **Build the client** for static hosting
2. **Configure base path** in `vite.config.ts`
3. **Handle routing** for single-page application

## Important Notes

- **Never upload node_modules** - Delete this folder before git add
- **GitHub Pages only hosts static files** - your Express server won't run
- **Tree configurations** saved in browser localStorage (no database needed)
- **Wallet connection** and blockchain features will work fine
- **Consider Vercel or Netlify** for full-stack deployment instead

## Quick Fix for Current Issue

If you already ran `git add .` with node_modules:

```bash
# Reset Git and start over
rm -rf .git
git init

# Delete node_modules
rmdir /s node_modules  # Windows
# or: rm -rf node_modules  # Mac/Linux

# Now add files properly
git add .
git commit -m "Initial commit: Soltree - Solana Merkle Tree Creator"
git branch -M main
git remote add origin https://github.com/StaplezStudio/Soltree.git
git push -u origin main
```

## Alternative: Deploy to Vercel/Netlify

For full functionality including database:

1. **Vercel**: Connect GitHub repo → Auto-deploy
2. **Netlify**: Connect GitHub repo → Auto-deploy
3. **Add environment variables** for database if needed

## Your Repository URL

Once uploaded, your repository will be at:
`https://github.com/YOUR_USERNAME/soltree`

Your GitHub Pages site will be at:
`https://YOUR_USERNAME.github.io/soltree`