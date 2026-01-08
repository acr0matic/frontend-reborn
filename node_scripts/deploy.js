const ftp = require("basic-ftp")
const dotenv = require("dotenv")

dotenv.config()

const secureValues = new Set(["true", "1", "yes", "on"])
const secureString = (process.env.FTP_SECURE || "true").toLowerCase()

async function deploy() {
  const client = new ftp.Client();

  client.ftp.verbose = true;

  try {
    // Здесь прописываем данные от FTP
    await client.access({
      host: process.env.FTP_HOST,
      user: process.env.FTP_USER,
      password: process.env.FTP_PASSWORD,
      secure: secureValues.has(secureString)
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