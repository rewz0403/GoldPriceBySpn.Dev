const admin = require('firebase-admin');
const axios = require('axios');

// โหลดไฟล์กุญแจความปลอดภัย (ขั้นตอนการเอาไฟล์นี้อยู่ด้านล่าง)
const serviceAccount = require("./serviceAccountKey.json"); 

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://goldprice-55844-default-rtdb.asia-southeast1.firebasedatabase.app"
});

const db = admin.database();

async function runTask() {
    try {
        console.log("Fetching API...");
        // ใส่ URL API ของคุณที่ Deploy แล้ว
        const response = await axios.get('https://your-api-url.com/latest'); 
        const gold = response.data.response;

        if (response.data.status === "success") {
            const dateKey = gold.update_date.replace(/\//g, "-");
            const roundMatch = gold.update_time.match(/ครั้งที่ (\d+)/);
            const roundKey = roundMatch ? `round_${roundMatch[1]}` : "round_1";

            await db.ref(`gold_history/${dateKey}/${roundKey}`).set({
                time: gold.update_time,
                price: gold.price,
                timestamp: Date.now()
            });
            console.log(`Saved: ${gold.update_time}`);
        }
    } catch (err) {
        console.error("Error:", err.message);
    } finally {
        process.exit();
    }
}

runTask();