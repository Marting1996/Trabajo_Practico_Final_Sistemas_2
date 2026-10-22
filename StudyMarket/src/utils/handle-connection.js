import mongoose from "mongoose";

const handleConnection = async (url) => {
  try {
    await mongoose.connect(url);
    console.log("DB Conectada!!!");
  } catch (error) {
    console.log(`Error al conectarse con la DB ${error}`);
  }
};

export default handleConnection;
