# EdgeRadar Arbitrage Calculator

Standalone iPhone-friendly web version of the `GUI_V1.py` arbitrage calculator.

## Run On This PC

Open:

```text
C:\Users\eloil\Documents\Codex\2026-05-11\i-m-running-the-code-and\iphone-arb-calculator\index.html
```

## Best iPhone Setup

For a phone app that keeps working when the PC is off, host this folder once on a static HTTPS host, then add it to the iPhone Home Screen.

Good free options:

- Netlify Drop: drag this folder into Netlify and use the link it gives you.
- GitHub Pages: upload the folder to a repository and enable Pages.
- Cloudflare Pages: upload from GitHub.

After opening the hosted HTTPS link on iPhone:

1. Open the link in Safari.
2. Wait for the calculator to load once.
3. Tap Share.
4. Tap Add to Home Screen.
5. Open it from the Home Screen icon.

The app includes an offline cache, so after it loads once from the hosted link, it can keep working even when your computer is off or somewhere else.

## Temporary iPhone Test Over Wi-Fi

1. Connect the iPhone and Windows PC to the same Wi-Fi.
2. Open PowerShell in this folder:

```powershell
cd C:\Users\eloil\Documents\Codex\2026-05-11\i-m-running-the-code-and\iphone-arb-calculator
python -m http.server 8000 --bind 0.0.0.0
```

3. Find your PC's Wi-Fi IPv4 address:

```powershell
ipconfig
```

4. On iPhone Safari, open:

```text
http://YOUR-PC-IP:8000
```

Example:

```text
http://192.168.1.23:8000
```

5. In Safari, tap Share, then Add to Home Screen.

If the iPhone cannot connect, allow Python through Windows Firewall for private networks.

This Wi-Fi method is only for testing. It depends on your PC being on.
