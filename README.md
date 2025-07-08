# UserUtility Bot

UserUtility is a general-purpose Discord bot focused on providing a wide range of user-centric utilities and information tools. Whether you want to look up user info, check invites, verify domains, or access other helpful features, UserUtility is designed to make your Discord experience easier and more informative.

---

## Features

- Access a variety of user-focused utilities and information commands.
- Look up Discord users, invites, and domains with simple slash commands.
- Designed for flexibility and future expansion—new user utilities are added regularly.
- Clean, modern Discord UI with ephemeral and public responses.
- Easy to use and open source.

---

## Getting Started

You can use UserUtility in two ways:

### 1. Invite the Bot

[Invite UserUtility](https://discord.com/oauth2/authorize?client_id=1390752371998457947)

---

### 2. Self-Hosting

If you prefer to run your own instance, follow these steps:

1. **Clone the repository:**

   ```sh
   git clone https://github.com/biast12/userUtility
   cd userUtility
   ```

2. **Install dependencies:**

   ```sh
   npm install
   ```

3. **Set up your environment variables:**
   - Copy `.env.example` to `.env` and fill in your bot token.

   ```env
   BOT_TOKEN=your_discord_bot_token
   CLIENT_ID=your_bot_client_id
   ```

4. **Register the slash commands:**

   ```sh
   npm run register
   ```

5. **Start the bot:**

   ```sh
   npm run start
   ```

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## Contributing

Contributions and suggestions are welcome! Feel free to open issues or pull requests to help improve UserUtility.

---
