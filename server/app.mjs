import express from "express";
import connectionPool from "./utils/db.mjs";

const app = express();
app.use(express.json());

const port = 4001;

app.get("/test", (req, res) => {
  return res.json("Server API is working 🚀");
});

// สร้าง API สําหรับการสร้าง Assignment
app.post("/assignments", async (req, res) => {
  let result;

  try {
    // สร้างการเชื่อมต่อกับฐานข้อมูลเพื่อสร้าง Assignment
    result = await connectionPool.query(
      "INSERT INTO assignments (title, content, category) VALUES ($1, $2, $3)",
      [req.body.title, req.body.content, req.body.category]
    );

    // ตรวจสอบว่ามีข้อมูลที่ส่งมาหรือไม่
    if (!req.body) {
      return res
        .status(400)
        .json({
          message:
            "Server could not create assignment because there are missing data from client",
        });
    }

    // ตรวจสอบว่ามีการสร้าง Assignment หรือไม่
    if (result.rowCount === 0) {
      return res
        .status(500)
        .json({
          message:
            "Server could not create assignment because there are missing data from client",
        });
    }

    // ส่งคําตอบกลับไปยังลูกค้า
    return res.status(200).json({ message: "Created assignment sucessfully" });
  } catch (error) {
    // ถ้ามีข้อผิดพลาดในการสร้าง Assignment
    console.error("Database error in post/assignment", error);
    return res
      .status(500)
      .json({
        message:
          "Server could not create assignment because database connection",
      });
  }
});

app.listen(port, () => {
  console.log(`Server is running at ${port}`);
});
