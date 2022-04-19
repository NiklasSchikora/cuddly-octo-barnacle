const { series, src, dest, watch } = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const sourcemaps = require("gulp-sourcemaps");
const autoprefixer = require("gulp-autoprefixer");
const browserSync = require("browser-sync").create();
const fileinclude = require("gulp-file-include");

const serve = () => {
  browserSync.init({
    server: {
      baseDir: "./build",
    },
  });
  copyImageAssets();
  includePartials();
  watch("./src/scss/**/*.scss", buildScss);
  watch("./src/**/*.html")
    .on("change", includePartials)
    .on("change", browserSync.reload);
};

const watchF = () => {
  return watch("./src/scss/*.scss").on("change", (event) => {
    console.log(
      "File " + event.path + " was " + event.type + ", running tasks..."
    );
  });
};

const copyImageAssets = () => {
  return src("./src/assets/img/**/*").pipe(dest("./build/assets/img"));
};

const includePartials = () => {
  src(["./src/index.html"])
    .pipe(
      fileinclude({
        prefix: "@@",
      })
    )
    .pipe(dest("./build/"));
};

const buildScss = () => {
  return src("./src/scss/index.scss")
    .pipe(sourcemaps.init())
    .pipe(sass().on("error", sass.logError))
    .pipe(sourcemaps.write())
    .pipe(autoprefixer())
    .pipe(dest("./build/assets/css"))
    .pipe(browserSync.stream());
};

exports.default = serve;
