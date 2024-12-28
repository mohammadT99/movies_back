const axios = require("axios");
const cheerio = require("cheerio");

const scrapIMDB = async (req, res) => {
  try {
    const url = "https://www.imdb.com/chart/top/?ref_=nv_mv_250";

    // Fetch the HTML of the page
    const { data } = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
    });
    // Load the HTML into cheerio
    const $ = cheerio.load(data);

    // Array to hold movie data
    const movies = [];

    // Select each movie row in the table
    $(".ipc-metadata-list li").each((index, element) => {
      const title = $(element).find(".ipc-title h3").text().trim();
      const year = $(element)
        .find(".cli-title-metadata span")
        .text()
        .replace(/\(|\)/g, ""); // Remove parentheses
      const rating = $(element).find(".cli-ratings-container").text();

      // Push the movie data into the array
      movies.push({ title, year, rating });
    });

    // Log the movies array

    return movies;
  } catch (error) {
    // Improved error handling
    console.error("Error fetching data:", error.message);
  }
};

// Export the function for use in other modules
module.exports = scrapIMDB;
