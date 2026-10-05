# Computer Science Portfolio

A lightweight, responsive portfolio for internship applications. It uses plain HTML, CSS, and JavaScript, so there is no build step or package installation.

## Content and design

The homepage uses a dark graphite palette with restrained amber highlights, local Manrope and Inter fonts, a subtle animated system diagram, and a featured IHSG project followed by four group projects. Motion respects the browser's reduced-motion preference. Original project screenshots retain their own application colors.

Edit `index.html` to update profile information, skills, project summaries, screenshots, and links. Technical explanations and contributions are in the five project detail HTML files. Keep group-project contributions distinct from the complete application's capabilities.

The resume links currently point to the supplied Canva URL. Replace both homepage links with a PDF in `assets/` when one is available. The old `resume.html` is not linked from the homepage.

Project screenshots are actual supplied images; the Smart Fridge architecture graphic is a diagram, not an application screenshot. Fonts and social icons are stored locally, so the portfolio needs no API keys, credentials, or external font service.

## Preview locally

Open `index.html` directly in a browser, or run a local static server from this folder:

```powershell
python -m http.server 4174 --bind 127.0.0.1
```

Then open `http://127.0.0.1:4174`.

## Deploy with GitHub and Vercel

1. Create a GitHub repository and push the contents of this folder to its root.
2. In Vercel, choose **Add New Project** and import the repository.
3. Select **Other** as the framework preset. Leave build command and output directory blank.
4. Deploy. Future pushes to your main branch will create new deployments.

The `vercel.json` file enables clean URLs for the project detail pages.
