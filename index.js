import core from "@actions/core";
import github from "@actions/github";
import exec from "@actions/exec";
import { HttpClient } from "@actions/http-client";
import fs from "fs";

async function run() {
  try {
    const level = core.getInput("level", { required: true });
    const version = core.getInput("server_version", { required: true });

    var http = new HttpClient();

    core.info("Fetching Language Server...");

    core.info(`GITHUB_WORKSPACE: ${process.env.GITHUB_WORKSPACE}`);

    const file_path = `${process.env.GITHUB_WORKSPACE}/language-server.tar.gz`;

    core.info(`Downloading to "${file_path}"`);

    const file = fs.createWriteStream(file_path);

    const response = await http.get(
      `https://github.com/sumneko/lua-language-server/releases/download/${version}/lua-language-server-${version}-linux-x64.tar.gz`
    );

    if (response.message.statusCode !== 200) {
      core.setFailed(
        `Failed to download language server: ${response.message.statusCode}`
      );
      return;
    }

    try {
      response.message.pipe(file);
    } catch (error) {
      core.setFailed(`Failed to download language server: ${error}`);
      return;
    }

    exec.exec("tree");

    exec.exec("ls", [`${process.env.GITHUB_WORKSPACE}`]);

    exec.exec("mkdir", [`${process.env.GITHUB_WORKSPACE}/lua-language-server`]);

    exec.exec("tar", [
      "-xzf",
      file_path,
      "-C",
      `${process.env.GITHUB_WORKSPACE}/lua-language-server`,
    ]);

    exec.exec("ls", ["/home/runner"]);

    exec.exec(
      `${process.env.GITHUB_WORKSPACE}/lua-language-server/bin/lua-language-server`,
      ["--check", process.env.GITHUB_WORKSPACE, "--checklevel=warning"]
    );

    if (level === "World") {
    }

    const payload = JSON.stringify(github.context.payload, undefined, 2);
    console.log(`The event payload: ${payload}`);
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
