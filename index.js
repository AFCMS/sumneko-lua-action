import core from "@actions/core";
import github from "@actions/github";

async function run() {
  try {
    const level = core.getInput("level", { required: true });
    console.log(`Hello ${level}!`);

    if (level === "World") {
    }

    const payload = JSON.stringify(github.context.payload, undefined, 2);
    console.log(`The event payload: ${payload}`);
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
