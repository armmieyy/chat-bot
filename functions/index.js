const functions = require('firebase-functions');
const admin = require('firebase-admin');
const request = require('request-promise');
const os = require('os');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4, v4 } = require('uuid');

admin.initializeApp();
const LINE_MESSAGING_API = 'https://api.line.me/v2/bot';
let CHANNEL_ACCESS_TOKEN =
  'WQfqMphx5tHSuh7P4iy1ZX4d/hjf7EqmBSw6qXgXivbbA1bR/JvzN+QHx5z3hxD26fs8H9zIC1RPh2X6roNquPe7kfjXm2goguTB8ya3Iz0K5sJ/u6Tklgwl2/JDdtIAxUC/Qifc8A4G7umZt8WUagdB04t89/1O/w1cDnyilFU';
const LINE_HEADER = {
  'Content-Type': 'application/json',
  Authorization: `Bearer ${CHANNEL_ACCESS_TOKEN}`,
};

const reply = (replyToken, payload) => {
  request.post({
    uri: `${LINE_MESSAGING_API}/message/reply`,
    headers: LINE_HEADER,
    body: JSON.stringify({
      replyToken: replyToken,
      messages: [payload],
    }),
  });
};

exports.helloWorld = functions.https.onRequest(async (req, res) => {
  let fetchData = [];
  const userId = req.body.events[0].source.userId;
  const message = req.body.events[0].message;
  const event = req.body.events[0];
  const db = admin.database();
  const ref = db.ref('/order');
  await ref.on('value', async snapshot => {
    const res = snapshot.val();
    for (const key in res) {
      fetchData.push({ ...res[key], id: key });
    }
  });
  fetchData = await fetchData.filter(
    item => item.status == 'inProgress' && item.uid === userId,
  );

  if (fetchData.length > 0) {
    console.log(fetchData[0]);
    if (fetchData[0].image === '') {
      if (message.type === 'image') {
        let buffer;
        await request
          .get(
            `https://api-data.line.me/v2/bot/message/${message.id}/content`,
            {
              headers: LINE_HEADER,
              encoding: null,
            },
          )
          .then(async res => {
            buffer = res;
            const filename = event.timestamp;
            const originalLocalFile = path.join(os.tmpdir(), filename + '.jpg');
            fs.writeFileSync(originalLocalFile, buffer);
            ////upload
            const uuid = v4();
            const imgUrl = await uploadImage(
              event.source.userId,
              originalLocalFile,
              filename,
              uuid,
            );
            const refByKey = db
              .ref(`/order/${fetchData[0].id}`)
              .update({ image: imgUrl });
            fs.unlinkSync(originalLocalFile);
          });
        await reply(event.replyToken, {
          type: 'text',
          text: 'โปรดส่งตำแหน่งที่ตั้ง',
        });
      } else {
        await reply(event.replyToken, {
          type: 'text',
          text: 'โปรดส่งรูปภาพของปัญหาที่ต้องการแจ้ง',
        });
      }
    } else {
      if (message.type === 'location') {
        await db.ref(`/order/${fetchData[0].id}/location`).update({
          address: message.address,
          la: message.latitude,
          lo: message.longitude,
        });
        await db.ref(`/order/${fetchData[0].id}`).update({
          status: 'wait',
        });
        await reply(event.replyToken, {
          type: 'text',
          text: 'กำลังกำเนินการส่งเรื่องโปรดรอตอบกลับจากเจ้าหน้าที่',
        });
      } else {
        await reply(event.replyToken, {
          type: 'text',
          text: 'โปรดส่งตำแหน่งที่ตั้ง',
        });
      }
    }
  } else {
    let displayName = '';
    await request
      .get(`https://api.line.me/v2/bot/profile/${userId}`, {
        headers: LINE_HEADER,
      })
      .then(res => {
        const data = JSON.parse(res);
        displayName = data.displayName;
      });

    switch (message.type) {
      case 'text':
        await ref.push({
          image: '',
          location: {
            la: '',
            lo: '',
            address: '',
          },
          message: message.text,
          status: 'inProgress',
          date: new Date().toLocaleString('en-GB', {
            timeZone: 'Asia/Jakarta',
          }),
          uid: userId,
          displayName: displayName,
        });
        await reply(event.replyToken, {
          type: 'text',
          text: 'โปรดส่งรูปภาพของปัญหาที่ต้องการแจ้ง',
        });
        break;
      default:
        await reply(event.replyToken, {
          type: 'text',
          text: 'โปรดแจ้งปัญหา โดยใช้ข้อความ',
        });
    }
  }
  res.send('Hello from Firebase!');
});

const uploadImage = async (userId, imgLocalFile, filename, uuid) => {
  const bucket = admin.storage().bucket();
  const file = await bucket.upload(imgLocalFile, {
    // กำหนด path ในการเก็บไฟล์แยกเป็นแต่ละ userId
    destination: `photos/${userId}/${filename}.jpg`,
    metadata: {
      cacheControl: 'no-cache',
      metadata: {
        firebaseStorageDownloadTokens: uuid,
      },
    },
  });
  const prefix = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o`;
  const suffix = `alt=media&token=${uuid}`;

  // ส่งคืนค่า public url ของรูปออกไป
  return `${prefix}/${encodeURIComponent(file[0].name)}?${suffix}`;
};
