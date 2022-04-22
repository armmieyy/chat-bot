const functions = require('firebase-functions');
const admin = require('firebase-admin');
const request = require('request-promise');
const os = require('os');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4, v4 } = require('uuid');
const { async } = require('@firebase/util');
const cors = require('cors')({ origin: true });

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
const pushMessage = (replyToken, payload) => {
  request.post({
    uri: `${LINE_MESSAGING_API}/message/push`,
    headers: LINE_HEADER,
    body: JSON.stringify({
      to: replyToken,
      messages: [payload],
    }),
  });
};

exports.messageReply = functions.https.onRequest(async (req, res) => {
  cors(req, res, async () => {

    if (req.body.type === 'complete') {
      const db = admin.database();
      const ref = db.ref(`/order/${req.body.id}`);
      await ref.update({ status: 'complete' });
      pushMessage(req.body.uid , {
        type: 'flex',
        altText: 'ดำเนินการเสร็จสิ้น',
        contents: {
          type: 'bubble',
          hero: {
            type: 'image',
            url: `${req.body.image}`,
            size: 'full',
            aspectRatio: '20:13',
            aspectMode: 'cover',
          },
          body: {
            type: 'box',
            layout: 'vertical',
            contents: [
              {
                type: 'text',
                text: `${req.body.title}`,
                weight: 'bold',
                size: 'xl',
              },
              {
                type: 'box',
                layout: 'vertical',
                margin: 'lg',
                spacing: 'sm',
                contents: [
                  {
                    type: 'box',
                    layout: 'baseline',
                    spacing: 'sm',
                    contents: [
                      {
                        type: 'text',
                        text: 'วันที่แจ้ง',
                        size: 'sm',
                        flex: 2,
                        wrap: true,
                      },
                      {
                        type: 'text',
                        text: `${req.body.date}`,
                        wrap: true,
                        color: '#666666',
                        size: 'sm',
                        flex: 5,
                      },
                    ],
                  },
                  {
                    type: 'box',
                    layout: 'baseline',
                    spacing: 'sm',
                    contents: [
                      {
                        type: 'text',
                        text: 'สถานะ',
                        size: 'sm',
                        flex: 2,
                      },
                      {
                        type: 'text',
                        text: 'ดำเนินการเสร็จสิ้น',
                        wrap: true,
                        color: '#0ffe00',
                        size: 'sm',
                        flex: 5,
                      },
                    ],
                  },
                ],
              },
            ],
          },
          
        },
      });
      res.send("ok")
    }

    if (req.body.type === 'reply') {
      const db = admin.database();
      const ref = db.ref(`/order/${req.body.id}`);
      await ref.update({ status: 'receive' });
      pushMessage(req.body.uid, {
        type: 'flex',
        altText: 'ทางเราได้รับเรื่องแล้ว',
        contents: {
          type: 'bubble',
          hero: {
            type: 'image',
            url: `${req.body.image}`,
            size: 'full',
            aspectRatio: '20:13',
            aspectMode: 'cover',
          },
          body: {
            type: 'box',
            layout: 'vertical',
            contents: [
              {
                type: 'text',
                text: `${req.body.title}`,
                weight: 'bold',
                size: 'xl',
              },
              {
                type: 'box',
                layout: 'vertical',
                margin: 'lg',
                spacing: 'sm',
                contents: [
                  {
                    type: 'box',
                    layout: 'baseline',
                    spacing: 'sm',
                    contents: [
                      {
                        type: 'text',
                        text: 'วันที่แจ้ง',
                        size: 'sm',
                        flex: 2,
                        wrap: true,
                      },
                      {
                        type: 'text',
                        text: `${req.body.date}`,
                        wrap: true,
                        color: '#666666',
                        size: 'sm',
                        flex: 5,
                      },
                    ],
                  },
                  {
                    type: 'box',
                    layout: 'baseline',
                    spacing: 'sm',
                    contents: [
                      {
                        type: 'text',
                        text: 'สถานะ',
                        size: 'sm',
                        flex: 2,
                      },
                      {
                        type: 'text',
                        text: 'รับเรื่อง',
                        wrap: true,
                        color: '#666666',
                        size: 'sm',
                        flex: 5,
                      },
                    ],
                  },
                ],
              },
              {
                type: 'box',
                layout: 'baseline',
                spacing: 'none',
                contents: [
                  {
                    type: 'text',
                    text: 'ข้อความตอบกลับจากเจ้าหน้าที่',
                    size: 'sm',
                    wrap: true,
                    margin: 'none',
                    offsetTop: 'none',
                  },
                ],
                paddingTop: 'lg',
              },
              {
                type: 'box',
                layout: 'vertical',
                contents: [
                  {
                    type: 'text',
                    text: `${req.body.textReply}`,
                    wrap: true,
                  },
                ],
              },
            ],
          },
          footer: {
            type: 'box',
            layout: 'vertical',
            spacing: 'sm',
            contents: [
              {
                type: 'box',
                layout: 'vertical',
                contents: [],
                margin: 'sm',
              },
            ],
            flex: 0,
          },
        },
      });
      res.send('ok');
    }

    if (req.body.type === 'notInvoled') {
      console.log('notInvoled');
      const db = admin.database();
      const ref = db.ref(`/order/${req.body.id}`);
      await ref.update({ status: 'notInvoled' });
      const text = `เรียนคุณ ${req.body.displayName} เนื่องจากปัญหาที่แจ้งเข้ามาเรื่อง ${req.body.title}  เราไม่สามารถดำเนินการแก้ไขให้ได้`;
      pushMessage(req.body.uid, { type: 'text', text: text });
      res.send('ok');
    }
  });
});

