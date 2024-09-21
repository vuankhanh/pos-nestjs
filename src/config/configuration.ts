import { join } from "path";

export default () => {
  const dev = {
    app: {
      port: Number(process.env.DEV_APP_PORT) || 3004
    },
    db: {
      host: process.env.DEV_DB_HOST || 'localhost',
      port: Number(process.env.DEV_DB_PORT) || 27017,
      name: process.env.DEV_DB_NAME || 'pos_dev'
    },
    printer: {
      protocol: process.env.DEV_PRINTER_PROTOCOL || 'http',
      host: process.env.DEV_PRINTER_HOST || 'localhost',
      port: Number(process.env.DEV_PRINTER_PORT) || 3005
    }
  };

  const pro = {
    app: {
      port: Number(process.env.PRO_APP_PORT)
    },
    db: {
      host: process.env.PRO_DB_HOST,
      port: Number(process.env.PRO_DB_PORT),
      name: process.env.PRO_DB_NAME
    },
    printer: {
      protocol: process.env.PRO_PRINTER_PROTOCOL || 'http',
      host: process.env.PRO_PRINTER_HOST || 'localhost',
      port: Number(process.env.PRO_PRINTER_PORT) || 3005
    }
  };

  const folder = {
    album: join(__dirname, '../..', process.env.ALBUM_FOLDER).replace(/\\/g, "/"),
    assets: join(__dirname, '../..', 'src', process.env.ASSETS_FOLDER).replace(/\\/g, "/"),
  }

  const config = process.env.NODE_ENV?.trim() === 'pro' ? pro : dev;

  return { ...config, folder };
}