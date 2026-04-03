# Publishing your Next.js Website on HostSheba (cPanel Hosting)

HostSheba uses cPanel, which typically includes a "Setup Node.js App" tool. This guide walks you through preparing, uploading, and configuring your application.

## Prerequisites
- A domain name pointing to your HostSheba account.
- Your Next.js project is ready and working locally.
- Access to your HostSheba cPanel.

---

## Step 1: Prepare Your Project for Production

Before uploading, update your environment variables for production.

1.  **Open `.env.local`** and change `NEXT_PUBLIC_APP_URL` to your actual domain name:
    ```env
    NEXT_PUBLIC_APP_URL=https://yourdomain.com
    ```
2.  **Build your project** locally to ensure there are no errors:
    ```bash
    npm run build
    ```
    This creates a `.next` folder in your project root.

---

## Step 2: Create a Zip File for Upload

To save time and ensure all files are transferred correctly:
1.  **Select these files/folders** in your project directory:
    - `.next` (Output folder)
    - `public` (Assets)
    - `src` (Source code)
    - `package.json`
    - `package-lock.json`
    - `next.config.js`
    - `.env.local` (Rename to `.env` if cPanel doesn't detect it)
2.  **DO NOT** include `node_modules`. It's too large and should be installed on the server.
3.  **Right-click and Zip** these files into a single archive (e.g., `brixel_deploy.zip`).

---

## Step 3: Upload Files to HostSheba

1.  Log in to your **HostSheba cPanel**.
2.  Open **File Manager**.
3.  Navigate to your domain's root folder (usually `public_html`, or a separate folder if you're using a subdomain/addon domain).
4.  Click **Upload** and select your `brixel_deploy.zip`.
5.  Once uploaded, right-click the zip file and select **Extract**.

---

## Step 4: Setup Node.js App in cPanel

1.  Search for **Setup Node.js App** in cPanel.
2.  Click **Create Application**.
3.  Configure the settings:
    -   **Node.js version**: Choose 18.x or 20.x (Recommended).
    -   **Application mode**: Production.
    -   **Application root**: The folder where you extracted the files (e.g., `public_html` or yours).
    -   **Application URL**: Select your domain.
    -   **Application startup file**: Type `node_modules/next/dist/bin/next` (Note: This is how cPanel runs Next.js natively).
4.  Click **Create**.

---

## Step 5: Install Dependencies

1.  Once the app is created, you will see a section for **Run npm install**.
2.  Click the **npm install** button. This will download all necessary packages into the `node_modules` folder on the server.
3.  Wait for it to finish. If it fails, you may need to use the **Terminal** in cPanel to run `npm install` manually in your application root.

---

## Step 6: Environment Variables (Important)

In the same "Setup Node.js App" page:
1.  Scroll down to **Environment variables**.
2.  Add your variables from `.env.local`:
    -   `MONGODB_URI`: (Your MongoDB string)
    -   `JWT_SECRET`: (Your secret)
    -   `NEXT_PUBLIC_APP_URL`: (Your domain)
3.  Click **Save Changes** and then **Restart** the application.

---

## Common Troubleshooting
- **404/503 Error**: Ensure the "Application startup file" is correct. If `node_modules/next/dist/bin/next` doesn't work, you might need a simple `server.js` file to bridge it.
- **MongoDB Connection**: Ensure your MongoDB Atlas cluster has white-listed your HostSheba server's IP address (get the IP from cPanel's Sidebar).
- **Public Assets**: If images in `public/` are not loading, check permissions (folders: 755, files: 644).
