# Abadima's Follow Explodinator 9000

_(Totally not inspired by Dr. Doofenshmirtz)_

## Story behind this?

My partner for quite some time had been following over 4.3K accounts on Roblox, and they wanted to clear out the clutter, but didn't want to go through each and individual one, I don't blame them, I would not want to do that either.

That's why, using my not so civil engineering knowledge, I decided to code this stupidly simple NodeJS code to effectively eliminate all of them within' minutes. (would be seconds if ratelimits weren't so painful 😭)

Some of you may notice I decided to use noblox.js instead of Roblox's API itself? I'm what some would consider a lazy dev, I don't want to maintain this code much, so this package should prevent me from having to that, if for some reason it breaks, I'll remake it to use the API directly, but for now, this is a good solution.

## Basic Features

- Follower & Following Removals
- The absolute LUXURY of choosing between all followers, or only botted ones.
- Basic options, like the amount to remove!
  - (worth noting, while you can theoretically set any limit, the more followers/followings you have, the longer it WILL take to remove as unfortunately we do have to respect Roblox's ratelimit, so it may take a while.)
- Prevents friends from being removed & removed from followers list
  - In order to remove a follower, we have to block and unblock them, after some consideration, we decided that people might prefer to keep their friends, so by default, none of your Roblox friends will ever be affected by this script, but you can change this in the code if you want to remove them too. (read the instructions below for more details)
- Debugging mode, for those who want to report issues or just want to see what the script is doing behind the scenes.

## How to Use

1. **Clone the Repository**  
   Clone this repository to your local machine using Git or download it as a ZIP file and extract it.

   ```bash
   git clone https://github.com/Abadima/Abadimas-Follow-Explodinator-9000.git
   cd Abadimas-Follow-Explodinator-9000
   ```

2. **Install Dependencies**  
   Make sure you have [NodeJS LTS](https://nodejs.org/) installed. Then, install the required dependencies:

   ```bash
   npm install
   ```

   _(alternatively, you can use your own package manager of choice if you have a preference)_

3. **Set Up Environment Variables**  
   First, rename `.env.example` to `.env`.

   Then, open the `.env` file and add your Roblox cookie. You can find your Roblox cookie by following these steps:

   - Open Roblox in your web browser.
   - Press `F12` to open the Developer Tools.
   - Go to `Network` tab and refresh the page.
   - Look search for "get-profiles" and click on it.
   - In the `Request Headers` section, find the `Cookie` header. Copy the COMPLETE value of the `ROBLOSECURITY` cookie.
     > **WARNING**: Don't ever share your cookie with anyone and/or scripts that you don't understand, as it can be used to hack your account, and I recommend making a new password even after using this code, as you can never be too careful.
   - Paste it into the `.env` file as follows:

   ```
   ROBLOX_TOKEN=your_roblox_cookie_here
   ```

4. **Configure Options**  
   Open `index.js` and modify the following variables as needed:

   - `amountToRemove`: Number of users to process.
   - `removeFriends`: Whether to remove friends from the list.
   - `onlyBots`: Whether to target only bot accounts.

     > **ADVICE:** You can also comment out either or both functions (`removeFollowers` or `removeFollowings`) in `index.js` if you only want to target one of them.

5. **Run the Script**  
   Execute the script using Node.js:

   ```bash
   node index.js
   ```

6. **Check Logs**  
   The script will log its progress in the console. Follow the logs to monitor the removal process.

   > **NOTE:** The script will take a while to run, depending on the number of followers/followings you have. It will also respect Roblox's rate limits, so it may take longer than expected.

7. **Troubleshooting**
   If you encounter any issues with the script, you can change the `debug` variable in `index.js` to `true`. This will enable debug mode, which provides more detailed logs for troubleshooting.

```javascript
Logena.set({
	appName: "FOLLOW-EXPLODINATOR-9000",
	colors: { info: "magenta" },
	useTimestamps: true,
	debug: true,
});
```

    Enabling debug logs will give you additional logs, so if you'd like to create a Github issue, please make sure to include DEBUG logs before submitting it, as it will help me a lot to figure out what went wrong.

## Before & After Comparisons

|                            BEFORE                             |                            AFTER                             |
| :-----------------------------------------------------------: | :----------------------------------------------------------: |
|    ![image](/Github_Assets/preview_before_bot_removal.png)    |    ![image](/Github_Assets/preview_after_bot_removal.png)    |
| ![image](/Github_Assets/preview_before_following_removal.png) | ![image](/Github_Assets/preview_after_following_removal.png) |

### Legal Disclaimers

This project is not affiliated with, endorsed by, or associated with Roblox Corporation in any way.

This project is intended for educational purposes only. I am not responsible for any misuse or abuse of this code, or any consequences that may arise from its use. Use at your own risk.

This project is not intended to be used for malicious purposes, and I do not condone any illegal or unethical behavior. Please use this code responsibly and in accordance with all applicable laws and regulations.

This project is licensed under MIT License, allowing any of you to use, modify, and distribute the code as long as you include the original copyright notice and license in any copies or substantial portions of the software.