exports.helloWorld = functions.https.onRequest(async (req, res) => {
  let fetchData = [];
  const kind = [
    'ประปา',
    'อื่นๆ',
    'ถนน',
    'ต้นไม้',
    'ความสะอาด',
    'ไฟฟ้า',
    'ทางเท้า',
    'จราจร จอดรถ',
    'กลิ่น',
    'เสียง',
  ];
  const userId = req.body.events[0].source.userId;
  const message = req.body.events[0].message;
  const event = req.body.events[0];
  console.log(req.body);
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

  if (event.type === 'unfollow') {
    db.ref('/stat/friends').transaction(current_value => {
      return (current_value || 0) - 1;
    });
    res.end();
  }
  if (event.type === 'follow') {
    db.ref('/stat/friends').transaction(current_value => {
      return (current_value || 0) + 1;
    });
    res.end();
  }

  if (fetchData.length > 0) {
    // console.log(kind.indexOf(message.text));
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
          text: 'โปรดเลือกประเภทปัญหาที่แจ้ง',
          quickReply: {
            items: [
              {
                type: 'action',
                action: {
                  type: 'message',
                  label: 'ประปา',
                  text: 'ประปา',
                },
              },
              {
                type: 'action',
                action: {
                  type: 'message',
                  label: 'ไฟฟ้า',
                  text: 'ไฟฟ้า',
                },
              },
              {
                type: 'action',
                action: {
                  type: 'message',
                  label: 'ถนน',
                  text: 'ถนน',
                },
              },
              {
                type: 'action',
                action: {
                  type: 'message',
                  label: 'ต้นไม้',
                  text: 'ต้นไม้',
                },
              },
              {
                type: 'action',
                action: {
                  type: 'message',
                  label: 'ความสะอาด',
                  text: 'ความสะอาด',
                },
              },
              {
                type: 'action',
                action: {
                  type: 'message',
                  label: 'ทางเท้า',
                  text: 'ทางเท้า',
                },
              },
              {
                type: 'action',
                action: {
                  type: 'message',
                  label: 'จราจร จอดรถ',
                  text: 'จราจร จอดรถ',
                },
              },
              {
                type: 'action',
                action: {
                  type: 'message',
                  label: 'กลิ่น',
                  text: 'กลิ่น',
                },
              },
              {
                type: 'action',
                action: {
                  type: 'message',
                  label: 'เสียง',
                  text: 'เสียง',
                },
              },
              {
                type: 'action',
                action: {
                  type: 'message',
                  label: 'อื่นๆ',
                  text: 'อื่นๆ',
                },
              },
            ],
          },
        });
      } else {
        await reply(event.replyToken, {
          type: 'text',
          text: 'โปรดส่งรูปภาพของปัญหาที่ต้องการแจ้ง',
          quickReply: {
            items: [
              {
                type: 'action',
                imageUrl:
                  'https://cdn.dribbble.com/users/3511384/screenshots/6601006/main-zoom---longer---dribbble2.gif',
                action: {
                  type: 'camera',
                  label: 'กล้องถ่ายรูป',
                },
              },
              {
                type: 'action',
                imageUrl:
                  'https://www.pngfind.com/pngs/m/349-3497914_png-file-svg-album-icon-transparent-png.png',
                action: {
                  type: 'cameraRoll',
                  label: 'อัลบั้ม',
                },
              },
            ],
          },
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
        if (kind.indexOf(message.text) > -1) {
          await db
            .ref(`/order/${fetchData[0].id}`)
            .update({ kind: message.text });
          await reply(event.replyToken, {
            type: 'text',
            text: 'โปรดส่งตำแหน่งที่ตั้ง',
            quickReply: {
              items: [
                {
                  type: 'action',
                  imageUrl:
                    'https://i.pinimg.com/originals/45/2c/3d/452c3deef1a83f6dee5ea526f3bcb5cf.gif',
                  action: {
                    type: 'location',
                    label: 'ส่งตำแหน่งที่อยู่',
                  },
                },
              ],
            },
          });

          return res.send('200');
        }
        await reply(event.replyToken, {
          type: 'text',
          text: 'โปรดส่งตำแหน่งที่ตั้ง',
          quickReply: {
            items: [
              {
                type: 'action',
                imageUrl:
                  'https://i.pinimg.com/originals/45/2c/3d/452c3deef1a83f6dee5ea526f3bcb5cf.gif',
                action: {
                  type: 'location',
                  label: 'ส่งตำแหน่งที่อยู่',
                },
              },
            ],
          },
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
          kind: '',
        });
        await reply(event.replyToken, {
          type: 'text',
          text: 'โปรดส่งรูปภาพของปัญหาที่ต้องการแจ้ง',
          quickReply: {
            items: [
              {
                type: 'action',
                imageUrl:
                  'https://cdn.dribbble.com/users/3511384/screenshots/6601006/main-zoom---longer---dribbble2.gif',
                action: {
                  type: 'camera',
                  label: 'กล้องถ่ายรูป',
                },
              },
              {
                type: 'action',

                imageUrl:
                  'https://www.pngfind.com/pngs/m/349-3497914_png-file-svg-album-icon-transparent-png.png',
                action: {
                  type: 'cameraRoll',
                  label: 'อัลบั้ม',
                },
              },
            ],
          },
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
