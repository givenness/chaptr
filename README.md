# chaptr

![chaptr](https://github.com/user-attachments/assets/710b64d6-6b9a-4e1b-9688-6e86241cdff2)

A World Mini App for user‑generated serialized fiction: verified authors publish stories in chapters; readers follow, upvote, comment, and tip authors. 

## Features

- **🔐 World ID Authentication** - Secure authentication using Worldcoin's MiniKit
- **📚 Story Publishing** - Create and publish stories
- **💰 WLD Token Tipping** - Monetize content through World payments
- **🏷️ Genre Tagging** - Organize stories by genres and tags

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- A Worldcoin Developer Portal account
- ngrok (for local development)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/username/chaptr-app.git
   cd chaptr-app
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   npm run setup
   ```

   Then edit `.env.local` with your Worldcoin App ID:

   ```env
   NEXT_PUBLIC_WORLDCOIN_APP_ID=your_worldcoin_app_id_here
   APP_ID=your_worldcoin_app_id_here
   ```

4. **Start the development server**

   ```bash
   npm run dev
   ```

5. **Set up ngrok for World App testing**

   ```bash
   # In a new terminal
   ngrok http 3000
   ```

   Use the ngrok URL in your Worldcoin Developer Portal as your MiniApp URL.

## 🔧 Configuration

### Worldcoin Setup

1. **Create a World App**

   - Go to [Worldcoin Developer Portal](https://developer.worldcoin.org/)
   - Create a new application
   - Note your App ID

2. **Configure MiniApp**

   - Set your ngrok URL as the MiniApp URL
   - Enable required permissions:
     - `wallet-auth` (for authentication)
     - `payments` (for tipping functionality)

3. **Environment Variables**

   ```env
   # Required
   NEXT_PUBLIC_WORLDCOIN_APP_ID=app_your_app_id_here
   APP_ID=app_your_app_id_here

   # Optional (for payment verification)
   DEV_PORTAL_API_KEY=your_dev_portal_api_key
   ```

## Support

- **Documentation**: [Worldcoin MiniKit Docs](https://docs.worldcoin.org/minikit)
- **Issues**: [GitHub Issues](https://github.com/username/chaptr-app/issues)

---

Built with 📚 for World 
