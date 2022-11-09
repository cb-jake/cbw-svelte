// rollup.config.js
import svelte from "rollup-plugin-svelte";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import livereload from "rollup-plugin-livereload";
import polyfills from "rollup-plugin-polyfill-node";
import ChildProcess from "child_process";

function serve() {
  let server;

  function toExit() {
    if (server) server.kill(0);
  }

  return {
    writeBundle() {
      if (server) return;
      // Spawn a child server process
      server = ChildProcess.spawn(
        "npm",
        ["run", "start", "--", "--dev"],
        {
          stdio: ["ignore", "inherit", "inherit"],
          shell: true,
        }
      );

      // Kill server on process termination or exit
      process.on("SIGTERM", toExit);
      process.on("exit", toExit);
    },
  };
}

export default {
  input: "src/main.js",
  output: {
    file: "public/bundle.js",
    format: "iife",
    name: "app",
  },
  plugins: [
    svelte({
      include: "src/**/*.svelte",
      preprocess: {
        style: ({ content }) => {
          return transformStyles(content);
        },
      },
      // Warnings are normally passed straight to Rollup. You can
      // optionally handle them here, for example to squelch
      // warnings with a particular code
      onwarn: (warning, handler) => {
        // e.g. don't warn on <marquee> elements, cos they're cool
        if (warning.code === "a11y-distracting-elements") return;
        // let Rollup handle all other warnings normally
        handler(warning);
      },
      emitCss: false,

      // You can pass any of the Svelte compiler options
      compilerOptions: {},
    }),
    resolve({ preferBuiltins: true, dedupe: ["svelte"] }),
    json(),
    commonjs({
      include: ["node_modules/**"],
    }),
    polyfills(),
    serve(),
    livereload("public"),
  ],
};
