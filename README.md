# Discord Rare Accounts Scraper

An advanced scraper to find and monitor rare Discord accounts in specific servers. The bot automatically identifies accounts with rare characteristics such as short usernames, special badges, high boost levels, and Nitro Platinum badges or higher.

## 📸 Preview

![Embed Preview](https://i.imgur.com/eWDYh8V.png)

## ✨ Features

- **Rare Username Detection**: Identifies accounts with 2 or 3 characters
- **Rare Badges**: Detects special badges like Staff, Partner, Certified Moderator, Hypesquad, Bug Hunter, etc.
- **Boost Levels**: Monitors accounts with Boost Level 3 or higher
- **Nitro Badges**: Identifies Nitro Platinum, Diamond, Emerald, Ruby, and Opal badges (only Platinum and above are considered rare)
- **Rate Limiting System**: Implements intelligent delays to avoid rate limits
- **Proxy Support**: Optional proxy configuration for requests
- **Webhook Integration**: Sends automatic notifications via Discord Webhook
- **Processed IDs Tracking**: Prevents processing the same account multiple times

## 🛠️ Technologies Used

- **Node.js** - JavaScript runtime
- **discord.js-selfbot-v13** - Library for Discord interaction
- **Axios** - HTTP client for API requests
- **Moment.js** - Date manipulation
- **Colors** - Terminal text formatting

## 📋 Requirements

- Node.js 16+ installed
- Discord authentication token
- Discord Webhook URL
- (Optional) Configured proxy

## 🚀 Installation

1. Clone the repository:
```bash
git clone https://github.com/ofyv/discord-rare-accounts-scraper.git
cd discord-rare-accounts-scraper
```

2. Install dependencies:
```bash
npm install
```

3. Configure the `config.json` file:
```json
{
  "token": "YOUR_USER_ACCOUNT_TOKEN",
  "webhook_url": "YOUR_WEBHOOK_URL",
  "use_proxy": false,
  "user_check_delay_ms": 10000,
  "proxy": {
    "protocol": "http",
    "host": "your-proxy.com",
    "port": 8080,
    "auth": {
      "username": "username",
      "password": "password"
    }
  }
}
```

## ⚙️ Configuration

### Basic Configuration

Edit the `config.json` file with your credentials:

- **token**: Discord **user account** authentication token used by the selfbot
- **webhook_url**: Webhook URL where notifications will be sent
- **use_proxy**: `true` or `false` to enable/disable proxy
- **user_check_delay_ms**: Delay in milliseconds between each user verification (default: 10000ms / 10 seconds)
- **proxy**: Proxy settings (optional)

> **Important**: This project was designed to run with a user token (selfbot). Do **not** use a bot application token here, as it will not work as intended.

### How to Create a Webhook

1. In the Discord server, go to Channel Settings > Integrations > Webhooks
2. Click "Create Webhook"
3. Copy the webhook URL

## 📖 How to Use

1. Start the bot:
```bash
npm start
```

2. When prompted, enter the server ID you want to scan

3. The bot will:
   - Fetch all server members
   - Process each account checking rarity criteria
   - Send webhook notifications for rare accounts found
   - Save processed IDs to avoid duplicates

## 🏗️ Project Structure

```
discord-rare-accounts-scraper/
├── index.js              # Main scraper file
├── config.json           # Configuration file
├── package.json          # Project dependencies
├── utils/
│   ├── api.js           # Discord API functions
│   └── rarity.js        # Rarity verification logic
└── files/                # Generated files (processed IDs)
    └── processed_ids.txt
```

## 🎯 Rarity Criteria

### Rare Usernames
- Accounts with **2 characters** in username
- Accounts with **3 characters** in username

### Rare Badges
- Staff
- Partner
- Certified Moderator
- Hypesquad
- Bug Hunter Level 1/2
- Premium Early Supporter
- Verified Developer

### Boost Levels
- Boost Level 3 or higher (BoostLevel3 to BoostLevel9)

### Nitro Badges (Premium Tenure)
- **Platinum** (12 months) - `premium_tenure_12_month_v2`
- **Diamond** (24 months) - `premium_tenure_24_month_v2`
- **Emerald** (36 months) - `premium_tenure_36_month_v2`
- **Ruby** (48 months) - `premium_tenure_48_month_v2`
- **Opal** (60 months) - `premium_tenure_60_month_v2`

> **Note**: Only Nitro Platinum badges and above are considered rare. Bronze, Silver, and Gold are not considered rare.

## 📊 Rate Limiting

The bot implements an intelligent rate limiting system:

- **Configurable delay**: Delay between user verifications (configurable via `user_check_delay_ms` in `config.json`, default: 10000ms / 10 seconds)
- **Special delay**: Additional 5 seconds delay every 360 requests (base delay + 5000ms)
- **Rate limit detection**: Automatically detects rate limits and waits for the necessary time

### Configuring the Delay

You can adjust the delay between user verifications by modifying the `user_check_delay_ms` value in `config.json`:

- **Lower values** (e.g., 5000ms): Faster processing, but higher risk of rate limits
- **Higher values** (e.g., 15000ms): Slower processing, but safer from rate limits
- **Recommended**: 10000ms (10 seconds) for most cases

## 🔒 Security and Privacy

- ⚠️ **Warning**: This project uses selfbot, which violates Discord's Terms of Service
- ⚠️ Use at your own risk
- ⚠️ Do not share your token with anyone
- ⚠️ Keep the `config.json` file private and do not commit it to Git

## 📝 Important Notes

- The bot saves processed IDs in `files/processed_ids.txt` to avoid processing the same account multiple times
- The bot displays a LOFY banner after collecting user IDs
- All errors are logged to the console for debugging

## 🐛 Troubleshooting

### Error: "Token not configured"
- Check if the `config.json` file exists and contains the `token` field

### Error: "Rate limit reached"
- The bot automatically detects and waits. Consider using a proxy if the problem persists

### Accounts are not being found
- Verify that the server ID is correct
- Make sure the bot has permissions to view server members

## 📄 License

This project is licensed under the MIT License.

## ⚠️ Disclaimer

This project is for educational purposes only. The use of selfbots violates Discord's Terms of Service and may result in your account being banned. Use at your own risk.

## 🤝 Contributing

Contributions are welcome! Feel free to open an issue or submit a pull request.
