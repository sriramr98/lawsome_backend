import admin from "firebase-admin";
import * as serviceCreds from "./../../firebase-conf.json";
import config from "./../config";

const serviceAccount = serviceCreds as admin.ServiceAccount;

export default function (): void {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: config.firebase.databaseURL,
  });
}
