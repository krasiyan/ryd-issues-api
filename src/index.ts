import { app } from "./server";
import { API_PORT } from "./config";

app.listen(API_PORT, () => {
  console.log(`listening on :${API_PORT}`);
});
