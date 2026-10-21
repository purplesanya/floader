# Deployment units

These are the systemd units used by the production FLoader host.

## Install

```bash
sudo cp deploy/floader-web.service /etc/systemd/system/
sudo cp deploy/floader-cache-warm.service /etc/systemd/system/
sudo cp deploy/floader-cache-warm.timer /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable --now floader-web.service
sudo systemctl enable --now floader-cache-warm.timer
```

The app lives in `/opt/apps/floader` and runs from its own virtualenv as the
`floader` user. Nginx reverse-proxies to `127.0.0.1:8103`.

`floader-cache-warm.timer` requests the recommendations page every 30 minutes
so the shared cache is warm after restarts. The cache is stored in
`/opt/apps/floader/.cache/http` and is capped at 100 MB.
