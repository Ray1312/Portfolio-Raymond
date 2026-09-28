# Computer Science Portfolio

A lightweight, responsive portfolio for internship applications. It uses plain HTML, CSS, and JavaScript, so there is no build step or package installation.

## Personalize before sharing

All sample details are intentionally labelled. Edit `index.html` and `resume.html` to replace:

1. Raymond's name, city, university, graduation year, and contact links are already filled in.
2. The GearShare and FloodGuard details. Keep the problem, role, challenge, solution, and stack fields. Replace the link placeholder text with GitHub and demo anchors.
3. The skills list, which is still illustrative. Experience is intentionally empty because there is no formal role to list yet.
4. The print-friendly resume content in `resume.html`.

Search for `to add`, `Add`, and `Details to add` to find remaining placeholders. The workbench image is illustrative and does not depict you or your projects.

## Preview locally

Open `index.html` directly in a browser, or run a local static server from this folder:

```powershell
python -m http.server 4173
```

Then open `http://localhost:4173`.

## Deploy with GitHub and Vercel

1. Create a GitHub repository and push the contents of this folder to its root.
2. In Vercel, choose **Add New Project** and import the repository.
3. Select **Other** as the framework preset. Leave build command and output directory blank.
4. Deploy. Future pushes to your main branch will create new deployments.

The `vercel.json` file enables clean URLs, so `/resume` opens the resume page.
