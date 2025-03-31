const { Logena } = require("logena");
const noblox = require("noblox.js");
const dotenv = require("dotenv");
dotenv.config();
Logena.set({
    appName: "FOLLOW-EXPLODINATOR-9000",
    colors: { info: "magenta" },
    useTimestamps: true,
    debug: true
});

const amountToRemove = 100; // The number of users to remove. Default is 100.
const removeFriends = false; // Set to true if you want to remove friends from the friends list (required to remove them as followers). Default is false.
const onlyBots = true; // Set to true if you want to remove only bot followers. Default is true.

// Use README.md to know the options you have for the 2 functions below:
(async () => {
    await removeFollowers(amountToRemove, onlyBots, removeFriends);
    await UnfollowUsers(amountToRemove, removeFriends, onlyBots);
})();


/**
 * This function removes followers from the current user.
 * @param {number} [maxFollowersToRemove=100] - The maximum number of followers to remove. Default is 100.
 * @param {boolean} [onlyBots=true] - If false, all followers will be removed. If true, only bot followers will be removed.
 * @param {boolean} [removeFriends=false] - If true, friends will be removed from the friends list (required to remove them as followers). Default is false.
 * @returns {Promise<void>}
 */
async function removeFollowers(maxFollowersToRemove = 100, onlyBots = true, removeFriends = false) {
    try {
        const { name, id } = await noblox.setCookie(process.env.ROBLOX_TOKEN);
        Logena.info(`LOGGED IN AS ${name.toUpperCase()} (${id})`);
        let friends = [];

        if (removeFriends) {
            friends = (await noblox.getFriends(id)).data.map(friend => friend.id) || [];
            Logena.debug(`SUCCESSFULLY FETCHED ${friends.length} FRIENDS`);
        };

        await processUsers(id, "getFollowers", maxFollowersToRemove, onlyBots, friends);
    } catch (error) {
        Logena.error(error.message);
    }
}

/**
 * @param {number} totalUsersToUnfollow - The number of users to unfollow. Default is 100.
 * @param {boolean} [removeFriends=true] - If true, friends will be removed from the friends list. Default is true.
 * @param {boolean} onlyBots - If true, only bot accounts will be processed. Default is false.
 * @returns {Promise<void>}
 * @async
 */
async function UnfollowUsers(totalUsersToUnfollow = 100, removeFriends = true, onlyBots = false) {
    try {
        const { name, id } = await noblox.setCookie(process.env.ROBLOX_TOKEN);
        Logena.info(`LOGGED IN AS ${name.toUpperCase()} (${id})`);
        let friends = [];

        if (removeFriends) {
            let friends = (await noblox.getFriends(id)).data.map(friend => friend.id) || [];
            Logena.debug(`SUCCESSFULLY FETCHED ${friends.length} FRIENDS`);
        };

        await processUsers(id, "getFollowings", totalUsersToUnfollow, onlyBots, friends);
    } catch (error) {
        Logena.error(error.message);
    }
}

/**
 * Helper function to determine if an account is a bot.
 * @param {Object} user - The user object to check.
 * @param {number} user.id - The user's ID.
 * @param {string} user.description - The user's description.
 * @returns {boolean} - True if the user is a bot, false otherwise.
 * @private
 */
async function isBotAccount(user) {
    try {
        const [friendCount, badges, followerCount, followingCount] = await Promise.all([
            noblox.getFriendCount(user.id),
            noblox.getPlayerBadges(user.id, 1),
            noblox.getFollowerCount(user.id),
            noblox.getFollowingCount(user.id)
        ]);

        if (!friendCount && !followerCount && !badges.length && !user.description && followingCount >= 200) {
            Logena.debug(`${user.id} IS DETECTED AS A FOLLOWER BOT`);
            return true;
        }
    } catch (error) {
        Logena.error(`Fetching data for user ${user.id}: ${error.message}`);
    }
    return false; // Assume not a bot if criteria not met or error occurs
}

/**
 * This function processes users for both primary functions. (easier to maintain long term I guess)
 * @param {number} userId - The user ID of the current user.
 * @param {"getFollowers", "getFollowings"} action - The action to perform on the users.
 * @param {number} [maxUsers=100] - The maximum number of users to process. Default is 100.
 * @param {boolean} [onlyBots=true] - If true, only bot accounts will be processed. Default is true.
 * @param {Array<number>} exemptedUsers - The array of user IDs to exempt from processing.
 * @returns {Promise<void>}
 */
async function processUsers(userId, action, maxUsers = 100, onlyBots = true, exemptedUsers = []) {

    let removedUsers = 0, cursor = '';
    let remainingUsers = maxUsers % 100;
    let cycles = Math.floor(maxUsers / 100);

    try {
        Logena.debug(`CYCLES: ${cycles}, OVERFLOW: ${remainingUsers}`);
        Logena.info(`PROCESSING UP TO ${maxUsers} USER${maxUsers === 1 ? "" : "S"}...`);

        for (let cycleIndex = 0; cycleIndex < cycles; cycleIndex++) {
            Logena.debug(`CYCLE ${cycleIndex + 1} OF ${cycles} [${remainingUsers} EXTRAS]`);

            usersToProcess = await noblox[action](userId, "Asc", 100, cursor);
            Logena.debug(`FETCHED ${usersToProcess.data.length} USERS WITH CURSOR [${cursor}]`);

            for (const user of usersToProcess.data) {
                if (exemptedUsers.includes(user.id) || removedUsers >= Math.min(maxUsers, usersToProcess.data.length)) break; // Skip exempted users and stop if max users or data size reached
                if (onlyBots && !(await isBotAccount(user))) continue; // Skip non-bot accounts if onlyBots is true
                Logena.debug(`PROCESSING USERID ${user.id}...`);

                if (action === "getFollowers") {

                    Logena.debug(`BLOCKING ${user.id}...`);
                    await noblox.block(user.id);
                    Logena.debug(`UNBLOCKING ${user.id}...`);
                    await noblox.unblock(user.id);

                } else if (action === "getFollowings") {
                    Logena.debug(`UNFOLLOWING ${user.id}...`);
                    await noblox.unfollow(user.id);
                } else {
                    Logena.error(`[processUsers] INVALID ACTION: ${action}`);
                    return;
                }

                Logena.debug(`PROCESSED USER ${user.id}`);
                removedUsers++;
            }

            cursor = usersToProcess.nextPageCursor;
            if (!cursor) break; // No more users to process
        };

        // LAST 100 USERS
        if (remainingUsers > 0) for (const user of (await noblox[action](userId, "Asc", 100, cursor)).data) {
            if (exemptedUsers.includes(user.id) || removedUsers >= maxUsers) break; // Skip exempted users and stop if max users reached
            if (onlyBots && !(await isBotAccount(user))) continue; // Skip non-bot accounts if onlyBots is true
            Logena.debug(`PROCESSING USERID ${user.id}...`);

            if (action === "getFollowers") {

                Logena.debug(`BLOCKING ${user.id}...`);
                await noblox.block(user.id);
                Logena.debug(`UNBLOCKING ${user.id}...`);
                await noblox.unblock(user.id);

            } else if (action === "getFollowings") {
                Logena.debug(`UNFOLLOWING ${user.id}...`);
                await noblox.unfollow(user.id);
            } else {
                Logena.error(`[processUsers] INVALID ACTION: ${action}`);
                return;
            }
            removedUsers++;
        };

        Logena.info(`SUCCESSFULLY PROCESSED ${removedUsers} USER${removedUsers === 1 ? "" : "S"}.`);
    } catch (error) {
        Logena.error(`Error processing users: ${error.message}`);
    }
}