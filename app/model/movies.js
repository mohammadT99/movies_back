const { default: mongoose } = require("mongoose");

const ActorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, required: true },
  image: { type: String, required: true },
  link: { type: String, required: true },
});

const MoviesSchema = new mongoose.Schema({
  title: { type: String, required: true },
  rating: { type: String, required: true },
  releaseDate: { type: String, required: true },
  genres: { type: [String], required: true },
  rottenTomatoesScore: { type: String, required: true },
  metacriticScore: { type: String, required: true },
  actors: { type: [ActorSchema], required: true },
});

const Movie = mongoose.model("Movie", MoviesSchema);

module.exports = Movie;
