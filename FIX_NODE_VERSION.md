# نیاز به Node.js 20

## مشکل
Node.js فعلی شما: **v18.20.8**  
نسخه مورد نیاز Next.js: **v20.9.0+**

## راه‌حل

```bash
# نصب Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# چک کردن نسخه
node --version  # باید v20.x.x باشد

# نصب مجدد dependencies
cd /home/sajad/talaseen
./clean-install.sh

# اجرای پروژه
./start-all.sh
```

## یا استفاده از nvm (پیشنهادی)

```bash
# نصب nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc

# نصب Node 20
nvm install 20
nvm use 20
nvm alias default 20

# بعد از نصب
cd /home/sajad/talaseen
./clean-install.sh
./start-all.sh
```
