const ftp = require("basic-ftp")

async function deploy() {
  const client = new ftp.Client();

  client.ftp.verbose = true;

  try {
    // Здесь прописываем данные от FTP
    await client.access({
      host: "",
      user: "",
      password: "",
      secure: true
    });

    await client.ensureDir("dist/") // Путь к папке на удаленном сервере
    await client.clearWorkingDir()
    await client.uploadFromDir("dist/")
  }

  catch (error) {
    console.log(error);
  }

  client.close();
}

deploy();
