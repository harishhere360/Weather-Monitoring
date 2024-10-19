"use strict";
// Simulated in-memory storage for daily weather summaries
const dailySummaries = {};

/**
 * Saves the daily summary in the in-memory database.
 * @param {string} date - The date of the weather data (e.g., "2024-10-19").
 * @param {object} summary - The summary object containing avgTemp, maxTemp, minTemp, and dominantCondition.
 */
function saveDailySummary(date, summary) {
    dailySummaries[date] = summary;
    console.log(`Summary for ${date} saved:`, summary);
}

/**
 * Retrieves the daily summary from the in-memory database.
 * @param {string} date - The date for which to retrieve the summary.
 * @returns {object|null} - The summary object for the specified date, or null if not found.
 */
function getDailySummary(date) {
    if (dailySummaries[date]) {
        return dailySummaries[date];
    } else {
        console.log(`No summary found for ${date}`);
        return null;
    }
}

module.exports = {
    saveDailySummary,
    getDailySummary,
};

