const axios = require("axios");
const cheerio = require("cheerio");

const ScrapController = async (req, res) => {
  try {
    const url = "https://www.imdb.com/chart/bottom/?ref_=chtmvm_ql_7";

    // Fetch the HTML of the page
    const { data } = await axios.get(url, {
      headers: {
        "User -Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
    });

    // Load the HTML into cheerio
    const $ = cheerio.load(data);

    // Array to hold movie data
    const movies = [];

    // Select each movie row in the table
    $(".ipc-page-grid .ipc-metadata-list .ipc-metadata-list-summary-item").each(
      (index, element) => {
        const title = $(element)
          .find(".ipc-title .ipc-title__text")
          .text()
          .trim();
        const year = $(element)
          .find(".cli-title-metadata .cli-title-metadata-item")
          .first()
          .text()
          .trim(); // Use .first() to get the correct year
        const time = $(element)
          .find(".cli-title-metadata-item")
          .last()
          .text()
          .trim(); // Assuming time is the last item
        const rating = $(element).find(".cli-ratings-container").text().trim();
        const image = $(element).find(".ipc-media img").attr("src"); // Get the image source

        // Push the movie data into the array
        movies.push({ title, year, rating, image, time });
      }
    );

    // Return the movies array as a JSON response
    return res.status(200).json(movies);
  } catch (error) {
    // Improved error handling
    console.error("Error fetching data:", error.message);
    return res.status(500).json({ error: "Failed to fetch movie data." }); // Send a response with an error message
  }
};

module.exports = { ScrapController };
