curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs# به‌روزرسانی Node.js

## مشکل فعلی
نسخه Node.js شما: **v12.22.9** (خیلی قدیمی!)  
نسخه مورد نیاز: **v18+**

## راه حل سریع با nvm

```bash
# نصب nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# بستن و باز کردن ترمینال یا اجرای این دستور:
source ~/.bashrc

# نصب Node.js 18
nvm install 18
nvm use 18

# چک کردن نسخه
node --version  # باید v18.x.x نشان بدهد
```

## بعد از نصب Node.js 18

```bash
cd /home/sajad/talaseen
./start-all.sh
```

---

یا اگر nvm نمی‌خواهید، از NodeSource استفاده کنید:

```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
node --version
```
