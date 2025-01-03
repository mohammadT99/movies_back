const axios = require("axios");
const cheerio = require("cheerio");

const GetMoviesController = async (req, res) => {
  try {
    const { code } = req.body;
    console.log("code ------------->>", code);
    const url = `https://www.imdb.com/title/${code}`;

    const { data } = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
    });

    const $ = cheerio.load(data);
    const movieDetails = {};

    // Extracting the title
    movieDetails.title = $(".hero__primary-text").text().trim() || "N/A";
    movieDetails.cover =
      $(".sc-9a2a0028-5 .sc-9a2a0028-7 .ipc-poster .ipc-media img").attr(
        "src"
      ) || "N/A";

    // Extracting the full rating
    const ratingElement = $('span[class*="sc-d541859f-"]');
    movieDetails.rating = ratingElement.length
      ? ratingElement.first().text().trim()
      : "N/A";

    // Extracting the release date
    movieDetails.releaseDate =
      $(".sc-70a366cc-0 ul li a").first().text().trim() || "N/A";

    movieDetails.time = $(".sc-70a366cc-0 ul li").last().text().trim() || "N/A";
    movieDetails.Numberofvotes = $('div[class*="dwhNqC"]')
      .first()
      .text()
      .trim();

    // Extracting the languages
    movieDetails.languages = [];
    $(
      'section[data-testid="Details"] .sc-f65f65be-0 .ipc-metadata-list li:contains("Language") .ipc-metadata-list-item__content-container a'
    ).each((index, element) => {
      movieDetails.languages.push($(element).text().trim());
    });

    if (movieDetails.languages.length === 0) {
      movieDetails.languages.push("N/A");
    }

    movieDetails.MovieDuration = $(
      'div[class*="ipc-html-content ipc-html-content--base"] .ipc-html-content-inner-div'
    )
      .text()
      .trim();

    // console.log("testtt->>>", movieDetails.MovieDuration); // Check what is being retrieved

    // Extracting the countries
    movieDetails.countries = [];
    $(
      'section[data-testid="Details"] .sc-f65f65be-0 .ipc-metadata-list  li[data-testid="title-details-origin"] .ipc-metadata-list-item__content-container .ipc-inline-list__item a'
    ).each((index, element) => {
      movieDetails.countries.push($(element).text().trim());
    });

    if (movieDetails.countries.length === 0) {
      movieDetails.countries.push("N/A");
    }

    // Extracting the genres
    movieDetails.genres = [];
    $(".ipc-chip-list__scroller a span").each((index, element) => {
      movieDetails.genres.push($(element).text().trim());
    });
    movieDetails.labels = [];
    $(".ipc-chip-list__scroller a span").each((index, element) => {
      movieDetails.labels.push($(element).text().trim());
    });

    // Extracting the Rotten Tomatoes score (if available)
    movieDetails.rottenTomatoesScore =
      $('span[data-qa="tomatometer"]').text().trim() || "N/A";

    // Extracting the Metacritic score
    movieDetails.metacriticScore =
      $(
        'ul[class*="ipc-inline-list sc-b782214c-0 bllRjU baseAlt"] li a .score '
      )
        .last()
        .text()
        .trim() || "N/A";
    movieDetails.Budget = $(
      'section[data-testid="BoxOffice"] .sc-f65f65be-0 .ipc-metadata-list__item .ipc-metadata-list-item__content-container ul li span '
    )
      .first()
      .text()
      .trim();
    // Extracting the list of actors

    movieDetails.Filminglocations = $(
      'li[data-testid="title-details-filminglocations"] .ipc-metadata-list-item__content-container li a '
    )
      .text()
      .trim();

    movieDetails.actors = [];
    $('div[data-testid="title-cast-item"]').each((index, element) => {
      const actor = {};
      const actorElement = $(element).find(
        'a[data-testid="title-cast-item__actor"]'
      );

      if (actorElement.length > 0) {
        actor.name = actorElement.text().trim();
        actor.link = `https://www.imdb.com${actorElement.attr("href")}`;
        actor.role = $(element)
          .find(
            'span[data-testid="title-cast-item__character"]  a span[class*="sc-cd7dc4b7-4 zVTic"]'
          )
          .text()
          .trim();
        actor.image = $(element).find("img").attr("src");

        movieDetails.actors.push(actor);
      }
    });
    movieDetails.Director = $(
      'li[data-testid="title-pc-principal-credit"] .ipc-metadata-list-item__content-container ul li'
    )
      .first()
      .text()
      .trim();
    // Sending the response
    res.status(200).json({
      msg: "Movie data fetched successfully",
      data: movieDetails,
    });
  } catch (error) {
    console.error("Error fetching movie data:", error.message);
    res.status(500).json({ error: "Failed to fetch movie data" });
  }
};

module.exports = { GetMoviesController };
